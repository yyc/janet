// @flow
import * as localForage from "localforage";

import { Plugin, PluginConfig } from "./plugin";
import PluginIndex from "./plugins/index";
import { booleanLiteral } from "@babel/types";

const routerlocalForageKey = "routerStorage";

export default class Router {
  // This class abstracts the fast storage of commands in localForage
  // And also does the command routing

  config: Object;
  regexCache: Object;

  constructor() {
    this.config = {
      commandSearches: {},
      regexSearches: []
    };
    this.regexCache = {};
  }

  async load(): Promise<void> {
    let confString = await localForage.getItem(routerlocalForageKey);
    if (!confString) {
      return;
    }
    (confString: string);
    this.config = JSON.parse(confString);
  }

  registerCommand(key: string, state: ?any): void {}

  registerRegex(regex: string, state: ?any): void {}

  async getSearchForQuery(query: string): Promise<string> {
    let results = this.getMatchingCommandsForQuery(query, searchWrapper);
    for await (let result of results) {
      if (typeof result == "string") {
        (result: string);
        return result;
      }
    }
    return "";
  }

  async getSuggestForQuery(query: string): Promise<Array<[string, string]>> {
    let sggns = this.getMatchingCommandsForQuery(query, suggestWrapper);
    return [];
  }

  async *getMatchingCommandsForQuery<T>(
    query: string,
    wrapper: (Plugin<PluginConfig>, Array<string>, any) => Promise<T>
  ): AsyncGenerator<T, void, T> {
    // Tries to find a matching command
    let str_split = query.split(" ", 1);
    let command = str_split[0];

    if (this.config.commandSearches.hasOwnProperty(command)) {
      let plugin = await this.loadPluginWithKey(command);

      let pluginState = this.tryParseJSON(
        await localForage.getItem(`${routerlocalForageKey}/state/${command}`)
      );

      yield await wrapper(plugin, str_split, pluginState);
    }
    // try all regex matches
    for (let regexString of this.config.regexSearches) {
      if (!(regexString in this.regexCache)) {
        this.regexCache[regexString] = new RegExp(regexString);
      }
      let re = this.regexCache[regexString];
      if (query.match(re)) {
        let plugin = await this.loadPluginWithKey(regexString);
        let pluginState = this.tryParseJSON(
          await localForage.getItem(
            `${routerlocalForageKey}/state/${regexString}`
          )
        );
        yield await wrapper(plugin, str_split, pluginState);
      }
    }

    // TODO: function matches
  }

  async loadPluginWithKey(key: string): Promise<Plugin<PluginConfig>> {
    let pluginName = this.config.commandSearches[key];
    let PluginClass = PluginIndex[pluginName];
    let configObj = this.tryParseJSON(
      await localForage.getItem(`${routerlocalForageKey}/config/${key}`)
    );

    let pluginConfig = new PluginClass.configClass(configObj);
    let plugin = new PluginClass(PluginConfig);
    return plugin;
  }

  tryParseJSON(json: ?string): Object | string | boolean | number {
    if (json == null || json == undefined) {
      return {};
    }
    try {
      json = JSON.parse(json);
    } catch (e) {
      console.error(e);
    }
    return json;
  }
}

async function searchWrapper(
  plugin: Plugin<PluginConfig>,
  query: Array<string>,
  state: any
): Promise<string | boolean> {
  return await plugin.search(query, state);
}

async function suggestWrapper(
  plugin: Plugin<PluginConfig>,
  query: Array<string>,
  state: any
): Promise<Array<[string, string]>> {
  return await plugin.suggest(query, state);
}

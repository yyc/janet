// @flow
import * as localForage from "localforage";

import { Plugin, PluginConfig } from "./plugin";
import PluginIndex from "./plugins/index";

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
    return "";
  }

  async getSuggestForQuery(query: string): Promise<Array<[string, string]>> {
    return [];
  }

  async *getMatchingCommandsForQuery(
    query: string
  ): AsyncGenerator<Plugin<PluginConfig>, void, Plugin<PluginConfig>> {
    // Tries to find a matching command
    let str_split = query.split(" ", 1);
    let command = str_split[0];

    if (this.config.commandSearches.hasOwnProperty(command)) {
      let plugin = this.loadPluginWithKey(command);

      yield plugin;
    }
    // try all regex matches
    for (let regexString of this.config.regexSearches) {
      if (!(regexString in this.regexCache)) {
        this.regexCache[regexString] = new RegExp(regexString);
      }
      let re = this.regexCache[regexString];
      if (query.match(re)) {
        let plugin = this.loadPluginWithKey(regexString);
        yield plugin;
      }
    }

    // TODO: function matches
  }

  async loadPluginWithKey(key: string): Promise<Plugin<PluginConfig>> {
    let pluginName = this.config.commandSearches[key];
    let PluginClass = PluginIndex[pluginName];
    let pluginState = this.tryParseJSON(
      await localForage.getItem(`${routerlocalForageKey}/state/${key}`)
    );
    let configObj = this.tryParseJSON(
      await localForage.getItem(`${routerlocalForageKey}/config/${key}`)
    );

    let pluginConfig = new PluginClass.configClass(configObj);
    let plugin = new PluginClass(PluginConfig);
    plugin.setState(pluginState);
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

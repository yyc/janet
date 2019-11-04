// @flow
import { Plugin, PluginConfig } from "./plugin";
import PluginIndex from "./plugins/index";
const routerLocalStorageKey = "routerStorage";

const localStorage = window.localStorage;

export default class Router {
  // This class abstracts the fast storage of commands in localStorage
  // And also does the command routing

  config: Object;
  regexCache: Object;

  constructor() {
    let confString = localStorage.getItem(routerLocalStorageKey);
    if (!confString) {
      this.config = {
        commandSearches: {},
        regexSearches: []
      };
    } else {
      (confString: string);
      this.config = JSON.parse(confString);
    }
    this.regexCache = {};
  }

  registerCommand(key: string, state: ?any): void {}

  registerRegex(regex: string, state: ?any): void {}

  getSearchForQuery(query: string): string {
    return "";
  }

  getSuggestForQuery(query: string): Array<[string, string]> {
    return [];
  }

  *getMatchingCommandsForQuery(query: string): Iterable<Plugin<PluginConfig>> {
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

  loadPluginWithKey(key: string): Plugin<PluginConfig> {
    let pluginName = this.config.commandSearches[key];
    let PluginClass = PluginIndex[pluginName];
    let pluginState = this.tryParseJSON(
      localStorage.getItem(`${routerLocalStorageKey}/state/${key}`)
    );
    let configObj = this.tryParseJSON(
      localStorage.getItem(`${routerLocalStorageKey}/config/${key}`)
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

// @flow
import { Plugin, PluginConfig } from "./plugin";

const routerLocalStorageKey = "";

export default class Router {
  // This class abstracts the fast storage of commands in localStorage
  // And also does the command routing

  config: Object;

  constructor() {
    let confString = localStorage.getItem(routerLocalStorageKey);
    if (!confString) {
      this.config = {
        commandSearches: [],
        regexSearches: []
      };
    } else {
      (confString: string);
      this.config = JSON.parse(confString);
    }
  }

  registerCommand(key: string, state: ?any): void {}

  registerRegex(regex: string, state: ?any): void {}

  getSearchForQuery(query: string): string {
    // Tries to find a matching command

    // Failing that, tries all regex matches

    return "";
  }

  getSuggestForQuery(query: string): Array<[string, string]> {
    return [];
  }

  *getMatchingCommandsForQuery(query: string): Iterable<Plugin<PluginConfig>> {}
}

// @flow

import { PluginParameter, PluginConfig, Plugin } from "../plugin";
import Router from "../router";

export default class FallbackSearchEngine extends Plugin<PluginConfig> {
  static getDefaultConfig() {
    return null;
  }

  async update() {
    console.log("Update function for search engine called");
    return true;
  }

  activate(router: Router) {
    console.log("Search Engine activated");
    router.registerRegex(".*", null);
  }

  async search(query: Array<string>, state: ?any) {
    let queryString = encodeURIComponent(query.join(" "));
    return `https://www.bing.com/search?q=${queryString}`;
  }

  async suggest(query: Array<String>, state: ?any) {
    let queryString = encodeURIComponent(query.join(" "));
    try {
      let response = await fetch(
        "https://www.bing.com/complete/search?&q=${queryString}"
      );

      let json = await response.json();

      let suggestions = json[1];
      // A sorted list of suggested search terms

      return suggestions.map(str => [
        str,
        `https://www.google.com/search?q=${encodeURIComponent(queryString)}`
      ]);
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

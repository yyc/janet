// @flow

import { Plugin } from "./plugin";
import PluginDirectory from "./plugins/index";
import Router from "./router";

export default class SearchEngine {
  router: Router;

  constructor() {
    this.router = new Router();
  }

  async update() {
    for (let pluginName in PluginDirectory) {
      let SomePlugin: typeof Plugin = PluginDirectory[pluginName];
      let engine = new SomePlugin();
      let result = await engine.update();
      if (result) {
        engine.activate(this.router);
      }
    }
  }
}

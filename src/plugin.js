// @flow
import Router from "./router";

export class PluginParameter {
  required: boolean;
  value: any;

  constructor(value: boolean | string | number | null, required: ?boolean) {
    this.value = value;
    if (required) {
      this.required = required;
    } else {
      this.required = false;
    }
  }
}

export class PluginConfig {
  config: { [key: string]: string | boolean | number | PluginParameter };

  static fields(): Array<String> {
    return [];
  }

  constructor(json: ?{ [key: string]: any }) {
    this.config = {
      Name: new PluginParameter("asdf")
    };
    if (typeof json !== Object) {
      return;
    }
    for (let key of Object.keys(this.config)) {
      if (!(key in (json: Object))) {
        continue;
      }
      this.config[key] = ((json: Object)[key]: any);
    }
  }

  serialize(): Object {}
}

export class Plugin<ConfigClass> {
  config: ConfigClass;
  static configClass = PluginConfig;

  static getDefaultConfig(): ?PluginConfig {
    // The top level name will be
    return new Plugin.configClass();
  }

  // The constructor gets called if the plugin is activated (either manually or by default)
  // Config may be an empty dict, but will conform to configFields (defaults will be set if fields do not exist)
  // Whatever the plugin returns will be saved as the plugin's new object (useful for unsetting bad values)
  constructor(config: ConfigClass) {
    this.config = config;
    if (config == undefined) {
      return;
    }
    // The bare minimum amount of loading necessary to perform a search() should be done here
    // The plugin should **NOT** do any fetching here. Put that in the activate() function instead.
  }

  async update(): Promise<boolean> {
    return true;
  }

  activate(router: Router): void {}

  async search(query: Array<string>, state: ?any): Promise<string | boolean> {
    return false;
  }

  async suggest(
    query: Array<String>,
    state: ?any
  ): Promise<Array<[String, String]>> {
    return [];
  }
}

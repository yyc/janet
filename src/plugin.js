// @flow

class PluginParameter {
  value: any;
  required = false;

  contructor(
    value: boolean | string | number | null | void,
    required: ?boolean
  ) {
    this.value = value;
    if (required) {
      this.required = required;
    }
  }
}

class PluginConfig {
  config: { [key: string]: string | boolean | number | PluginParameter };

  static fields(): Array<String> {
    return [];
  }

  constructor(json: ?{ [key: string]: any }) {
    this.config = {
      Name: new PluginParameter("", false)
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

export default class Plugin<ConfigClass> {
  static configClass = PluginConfig;
  config: ConfigClass;

  static getDefaultConfig(): PluginConfig {
    // The top level name will be
    return new Plugin.configClass();
  }

  // The constructor gets called if the plugin is activated (either manually or by default)
  // Config may be an empty dict, but will conform to configFields (defaults will be set if fields do not exist)
  // Whatever the plugin returns will be saved as the plugin's new object (useful for unsetting bad values)
  constructor(config: ConfigClass) {
    this.config = config;
    if (config == undefined) {
      return {};
    }
    // The bare minimum amount of loading necessary to perform a search() should be done here
    // The plugin should **NOT** do any fetching here. Put that in the activate() function instead.
  }

  update() {}

  activate(router) {}

  search(state, query) {
    return false;
  }

  suggest(state, query) {
    return [];
  }
}

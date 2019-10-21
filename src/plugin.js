export default class Plugin {
  static getDefaultConfig() {
    // The top level name will be
    return {
      Name: {
        required: false, // default
        default: "asdf" // will be set
      }
    };
  }

  // The constructor gets called if the plugin is activated (either manually or by default)
  // Config may be an empty dict, but will conform to configFields (defaults will be set if fields do not exist)
  // Whatever the plugin returns will be saved as the plugin's new object (useful for unsetting bad values)
  constructor(config) {
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

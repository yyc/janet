self.addEventListener("install", event => {
  console.log("hi! Service worker is registered");
});

self.addEventListener("activate", event => {
  console.log("activate event detected");
});

self.addEventListener("fetch", event => {
  console.log("you tried to request for ", event.request);
  let url = new URL(event.request.url);
  if (url.pathname != "/find") {
    return fetch(event.request.url);
  }
  let query = url.searchParams.get("q");
  if (query == null) {
    respondWithText(
      event,
      "Hello from Janet, your plastic pal who's fun to be with"
    );
  }
  return fetch("google.com/");
});

function respondWithText(event, txt) {
  let resp = new Response(txt, { headers: { "Content-Type": "text/html" } });
  event.respondWith(resp);
}

// probably still need some way to easily add plugins (so people can write their own custom plugins)

let regex_url = RegExp("s|((.+))|(http[s]://.+$1)");
function search(store, captures) {
  if (typeof store == "string") {
    // If URL is a regex replacement, do the replacement
    // interpolate url if necessary
  }
}

class Plugin {
  static configFields() {
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

  activate() {}

  getName() {
    return "JSON Defined Search Library";
  }

  search(query) {
    return false;
  }
}

class SearchPlugin extends Plugin {
  constructor(config) {
    super(config);
    this.tree = fetch(
      "https://gist.githubusercontent.com/yyc/fb61b670186bec6996336703c74d71c2/raw"
    );
  }
  search(query) {
    return this._searchTree(query.split(" "), this.tree, {});
  }

  /* A search tree is either a string, or an object with tree properties and an optional 
    _regexes property
    TODO: Handle aliases
  */
  _searchTree(query, tree, bindings) {
    if (typeof tree == "string") {
      return interpolate(tree, bindings);
      // ideal case, do interpolation here
    }
    if (query.length == 0) {
      if (typeof tree == "object" && tree[""]) {
        return interpolate(tree[""], bindings);
      }
    }
    if (typeof tree == "object") {
      let nextWord = query[0]; // we are guaranteed from above that there is at least one element in query
      if (tree[nextWord]) {
        // Recurse on the inner tree
        return this._searchTree(query.shift(), tree[nextWord], bindings);
      }
      // Otherwise, check for matching regexes
      for (let key in Object.keys(tree)) {
        let subtree = tree[key];
        if (typeof subtree == "object" && subtree["_regex"]) {
          let match = query.join(" ").match(new RegExp(subtree["_regex"]));
          if (match) {
            bindings[subtree] = match[0];
            // Stopped here, need to capture and pass on rest of string
          }
        }
      }
    }
  }
}

function interpolate(string, bindings) {
  let new_string = string;
  for (let key in Object.keys(bindings)) {
    new_string = new_string.replace(key, bindings[key]);
  }
  return new_string;
}

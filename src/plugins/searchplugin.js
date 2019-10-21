import Plugin from "../plugin";

export default class SearchPlugin extends Plugin {
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

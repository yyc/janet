# Janet

Your plastic pal who's fun to be with

The easiest way to add a search engine is to use an instance of one of the predefined

## Plugins

A Plugin should not run arbitrary javascript code from anywhere, especially not the following sources:

- remote sources (obviously)
- localStorage
- cookies
- user input fields

Instead, a plugin should contain all the logic for deciding on a redirect/rendering content from serialized

## Lifecycle of a Plugin

### Creation

A plugin is first created by calling its constructor with the config.
Then, update() is called

### `static getDefaultConfig()`

Returns false by default.
If you want this config to be user-creatable, return an object. A similar object will be passed into `activate()`

```{
      Name: {
        required: false, // default
        default: "asdf" // will be set
      }
}
```

### constructor(config)

Constructs a new instance of the plugin. Fetching and network calls should not happen here, but only in `update`

### update(): Bool

Perform any network calls as necessary to update internal variables of the instance. This function should return `true` if these internal variables have been successfully updated.

Otherwise, if the function returns `false` or throws, `register()` will not be called.

### `activate(router)`

This static function is called when a plugin is instantiated with a new config, the config is updated, or a background refresh of the plugins is triggered.

It is guaratneed that `register` will only be called after `update()` is called and returns true.

One of more of the functions below should be called:
`router.registerCommand(key, state)`: registers a command that triggers this plugin.
`router.registerRegex(regex, state)`: registers a regular expression that triggers this plugin.

In both cases, if a state parameter is passed in, it will be passed into the instance's `search`/`suggest` function.

### `search(query: Array<string>, state: ?any): string | boolean`

### `suggest(query: Array<String>, state: ?any): Array<string>`

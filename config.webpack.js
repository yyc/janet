const path = require("path");

module.exports = {
  mode: "production", // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: {
    "app.js": "./src/app.js",
    "sw.js": "./src/sw.js",
    index: "./src/index.html"
  }, // string | object | array
  // defaults to ./src
  // Here the application starts executing
  // and webpack starts bundling
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "docs"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "[name]", // string
    // the filename template for entry chunks
    publicPath: "/", // string
    // the url to the output directory resolved relative to the HTML page
    library: "janet", // string,
    // the name of the exported library
    libraryTarget: "umd", // universal module definition
    // the type of the exported library
    globalObject: "this"
  },
  module: {
    // configuration regarding modules
    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, "src")],
        // exclude: [path.resolve(__dirname, "app/demo-files")],
        // these are matching conditions, each accepting a regular expression or string
        // test and include have the same behavior, both must be matched
        // exclude must not be matched (takes preferrence over test and include)
        // Best practices:
        // - Use RegExp only in test and for filename matching
        // - Use arrays of absolute paths in include and exclude
        // - Try to avoid exclude and prefer include
        // issuer: { test, include, exclude },
        // conditions for the issuer (the origin of the import)
        enforce: "pre",
        enforce: "post",
        // flags to apply these rules, even if they are overridden (advanced option)
        loader: "babel-loader",
        // the loader which should be applied, it'll be resolved relative to the context
        // -loader suffix is no longer optional in webpack2 for clarity reasons
        // see webpack 1 upgrade guide
        options: {
          presets: ["@babel/preset-env", "@babel/preset-flow"]
        }
        // options for the loader
      },
      {
        test: /\.html$/,
        use: ["file-loader?name=[name].[ext]", "extract-loader", "html-loader"]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
    /* Advanced module configuration (click to show) */
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: ["node_modules", path.resolve(__dirname, "src")],
    // directories where to look for modules
    extensions: [".js", ".json", ".jsx", ".css"]
    // extensions that are used
  },
  performance: {
    hints: "warning", // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
    }
  },
  devtool: "source-map", // enum
  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.
  context: __dirname, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory
  target: "web", // enum
  // the environment in which the bundle should run
  // changes chunk loading behavior and available modules
  externals: ["react", /^@angular/],
  // Don't follow/bundle these modules, but request them at runtime from the environment
  serve: {
    //object
    port: 1337,
    content: "./docs"
    // ...
  },
  // lets you provide options for webpack-serve
  stats: "errors-only",
  // lets you precisely control what bundle information gets displayed
  devServer: {
    proxy: {
      // proxy URLs to backend development server
      "/api": "http://localhost:4000"
    },
    contentBase: path.join(__dirname, "docs"), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: false, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: false // only errors & warns on hot reload
    // ...
  }
};

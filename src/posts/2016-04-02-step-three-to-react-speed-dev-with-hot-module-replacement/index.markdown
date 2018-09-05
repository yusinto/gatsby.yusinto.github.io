---
path: "/step-three-to-react-speed-dev-with-hot-module-replacement"
date: "2016-04-02"
title: "Step 3 to React - Speed dev with hot module replacement"
published: true
tags: ["react", "hmr", "hot", "module", "replacement", "webpack", "babel"]
---

In the [previous post](/step-two-to-react-webpack-and-react/) we started writing react code
and that was cool. However having to restart the app and refresh the browser everytime we make a change is a pain. 
There must be a better way to optimise our dev/debug cycle.

And yes there is. Enter react hot module replacement or hmr created by [Dan Abramov](https://github.com/gaearon) the creator of redux. Hmr is a much much better
"version" of liveReload. You don't need to inject a script tag into your code and there is no browser refresh. When you make
changes to your code, they simply appear in the browser like magic without reload.

This is a short post just to get hmr working so let's dive straight into the code now and I'll explain things along the way.

---

## Step 3.1: Install transforms and webpack middlewares 
There are 6 packages we need to install:

```bash
npm install --save-dev babel-plugin-react-transform react-transform-hmr react-transform-catch-errors redbox-react webpack-dev-middleware webpack-hot-middleware
```

**babel-plugin-react-transform** - This modifies your react components by applying all the transforms we configure in .babelrc.

**react-transform-hmr** - This transform enables hot reloading of components

**react-transform-catch-errors** - This transform catches errors inside the render() method and renders that error instead of your component.

**redbox-react** - Used by react-transform-catch-errors to display errors in a red screen of death in the browser.

**webpack-dev-middleware** - bundles our js file on the fly, stores it in memory and serves it

**webpack-hot-middleware** - enables hot reloading using webpack-dev-middleware above

---

## Step 3.2: Configure babel

Your .babelrc file should look like this:

```json
{
    "presets": ["es2015", "react"],
    "plugins": [
        ["react-transform", {
            "transforms": [{
                "transform": "react-transform-hmr",
                "imports": ["react"],
                "locals": ["module"]
            }, {
                "transform": "react-transform-catch-errors",
                "imports": ["react", "redbox-react"]
            }]
        }]
    ]
}
```

This is the configuration that uses the transform packages above. In short, we instruct the
react-transform plugin to apply 2 transforms: the hmr and catch-errors transforms to our react 
components. In simple terms, transforms are just functions that accepts a react component as input and modifies it. For 
example, **_react-transform-catch-errors_** adds a try catch block on the original render method to catch exceptions.

---

## Step 3.3: Configure webpack
Your webpack.config.dev.js should look like this:

```js
const webpack = require('webpack');
const path = require('path');

module.exports = {
    // Add webpack-hot-middleware/client to our bundle so our app 
    // subscribes to update notifications from the server
    entry: ['webpack-hot-middleware/client', path.join(__dirname, 'src/client/index')],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        
        // Add a publicPath property. This is the path referenced in the 
        // script tag in our html template to our bundle.js. We need 
        // this to configure webpack-dev-middleware in server.js
        publicPath: '/dist/' 
    },
    module: {
        loaders:[{
            test: /\.jsx?$/,
            loader: 'babel',
            include: path.join(__dirname, 'src')
        }]
    },
    
    // Enables hot module replacement in webpack
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
```

---

## Step 3.4: Modify express app to support hmr
Almost there! Now we need to modify server.js to use webpack dev and hot middlewares.

```js
// ...

import Webpack from 'webpack';
import WebpackConfig from '../../webpack.config.dev';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebPackHotMiddleware from 'webpack-hot-middleware';

// ...

// create a webpack instance from our dev config
const webpackCompiler = Webpack(WebpackConfig);

// Use webpack dev middleware to bundle our app on the fly and serve it 
// on publicPath. Turn off verbose webpack output in our server console
// by setting noInfo: true
app.use(WebpackDevMiddleware(webpackCompiler, {
    publicPath: WebpackConfig.output.publicPath,
    noInfo: true
}));

// instruct our webpack instance to use webpack hot middleware
app.use(WebPackHotMiddleware(webpackCompiler));

// NOTE: delete express static middleware for dist. We don't need that
// anymore because webpack-dev-middleware serves our bundle.js from memory

// ...
```

---

## Step 3.5: Run the app!
If you have been following my [previous post](/step-two-to-react-webpack-and-react/) up to this point, 
note that you'll need to delete the prestart command from package.json. We don't need that anymore because we are using webpack
dev middleware to bundle our app on the fly. 

If you have the physical /dist/ folder, also delete that because
again webpack dev middleware will serve bundle.js from memory.

At your root directory run "npm start" and browse to localhost:3000. Then make changes to appComponent.js; maybe change
the h1 text. You'll see your changes in the browser immediately without refresh.

Download the complete source code from [github](https://github.com/yusinto/reactStep3).

---------------------------------------------------------------------------------------

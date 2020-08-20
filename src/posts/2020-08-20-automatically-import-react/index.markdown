---
path: "/automatically-import-react"
date: "2020-08-20"
title: "Automatically import react"
published: true
files:
 - "./hero.png"
 - "./automatically-import-react.png"
tags: ["webpack", "provide", "plugin", "import", "react", "module", "typescript", "jest", "eslint", "lint", "js", "javascript"]
---

<code>import React from 'react';</code>

It's the most common import you type in your project. Won't it be cool if somehow we don't
have to do this all the time? Enter webpack [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/). This plugin
allows us to import react automatically where it's required, thus saving our lives so we can do other things.

If you are using react with typescript, jest and eslint, here's what you need to do to get it all working: 


#### webpack.config.js
```js
const { ProvidePlugin } = require("webpack");

module.exports = {
  plugins: [
    new ProvidePlugin({
      React: "react" // automatically import react where needed
    })
  ], // other webpack config
};

```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "allowUmdGlobalAccess": true, // make typescript work with ProvidePlugin
    // other compiler options
  },

  // other ts config
}
```

#### jest.setup.js
```js
// simulate ProvidePlugin for our tests using a global variable
window.React = require('react');

// other jest setup
```

#### .eslintrc.js
```js
module.exports = {
  rules: {
    // Prevent default react imports like import React from 'react' 
    // but still allows other named react imports.
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react',
            importNames: ['default'],
            message: 'React default is automatically imported by webpack.',
          },
        ],
      },
    ],

    // other eslint rules
  }
}
```

The result is you no longer need to import the default react export, but you will still need to
manually import other named exports. You can easily extend the webpack config to include react's named exports
and other imports as well like `react-dom` and `react-router`. However I would recommend using this technique 
sparingly to avoid having too much config magic in your project.

<p align="center">
<img src="/static/automatically-import-react-2cd103a8f0f422d7f093eda66bc565f7.png" id="markdownImage"/>
</p>

Have fun coding!

---------------------------------------------------------------------------------------

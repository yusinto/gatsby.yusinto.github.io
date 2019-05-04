---
path: "/node-es-modules"
date: "2019-05-02"
title: "Using es modules in node"
published: true
files:
 - "./hero.png"
tags: ["es","modules","import","node","js"]
---

Node 12 finally supports native es6 modules without having to name files with the *.mjs* extension.
To start using es6 modules in node, you'll need to be using node 12 and greater and add three things
to your <b>package.json</b> file:

* a *"type": "module"* property 

Use these two flags when executing node to run your app:

* "*--experimental-modules*"
<p>This enables es modules in node.</p>

* "*--es-module-specifier-resolution=node*"
<p>
By default extension resolution is disabled. This means you have to specify file extensions
in import statements. This flag enables extension resolution so you can import files
without specifying their extensions.
</p>

So your package.json file should look like this:
####package.json
```json
{
  "type": "module",
  "scripts": {
    "start": "node --experimental-modules --es-module-specifier-resolution=node index.js"
  }
}
```

Then in your app, you can directly import npm packages like so:

```js
import random from 'random-words';
import someModule from './someModule';

console.log(random({exactly:5, wordsPerString: 3}));
```

where *someModule.js* is your own module without having to be an *.mjs* file!

Yay!

---------------------------------------------------------------------------------------

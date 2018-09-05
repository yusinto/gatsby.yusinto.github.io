---
path: "/step-one-to-react-es-6-and-express"
date: "2016-03-27"
title: "Step 1 to React - Using es6 with Express"
published: true
tags: ["react", "es6", "express"]
---

I came from a .Net background but I realised quickly how powerful and easy node is and I love it. The advent of es6 has
bridged the gap even further. The introduction of arrow functions, classes and destructuring really make node programming
 that much more enjoyable and fun.

 Enough of my rant! Let's get to the point. This post is part one of a series of posts about react and the things I
 encountered in the process of learning it. One of the first steps that often get overlooked is how to get es6 to work
 with node on the server side. To me this is a very important step because I want my app to be in es6 as much as possible.
 
 Note that this is a very basic example of a node app running es6 without any react elements. In my next post, I will
 add react. The following posts will gradually include react router, relay, hot module replacement (hmr), 
 redux, foundation (sass) and many other goodies!
 
 But first thing first

---

## Step 1.1: Install babel
 You'll need to install express, babel-express and babel-preset-es2015:

```jsx
npm install express babel-register babel-preset-es2015 --save
```

Where express is the standard web framework for node, babel-register will compile every file that is require'd with babel and
babel-preset-es2015 tells babel to transpile es6 code to es5.

---

## Step 1.2: Configure babel - add a .babelrc file
Create a new file called .babelrc at the root directory of your project. The file contents should look like this:

```jsx
{
    "presets": ["es2015"]
}
```

This configures babel to transpile es6 code to es5.

---

## Step 1.3: Configure an entry point in package.json

In your package.json, add a scripts/start command which tells npm what to do when you run "npm start" in the command line:

```jsx
{
...
      "scripts": {
        "start": "node src/server/index.js",
      }
...
}
```

This tells npm to execute src/server/index.js when you run "npm start" at your root project folder. In this case, index.js 
is the entry point to your app. The contents of this file should look like this: 

```jsx
require('babel-register');
require('./server');
```

---

## Step 1.4: Write es6 code
The file server.js contains all your es6 code for your app. It should look like this:

```jsx
import Express from 'express';

const PORT = 3000;
const app = Express();

app.use((req, res) => {
    res.end('hello world!');
});

app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
});
```

Here we use import statements in place of the classic require statements, const keyword instead of var, 
arrow functions instead of inline function declarations and es6 template strings instead of string concatenations.

---

## Step 1.5: Run your app!
Run 
 
```jsx
npm start
```
 
 at your root directory and browse to localhost:3000 to see the output of your app. Download the complete source code from
 [github](https://github.com/yusinto/reactStep1).




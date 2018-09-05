---
path: "/step-two-to-react-webpack-and-react"
date: "2016-03-30"
title: "Step 2 to React - Webpack and React"
published: true
tags: ["react", "webpack", "babel"]
---

If you haven't read my [previous post](/step-one-to-react-es-6-and-express/), 
it might be a good idea to have a quick read before reading this one. We'll build this example based on that last post.
Let's get into it!

---

## Step 2.1: Install webpack, babel and react

```bash
npm install --save-dev webpack babel-loader
```

```bash
npm install --save react react-dom babel-preset-react
```

We use webpack to bundle all our javascript code into a single file. We then include this bundled file 
in a script tag in our html just like any other js file. This single file alone will be sufficient to run our app in the browser.

Our code is in es6 and jsx (we'll talk about jsx in detail a bit later) which are not (yet) natively understood by browsers. So
we have to transpile (short for transform and compile) it into pure javascript which are understood by all browsers. We use
babel to perform this transpilation.

react and react-dom are core react modules required to write react apps. babel-preset-react instructs babel (both
babel-register and babel-loader) to transpile jsx into pure javascript.

---

## Step 2.2: Configure webpack
Create a new file called webpack.config.dev.js at the root directory of your project. The file contents should look like this:

```jsx
var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [path.join(__dirname, 'src/client/index')],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders:[{
            test: /\.jsx?$/,
            loader: 'babel',
            include: path.join(__dirname, 'src')
        }]
    }
};
```

There are 3 main parts to this config:
<ul>
<li>entry: tells webpack to start bundling from this file</li>
<li>output: write the resultant bundled file to the dist folder at root</li>
<li>module.loaders: For all js or jsx files under src folder, use babel-loader to transpile those files prior to bundling</li>
</ul>

---

## Step 2.3: Add a build command to package.json

In your package.json, add a scripts.prestart command. This is a natively supported npm command, just like start.
When you run npm start, the prestart command will always get executed first, then the start command, followed by a
poststart command which we don't use here. 

In prestart, we tell npm to run webpack with the config file above essentially
bundling our app prior to running it.

```jsx
{
...
      "scripts": {
        "prestart": "webpack --config webpack.config.dev.js --progress",
        "start": "node src/server/index.js",
      }
...
}
```

When the prestart command completes, a bundle.js file should exist in the dist folder.

---

## Step 2.4: Write some react code
Finally we get to write some react code! This is the meatiest part, so it's a bit longer than the other sections, but
it's worth it. Let's create two new files:

<ul>
    <li>src/common/component/appComponent.js</li>
    <li>src/client/index.js</li>
</ul>

Note about directory structure: All my code are in a src folder to separate it from other elements of the project
like node_modules and dist. This allows me to target only src for transpilation in my webpack build. Under src, my files
are further organised into client, server and common. 

So what's in common? This is in preparation for building a universal
app (also known as isomorphic app) where the code being run on the client and server are one and the same ergo common
code. But we'll talk more about this in a later post.

If you come from an OO background like me, you should be familiar with the syntax here.

##### appComponent.js
```jsx
/*
 Import react's default module and assign it to a variable named React. 
 Additionally we also import the Component module and assign it to a 
 variable named Component.
*/
import React, {Component} from 'react';

/*
 Subclass React.Component and implement the render method. This method 
 must return a single child element. A react component at minimum must 
 implement the render method. Also set this class as the default export 
 of this file so we can import it in other files.
*/
export default class App extends Component {
    render() {
        return (
            // Nooo this looks like inline html! Are we back in the land
            // of classic asp/php? Short answer is no we are not. See 
            // below for details.
            <div>
                <h1>Hello world in React!</h1>
                <p>
                    The time now is { (new Date()).toLocaleString() }
                </p>
            </div>
        );
    }
}
```

It might look like we are writing literal html strings like old school asp/php, 
but under the bonnet these are shorthand syntax to generate ReactElements.

A ReactElement is the primary basic type in React which constitutes the virtual DOM. In essence, you are
writing virtual DOM. It's called virtual because it's not the real DOM. React keeps an in-memory copy
of this "html" ergo virtual dom and only flushes changes to the real DOM in the browser if there is a props or state
change. We'll talk about props and state more in later posts.

For now, just understand that you are writing a html-like syntax called jsx which becomes part of the virtual dom.

##### index.js
```jsx
// Import the render method from react-dom so we can mount our 
// component onto an html element
import React from 'react';
import {render} from 'react-dom';
import App from '../common/component/appComponent';

// This is the entry point into our react app on the client side. Again 
// we use jsx to create our ReactElement and mount it onto a div called 
// reactDiv on the html template.
render(<App />, document.getElementById('reactDiv'));
```

---

## Step 2.5: Modify express to serve react
Almost there! Now we need to modify server.js to serve a html page with a script reference to our dist/bundled.js generated by webpack.

We also need to add an express static middleware to serve that static bundle.js file. A middleware is just code that executes
between a request and a response. In this example, a GET request comes in from the client asking for dist/bundled.js. Our
middleware matches the route and executes our code. We use express' built-in static middleware so we get this for free.

```jsx

...

// This is our html template that contains our target mounting 
// div id="reactDiv". Also note the script reference to /dist/bundle.js.
const htmlString = `<!DOCTYPE html>
    <html>
         <head>
            <title>Webpack and React</title>
          </head>
          <body>
            <div id="reactDiv" />
            <script src="/dist/bundle.js"></script>
          </body>
    </html>`;

// Use express' built-in static middleware to serve static files in 
// the dist folder
app.use('/dist', Express.static('dist'));

...
```

---

## Step 2.6: Run the app!
At your root directory run "npm start" and browse to localhost:3000 to see the output.
Download the complete source code from [github](https://github.com/yusinto/reactStep2).

---------------------------------------------------------------------------------------

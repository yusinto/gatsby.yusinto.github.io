---
path: "/universal-hot-reload"
date: "2016-10-22"
title: "Hot Reloading Universally Bundled Webpack Apps"
published: true
tags: ["universal", "hot", "reload", "webpack", "server", "client", "bundle"]
files:
 - "./neo_spoon.jpg"
 - "./batman_robin.jpg"
---

I learnt quite a lot in the past week. Firstly there's no substitute to good sleep. Secondly, you can actually eat a salmon steak raw! Thirdly, it's really really hard
to hot reload a server bundle if you are writing a universal app.

On the client side, [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) and [react-hot-loader](https://github.com/gaearon/react-hot-loader)
have been around for a while now and have become indispensable to developers. However, what about the server side? 

One solution is to use nodemon to restart the server on file changes. This works if you don't bundle your server side code. If you do, you'll have to use a task runner 
like gulp to first compile your code, then use nodemon to restart the server.

I don't particularly like this solution because I need to introduce gulp and nodemon into my project. I believe webpack can solve anything and everything. So the challenge was set:
use only webpack to implement server side bundling and hot reload.

The final product is [universal-hot-reload](https://github.com/yusinto/universal-hot-reload) if you want to skip straight to dessert.
 
## The plan

We want to use webpack to watch our server files for changes, rebundle on change and restart the express server for changes to take effect.

## What's so hard about it?

Watching files for changes is already supported by webpack out of the box so that's easy. For example we can do this:

```jsx
  function watchServerChanges() {
    const webpack = require('webpack');
    const serverCompiler = webpack(require('path/to/webpack/server/config');
    const options = {
      aggregateTimeout: 300, // wait so long for more changes
      poll: true // use polling instead of native watchers
    };
    
    serverCompiler.watch(options, function onServerChange(err, stats) {
      if (err) {
        console.log('Server bundling error:' + JSON.stringify(err));
        return;
      }

      // TODO: restart express here 
    });
  }
```

We can call watchServerChanges on our server bootstrap and walah problem solved. Well not quite. How do we tackle restarting express on server file changes?

##Step 1: Express server restart using htttp.Server.close()
The http.Server object provides a [close](https://nodejs.org/api/http.html#http_server_close_callback) method which sounds like it might do the job.
For example we can theoretically do this:

```jsx
  function onServerChange(err, stats) {
    if (err) {
      console.log('Server bundling error:' + JSON.stringify(err));
      return;
    }

    // TODO: somehow get a reference to the running http.Server object;
    //const httpServer = ??? 
    
    httpServer.close(function () {
      console.log('Server restarted ' + new Date());
    });
  }
```

Two things we need to solve here:

1. We need to obtain a reference to the running http.Server object.

2. close() does not restart the server. It stops the server from accepting new connections and then shuts down the server when all its existing connections have closed.

###Step 1.1: Getting a reference to http.Server
<img alt="Neo Spoon" src="/static/neo_spoon.jpg" id="markdownImage"/>

Let's take a look at some code.

####src/server/index.js (bootstrap)
```jsx
  require('babel-polyfill');
  
  // require the server entry file where the express server is initialised
  // expect the server entry file to export a http.Server object
  const httpServer = require('./server');

  //... then we can call httpServer.close() at some point later
```

####src/server/server.js (entry)
```jsx
import express from 'express';

const PORT = 3000;
const app = express();

//... your other express middlewares

// the listen method returns the currently running instance of 
// http.Server object 
const httpServer = app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});

// export httpServer object so we can access it in bootstrap
module.exports = httpServer;
```

What's happening here:

* src/server/index.js is our bootstrap file. It requires src/server/server.js 
and expects an http.Server object as the exported value of that module. 

* In server.js, the listen() method returns an instance of the running http.Server object. 
This is what we export out of this module for index.js.

We are not done yet. Merely setting module.exports will not expose the exported object to
the consumer of our bundled js. Essentially we need to create a library out of our app. 
Meaning the main export of our app needs to be exposed to the consumer. To do this, 
in your webpack server config file, set **output.libraryTarget = 'commonjs2'**, like so:

####webpack.config.server.js
```jsx
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  devtool: 'cheap-module-inline-source-map',
  
  // set this to your server entry point. This should be where you start 
  // your express server with .listen()
  entry: './src/server/server.js', 
  
  // tell webpack this bundle will be used in nodejs environment.
  target: 'node', 
  
  // Omit node_modules code from the bundle. You don't want and don't 
  // need them in the bundle.
  externals: [nodeExternals()], 
  output: {
    path: path.resolve('dist'),
    filename: 'serverBundle.js',
    
    // IMPORTANT! Add module.exports to the beginning of the bundle 
    // so your main module is exposed to the consumer of the bundle.
    libraryTarget: 'commonjs2'
  },
  // The rest of the config is pretty standard and can contain 
  // other webpack stuff you need.
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.resolve('src')
      }]
  }
};
```
 

###Step 1.2: Restarting express
 
Now we have http.Server, we can call close() to stop the server. However as mentioned earlier, 
close() shuts down the server ONLY when all existing connections have closed. It does not terminate
stale or idle keep-alive connections. As a result after close() is invoked, your server will continue to run.
It will not accept new connections and it will wait for existing connections to timeout, which is in minutes.
 
Obviously you can't develop rapidly like this. You can't call this hot-reload, it's more like shit-reload.
A little googling reveals a promising [solution from stackoverflow](http://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately) by
[Golo Roden](http://www.goloroden.de/). 

The takeaway from that post is that each time a connection is made to our 
server, we have to keep a reference to the socket object that represents 
the connection. I store these in a Map for better performance rather
than a normal object as suggested in the post. We can then call
socket.destroy() in our watch handler for all sockets, which
terminates all connections to our http.Server. The close() method can then
proceed to shut the server.

What does it look like in code? 

####src/server/index.js (bootstrap)
```jsx
  require('babel-polyfill');
  
  watchServerChanges();

  // Starts the express server. Caches sockets and delete those caches 
  // on socket close. Returns the running http.Server object and the
  // socket Map cache.
  function initHttpServer() {
    // start the server, getting back a reference to http.Server
    const httpServer = require('/path/to/server/bundle');
    const sockets = new Map(); // cache all sockets in a Map
    let nextSocketId = 0;

    httpServer.on('connection', function (socket) {
      var socketId = nextSocketId++;
      sockets.set(socketId, socket);

      // remove socket from Map on close.
      // this is not where we terminate the socket! That happens 
      // in webpack.watch done handler below 
      socket.on('close', function () {
        sockets.delete(socketId);
      });
    });

    return {httpServer, sockets};
  }
  
  function watchServerChanges() {
      const webpack = require('webpack');
      
      // contains the running http.Server and socket cache
      let httpServerInitObject;
      let initialLoad = true;
      const compiler = webpack(require('path/to/webpack/server/config');
      const compilerOptions = {
        aggregateTimeout: 300, // wait so long for more changes
        poll: true // use polling instead of native watchers
      };
  
      // watch file changes
      compiler.watch(compilerOptions, function onServerChange(err, stats){
        if (err) {
          console.log('Server bundling error:' + JSON.stringify(err));
          return;
        }
  
        if (initialLoad) {
          // first time run, just start the server, no need to restart
          initialLoad = false;
          httpServerInitObject = initHttpServer();
          console.log('Server bundling done');
        } else {
          // subsequent runs need to close the server and restart
          // call close() method, but this won't complete until all
          // sockets are destroyed below.
          httpServerInitObject.httpServer.close(function () {
            // if we reach this step, that means we have succeeded
            // in shutting down the server!!! Omg fuck yea!
            httpServerInitObject = initHttpServer(); // re-start
            console.log('Server restarted ' + new Date());
          });
  
          // This is where the magic happens: destroy all open sockets
          for (var socket of httpServerInitObject.sockets.values()) {
            socket.destroy();
          }        
        }
      });
    }
```

##Step 2: Clearing the require cache
<img alt="Are we there yet?" src="/static/batman_robin.jpg" id="markdownImage"/>

If you try the code above, you realise that it does not freakin work. Why? 
We are forgetting one thing: node caches all modules when required. How is
this a problem? At initial load, initHttpServer() will require your server.bundle.js
and node will cache that. Subsequent calls to initHttpServer() will re-use that
same server.bundle.js which is not we want. We want to require the newly
bundled server.bundle.js which webpack produces. To do this we need to clear
the require cache:

```jsx
  function clearCache() {
    const cacheIds = Object.keys(require.cache);
    for(let id of cacheIds) {
      if (id === 'path/to/server/bundle') {
        delete require.cache[id];
        return;
      }
    }
  }
```

You call clearCache() in onServerChange callback prior to starting the 
express server like so:
```jsx
      
      //... same code as above
      
      // watch file changes
      compiler.watch(compilerOptions, function onServerChange(err, stats){
        if (err) {
          console.log('Server bundling error:' + JSON.stringify(err));
          return;
        }
        
        // This solves all first world problems
        clearCache();
  
        //... same as above
      });
    
    // ... 
```

##Step 3: But wait there's more!
You can combine this with existing client hot reload techniques using [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 
and [react-hot-loader](https://github.com/gaearon/react-hot-loader) to achieve the ultimate universal hot reload experience. 
I have done this in [universal-hot-reload](https://github.com/yusinto/universal-hot-reload) so you can check the source
code for that if you are interested. But for now, I'm out of time .. I need to take a shower.


## What's next?
So webpack does solve everything and anything like I said in the beginning.. can it do my laundry and feed my dog too? 

The final product is [universal-hot-reload](https://github.com/yusinto/universal-hot-reload). 
Check it out! Let me know if there's any issues.

---------------------------------------------------------------------------------------

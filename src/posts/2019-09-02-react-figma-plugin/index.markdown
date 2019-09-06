---
path: "/react-graphql-figma-plugin"
date: "2019-09-02"
title: "Writing a figma plugin with hot reload, react and graphql"
published: true
files:
 - "./hero.png"
tags: ["writing","figma","plugin","react", "graphql", "hot","reload"]
---

Figma has officially launched support for custom plugins last month and it's exciting times!
In this blog, I will show you how to write your own custom figma plugin with react and graphql and how to
hot reload your changes to enhance your development speed. You can find the source code in this blog post
[here](https://github.com/yusinto/react-graphql-figma-plugin). I recommend you explore the source code
and follow the blog with it for maximum benefit. Let's begin!

## Anatomy of a Figma plugin
You need 3 files for a plugin to work:
* **manifest.json**
<p>
Contains metadata about your plugin. It tells figma where your source files are
so it can run your code. There are 2 source files you need.
</p>

* **a html file**
<p>
This is your plugin UI i.e the dialog screen that pops up and the figma user sees when he runs your plugin. 
You can build this with any web technology like svelte, vue or react. In this example 
I'll use react. The js code in this file do not have access to figma nodes. You'll need
to post messages to the figma sandbox in order to access and manipulate nodes.
</p>

* **a sandbox js file**
<p>
This runs in the figma sandbox. The javascript in this file have access to figma nodes and the figma plugin api
but does not have access to the full node js/html dom environment. If you need to fetch data
from the internet you'll need to do so from the html file above and post messages back and forth
between the html file and the sandbox file.
</p>

## The react app
I use webpack and react to build the plugin UI screen. To keep things simple, this is a single component react app
which makes a single graphql query to spotify and displays the artist results. I use [urql](https://formidable.com/open-source/urql/)
as the graphql client which I really recommend because it's lightweight and simple to use.

Webpack bundles the react code into a single js file which gets inlined into an index.html file. This
index.html file contains all the code required by figma to run the plugin UI.

#### index.html
The index.html file contains only the mounting node for our react app.
```html
<div id="reactDiv"></div>
```

#### index.tsx
The index.tsx is the entry point to our react app. It sets up a graphql client and provider using `urql`
and renders our app onto the dom. This is standard react stuff.
 
```tsx
import React from 'react'
import { render } from 'react-dom'
import { Provider as GraphqlProvider, createClient } from 'urql'
import App from './app'

const graphqlClient = createClient({
  url: 'https://spotify-graphql-server.herokuapp.com/graphql',
})

render(
  <GraphqlProvider value={graphqlClient}>
    <App />
  </GraphqlProvider>,
  document.getElementById('reactDiv'),
)
```

#### app.tsx
This is the react component that fetches data from spotify using `useQuery` and displays the results
onto the plugin UI. If you need to post messages like graphql data to the sandbox, you will do it here.
```tsx
import React from 'react'
import { useQuery } from 'urql'
import { Artist, query } from './constants'

export default () => {
  const [result] = useQuery({ query })
  const { fetching, data, error } = result

  if (fetching) {
    return <>Loading...</>
  } else if (error) {
    return <>{error.message}</>
  }

  const { queryArtists: artists } = data

  return artists.map(({ id, name, albums }: Artist) => (
    <div key={id}>
      <h1>Artist: {name}</h1>
      <ul>
        {albums.map(a => (
          <li key={a.id}>{a.name}</li>
        ))}
      </ul>
    </div>
  ))
}
```

## The sandbox app
In this contrived example, our sandbox just simply displays our plugin UI and does nothing else. In the real
world, you will at least have some code to handle messages from your plugin UI and update figma nodes in
your current selection and also to close the plugin UI. I'll dive into these in a separate post.

```js
// This code runs in the sandbox. 
// Tells figma to load the main html file specified in manifest.json
figma.showUI(__html__)
```

## Installing and running the plugin
You'll need the [Figma desktop app](https://www.figma.com/download/desktop/mac) to run plugins. I don't think
the webapp has plugin support just yet. Once installed, run Figma and go to Plugins/Development/New Plugin.
Click to choose a manifest.json file and select your manifest.json file. Your plugin should now be installed.

To run, right click anywhere on your Figma page/frame/node and select Plugins/Development/your-plugin.

## Developing and hot reloading
I use webpack to build the plugin UI and inline the resultant bundle into a html template. If you are like me you are
probably used to having hot reload / hot module replacement during development. This has become an indispensable part of
my toolchain and greatly improves productivity. So much so I built [universal-hot-reload](https://github.com/yusinto/universal-hot-reload).

However we are in the figma world so none of the webpack dev server/hot reload/hmr stuff works because we have to 
reload the desktop app. Thankfully I discovered [modd](https://github.com/cortesi/modd). To install:

```bash
brew install modd
```

Then to tell modd what to watch, add `modd.conf` to your project:

```bash
** !dist/** !lib/** !node_modules/** {
    prep: yarn build
    prep: ./applescript.sh
}
```

The first line is a file matching pattern which says "Hey modd, watch all file except files under dist, 
lib and node_modules". When modd detects a change, it executes each of the `prep` command in sequence. 
The first one runs webpack which bundles our plugin UI js. The second is a shell script which contains an apple script
which tells OS X to bring the Figma desktop app to the foreground i.e. activate it and sends it the `command + option + p` 
shortcut which tells Figma to re-run the last plugin. There are 2 caveats with the apple script:

* You need to use OS X and give the terminal app security access to accessibility.
* You'll need to run your plugin manually once first otherwise the command+option+p shortcut doesn't have anything
to re-run.

To run modd, just type `modd` in the terminal. I aliased this as 
`yarn build` in my [project](https://github.com/yusinto/react-graphql-figma-plugin).

##Summary
This is part one of how to write a figma plugin with hot reload with react and graphql. In part two, I'll
explore the sandbox app which is used to manipulate figma nodes using the figma plugin api.

---------------------------------------------------------------------------------------

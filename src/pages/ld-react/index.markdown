---
path: "/ld-react"
date: "30 May 2018"
title: "React integration with Launch Darkly using ld-react"
published: true
tags: ["ld-react", "launch", "darkly", "react", "feature", "flag", "integration", "context", "api", "toggle"]
files:
 - "./hero.jpeg"
---

About two years ago I wrote a package [ld-redux](https://github.com/yusinto/ld-redux)
which allows easy integration of Launch Darkly and react redux apps. That package is still alive and well, but with
the introduction of the context api in react 16.3 we can do better.

Introducing [ld-react](https://github.com/yusinto/ld-react), the fastest and easiest way to
integrate launch darkly with your react apps. Live subscription works out of the box and you get camelCased keys for a better
developer experience. Integration is a two step process and best of all no redux! 

## Step 1: Install

You need react ^16.4 to use ld-react.

```sh
yarn add ld-react
```

## Step 2: Wrap your root app withFlagProvider

The withFlagProvider hoc initialises an ldClient object on componentDidMount and sets up subscriptions to all flags.
It then uses the context api to pass flag values to consumers. 

```jsx
import {withFlagProvider} from 'ld-react';
import Home from './home';

const App = () =>
  <div>
    <Home />
  </div>;

export default withFlagProvider(App, {clientSideId: 'your-client-side-id'});
```

You can also pass a user object and options as part of the second parameter in addition to clientSideId. However, they are
not mandatory.
 
## Step 3: Where you need flags, wrap that component withFlags

The withFlags hoc sets up a context consumer which passes flags to the wrapped component. Your flags will then be
available as camelCased keys under `this.props.flags.yourFeatureFlag`. 

```jsx
import {withFlags} from 'ld-react';

const Home = props => {
   // flags are available via props.flags
   return props.flags.devTestFlag ? <div>Flag on</div> : <div>Flag off</div>;
};

export default withFlags(Home);
```

That's it! For more, check out [github](https://github.com/yusinto/ld-react). There is also a fully
working spa [example](https://github.com/yusinto/ld-react/tree/master/example) with react router 4 and
ssr. 

Happy coding!

---------------------------------------------------------------------------------------

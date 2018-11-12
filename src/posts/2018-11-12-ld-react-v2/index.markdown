---
path: "/ld-react-v2"
date: "2018-11-12"
title: "ld-react v2 Feature Flag with Hooks"
published: true
files:
 - "./hero.png"
tags: ["ld-react", "v2", "version", "two", "launch", "darkly", "react", "feature", "flag", "integration", "context", "api", "toggle", "hooks", "useState", "useEffect"]
---

This is the quickest blog ever about the quickest way to integrate launch darkly with react. Two lines
of code to get feature flags into react. Courtesy of hooks. All the code here are available on [github](https://github.com/yusinto/ld-react/tree/hooks).

###Install
```bash
yarn add ld-react@next
```

####App.js
```js{9}
import {useLaunchDarkly} from 'ld-react';
import Home from './home';

const App = () =>
  <div>
    <Home />
 </div>;

export default () => useLaunchDarkly(App, {clientSideId: 'client-side-id'});
```

Note that hooks can only be used inside function components so you'll have to 
export a function.

####Home.js
```js{4}
import {useFlags} from 'ld-react';

const Home = () => {
   const {devTestFlag} = useFlags(); // look ma! Flags from hooks!
   return devTestFlag ? <div>Flag on</div> : <div>Flag off</div>;
};

export default Home;
```

It's then a single line of code `useFlags()` in a component somewhere to get your flags.
That's it! Beautiful concise code. It's actually a lot harder to test these stuff 
than to use it. I'll write another post about testing hooks soon.

The old api withFlagProvider and with Flags are still available and will stay supported 
for backward compatibility.

---------------------------------------------------------------------------------------

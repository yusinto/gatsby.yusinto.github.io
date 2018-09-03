---
path: "/ld-redux-v3"
date: "2018-01-14"
title: "Launch Darkly, React and Redux: The Easy Way"
published: true
tags: ["launch", "darkly", "react", "redux", "feature", "flags", "toggle", "ld", "ld-redux", "v3", "easy", "way"]
files:
 - "./steve-jobs-small.jpg"
---
About a year and a bit ago I published ld-redux to integrate launch darkly with react and redux. I used that solution
both commercially in production and personally. It has been stable thus far. There were issues though:

 * ld-redux state contains a somewhat mysterious internal property called *isLDReady* which is a pain in the butt.
 
 * components have to be connected via a hoc called *ldConnect* which is again a pain.
 
 * The subscription logic for flag changes in that hoc might result in duplicate subscriptions which is inefficient. 

With these in mind, I introduce to you (drum roll) [ld-redux v3](https://github.com/yusinto/ld-redux).

## What's new?
There's no longer need to worry about *isLDReady*. It has been deleted completely from the package.

There's no longer need to connect using *ldConnect* either! It is gone baby gone!

You can consume your flags directly from your redux store without having to use *getFlags()*.

The subscription logic has been moved to the *init()* method so all subscriptions are done just once. Very efficient.

<h1 style="color: red">!!WARNING!!</h1>

<img alt="Backwards compatibility?" src="/static/steve-jobs-small-acfb0db7cfd55319023a97d893196da1.jpg" id="markdownImage"/>

v3 is **NOT** backwards compatible with v1.x! So be prepared to do some refactoring if you are on v1 upgrading to v3.
It's a simple upgrade though. You will be deleting code most of the time. ld-redux v3 is launch darkly 
and redux as it's meant to be!

## How to use?
You include ldReducer in your app and call the init method once at bootstrap. Your flags will then be available
in your redux state as camel cased keys. That's it!

####clientBootstrap.js
```jsx
import createStore from '<your-project>/store';
import ldRedux from 'ld-redux';

// standard redux createStore
const store = createStore();

// Init once on bootstrap to set default flag values and subscriptions
// Note you no longer need to specify a flags object. By default ld-redux
// will subscribe to all flags
ldRedux.init({
  clientSideId: 'your-client-side-id',
  dispatch: store.dispatch,
});

render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory}/>
  </Provider>,
  document.getElementById('reactDiv')
);
```

####reducer.js
```jsx
import { combineReducers } from 'redux';
import ldRedux from 'ld-redux';
import reducers from '<your-project>/reducers';

// Note: the LD key can be anything you want
export default combineReducers({
  ...reducers,
  LD: ldRedux.reducer(),
});
```

####yourComponent.js
```jsx
...

const mapStateToProps = (state) => {
  // Your camelCased feature flags are magically available in the store!
  // Note: the key LD must be the same as step 2
  const {featureFlagKey} = state.LD;

  return {
    featureFlagKey,
  };
};

...
```

## Conclusion
Check the fully working [example](https://github.com/yusinto/ld-redux/tree/master/example) on github.

Oh and one more thing in case someone asks what happened to ld-redux v2? It went from v1.4.x to v3.0.1. What the heck?
Umm I made a mistake during publishing (entered npm version update major twice) so it became v3. Doesn't matter! As long
as it works right?

---------------------------------------------------------------------------------------

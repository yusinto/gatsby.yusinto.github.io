---
path: "/react-feature-toggle-launch-darkly"
date: "2016-09-16"
title: "Implementing feature toggle with launch darkly and react redux"
published: true
tags: ["react", "redux", "feature", "toggle", "launch", "darkly", "toggling"]
---
###_Update: 22 October 2016_
_I have published an npm package called [ld-redux](https://github.com/yusinto/ld-redux) which covers everything you need to integrate launch darkly with your react
redux app. It's the contents of this blog in an npm package. If you use it, please give me some feedback. Thanks!_

---

I first heard the term feature toggle from someone I interviewed when we were talking about continuous deployment (deploying to prod at anytime, continuously).
I didn't really think much of it at first, thinking that it's just a trivial bunch of if-else flags that I have to maintain
manually. I couldn't be more wrong.

Maintaining feature flags in your codebase can become messy very quickly. On top of that you need to build targeting and analytics tools that
the business will (eventually) want. I soon realise that feature toggle is a distinct and separate supporting domain of my core domain. Much like identity and
access management. So is there anything existing out there we can use to integrate with our core domain?

Enter Launch Darkly. I met Edith Harbaugh the CEO of Launch Darkly at NDC Sydney 2016. She was kind enough to give a demo of launch darkly in situ and I was blown away.
Launch darkly stores feature flags without coupling to the UI, so it works with React or any modern javascript framework with virtual dom reconciliation.
The sdk supports almost every imaginable platform, but most importantly it's on [npm](https://www.npmjs.com/package/ldclient-js) and
open source on [github](https://github.com/launchdarkly/js-client).

In this blog I will walk through step by step how to integrate launch darkly feature toggles with your react react-router redux app.
Note that this blog assumes prior working knowledge of redux and redux-thunk.

## The end game
By the end of this blog, we will have a feature-flag driven react redux app using Launch Darkly as our feature toggle provider.

## Step 1: Configure launch darkly dashboard

`youtube: _WDy_V0h-qk`

## Step 2: Install ldclient-js
```bash
npm i ldclient-js --save
```

## Step 3: Create redux action and reducer to instantiate ldclient
We need to instantiate the ldclient in order to communicate with launch darkly. This instantiation
should be done once at the start of the app, and the resultant client object stored in redux state to be
re-used throughout the app.

We'll go ahead and create the action and reducer to perform this instantiation.

####appAction.js
```jsx
import ldClient from 'ldclient-js';

export const initialiseLD = () => {
  // use redux-thunk for async action
  return dispatch => {
    /**
     * Launch darkly provides a comprehensive suite of targeting and
     * rollout options. Targeting and rollouts are based on the user
     * viewing the page, so we must pass a user at initialisation time.
     *
     * The user object can contain these properties:
     * key, ip, firstName, lastName, country, email, avatar, name,
     * anonymous.
     *
     * The only mandatory property is "key". All the others are
     * optional. You can also specify custom properties using the
     * "custom" property name like company and authorOf properties below.
     *
     * For more info on users, check here:
     * http://docs.launchdarkly.com/docs/js-sdk-reference#users
    */
    const user = {
      // key is MANDATORY! You can use guid for anonymous users
      "key": "deadbeef",
      "firstName": "John",
      "lastName": "Carmack",
      "email": "jcarmack@doom.com",

      // specify custom properties here. These will appear
      // automatically on the dashboard.
      "custom": {
        "company": "ID Software",
        "authorOf": ["doom", "quake"]
      }
    };

    // Actual work done here. You'll need to use your environment id as
    // configured in your dashboard
    const client = ldClient.initialize('YOUR-ENVIRONMENT-ID', user);

    // The client will emit an "ready" event when it has finished
    // initialising. At that point we want to store that client
    // object in our redux state. Do this by dispatching an action
    // with the client object as the argument to be stored in app state.
    client.on('ready', () => {
      dispatch(setLDReady(client));
    });
  };
};

// Stores launch darkly client object in app state
export const setLDReady = ldClient => {
  return {
    type: Constants.LD_READY,
    data: ldClient
  }
};
```

####appReducer.js
```jsx
import Constants from './common/constant';

const defaultState = {
  isLDReady: false,
  ldClient: null,
};

export default function App(state = defaultState, action) {
  switch (action.type) {
    case Constants.LD_READY:
      return Object.assign({}, state,
        {
            isLDReady: true,
            ldClient: action.data
        });

    default:
      return state;
  }
}
```

## Step 4: Invoke initialiseLD on componentDidMount
We want to initialise the client just once at the start of the app. The
best place to do this is at the root component's componentDidMount.

I'll skip the appContainer snippet to keep things short.

####appComponent.js
```jsx
import React, {Component} from 'react';

export default class App extends Component {
  componentDidMount() {
    // This will trigger ldclient initialisation
    this.props.initialiseLD();
  }

  render() {
    ...
  }
}
```

## Step 5. Fetching feature flags
This is the jist of the entire blog so pay attention! Now we have the
client initialised, we can fetch our flags! Each component which uses
feature flagging must subscribe to the isLDReady app state above.
This is pretty standard in redux, and you can do this like so:

####homeContainer.js
```jsx
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as Actions from './homeAction';
import HomeComponent from './homeComponent';

const mapStateToProps = (state) => {
  const appState = state.App;
  const homeState = state.Home;

  return {
    isLDReady: appState.isLDReady,
    ...homeState
  };
};

@ connect(mapStateToProps, Actions)
export default class HomeContainer extends Component {
  render() {
    return <HomeComponent {...this.props} />;
  }
}
```

So now we can fetch "home" specific feature flags when ldclient is ready
like so:

####homeComponent.js
```jsx
import React, {Component} from 'react';

export default class Home extends Component {
  ...
  // When the ready flag changes to true, we fetch feature flags for
  // this component
  componentWillReceiveProps(newProps) {
    if (newProps.isLDReady && !this.props.isLDReady) {
      this.props.initialiseHomeFlags();
    }
  }
  ...
}
```

<b><i>initialiseHomeFLags</i></b> is the interesting bit here. The way you
 retrieve flags from launch darkly is through the "variation" method. You
 pass the feature flag key (which you set up in the dashboard) along with
 a default, just in case the call failed or if
 the flag doesn't exist. That means you need to store all your feature
 flag keys somewhere in the app so it can be shared across actions and reducers.
 I store it in a "logic" file specific to the component, so I can have
 a clean separation of concerns between actions and business logic.

####homeLogic.js
```jsx
export const homeFlags = {
  'random-number': false // default flag value
};
```

####homeReducer.js
```jsx
...
const defaultState = {
  randomNumber: 0,

  // store home flags in component state
  ...homeFlags
};

export default function App(state = defaultState, action) {
  switch (action.type) {
    case Constants.GENERATE_RANDOM:
      return Object.assign({}, state, {randomNumber: action.data});

    case Constants.SET_HOME_FLAGS:
      return Object.assign({}, state, action.data);

    default:
      return state;
  }
}
```

We can then retrieve individual feature flags for the home component
in our initialiseHomeFlags action using ldclient's variation method:

####homeAction.js
```jsx
...
export const initialiseHomeFlags = () => {
  // use thunk
  return (dispatch, getState) => {
    // get launch darkly client from app state
    const ldClient = getState().App.ldClient;
    const flags = {};

    for (let key in homeFlags) {
      // fetch each key
      flags[key] = ldClient.variation(key, homeFlags[key]);

      // EXTRA!! Subscribe to changes!
      ldClient.on(`change:${key}`, current => {
        const changedFlag = {};
        changedFlag[key] = current;
        dispatch(setHomeFlags(changedFlag));
      });
    }

    dispatch(setHomeFlags(flags));
  };

  const setHomeFlags = flags => {
    return {
      type: Constants.SET_HOME_FLAGS,
      data: flags
    }
  };
};
...
```

<b>EXTRA!!</b> Launch darkly provides support for realtime feature flag change
propagation using Server Sent Events (SSE, which is a html5 thing). This is like
websockets but it's a one way connection from the server to client to allow
 for push notifications. This is super cool! That means the client can
 see feature flag changes from the dashboard in realtime without having to
 refresh the browser!
 <p>
 The way you subscribe to this is by using the "on" event on the client object,
 specifying the string 'change:featureFlagKey' as the first argument, and the
 action to take as the second argument. In this case, we send an action
 to store the updated flags in our component state via our reducer.
 </p>

## Step 6: Use feature flags
This is the most fun and easy part!

####homeComponent.js
```jsx
import React, {Component} from 'react';

export default class Home extends Component {
  ...
  render() {
      return (
        <div>
          <p>
            Welcome to the homepage! The random number feature below is
            feature toggled.
          </p>
          {
            // feature toggle!
            this.props['random-number'] ?
              <div>
                <button onClick={this.onClickGenerateRandom}>Generate
                random number</button>
                <p>{this.props.randomNumber}</p>
              </div>
              :
              null
          }
        </div>
      );
    }
  ...
}
```

Your feature flags will be available to you as props because it's hydrated
by actions in the state. The only gotcha here is that you need to access
the feature flags using the brackets notation i.e. this.props.['feature-flag-key']
instead of the standard dot notation. This is because keys can contain
 spaces when created in the dashboard and spaces are replaced by dashes
 automatically by launch darkly. Since dashes are not allowed when using
 the dot notation, we have to use square brackets. There could be a better
 way, if you find one, let me know!

## What's next?
Feature flagging is instrumental in achieving continuous deployment and I have just
touched the tip of the iceberg. I will
be blogging more about my journey towards continuous deployment with docker
and launch darkly in the coming posts.

All the code in this blog are available on [github](https://github.com/yusinto/launchdarkly)

---------------------------------------------------------------------------------------

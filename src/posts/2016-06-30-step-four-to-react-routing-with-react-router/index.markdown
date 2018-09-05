---
path: "/step-four-to-react-routing-with-react-router"
date: "2016-06-30"
title: "Step 4 to React - Intro to routing with react router"
published: true
tags: ["react", "react router", "routing"]
---

I am in LA for holidays! Yep, I'm blogging as I am holidaying; I don't know why but I just can't stop thinking about it.
My wife says I'm addicted to work, I said no. We fight a lot but we love each other. Love is weird.

Anyway! This is a short and basic guide to implement routing with react router.
If you haven't read my [previous post](/step-three-to-react-speed-dev-with-hot-module-replacement/),
it might be a good idea to have a quick read before reading this one. We'll build this example based on that last post.
Let's get into it!

---

## Step 4.1: Install react-router

```bash
npm install --save react-router
```

The latest version of react-router at the time of writing is 2.5.1. This single npm package is sufficient for 
all our routing needs.

---

## Step 4.2: Initialise routes
You set up react router routes in jsx. What does that mean? That means you set up your routes
the same way you write jsx; in an xml-like format with nested parent-child structure. 
 
```xml
import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './component/appComponent';
import Home from './component/homeComponent';
import Contact from './component/contactComponent';

const routes =
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/contact" component={Contact}/>
  </Route>;

export default routes;
```

Setting up routes like this maybe confusing to someone who is new to react router and perhaps even more confusing
for .NET developers who are used to setting up MVC routes. Let me explain how this works in react router:
<ul>
<li>Each "Route" element must specify a path and a component attribute.</li>
<li>Incoming urls will be matched to a path. When matched, the corresponding component will be rendered.</li>
<li>The previous point means that a path like "/contact" is actually a nested path which 
matches <b>two</b> components at "/" and "/contact". That means <b>both</b> the App and Contact components will be rendered.
</li>
<li>IndexRoute is the default component which gets rendered when no nested route is specified i.e. when only "/" or "" is specified.</li>
</ul>

---

## Step 4.3: Add react router links
You need to use the Link component from react-router package instead of the standard html anchor tags to 
be able to route across pages SPA style.

```xml
<Link to="/">Home</Link>
<Link to="/contact">Contact Us</Link>
```

Each Link component needs to have a "to" attribute specified. The value of each "to" attribute must match a route specified in the route.js 
file in the previous section.

---

## Step 4.4: ReactDom render Router
Instead of rendering your root component directly on the client side, you render the Router component (from react-router package) with the routes attribute
specified. This is so we can match urls and render matching components using the routes declared in common/route.js
The history attribute tells react router to use html5 history api as opposed to hash history. If you don't specify this attribute,
 you will get this warning: 
 ```xml
 [react-router] `Router` no longer defaults the history prop to 
 hash history. Please use the `hashHistory` singleton instead."
 ```
Html5 history api is preferable to hash history because it keeps the url clean:

"/contact" 

as opposed to:

"/#/contact"

The whole client/index.js looks like this:
```xml
// Import the render method from react-dom so we can mount our
// component onto an html element
import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from '../common/route';

/**
 * Render the Router component with routes attribute so we can match urls 
 * and render matching components using the routes declared in common/route.js.
 * The history attribute tells react router to use html5 history api as 
 * opposed to hash history. Html5 history api is preferable to hash history 
 * because it keeps the url clean e.g. "/contact" as opposed to "/#/contact"
 */
render(<Router routes={routes} history={browserHistory} />, document.getElementById('reactDiv'));
```

---

## Step 4.5: Write child React components!
Almost there! Now we create the actual Home and Contact components that
get rendered when matched. These are pretty simple:

#### homeComponent.js
```jsx
import React, {Component} from 'react';

export default class Home extends Component {
  render() {
    return (
      <div>
        <p>React junkie will rock ndc 2016 in Sydney!</p>
      </div>
    );
  }
}
```
#### contactComponent.js
```jsx
import React, {Component} from 'react';

export default class Contact extends Component {
  render() {
    return (
      <div>
        <p>Contact us! 555-6969</p>
      </div>
    );
  }
}
```

---

## Step 4.6: Some finishing touches on styling and run the app!
We'll prettify our app by deactivating the current active link so users get a feedback on where they are on the website.
The whole appComponent.js looks like this:

#### appComponent.js
```xml
import React, {Component} from 'react';
import {Link} from 'react-router';

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>React Router Demo</h1>
        <span>
          {
            /* Activate or deactivate link depending on current route */
            this.props.location.pathname === '/' || this.props.location.pathname === '/home' ?
              <span>Home</span> : <Link to="/">Home</Link>
          }
        </span>&nbsp;|&nbsp;
        <span>
          {
            this.props.location.pathname === '/contact' ?
              <span>Contact Us</span> : <Link to="/contact">Contact Us</Link>
          }
        </span>
        <div>{this.props.children}</div>
      </div>
    );
  }
}
```

Notes:
<ul>
<li>You render child components from your routes by calling {this.props.children}</li>
<li>You can access the current location through "this.props.location". This contains a "pathname" property which will tell you the current path
that's matched.</li>
</ul>

At your root directory run "npm start" and browse to localhost:3000 to see the output.
Download the complete source code from [github](https://github.com/yusinto/reactStep4).

---------------------------------------------------------------------------------------

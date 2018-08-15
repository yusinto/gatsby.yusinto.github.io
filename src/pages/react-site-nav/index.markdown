---
path: "/react-site-nav"
date: "13 Jul 2018"
title: "Introducing react-site-nav"
tag:
- react
- site
- nav
- navigation
- bar
- navbar
- stripe
- styled
- components
- menu
- css
- animations
- grid
- cssgrid
---

Stripe has a beautiful site nav and this package is inspired by that.
Introducing react-site-nav, a beautifully animated site nav powered by styled components
and css animations. Play with the [live demo](https://now-evztwufdfm.now.sh) powered by now
or check out the video below.

`youtube: 4fThkT_vlBE`

### Goal
Let's use react-site-nav and add a kick ass nav to create-react-app!

### Step 1: Install

We'll create a new create-react-app project and install react-site-nav the usual way:

```sh
create-react-app cra-with-nav
cd cra-with-nav
yarn add react-site-nav
```

### Step 2: Adding SiteNav and ContentGroup

Good stuff. Now we are going to add two components to App.js: SiteNav and ContentGroup.

```js{4,12-25}
import React from 'react';
import logo from './logo.svg';
import './App.css';
import SiteNav, {ContentGroup} from 'react-site-nav';

export default () => (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <SiteNav>
        <ContentGroup title="About" width="240" height="140">
          <ul>
            <li>About me</li>
            <li>My projects</li>
          </ul>
        </ContentGroup>
        <ContentGroup title="Contact" width="200" height="150">
          <ul>
            <li><a href="https://github.com/yusinto">Github</a></li>
            <li><a href="https://twitter.com/yusinto">Twitter</a></li>
          </ul>
        </ContentGroup>
      </SiteNav>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
);
```

SiteNav is the root react component that contains ContentGroup children.
Each ContentGroup can accept 3 props: title, width and height.

<p align="center">
<img src="src/pages/react-site-nav/content-group.png" width="400"/>
</p>


### Step 3: Making it pretty

It takes only a few lines of code to get up and going, but it still looks very basic.
Let's make it pretty! First, set our SiteNav to debug mode so the content group stays open
when we hover over it:

```js
<SiteNav debug={true}>
```

Let's get rid of those ugly default list style, margin and padding:

```css
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
```

Next instead of a bullet point, let's have an image next to our text. Our jsx becomes:

<script src="https://gist.github.com/yusinto/840ecdba5ce0d8f4bf85fa11ae2a4e51.js"></script>

Let's use flex for our list item so we can easily center everything:

```css
li {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
}
```

It's starting to look good! Just some finishing touches now to make the images and text vertically
aligned and some hover effects:

```css
li:hover {
    opacity: 0.7;
}

li > span {
    flex: 0 0 100px;
    text-align: left;
    margin-left: 10px;
}
```

### Tadaa
![Before and after](/assets/images/before-after.png)

Check out the live demo [here](https://build-licattzisr.now.sh/). The complete stylesheet:

<script src="https://gist.github.com/yusinto/9a04ad983ff2b03a140683d45ef9405b.js"></script>

### Next steps
There are still loads left to do, like mobile and sizing near edges. I'll get to those in time!

For more, check out [github](https://github.com/yusinto/react-site-nav). There are three fully
working spas including the code in this blog in the [examples](https://github.com/yusinto/react-site-nav/tree/master/examples)
folder. The code in this blog is under [examples/cra-with-nav](https://github.com/yusinto/react-site-nav/tree/master/examples/cra-with-nav).

Please star it if you like it! Thanks.

# Thanks
[Max Stoiber](https://mxstbr.com/) is awesome.
[Styled components](https://www.styled-components.com/) is awesome.
[Now](https://zeit.co/now) is awesome. Thanks.

---------------------------------------------------------------------------------------

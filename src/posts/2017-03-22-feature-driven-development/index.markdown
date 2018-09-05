---
path: "/feature-driven-development"
date: "2017-03-22"
title: "Feature driven development"
published: true
tags: ["feature", "flag", "driven", "development", "git", "model", "agile", "scrum", "sprint"]
---
I'm writing this onboard of a plane, en route to my holidays in Vietnam. I was fortunate enough to get a business class upgrade (bucket list item
checked) which made it possible for me to even think of blogging. 

I didn't know they get real cutlery in business class?! Plus face moisturiser and lip
balm?! And that flatbed with built-in massager.. my god I've been missing out all this time. And the food! They get real food! I had pan fried
barramundi with steamed vegetables with unlimited hard liquors enough to inspire burnt out devs to start a blog.

I digressed. I want to talk about development cycles in this post. At work, I use scrum with a 2 week sprint, standups every morning, grooming etc. In my previous
job, I use the same. There's nothing wrong with this, but with the introduction of new tools like launch darkly (feature toggling), docker and aws ecr, there's
been a bit of a quiet evolution (or should I say revolution?) towards the inevitable: continuous feature driven delivery. 

What does that mean? It means you develop
a feature, test it, and as soon as its ready for production you deploy it. Each feature is treated the same way, so there could be many deployments in a week
or even in a day. What does this further mean? This means the scrum is dead my friend!

## Scrum is dead.. again?
I'm quoting Dave Thomas' infamous blog post "[Agile is dead](http://davethomas.org)". The idea of an x-nightly sprint at the end of which a prod deployment occurs
 is outdated, just as the waterfall model became outdated when agile was introduced. Some elements of the scrum are still useful e.g. standups and grooming, but the 
 notion of an end of sprint delivery is outdated.
 
## 


Consider the following code (which you can see in entirety [here](https://github.com/yusinto/test-react/blob/master/src/universal/home/home.js)):

#### home.js
```jsx
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as Actions from './homeAction';

// private class
class Home extends Component {
  constructor(props) {
    super(props);
    this.onClickGenerateRandom = ::this.onClickGenerateRandom;
  }

  onClickGenerateRandom() {
    this.props.generateRandom();
  }

  render() {
    let homeText = 'Click button below to generate a random number!';

    return (
      <div>
        <p>{ homeText }</p>
        <div>{this.props.randomNumber}</div>
        <button onClick={this.onClickGenerateRandom}>
            Generate random number
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const homeState = state.Home;

  return {
    randomNumber: homeState.randomNumber
  };
};

export default connect(mapStateToProps, Actions)(Home);
```

The Home class is private and that's what we want to test. It is not exported at all, so we can't access it directly. 
As mentioned above, the official redux documentation recommends exporting this class, but that breaks encapsulation.
So what do we do? Enter [babel-plugin-rewire](https://github.com/speedskater/babel-plugin-rewire).

## Using rewire
You need to install the following npm packages:

```jsx
yarn add --dev jest babel-plugin-rewire enzyme react-addons-test-utils
```

I use [jest](https://facebook.github.io/jest/) for my test framework and you should too, it kicks butt. 
I also use [enzyme](https://github.com/airbnb/enzyme) which is a utility library for testing react components. 
Enzyme requires the official [react-addons-test-utils](https://facebook.github.io/react/docs/test-utils.html) package.

In your .babelrc, add an "env" block to include babel-plugin-rewire when running tests:

#### .babelrc
```jsx
{
    "presets": ["es2015", "react", "stage-0"],
    
    /* etc your other config */
    
    "env": {
      "test": {
        "plugins": ["babel-plugin-rewire"]
      }
    }
}
```

## Write the tests!
Now we can write the tests! The complete file is [here](https://github.com/yusinto/test-react/blob/master/src/universal/home/home.test.js):

#### home.test.js
```jsx
import React from 'react';
import {shallow} from 'enzyme';
import HomeRedux from './home';

describe('Home component tests', () => {
  // rewire injects __get__ and __set__ methods to all our modules.
  // These can then be used to extract and set top level private variables.
  // In this instance, we extract the private Home class
  const Home = HomeRedux.__get__('Home');

  it('should render correctly', () => {
    // Yayy! We can now render the presentational component directly! 
    const output = shallow(<Home randomNumber={45}/>);
    
    // Use jest snapshot testing for convenience
    expect(output).toMatchSnapshot();
  });
});
```

## Conclusion
This approach incurs a little more time to setup, but I think it's worth it. We leave the code fully testable, encapsulation intact. 
This feels right for me. Also, you can apply the same technique to test react components wrapped in relay containers. It works! 

Check out the [sample code](https://github.com/yusinto/test-react) for a working example and let me know if this is useful (or not)!

---------------------------------------------------------------------------------------

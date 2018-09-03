---
published: true
title: "Testing Connected Redux and Relay Components"
layout: post
date: 2017-01-28 08:30
tag:
- redux
- relay
- connected
- unit
- tests
- testing
- encapsulation
- jest
- rewire
blog: true
---
Happy chinese new year everyone! In the spirit of the year of the cock, I shall write the rest of this post in chinese. 
中国著名的大思想家、大教育家。孔子开创了私人讲学的风气，是儒家学派的创始人。孔子曾受业于老子 (roughly translates to... I don't know).
Did I say Cock? I mean Rooster. Apologies my dear chinese readers... I don't think there's a difference anyway?
 
I'm gonna talk about testing redux components today. If you use react-redux, you are probably connecting
your components to redux using the connect method. If you do this in one file with a single default export (which is the connected component)
you have a problem. You'll find that you can't test your component directly because the default export of your module is not the component
itself, rather it's the redux connected component. What you want to test is the presentational component, not the connected component. Redux
itself is already tested!

You have two options at this point; you can either bite the bullet and test the redux component meaning mocking a lot of the redux stuff OR 
you can modify your code to be testable by exporting the private presentational component. This second approach is the one recommended by the 
[official redux documentation](https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md){:target="_blank"}. I find that although 
this works it does so at the expense of encapsulation. I believe code should be driven by design and requirements, not testing restrictions. 
So I set out to find a better approach.

There is a popular npm package [rewire](https://github.com/jhnns/rewire){:target="_blank"} which seems to be promising. I failed to make it work
quickly though, because it does not work with es6 so a little more googling reveals [babel-plugin-rewire](https://github.com/speedskater/babel-plugin-rewire){:target="_blank"} 
which is based on rewire and works with es6. Armed with this library, I embarked on a journey towards a better cock year oops I mean better unit tests. 

## Enough talk, show me some code
Consider the following code (which you can see in entirety [here](https://github.com/yusinto/test-react/blob/master/src/universal/home/home.js){:target="_blank"}):

#### home.js
{% highlight javascript %}
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
{% endhighlight %}

The Home class is private and that's what we want to test. It is not exported at all, so we can't access it directly. 
As mentioned above, the official redux documentation recommends exporting this class, but that breaks encapsulation.
So what do we do? Enter [babel-plugin-rewire](https://github.com/speedskater/babel-plugin-rewire){:target="_blank"}.

## Using rewire
You need to install the following npm packages:

{% highlight javascript %}
yarn add --dev jest babel-plugin-rewire enzyme react-addons-test-utils
{% endhighlight %}

I use [jest](https://facebook.github.io/jest/){:target="_blank"} for my test framework and you should too, it kicks butt. 
I also use [enzyme](https://github.com/airbnb/enzyme){:target="_blank"} which is a utility library for testing react components. 
Enzyme requires the official [react-addons-test-utils](https://facebook.github.io/react/docs/test-utils.html){:target="_blank"} package.

In your .babelrc, add an "env" block to include babel-plugin-rewire when running tests:

#### .babelrc
{% highlight javascript %}
{
    "presets": ["es2015", "react", "stage-0"],
    
    /* etc your other config */
    
    "env": {
      "test": {
        "plugins": ["babel-plugin-rewire"]
      }
    }
}
{% endhighlight %}

## Write the tests!
Now we can write the tests! The complete file is [here](https://github.com/yusinto/test-react/blob/master/src/universal/home/home.test.js){:target="_blank"}:

#### home.test.js
{% highlight javascript %}
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
{% endhighlight %}

## Conclusion
This approach incurs a little more time to setup, but I think it's worth it. We leave the code fully testable, encapsulation intact. 
This feels right for me. Also, you can apply the same technique to test react components wrapped in relay containers. It works! 

Check out the [sample code](https://github.com/yusinto/test-react){:target="_blank"} for a working example and let me know if this is useful (or not)!

---------------------------------------------------------------------------------------

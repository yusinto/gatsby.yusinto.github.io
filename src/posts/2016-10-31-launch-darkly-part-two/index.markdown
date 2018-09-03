---
published: true
title: "Targeting users with React Redux and Launch Darkly"
layout: post
date: 2016-11-1 19:30
tag:
- targeting
- users
- react
- redux
- feature
- toggle
- launch
- darkly
- toggling
- ld-redux
blog: true
---

In my [previous previous post](http://www.reactjunkie.com/react-feature-toggle-launch-darkly/){:target="_blank"} 
I introduced launch darkly as a feature toggling platform and how to use it with react redux. In this post I
will explain how you can further leverage the power of feature toggling with user targeting.
 
## What's user targeting?
You have a feature or functionality you only want to display to a select group of audience. For example 
releasing a beta feature to users who have signed up. Kinda like a sneak preview for early adopters. 
Or perhaps you want to show special offers only to premium members of your website. This is user targeting.

## Ok sounds interesting. How do I do it?
On init, you'll need to pass a user object to Launch Darkly so it has something to work with: 

{% highlight javascript %}
import ldClient from 'ldclient-js';

// Launch Darkly supports the following user attributes by default
const user = {
   key: 'some-unique-key', // mandatory, the only mandatory property
   ip: '111.222.3.4',
   email: 'some@email.com',
   name: 'React Junkie',
   firstName: 'React',
   lastName: 'Junkie',
   country: 'Australia'
};

ldClient.initialize('your/client/side/id', user);
{% endhighlight %}

You'll need to pass a user object containing at least a key property to Launch Darkly.

## Configure the dashboard
Login to Launch Darkly and in the Feature Flags section select a feature flag. In the targeting section,
you can target individual users, use rules to target a group of users or default to a blanket rule for 
all users.

I will delve into using rules to target a group of users because I think that's a more common use case 
compared to targeting individual users.

For example, the settings below will target users in Australia:

![Targeting user by country?](/assets/images/user_targeting_by_country.png)

You can also serve true to a percentage of Australian users using the "percentage rollout" serve option.
For example the settings below will rollout true to 50% of Australian users:

![Targeting user by country percentage rollout?](/assets/images/user_targeting_percentage_rollout.png)

###Advanced targeting
If you look carefully there's an Advanced option if you select percentage rollout. The purpose of this 
option is not very obvious. In our example above you can use this advanced option to further group 
Australian users by (say) their browser.
 
For example, the settings below will serve true to half of chrome users, half of safari users, 
half of firefox users, etc. It's a way of "bucketing" your users so each bucket receives the 
percentage rollout you specified.

![Targeting user by country percentage rollout?](/assets/images/user_targeting_advanced.png)

##Usage with ld-redux
If you use [ld-redux](https://github.com/yusinto/ld-redux){:target="_blank"}, you pass the user object
as the third parameter to ldRedux.init method:
{% highlight javascript %}
import createStore from '<your-project>/store';
import ldRedux from 'ld-redux';

// standard redux createStore
const store = createStore();

const user = {
   key: 'some-unique-key',
   ip: '111.222.3.4',
   email: 'some@email.com',
   name: 'React Junkie',
   firstName: 'React',
   lastName: 'Junkie',
   country: 'Australia'
};

// Pass the user object after store to the init method
ldRedux.init('yourClientSideId', store, user);
 
render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory}/>
  </Provider>,
  document.getElementById('reactDiv')
);
{% endhighlight %}

By default, if you don't specify a user object, ld-redux will create a default
user like below:

{% highlight javascript %}
user = {
   key: uuid.v4(),
   ip: ip.address(),
   custom: {
        browser: userAgentParser.getResult().browser.name,
        device, // either mobile, tablet or desktop
   },
};
{% endhighlight %}

You can see the complete logic for default user creation [here](https://github.com/yusinto/ld-redux/blob/master/src/init.js){:target="_blank"}.

The custom property allows you to pass any arbitrary properties to Launch Darkly which you can use for targeting. This is very useful and powerful.

## Conclusion
Feature flagging coupled with user targeting is a powerful way to control your target audience. This opens up a whole
new world of possibilities in regards to what you can do with your app. Someday all apps will be built this way.


Check out [ld-redux](https://github.com/yusinto/ld-redux){:target="_blank"} if you haven't, and please give me some feedback if you use it! Thanks.

---------------------------------------------------------------------------------------

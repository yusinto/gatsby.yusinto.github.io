---
path: "/graphcool-functions-in-es6-with-async-await"
date: "2017-06-30"
title: "Writing Graphcool functions in es6 with async await and jest"
published: true
tags: ["graphcool", "functions", "server", "side", "subscription", "async", "await", "es6", "graphql", "jest"]
---
Graphcool is cool. Graphcool functions are even cooler. There are two types of functions:
request pipeline and server side subscription. Request pipeline function gets triggered
at a specified stage of a crud request. You write custom business logic you want to execute
as part of your api requests here. It is synchronous.

The second type of function is server side subscription. These get triggered
<b>after</b> crud operations. Your write custom business logic here to
react to crud events in your database. Server side subscriptions are
asynchronous.

In this blog, I will talk about server side subscriptions. A crud occurs
on the server and we want to execute some business logic after that happens.
The traditional solution is to do it in our own backend in node/java/.net
probably in the business logic layer. But that means we need to host our
own backend server which means we have to worry about infrastructure.
Can we do better?

Yes we can. Enter Graphcool server side subscriptions. You write your business logic directly in
the Graphcool console and specify the event which will trigger this logic.

## Goal
The goal is to create a stripe customer when a Graphcool customer is created. It's a very common
use case. The complete code is [here](https://github.com/yusinto/functions/tree/master/stripe-create-customer-es6).

Enough talk, let's code!

## Step 1: Create Graphcool schema
Create a Customer type in your Graphcool backend so we have something to crud with.

#### customer.graphql
```graphql
type Customer implements Node {
  email: String!
  stripeCustomerId: String
  id: ID! @isUnique
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

Use the graphcool cli to create a new Graphcool project and create the Customer type.

```bash
npm -g install graphcool
graphcool init --schema customer.graphql
```

## Step 2: Create Graphcool server side subscription
The cli is powerful but it is still work in progress. You can't create functions
via the cli at this stage (yet). We'll create our ssr function via the console
for now. You can open the console using the cli:

```bash
graphcool console
```

Go to functions -> new function -> server-side subscription -> select Customer type
as the trigger and click define function. Copy paste the subscription query
below into the left window pane under subscription query.

#### subscription.graphql
```graphql
subscription {
  Customer(filter: {
    mutation_in: [CREATED]
  }) {
    updatedFields
    node {
      id
      email
    }
  }
}
```

Let's look at this in detail:
<ul>
<li>
The <b><i>subscription</i></b> keyword is a third operation recently added to
graphql in addition to query and mutation.
</li>
<li>The subscription above means we are subscribing only to Customer create events.
You can also listen to UPDATED and DELETED events but we don't need those here.
</li>
<li>When a Customer is created, return the id and email of that newly created customer.</li>
</ul>

Back in the console click "Create Function". Leave inline code on the right pane
as is for now, we'll write the code for this in the next section.

## Step 3: Write code!
Finally we get to write some code! You can code directly
in the console inline editor, but doing so forgoes a lot of the benefit
of your IDE. Furthermore, behind the scenes inline functions are deployed
to [webtask](https://webtask.io/) which is cool
but does not support async await.

Optionally you can also write and host your code elsewhere (like aws lambda) and
specify that as a webhook. But this means you have to worry about hosting
your code elsewhere.

In this blog, we want to be able to write es6 code with async await, linting, unit tests,
strong typing, etc in the comfort of our favourite IDE and be able to
deploy that to graphcool. To do this we have to bite the bullet and use
webpack to transpile our code. Luckily for you fellow js devs, readers and
oss fans, I've done all the hard work! I have worked out the minimal webpack
config to support async await and the latest es6 features to write Graphcool
functions. There's a [bonus section](#bonus-webpack-configuration) at the
end of this blog if you are interested in how the webpack config works.

### Step 3.1: Copy package.json
Copy package.json from [here](https://github.com/yusinto/functions/tree/master/stripe-create-customer-es6)
to your root directory. Then do yarn.

```bash
yarn
```

The devDependencies are mostly used by webpack to transpile our code. We also
use jest for unit tests so that's in there too. We also need the stripe
library and a fetch library so those are included as dependencies.


### Step 3.2: Copy webpack.config.js and .babelrc and create src dir
Copy webpack.config.js and .babelrc files from [here](https://github.com/yusinto/functions/tree/master/stripe-create-customer-es6)
into the root directory of your project. Check the
[bonus section](#bonus-webpack-configuration) below if you want to dig
into the webpack config.

Also at the root of your project, create a src directory where all your code lives.

## Step 3.3:
Create a file called src/createStripeCustomer.js. This file contains all
of our function code. Note that the webpack config you copied is hardcoded to
look for this file under src/createStripeCustomer.js. You can change this
in webpack.config.js if you wish.

#### main method
```js
const main = event => {
  const {id, email} = event.data.Customer.node;

  return new Promise(async (resolve, reject) => {
    try {
      const stripeCustomer = await createStripeCustomer(email);
      const graphCoolCustomer = await updateGraphCoolCustomer(id, stripeCustomer.id);
      console.log(`Successfully updated GraphCool customer: ${JSON.stringify(graphCoolCustomer)}`);
      resolve(event);
    }
    catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
```

#### createStripeCustomer method
```js
const createStripeCustomer = async email => {
  console.log(`Creating stripe customer for ${email}`);
  let stripeCustomer;

  try {
    stripeCustomer = await stripe.customers.create({email});
    console.log(`Successfully created Stripe customer: ${stripeCustomer.id}`);
    return stripeCustomer;
  }
  catch (err) {
    console.log(`Error creating Stripe customer: ${JSON.stringify(err)}`);
    throw err;
  }
};
```

#### updateGraphCoolCustomer method
```js
const updateGraphCoolCustomer = async (id, stripeCustomerId) => {
  const updateCustomer = JSON.stringify({
    query: `
        mutation {
          updateCustomer(
            id: "${id}",
            stripeCustomerId: "${stripeCustomerId}",
          ) {
            id
            stripeCustomerId
            email
          }
        }
      `
  });

  try {
    const response = await fetch(graphCoolEndpoint, {
      headers: {'content-type': 'application/json'},
      method: 'POST',
      body: updateCustomer,
    });
    return await response.json();
  }
  catch (err) {
    console.log(`Error updating GraphCool customer: ${JSON.stringify(err)}`);
    throw err;
  }
};
```

The entire file is available [here](https://github.com/graphcool-examples/functions/blob/master/stripe-create-customer-es6/src/createStripeCustomer.js)
on github.

## Bonus: webpack configuration
This is not a webpack tutorial but I want to share a few interesting things I
discovered while working on this:

<ul>
<li>
We will export our function by setting module.exports so we need to set
output.libraryTarget to commonjs2.
</li>
<li>
<b>DO NOT BUNDLE THIRD PARTY LIBRARIES!</b> This will blow up your code size, and it's
not necessary. Your Graphcool function is executed in webtask
and it supports most of the npm packages you'll need. Check 
<a href="https://tehsis.github.io/webtaskio-canirequire/" target="_blank">here</a>
for packages webtask supports.
</li>
<li>As a result of the point above, use
<a href="https://github.com/liady/webpack-node-externals" target="_blank">webpack-node-externals</a> to exclude all npm packages.
</li>
<li>
GOTCHA: To enable latest es6 features and async await, we have to include two npm packages: babel-polyfill and regenerator-runtime/runtime
</li>
</ul>
If you are interested, you can check the complete webpack config 
<a href="https://github.com/yusinto/functions/blob/master/stripe-create-customer-es6/webpack.config.js" target="_blank">here</a>.


## Conclusion
With client side subscriptions, you'll use apollo with
the [subscriptions-transport-ws](https://github.com/apollographql/subscriptions-transport-ws)
to enable your js client app to "hot listen" to server changes. The server pushes notifications
to the client, which reacts to these notifications in real-time. It's super cool!

This approach incurs a little more time to setup, but I think it's worth it. We leave the code fully testable, encapsulation intact. 
This feels right for me. Also, you can apply the same technique to test react components wrapped in relay containers. It works! 

Check out the code on [github](https://github.com/yusinto/functions/tree/master/stripe-create-customer-es6)!

---------------------------------------------------------------------------------------

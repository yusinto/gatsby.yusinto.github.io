---
path: "/return-graphql-enums"
date: "2016-04-13"
title: "Returning graphql enum values to the client"
published: true
tags: ["react", "relay", "graphql", "GraphQLEnumType"]
---

In my attempt to learn Relay and GraphQL, I recently created a simple movie app. It is a single page app in both senses -
it only has one page and it's all client side (excuse the pun!). This single page displays a list of movie titles and their genres.
It also has a select box to filter the list by genre.

This blog is not an intro to graphql or relay, that will be covered sometime in the near future. It's about how to return
a list of enum values declared in our graphql schema to the client. So in a nutshell:

###The Problem
Given a GraphQLEnumType in the schema, how do we return all the values in that enum type as a list to the client?

###The Solution
The premise is straight forward. We need to populate our genre select box with all the enum values declared in the schema. However, I can't seem to
find any posts/articles/documentation that describe how I can do this. So I set out on my own exciting investigation.

---

##The Schema

The genre enum type looks like this. You can find the complete schema [here](https://github.com/yusinto/movie-time/blob/master/src/graphql/schema.js).

```jsx
const genreEnum = new GraphQLEnumType({
  name: 'Genre',
  values: {
    ACTION: {
      value: 'Action'
    },
    ADVENTURE: {
      value: 'Adventure'
    },
   ...
    WESTERN: {
      value: 'Western'
    }
  }
});
```

Our graphql endpoint should return a list like this:

```jsx
['Action', 'Adventure',...,'Western']
```

Using the chrome debugger, I discovered that the genreEnum object has a property called <b>_values</b>. I'm guessing the underscore
prefix means that it's a private property by convention, so we might not be doing the best thing here! However due to the lack of
alternatives, it will have to do for now. Your resolve method should then look like this:

```jsx
resolve: () => genreEnum._values.map(e => e.value)
```

And that's it! You can find the complete code on [github](https://github.com/yusinto/movie-time)

Happy coding!

---------------------------------------------------------------------------------------

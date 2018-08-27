---
path: "/relay-schema-stitching"
date: "27 April 2018"
title: "Relay Schema Stitching with Pesisted Queries"
published: true
tags: ["relay", "schema", "stitching", "graphql", "apollo", "react", "js", "javascript", "prisma", "graphcool", "persisted", "queries"]
files:
 - "./loui-stitch.jpg"
---

Schema stitching was introduced by Apollo, so there is a general misconception that it
only works with the apollo stack but it works with relay as well! In this blog
I'll show you how to stitch your relay schema with any remote graphql schema.

You can find the complete project in [github](https://github.com/yusinto/relay-compiler-plus/tree/master/example-stitching).

## Goal
Given a local schema that looks like this:

```graphql
type Query {
  user: User
  place: Place
}

type User {
  email: String
  name: String
  favouritePlaces: [Place]
}

type Place {
  id: String
  name: String
  #business: Business # this is remote
}
```

Stitch it so that business details are coming from a remote graphql server, in this case from [prisma](https://eu1.prisma.sh/public-nickelwarrior-830/wendarie-prisma/dev).

## Step 1: Install graphql-cli
We'll use graphql cli to download the remote schema:
 
```sh
yarn add -D graphql-cli
```

## Step 2: Download the remote schema
Graphql cli looks for a .graphqlconfig.yml by default, so we'll create that file
and it looks like this:

```yaml
schemaPath: ./remote.schema.graphql
extensions:
  endpoints:
    default:
      url: https://eu1.prisma.sh/public-nickelwarrior-830/wendarie-prisma/dev
```

In this example, our business details are hosted in [prisma](https://eu1.prisma.sh/public-nickelwarrior-830/wendarie-prisma/dev) 
but you can use any graphql endpoint. [Prisma](https://prisma.io) is created by the guys from 
graphcool, check it out if you haven't!

Run the following to download the remote schema to ./remote.schema.graphql:

```sh
graphql get-schema
```

## Step 3: Stitch
The stitching part is standard, following [Apollo's doco](https://www.apollographql.com/docs/graphql-tools/schema-stitching.html):

```js
import {mergeSchemas, makeRemoteExecutableSchema, makeExecutableSchema} from 'graphql-tools';
import {importSchema} from 'graphql-import';
import {HttpLink} from 'apollo-link-http';
import fetch from 'node-fetch';
import localSchema from './localSchema';

const uri = 'https://eu1.prisma.sh/public-nickelwarrior-830/wendarie-prisma/dev';
const link = new HttpLink({uri, fetch});

// remote.schema.graphql is downloaded in the previous step
const remoteTypeDefs = importSchema('./remote.schema.graphql');
const remoteSchema = makeRemoteExecutableSchema({
  schema: makeExecutableSchema({typeDefs: remoteTypeDefs}),
  link, // GOTCHA: you gotta use apollo link, not fetcher!
});

// Our local schema contains one user with her favourite places.
// Prisma contains the business details of those places.
// We connect our places with prisma's businesses using this link.
const linkTypeDefs = `
  extend type Place {
    business: Business
  }
`;
const result = mergeSchemas({
  schemas: [localSchema, remoteSchema, linkTypeDefs],
  resolvers: {
    Place: {
      business: {
        fragment: `fragment PlaceFragment on Place { id }`,
        resolve: (place, args, context, info) =>
          info.mergeInfo.delegateToSchema({
            schema: remoteSchema,
            operation: 'query',
            fieldName: 'business',
            args: {
              where: {
                publicId: place.id, // local Place.id maps to remote Business.publicId
              },
            },
            context,
            info,
          }),
      }
    }
  }
});

export default result;
```

**Important bits**:

* Line 11: Import the remote schema we downloaded from step 2 using graphql-import. This gets
fed into makeRemoteExecutableSchema.

* Line 14: Use apollo-link to resolve remote queries! If you look at the documentation, there is
a second option of using a fetcher. However doing this will forward the Document AST
to the remote server instead of the query string, which breaks most graphql servers except 
apollo-server.

* Line 20: Extend the Place type to include a reference to Business, which will be resolved to
the remote server via mergeSchemas in line 29.

* Line 29: This defines the resolver for the business field. The key here is the `delegateToSchema`
method which gives you access to the current `Place` being queried based on the fragment defined
in line 30, and access to the remote schema so you can query the remote server with any queries 
you want. In this instance, the query we want to execute on prisma is equivalent to:

```graphql
query {
  business(where: {publicId: "$place.id"}) { # place.id is supplied by fragment on line 30 
    id
    name
    email
    address
  }
}
```

## Step 4: Compile
Say we have a relay query like so:

```jsx
const query = graphql`
    query client_index_Query {
        user {
          email
          name
          favouritePlaces {
              business { # look ma, remote schema field!
                  name
                  email
                  address
              }
          }
        }
    }
`;

// most props omitted for brevity
<QueryRenderer
    environment={relayEnvironment}
    query={query}
/>
```

We'll compile our relay queries using [relay-compiler-plus](https://github.com/yusinto/relay-compiler-plus).
This way we'll get schema stitching plus persisted queries for free! You can still use the standard relay-compiler,
but you won't get persisted queries (not yet anyway. I have submitted a [pr](https://github.com/facebook/relay/pull/2354)) 
and you can't compile directly from graphql-js.

```sh
yarn add -D relay-compiler-plus
```

Add the following npm command to your package.json:

```sh
"rcp": "relay-compiler-plus --webpackConfig path/to/webpack.config.js --src src",
```

Ensure the webpack entry is pointing to mergedSchema.js from step 3. Then run:

```sh
npm run rcp
```

This should produce the standard relay query files plus a queryMap.json file under src. You'll see in queryMap.json that 
the remote query exists as if it's local!

## Conclusion
It is possible to use relay and schema stitching. It is surprisingly straight forward thanks to the tools provided
by Apollo. It is impossible to document every single step in this blog without boring everyone to death. People don't read
blogs more than 4 mins long these days... so perhaps it's best to see it in action. 

Check out the full project on [github](https://github.com/yusinto/relay-compiler-plus/tree/master/example-stitching).

Happy stitching!

<img alt="Loui stitch" src="/static/loui-stitch-c058c54d16587be41ae99fcbe6003743.jpg" id="markdownImage"/>


---------------------------------------------------------------------------------------

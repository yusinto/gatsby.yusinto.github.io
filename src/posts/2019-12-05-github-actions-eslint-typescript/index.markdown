---
path: "/github-actions-eslint-typescript"
date: "2019-12-05"
title: "Using github actions with eslint and typescript"
published: true
files:
 - "./hero.png"
tags: ["github", "actions", "eslint", "typescript", "linting", "ts", "react", "javascript", "continuous", "integration", "ci"]
---

I discovered the true power of github actions 2 weeks ago when starting a new project at work. Prior to this,
I have been using circleci to run my linting, typescript check, tests and then deployment. I was happy with
this setup but was keen to learn what github actions have to offer. I was pleasantly suprised with the results.

Now I see linting and typescript errors <i>in the PR</i> in the UI! I no longer have to context jump
to another tool to check build failures, which is a huge win. Check my [demo repo](https://github.com/yusinto/github-actions-demo/pull/1/files)
to see this in action (excuse the pun). 

The way github actions is setup is similar with circleci.
 
## Step 1: Create main.yml

At the root of your repo for e.g: `projectRoot/.github/workflows/main.yml` create the following:

```yaml
on: [push]

jobs:
  lint:
    runs-on: ubuntu-latest
    name: Run eslint
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: '13.x'
      - run: yarn
      - run: yarn lint
  tsc:
    runs-on: ubuntu-latest
    name: Check typescript
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: '13.x'
      - run: yarn
      - run: yarn tsc
```

A workflow consists of jobs. A job consists of steps. Each job runs in its own docker container.

You might wonder why I have 2 jobs here instead of 1. The reason is speed. Jobs are run in parallel by default
so it could be faster to run some steps in parallel like linting and tsc. In the case where a job needs to depend
on another you can use the needs keyword:

```yaml
  jest:
    runs-on: ubuntu-latest
    name: Run tests
    needs: [lint, tsc] # ensure tests are run only after eslint and tsc pass
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: '13.x'
      - run: yarn
      - run: yarn test
```

## Step 2: Commit and push the yml file

And wait. Github will schedule your workflow to run at some point. In my experience this has been
fast, but there is one time when I had to make an extra push on a non-master branch to initiate
github actions.

That's it! Now if you submit a PR you will be able to see linting and typescript errors in the UI itself:

<p align="center">
<img src="https://user-images.githubusercontent.com/1593077/70263065-6358bc80-174a-11ea-8e62-aadb6de7a1fb.png" alt="Linting with github actions" />
</p>

Nice!

## Summary

I love github actions. It provides immediate compile and build feedback in the UI without having to context
change to another tool. It's easy to setup and it's fast. There is a marketplace offering many custom actions
you can include in your workflow. Some of the interesting ones are [jest code coverage](https://github.com/marketplace/actions/jest-code-coverage-report),
[size-plugin](https://github.com/marketplace/size-plugin) and [pull-request-size](https://github.com/marketplace/pull-request-size).

There are still issues though. The marketplace actions are mostly un-verified which mean they could be 
buggy and unmaintained. Going with a verified action is best but no guarantee that things are bug free. For
example I find the [typescript line number annotation](https://github.com/yusinto/github-actions-demo/pull/1/files#r354480279)
in my demo PR is wrong. The pricing is also something you might want to consider. Github actions are free
for public repos but are priced according to minutes for private repos. The free tier for private repos 
includes 2000 minutes per month.

All the code in this post are in the [demo repo](https://github.com/yusinto/github-actions-demo/pull/1/files).

Thanks for reading!

---------------------------------------------------------------------------------------

---
path: "/storybook-launchdarkly"
date: "2020-03-27"
title: "Using Storybook and LaunchDarkly"
published: true
files:
 - "./hero.png"
tags: ["storybook", "launchdarkly", "feature","flags", "ux", "ui", "js", "react", "javascript"]
---

If you use LaunchDarkly to feature flag your app and you use storybook, then here's a way to
run your feature flagged components in storybook. 

The example below assumes a `Button` component that uses the LaunchDarkly react sdk to
access flags via the `useFlags` hook. 

```tsx
import React from 'react'
import { withLDProvider } from 'launchdarkly-react-client-sdk'
import Button from './button'

export default { title: 'Buttons' }

// 1. Write your standard story component
const EmojiButton = () => (
  <Button backgroundColor="blue">
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
)

// 2. Then wrap it with withLDProvider
const LDEmojiButton = withLDProvider({ clientSideID: 'your-client-side-id' })(EmojiButton)

// 3. Finaly export the wrapped component
export const withLDEmoji = () => <LDEmojiButton />

```

You will be able to target users and turn features on/off in storybook like you can in your app!
The possibilities are endless.

See the complete sample app which you can run on [github](https://github.com/yusinto/storybook-launchdarkly).  

---------------------------------------------------------------------------------------

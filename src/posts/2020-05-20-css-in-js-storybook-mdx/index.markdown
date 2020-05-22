---
path: "/css-in-js-storybook-mdx"
date: "2020-05-20"
title: "Using css in js with storybook and mdx"
published: true
files:
 - "./hero.png"
tags: ["mdx", "storybook", "docs", "addon-docs", "addons", "add", "ons", "add-ons", "css", "emotion", "styled", "components", "css-in-js", "in", "cssinjs", "js", "gatsby", "react", "javascript", "markdown"]
---

Mdx is cool. It lets you use react components in markdown files so it's like markdown on steroids.
If you use storybook docs addon and mdx and want to use css in js in your mdx files, here's a way to do it. 
Theoretically this should work with gatsby too.


Note that I was only able to make this work with the `styled` object and failed to make it work 
with the css prop. The css prop relies on the jsx pragma, which I think requires further tinkering with
babel for it work with storybook and mdx.

Also note that we are using storybook's re-export of emotion styled object. Storybook [uses emotion](https://storybook.js.org/docs/configurations/theming/#using-the-theme-for-addon-authors)
under the hood and re-exports all emotion exports. So in theory, we should be able to use the jsx pragma and
the css prop in mdx if babel is configured correctly as I mentioned above.

####Alert.docs.mdx
```markdown
import { Meta, Story, Preview } from '@storybook/addon-docs/blocks'
import { styled } from '@storybook/theming'
import { Alert } from './Alert'

<!-- 
1. Declare your styled component. You must export the const!
-->
export const StyledDiv = styled.div`
  font-size: 40px;
  padding-bottom: 10px;
`

<Meta title="MDX/Alert" component={Alert}/>

# Alert

<!-- 
2. Use your styled component as usual. That's it!
-->
<StyledDiv>
  Hello css in js! We got emotion in mdx!
</StyledDiv>

<Preview>
    <Story name="Success">
        <Alert kind="success">
           Successfully used emotion css-in-js with mdx!
        </Alert>
    </Story>
</Preview>
```

Have fun coding!

---------------------------------------------------------------------------------------

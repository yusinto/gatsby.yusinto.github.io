---
path: "/theme-ui-react-router-link-typescript"
date: "2020-01-31"
title: "Theme UI react router link with typescript"
published: true
files:
 - "./hero.png"
tags: ["theme-ui", "theme", "ui", "components", "gatsby", "typescript", "ts", "tsx", "react", "javascript", "link", "react-router", "router", "reach"]
---

In this post I'll describe how you can create a theme-ui aware Link component with react router or gatsby in typescript. 

Theme UI provides built-in components that are theme-aware which are awesome. This means you can directly use
variant, mx, py and other [style props](https://theme-ui.com/components#style-props) in your jsx: 

```tsx
import { Box } from 'theme-ui'

export default () => (
  // directly use variant, mx, py, etc with theme-ui components 
  <Box variant="gretting" mx={3} py={5}>
    G'day from reactjunkie!
  </Box>
);

```

The example above is a contrived one. What if you want to use the theme-ui Link component with react router or gatsby? 
These libraries have their own Link component so you'll have to use the `as` prop that comes with all theme-ui 
components to change the underlying component. This works, however making it work with typescript requires a 
little extra work. Let's implement this with react router.

<iframe src="https://codesandbox.io/embed/infallible-tharp-d1ri5?fontsize=14&hidenavigation=1&module=%2Fsrc%2Flink.tsx&moduleview=1&theme=dark&view=editor" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="Example theme-ui react router gatsby link with typescript" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

We want to make a theme-ui aware react router link with typescript. You can see the important steps from the comments
above with additonal notes below. Note that the `ForwardRef` type is ripped from the official [definition](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/86bd530585927c9a4e16bc8f5db17439b66c30b3/types/theme-ui__components/index.d.ts#L21)
so I won't go into that here.

1. We combine the theme-ui and react router link props to get an intersection type called `CombinedProps`.  

2. Create a new component `FinalLink` using the intersection type above so typescript is aware of all the props our custom
Link component can accept.

3. Finally use the `as` prop to swap the underlying component of the default theme-ui link with
the default react router link.

Now we have a react router Link component that complies with theme-ui!

```tsx

import Link from "./link";

const Home = () => (
  // Look ma theme-ui aware react router link!
  <Link to="/about" variant="body" pl={2} sx={{ fontSize: 1 }}>
    Back to about us page
  </Link>
);
``` 

Check out the full app in [codesandbox](https://codesandbox.io/s/infallible-tharp-d1ri5?fontsize=14&hidenavigation=1&theme=dark).

Thanks for reading!

---------------------------------------------------------------------------------------

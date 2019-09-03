---
path: "/react-figma-plugin"
date: "2019-09-02"
title: "Writing figma plugin in react"
published: true
files:
 - "./hero.png"
tags: ["writing","figma","plugin","react","hot","reload"]
---

Figma has officially launched support for custom plugins last month and it's exciting times.
In this blog, I will show you how to write your own custom figma plugin in react. 


##Highlights  

[Michael Jackson](https://github.com/Mjackson/react-loop-2019) was the highlight of the conference. 
He was the keynote speaker and he was very good. His talk was largely based around hooks and how it has
changed React. There were many good ideas in his demos. He was "live" coding custom hooks just to show
the possibilities: useLogger, usePersistentState, useThunk all of which are really super cool. I really 
like his talk. He's very funny too.

[Eric Bishard](https://dev.to/httpjunkie/react-loop-p8) further expanded on hooks talking
about state management with hooks. He gave an awesome demo implementing a TODO app with hooks. The app demonstrates
how to use `useReducer` and `useEffect` to manage state. I am already familiar with these hooks but to see them being
implemented live and explained in detail is a good learning experience. These hooks combined with `useThunk` from MJ 
above really indicates that React is becoming a more self-sufficient library i.e. we don't need redux anymore.

[Houssein Djirdeh](https://houssein.me/progressive-react) gave a good and almost customary talk on performance and react. 
I learnt that you can run lighthouse now straight from devtools from the Audits tab. Another cool thing is [library detector for chrome](https://github.com/johnmichel/Library-Detector-for-Chrome)
which tells you what libraries/frameworks are used on a website. It's so cool! Another cool thing is [size-plugin](https://github.com/GoogleChromeLabs/size-plugin)
which prints the size of your webpack bundle and the size difference compared to the last build. I think I'm going
to incorporate this as part of my development pipeline to watch out for size bloats.

##Summary
I enjoyed parts of the conference more than others I must admit. The attendees were awesome I had a chance
to socialise and network with many awesome developers in the area. It was a small decent size group. The theme
of the conference was unmistakable: hooks, hooks and hooks. That said, the food was not very good and
they didn't have tea, only coffee. Perhaps next time these could be better.

Thanks for reading! 

---------------------------------------------------------------------------------------

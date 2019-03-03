---
path: "/test-react-use-effect-with-enzyme"
date: "2019-03-02"
title: "Test React useEffect with Enzyme"
published: true
files:
 - "./hero.png"
tags: ["unit", "testing", "test", "react", "useEffect", "use", "effect", "use-effect", "hooks", "enzyme", "jest", "mount", "act", "react-dom", "test-utils"]
---

To test the useEffect hook with enzyme, you'll need to use a combination of the new react-dom/test-utils method `act` with
enzyme mount. Shallow rendering does not trigger componentDidMount so that won't work.

<iframe src="https://codesandbox.io/embed/wq8w1zwlwk?fontsize=14&module=%2Fsrc%2Fapp%2Fapp.test.js&previewwindow=tests&view=editor" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

---------------------------------------------------------------------------------------

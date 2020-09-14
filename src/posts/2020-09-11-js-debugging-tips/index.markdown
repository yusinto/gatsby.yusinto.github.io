---
path: "/js-debugging-tips"
date: "2020-09-11"
title: "Javascript debugging tips"
published: true
files:
 - "./hero.png"
 - "./js-debugging-tips.png"
tags: ["debug", "tips", "js", "chrome", "dev", "tools", "react", "typescript", "javascript", "conditional", "breakpoint", "console", "log", "production"]
---

Last week whilst investigating a production issue I discovered the following two priceless debugging techniques on
chrome dev tools. These eventually helped me solve the bug so I'm sharing them here now. Hopefully these will be useful
to others.

<p align="center">
<img src="/static/js-debugging-tips-e26131a96057ea998fe311d2ded13316.png" id="markdownImage"/>
</p>

##Console log without code change
You can console log without changing the source code! This means you can even console log production code
or any code for that matter accessible via dev tools:

1. Right click on the line number you want to console log.

2. Add logpoint.

3. Enter the string you want to log in this format: `'Input value is:', input`.

`youtube: YOkftPOzJpU`

##Conditional breakpoint 
You can add a condition to a breakpoint so the debugger only kicks in when the condition is met. This saves you from
having to repeatedly click the resume button only to miss the actual problematic case because of the mad clicking:

1. Right click on the line number you want to break on.

2. Add conditional breakpoint.

3. Enter a boolean expression on which you want the debugger to break. For example: `blurbShort.startsWith('Frontend')`.

`youtube: 8kQblnwPE0Y`

Hope that helps. Till next time!

---------------------------------------------------------------------------------------

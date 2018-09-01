---
path: "/js-lessons-tojson-valueof"
date: "2018-03-28"
title: "Javascript Lessons: toJSON and valueOf"
published: true
tags: ["js", "lessons", "javascript", "tojson", "valueof", "json", "stringify", "prototype", "object"]
---

## toJSON()
If you need a custom output when json stringifying your object, you can define
a function called toJSON() which will be invoked automatically by
JSON.stringify():

TODO: https://gist.github.com/whoisryosuke/17d79b09a4923546ab58009720d50976
<p data-height="376" data-theme-id="dark" data-slug-hash="KoZmLa" data-default-tab="js,result" data-user="yusinto" data-embed-version="2" data-pen-title="Javascript Lessons" class="codepen">See the Pen <a href="https://codepen.io/yusinto/pen/KoZmLa/">Javascript Lessons</a> by Yusinto Ngadiman (<a href="https://codepen.io/yusinto">@yusinto</a>) on <a href="https://codepen.io">CodePen</a>.</p>

Without the custom toJSON() implementation, the code above will use the default
implementation:

```json
{"firstName":"Yus","lastName":"Ng"}
```

## valueOf()
Object.prototype has a built-in valueOf method which returns the primitive value
of the object. You can override this method to return a custom primitive value
for your object:

<p data-height="372" data-theme-id="dark" data-slug-hash="YaYQyo" data-default-tab="js,result" data-user="yusinto" data-embed-version="2" data-pen-title="Javascript Lessons: valueOf" class="codepen">See the Pen <a href="https://codepen.io/yusinto/pen/YaYQyo/">Javascript Lessons: valueOf</a> by Yusinto Ngadiman (<a href="https://codepen.io/yusinto">@yusinto</a>) on <a href="https://codepen.io">CodePen</a>.</p>

The override allows us to perform arithmetic with our object. Without the override,
the valueOf myCar will be NaN (Not-a-Number).


---------------------------------------------------------------------------------------

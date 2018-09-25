---
path: "/vue-mixin-args"
date: "2018-09-25"
title: "Vue Mixins With Arguments"
published: true
files:
 - "./hero.png"
tags: ["vue", "mixins", "mixin", "args", "arguments", "params", "parameters", "vuejs", "vue2", "vuejs2"]
---

I was writing [ld-vue](https://github.com/yusinto/ld-vue) when I needed a way to pass arguments
to my Vue mixin. In my case, I needed to pass a client id to an external library so it can be
initialised. This is the technique I ended up using to pass params to my mixin:

####exampleMixin.js
```js{6}
import someLibrary from 'some-library';

const exampleMixin = clientId => ({
  methods: {
    init: function() {
      someLibrary.initialize(clientId);
    },
  },
})

export default exampleMixin
```

Instead of defining an object, define a function which returns the mixin object. Pass any
arguments or parameters you want to this function. Then using closure, you can access these
in your mixin. To use this mixin:

####App.vue
```js{5}
<script>
import exampleMixin from './exampleMixin'

export default {
  mixins: [exampleMixin('some-client-id')],
}
</script>
```

Call the function with an argument which will generate the *real* mixin object.

---------------------------------------------------------------------------------------

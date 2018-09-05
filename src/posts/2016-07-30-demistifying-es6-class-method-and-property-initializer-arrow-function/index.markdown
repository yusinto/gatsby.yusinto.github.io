---
path: "/demistifying-es6-class-method-and-property-initializer-arrow-function"
date: "2016-07-30"
title: "Demistifying es6 class method and property initializer arrow function"
published: true
tags: ["react", "es6", "es 6", "class", "classes", "method", "property", "initializer", "arrow", "function"]
---

Welcome back to another episode of react junkie's blog post. Today I'll be talking about meth crystal meth ice and how to
replicate the perfect process to produce the most immaculate blue sky just like Jesse Pinkman.

Did that get your attention? :)

Actually no. Today I'll be talking about a much more exciting topic: the difference between es6 class methods and arrow functions.

I encountered this at work when two of my colleagues (let's call them Lill and Woic to preserve anonymity) implemented class methods
in two different styles. Compare the printQuality method in the following code snippets:

####Lill: Standard es6 class method
```js
import React, {Component} from 'react';

export default class MethLab extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            methQuality: 'blueSky'
        };
        
        // manually bind "this" context of printQuality function
        // to the instance of MethLab being constructed
        this.printQuality = ::this.printQuality;
    }
    
    // Use the standard es6 class method syntax
    printQuality() {
        console.log(`${this.state.methQuality}`);
    }
}
```

####Woic: Property initializer with arrow function
```js
import React, {Component} from 'react';

export default class MethLab extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
           methQuality: 'blueSky'
        };
    }
    
    // Use property initializer combined with arrow function
    printQuality = () => {
        console.log(`${this.state.methQuality}`);
    };
}
```

Can you guess the output of each implementation? If you've been using react
for a while, you would guess that they would both output 'bluesky' and you would be
right. Based on that guess, you would further extrapolate that they are both
doing the same thing and are indifferent from each other. It's a fair and logical guess, but you would be wrong.

The answer lies in the es5 translation of these syntactic sugar. Let me explain through code:

####Lill: Standard es6 class method in es5
```js
function MethLab(props) {
    // ...

    // manually bind "this" context of printQuality function
    // to the instance of MethLab being constructed
    this.printQuality = this.printQuality.bind(this);
    
    // ...
}

MethLab.prototype.printQuality = function printQuality() {
    console.log(this.state.methQuality);
};
```

####Woic: Property initializer with arrow function in es5
```js
function MethLab(props) {
    // ... 
    
    this.printQuality = function () {
        console.log(this.state.methQuality);
    };

    // ...
}

```

The above are simplified versions of the actual babel6 output (you can see 
the full translations using the kick-ass babel6 repl editor 
[here](https://babeljs.io/repl/))

The key point here is that the standard es6 class method translates to
a method on the function prototype, whereas the arrow function translates
to a method in the constructor function.

What does this mean? Traditionally in es5, you would only declare instance 
properties in the constructor function. These are properties that are 
specific to the instance and are not shared across instances. For example constructor arguments. 
These are created every time for each instance and hence are not very efficient.

To improve performance, you would declare shared properties and methods on the
function prototype. These will be created once for the function and then shared across all
instances. I would normally declare methods on the function prototype; properties not so much. 

It makes sense to share methods across instances for performance reasons and keep instance properties
in the constructor function. This leads to the conclusion that the es6 standard class method syntax
(Lill's way) is preferable to the property initializer arrow function syntax.

Hopefully by understanding what es6 does under the hood you can now better decide
how to declare your class methods. I know many developers are using the property
initializer arrow function syntax because it's convenient, albeit unaware of what's 
really happening under the hood.

---

## Other news
I'll be attending [NDC Sydney](http://ndcsydney.com/) on 3-5 August. If you are around, please say hello otherwise
it will be quite a lonely conference for me :(

I have also organised a reading group which will take place on Thu 25 Aug. The pick is ["If Hemingway Wrote Javascript"
by Angus Croll](https://www.nostarch.com/hemingway). Please reach out to me if you would like to join!

Until next time, cowabunga.

---------------------------------------------------------------------------------------

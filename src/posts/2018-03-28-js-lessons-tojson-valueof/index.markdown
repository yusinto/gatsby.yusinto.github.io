---
path: "/js-lessons-tojson-valueof"
date: "2018-03-28"
title: "Javascript Lessons: toJSON and valueOf"
published: true
tags: ["js", "lessons", "javascript", "tojson", "valueof", "json", "stringify", "prototype", "object"]
---

## toJSON
If you need a custom output when json stringifying your object, you can define
a function called toJSON() which will be invoked automatically by
JSON.stringify():

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // JSON.stringify will invoke this method if it is defined
  toJSON() {
    return {
      fullName: `${this.firstName} ${this.lastName}`,
    }
  }
}

const yus = new Person('Yusinto', 'Ngadiman');
console.log(JSON.stringify(yus)); // {"fullName":"Yusinto Ngadiman"}
```

Without the custom toJSON() implementation, the code above will use the default
implementation:

```json
{"firstName":"Yusinto","lastName":"Ngadiman"}
```

## valueOf
Object.prototype has a built-in valueOf method which returns the primitive value
of the object. You can override this method to return a custom primitive value
for your object:

```js
class Car {  
  constructor(make, model, price) {
    this.make = make;
    this.model = model;
    this.price = price;
  }
  
  // override Object.prototype.valueOf to return a 
  // custom primitive value
  valueOf() {
    return this.price;
  }
}

const myCar = new Car('Tesla', 'Model 3', 55000);
const tax = myCar * 0.33;
console.log(`Total car price: ${tax + myCar}`); // 73150
```

The override allows us to perform arithmetic with our object. Without the override,
the valueOf myCar will be NaN (Not-a-Number).


---------------------------------------------------------------------------------------

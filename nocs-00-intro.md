## Composing Software: An Introduction

https://medium.com/javascript-scene/composing-software-an-introduction-27b72500d6ea

### You Compose Software Every Day

> If you’re a software developer, you compose functions and data structures every day, whether you know it or not. You can do it consciously (and better), or you can do it accidentally, with duct-tape and crazy glue.

### Composing Functions

> Function composition is the process of applying a function to the output of another function.

```
    (f ∘ g)(x) = f(g(x))
```

> When you compose functions intentionally, you’ll do it better.

```
const g = n => n + 1;
const f = n => n * 2;
const doStuffBetter = x => f(g(x));
doStuffBetter(20); // 42
```

*How to debug this form?*

Define a `trace()` utility!

```
const trace = label => value => {
  console.log(`${ label }: ${ value }`);
  return value;
};
```

> Popular functional programming libraries like Lodash and Ramda include utilities to make function composition easier.

*...or you can roll your own:*

> `pipe()` creates a pipeline of functions, passing the output of one function to the input of another.

```
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const doStuffBetterWithPipe = pipe(
  g,
  trace('after g'),
  f,
  trace('after f')
);

doStuffBetterWithPipe(20);
```

> When you use `pipe()` (and its twin, `compose()`) You don't need intermediary variables. Writing functions without mention of the arguments is called **point-free style**.

*PFS can help reduce complexity. Reduced complexity has benefits:*
- *consumes less working memory between the ears*
- *reduces SNR making it easier to read*
- *reduces amount of code => less surface area for bugs*


### Composing Objects

> “Favor object composition over class inheritance”
(Go4)

*Primitives:*

```
const firstName = 'Claude';
const lastName = 'Debussy';
```

*A composite:*

```
const fullName = {
  firstName,
  lastName
};
```

*Arrays, Sets, Maps, WeakMaps, TypedArrays, etc… are composite datatypes.*


> Any time you build any non-primitive data structure, you’re performing some kind of object composition.

> Class inheritance can be used to construct composite objects, but it’s a restrictive and brittle way to do it.

> When the Gang of Four says “favor object composition over class inheritance”, they’re advising you to use flexible approaches to composite object building, rather than the rigid, tightly-coupled approach of class inheritance.

i.e. Form composite objects from small component parts, rather than inheriting all properties from an ancestor in a class hierarchy. This avoids well known problems in OO design:

* The tight coupling problem
* The fragile base class problem
* The inflexible hierarchy problem
* The duplication by necessity problem
* The gorilla/banana problem

... a (more) general definition of object composition from “Categorical Methods in Computer Science: With Aspects from Topology” (1989):

> “Composite objects are formed by putting objects together such that each of the latter is ‘part of’ the former.”

#### Mixin composition

> The most common form of object composition is known as mixin composition. It works like ice-cream. You start with an object (like vanilla ice-cream), and then mix in the features you want. Add some nuts, caramel, chocolate swirl, and you wind up with nutty caramel chocolate swirl ice cream.

Building composites with mixin composition:

```
const a = {
  a: 'a'
};
const b = {
  b: 'b'
};
const c = {...a, ...b}; // {a: 'a', b: 'b'}
```

### Conclusion

It's not about FP vs OOP or which language is best. In the end it's about composing functions and data structures.

These articles focus on FP because functions are easy in JavaScript. The essence of JS?

> We’ll use object composition to produce datatypes for functional programming, and functional programming to produce objects for OOP.

> No matter how you write software, you should compose it well.

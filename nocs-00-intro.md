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

> `pipe()` creates a pipeline of functions, passing the output of one function to the input of another.

```
// pipe(...fns: [...Function]) => x => y
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
```

> When you use `pipe()` (and its twin, `compose()`) You don't need intermediary variables. Writing functions without mention of the arguments is called **point-free style**.

### Composing Objects

Primitives:

```
const firstName = 'Claude';
const lastName = 'Debussy';
```

A composite:

```
const fullName = {
  firstName,
  lastName
};
```

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

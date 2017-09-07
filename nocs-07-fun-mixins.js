// Functional Mixins
// Composing Software
// https://medium.com/javascript-scene/functional-mixins-composing-software-ffb66d5e731c

// Functional mixins are composable factory functions which connect together in
// a pipeline; each function adding some properties or behaviors like workers on
// an assembly line.

// Functional mixins don’t depend on or require a base factory or constructor:
// Simply pass any arbitrary object into a mixin, and an enhanced version of
// that object will be returned.

// Functional mixin features:
// * Data privacy/encapsulation
// * Inheriting private state
// * Inheriting from multiple sources
// * No diamond problem (property collision ambiguity) — last in wins
// * No base-class requirement

// All modern software development is really composition:

// The atomic units of composition are one of two things:
// 1. Functions
// 2. Data structures

// Often, composite objects are produced using class inheritance, where a class
// inherits the bulk of its functionality from a parent class, and extends or
// overrides pieces. The problem with that approach is that it leads to is-a
// thinking, e.g., “an admin is an employee”, causing lots of design problems.

// Mixins offer a more flexible approach.

// Mixins are a form of object composition, where component features get mixed
// into a composite object so that properties of each mixin become properties of
// the composite object.

// Because JavaScript supports dynamic object extension and objects without
// classes, using object mixins is trivially easy in JavaScript — so much so
// that it is the most common form of inheritance in JavaScript by a huge
// margin. Let’s look at an example:

const chocolate = {
  hasChocolate: () => true
};
const caramelSwirl = {
  hasCaramelSwirl: () => true
};
const pecans = {
  hasPecans: () => true
};
const iceCream = Object.assign({}, chocolate, caramelSwirl, pecans);
/*
// or, if your environment supports object spread...
const iceCream = {...chocolate, ...caramelSwirl, ...pecans};
*/
console.log(`
  hasChocolate: ${ iceCream.hasChocolate() }
  hasCaramelSwirl: ${ iceCream.hasCaramelSwirl() }
  hasPecans: ${ iceCream.hasPecans() }
`);


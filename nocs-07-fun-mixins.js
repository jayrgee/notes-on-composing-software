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

//
// Design problems caused by Class Inheritance
//

// Often, composite objects are produced using class inheritance, where a class
// inherits the bulk of its functionality from a parent class, and extends or
// overrides pieces. The problem with that approach is that it leads to is-a
// thinking, e.g., “an admin is an employee”, causing lots of design problems, e.g.
//
// * The tight coupling problem
// * The fragile base class problem
// * The inflexible hierarchy problem
// * The duplication by necessity problem
// * The gorilla/banana problem


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

//const iceCream = Object.assign({}, chocolate, caramelSwirl, pecans);
// or, if your environment supports object spread...
const iceCream = {...chocolate, ...caramelSwirl, ...pecans};

console.log(`
  hasChocolate: ${ iceCream.hasChocolate() }
  hasCaramelSwirl: ${ iceCream.hasCaramelSwirl() }
  hasPecans: ${ iceCream.hasPecans() }
`);

//
// Functional Mixins
//

const flying = o => {
  let isFlying = false;
  return Object.assign({}, o, {
    fly () {
      isFlying = true;
      return this;
    },
    isFlying: () => isFlying,
    land () {
      isFlying = false;
      return this;
    }
  });
};
const bird = flying({});
console.log( bird.isFlying() ); // false
console.log( bird.fly().isFlying() ); // true

const quacking = quack => o => Object.assign({}, o, {
  quack: () => quack
});
const quacker = quacking('Quack!')({});
console.log( quacker.quack() ); // 'Quack!'

// Composing Functional Mixins

const createDuck = quack => quacking(quack)(flying({}));
const duck = createDuck('Quack!');
console.log(duck.fly().quack());

// using pipe 

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const createDuckWithPipe = quack => pipe(
  flying,
  quacking(quack)
)({});
const duck2 = createDuckWithPipe('Quack!');
console.log(duck2.fly().quack());

// good use-cases for functional mixins:
//
// * Application state management, e.g., a Redux store.
// * Certain cross-cutting concerns and services, e.g., a centralized logger.
// * Composable functional data types

//
// Caveats
//

// Most problems can be elegantly solved using pure functions. The same is not
// true of functional mixins. Like class inheritance, functional mixins can
// cause problems of their own.

// You can avoid that, though, using the following advice:

// * Use the simplest practical implementation.
//   Start on the left and move to the right only as needed:
//     pure functions > factories > functional mixins > classes.

// * Avoid the creation of is-a relationships between objects, mixins, or data
//   types.


//
// * “Functional mixins” doesn’t mean “functional programming”.
//

// * There may be side-effects when you access a property using Object.assign()
//   or object spread syntax ({...}). You’ll also skip any non-enumerable
//   properties. ES2017 added Object.getOwnPropertyDescriptors() to get around
//   this problem.
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors



// * Avoid implicit dependencies between mixins 

// example: configuration manager for your app that logs warnings when you try
// to access configuration properties that don’t exist:

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

// in its own module...
const withLogging = logger => o => Object.assign({}, o, {
  log (text) {
    logger(text)
  }
});

//import withLogging from './with-logging';
const addConfig = config => o => Object.assign({}, o, {
  get (key) {
    return config[key] == undefined ? 
      this.log(`Missing config key: ${ key }`) :
      config[key]
    ;
  }
});
const withConfig = ({ initialConfig, logger }) => o =>
  pipe(
    // vvv compose explicit dependency in here vvv
    withLogging(logger),
    // ^^^ compose explicit dependency in here ^^^
    addConfig(initialConfig)
  )(o)
;
// The factory only needs to know about withConfig now...
const createConfig = ({ initialConfig, logger }) =>
  withConfig({ initialConfig, logger })({})
;

// elsewhere, in a different module...
const initialConfig = {
  host: 'localhost'
};
const logger = console.log.bind(console);
const config = createConfig({initialConfig, logger});
console.log(config.get('host')); // 'localhost'
config.get('notThere'); // 'Missing config key: notThere'

//
// Functional Mixins & Functional Programming
//

// “Functional” in the context of functional mixins does not always have the
// same purity connotations as “functional programming”.

// Code your mixins and the code that uses them assuming a random mix of both
// styles, i.e. OOP style (with side-effects) and FP-style (pure).

// That means that if you need to return the object instance, always return this
// instead of a reference to the instance object in the closure -- in functional
// code, chances are those are not references to the same objects. 

// always assume that the object instance will be copied by assignment using
// Object.assign() or {...object, ...spread} syntax. That means that if you set
// non-enumerable properties, they will probably not work on the final object:

const a = Object.defineProperty({}, 'a', {
  enumerable: false,
  value: 'a'
});
const b = {
  b: 'b'
};
console.log({...a, ...b}); // { b: 'b' }


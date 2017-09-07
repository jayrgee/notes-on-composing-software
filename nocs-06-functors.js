// Functors & Categories
// Composing Software
// https://medium.com/javascript-scene/functors-categories-61e031bac53f

// NOTE: mostly theory...

// A functor data type is something you can map over.

// It’s a container which has an interface which can be used to apply a function
// to the values inside it.

// When you see a functor, you should think “mappable”.

// Functor types are typically represented as an object with a .map() method
// that maps from inputs to outputs while preserving structure. In practice,
// “preserving structure” means that the return value is the same type of
// functor (though values inside the container may be a different type).

// For collections (arrays, streams, etc…), .map() typically iterates over the
// collection and applies the given function to each value in the collection,
// but not all functors iterate. Functors are really about applying a function
// in a specific context.

// Promises use the name .then() instead of .map().

// You can usually think of .then() as an asynchronous .map() method, except when
// you have a nested promise, in which case it automatically unwraps the outer
// promise.

// Again, for values which are not promises, .then() acts like an asynchronous
// .map().

// For values which are promises themselves, .then() acts like the .chain()
// method from monads (sometimes also called .bind() or .flatMap()).

// So, promises are not quite functors, and not quite monads, but in practice,
// you can usually treat them as either. Don't worry about what monads are, yet.

// Monads are a kind of functor, so you need to learn functors first.

// Using a functor is easy — just call map():
const double = n => n * 2;
const f = [1, 2, 3];
f.map(double); // [2, 4, 6]

//
// Functor Laws
//

// Categories have two important properties:
// 1. Identity
// 2. Composition

// Identity

// If you pass the identity function (x => x) into f.map(), where f is any
// functor, the result should be equivalent to (have the same meaning as) f:
const f = [1, 2, 3];
f.map(x => x); // [1, 2, 3]

// Composition

// Functors must obey the composition law:
// F.map(x => f(g(x))) is equivalent to F.map(g).map(f).

// Function Composition is the application of one function to the result of
// another, e.g.,
// given an x and the functions, f and g,
//   the composition (f ∘ g)(x)
//   (usually shortened to f ∘ g - the (x) is implied)
//     means f(g(x)).

//
// Category theory
//

// A lot of functional programming terms come from category theory, and the
// essence of category theory is composition.

// Here’s the foundation of category theory in a few bullet points:

// * A category is a collection of objects and arrows between objects (where
//   “object” can mean literally anything).

// * Arrows are known as morphisms. Morphisms can be thought of and represented
//   in code as functions.

// * For any group of connected objects, a -> b -> c, there must be a
//   composition which goes directly from a -> c.

// * All arrows can be represented as compositions (even if it’s just a
//   composition with the object’s identity arrow). All objects in a category
//   have identity arrows.

// Say you have a function g that takes an a and returns a b (a -> b), and another
// function f that takes a b and returns a c (b -> c);
// there must also be a function h that represents the composition of f and g.

// So, the composition from a -> c, is the composition f ∘ g (f after g).

// So, h(x) = f(g(x)).

// Function composition works right to left, not left to right, which is why f ∘
// g is frequently called f after g.

// Composition is associative. Basically that means that when you’re composing
// multiple functions (morphisms), you don’t need parenthesis:
//
// h∘(g∘f) = (h∘g)∘f = h∘g∘f

// In JavaScript:
//   Given a functor, F:
const F = [1, 2, 3];

// The following are equivalent:

F.map(x => f(g(x)));

// is equivalent to...

F.map(g).map(f);

//
// Endofunctors
//

// An endofunctor is a functor that maps from a category back to the same
// category.

// A functor can map from category to category: X -> Y

// An endofunctor maps from a category to the same category: X -> X

// A monad is an endofunctor.

//
// Roll your own Functor
//
const Identity = value => ({
  map: fn => Identity(fn(value))
});

// this satisfies the functor laws:

// trace() is a utility to let you easily inspect the contents.
const trace = x => {
  console.log(x);
  return x;
};

const u = Identity(2);

// Identity law
u.map(trace); // 2
u.map(x => x).map(trace); // 2

const f = n => n + 1;
const g = n => n * 2;

// Composition law
const r1 = u.map(x => f(g(x)));
const r2 = u.map(g).map(f);
r1.map(trace); // 5
r2.map(trace); // 5

// Now implement .valueOf() -- returns primitive value of object -- to enable +
// operator for number and string values.

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf

const trace = x => {
  console.log(x);
  return x;
};

const Identity = value => ({
  map: fn => Identity(fn(value)),
  valueOf: () => value
});
const ints = Identity(2) + Identity(4);
trace(ints); // 6
const hi = Identity("h") + Identity("i");
trace(hi); // "hi"

// Nice. But what if we want to inspect an Identity instance in the console? It
// would be cool if it would say "Identity(value)", right. Let's add a
// .toString() method:

const Identity = value => ({
  map: fn => Identity(fn(value)),
  valueOf: () => value,
  toString: () => `Identity(${value})`
});

// We should probably also enable the standard JS iteration protocol.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
// We can do that by adding a custom iterator:

const Identity = value => ({
  map: fn => Identity(fn(value)),
  valueOf: () => value,
  toString: () => `Identity(${value})`,
  [Symbol.iterator]: () => {
    let first = true;
    return {
      next: () => {
        if (first) {
          first = false;
          return {
            done: false,
            value
          };
        }
        return {
          done: true
        };
      }
    };
  }
});

// [Symbol.iterator] enables standard JS iterations:
const arr = [6, 7, ...Identity(8)];
trace(arr); // [6, 7, 8]

// with the lot

const Identity = value => ({
  map: fn => Identity(fn(value)),
  valueOf: () => value,
  toString: () => `Identity(${value})`,
  [Symbol.iterator]: () => {
    let first = true;
    return ({
      next: () => {
        if (first) {
          first = false;
          return ({
            done: false,
            value
          });
        }
        return ({
          done: true
        });
      }
    });
  },
  constructor: Identity
});
Object.assign(Identity, {
  toString: () => 'Identity',
  is: x => typeof x.map === 'function'
});

const fRange = (
  start,
  end
) => Array.from(
  { length: end - start + 1 },
  
  // change `Identity` to `start.constructor`
  (x, i) => start.constructor(i + start)
);
const range = fRange(Identity(2), 4);
range.map(x => x.map(trace)); // 2, 3, 4

//
// Why Functors?
//

// Functors are an abstraction that you can use to implement lots of useful
// things in a way that works with any data type. 

// For instance, what if you want to kick off a chain of operations, but only if
// the value inside the functor is not undefined or null?

 // Create the predicate
const exists = x => (x.valueOf() !== undefined && x.valueOf() !== null);
const ifExists = x => ({
  map: fn => exists(x) ? x.map(fn) : x
});
const add1 = n => n + 1;
const double = n => n * 2;
// Nothing happens...
ifExists(Identity(undefined)).map(trace);
// Still nothing...
ifExists(Identity(null)).map(trace);
// 42
ifExists(Identity(20))
  .map(add1)
  .map(double)
  .map(trace)
;

// Functional programming is all about composing tiny functions to create higher
// level abstractions. What if you want a generic map that works with any
// functor? That way you can partially apply arguments to create new functions.

// Pick your favorite auto-curry, or use this magic spell from before:
const curry = (
  f, arr = []
) => (...args) => (
  a => a.length === f.length ?
    f(...a) :
    curry(f, a)
)([...arr, ...args]);

// Now we can customize map:

const map = curry((fn, F) => F.map(fn));
const double = n => n * 2;
const mdouble = map(double);
mdouble(Identity(4)).map(trace); // 8

// Conclusion

// Functors are things we can map over. More specifically, a functor is a
// mapping from category to category. A functor can even map from a category
// back to the same category (i.e., an endofunctor).

// A category is a collection of objects, with arrows between objects. Arrows
// represent morphisms (aka functions, aka compositions).

// Each object in a category has an identity morphism (x => x). For any chain of
// objects A -> B -> C there must exist a composition A -> C.

// Functors are great higher-order abstractions that allow you to create a
// variety of generic functions that will work for any data type.

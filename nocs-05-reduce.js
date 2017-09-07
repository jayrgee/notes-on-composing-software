// https://medium.com/javascript-scene/reduce-composing-software-fe22f0c39a1d

// Reduce (aka: fold, accumulate) utility commonly used in functional
// programming that lets you iterate over a list, applying a function to an
// accumulated value and the next item in the list, until the iteration is
// complete and the accumulated value gets returned.

// Reduce takes a reducer function and an initial value, and returns the
// accumulated value.

// For Array.prototype.reduce(), the initial list is provided by this, so it's
// not one of the arguments

// Let’s sum an array:
[2, 4, 6].reduce((acc, n) => acc + n, 0); // 12

// In this case, we passed in an anonymous reducing function, but we can
// abstract it and give it a name:
const summingReducer = (acc, n) => acc + n;
[2, 4, 6].reduce(summingReducer, 0); // 12

// Reduce is versatile. It’s easy to define map(), filter(), forEach() and lots
// of other interesting things using reduce:

// Map:
const map = (fn, arr) => arr.reduce((acc, item, index, arr) => {
  return acc.concat(fn(item, index, arr));
}, []);

// Filter:
const filter = (fn, arr) => arr.reduce((newArr, item) => {
  return fn(item) ? newArr.concat([item]) : newArr;
}, []);

// For each of the above examples, you have a list of data, iterate over that
// data applying some function and folding the results into an accumulated
// value. Lots of applications spring to mind. But what if your data is a list
// of functions?

// Compose:

// Reduce is also a convenient way to compose functions.

// If you want to apply the function f to the result of g of x i.e., the
// composition, f . g, you could use the following JavaScript:
f(g(x))

// Reduce lets us abstract that process to work on any number of functions, so
// you could easily define a function that would represent:
f(g(h(x)))

// To make that happen, we’ll need to run reduce in reverse. That is,
// right-to-left, rather than left-to-right. 

// JavaScript provides a .reduceRight() method:

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// compose() is great if you want to represent the composition from the
// inside-out -- that is, in the math notation sense. But what if you want to
// think of it as a sequence of events?

// Imagine we want to add 1 to a number and then double it.

// With compose(), that would be:

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

const add1 = n => n + 1;
const double = n => n * 2;
const add1ThenDoubleWithCompose = compose(
  double,
  add1
);
add1ThenDoubleWithCompose(2); // 6
// ((2 + 1 = 3) * 2 = 6)

// However, the first step is listed last, so in order to understand the
// sequence, you’ll need to start at the bottom of the list and work your way
// backwards to the top.

// Or we can reduce left-to-right as you normally would, instead of
// right-to-left:

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const add1ThenDouble = pipe(
  add1,
  double
);
add1ThenDouble(2); // 6
// ((2 + 1 = 3) * 2 = 6)

// This is important because sometimes if you compose backwards, you get a
// different result:
const doubleThenAdd1 = pipe(
  double,
  add1
);
doubleThenAdd1(2); // 5


//
// Redux
//

// As of this writing, Redux is the most popular state management
// library/architecture for web applications built using React and Angular (the
// latter via ngrx/store).

// Redux uses reducer functions to manage application state. A Redux-style
// reducer takes the current state and an action object and returns the new
// state

// Redux has some reducer rules you need to keep in mind:

// 1. A reducer called with no parameters should return its valid initial state.
// 2. If the reducer isn’t going to handle the action type, it still needs to
//    return the state.
// 3. Redux reducers **must be pure functions**.

// Let’s rewrite our summing reducer as a Redux-style reducer that reduces over
// action objects:
const ADD_VALUE = 'ADD_VALUE';

const summingReducer = (state = 0, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_VALUE:
      return state + payload.value;
    default: return state;
  }
};

// you can create an array of action objects and reduce over them to get a
// snapshot of state representing the same state you'd have if those same
// actions were dispatched to your store:
const actions = [
  { type: 'ADD_VALUE', payload: { value: 1 } },
  { type: 'ADD_VALUE', payload: { value: 1 } },
  { type: 'ADD_VALUE', payload: { value: 1 } },
];
actions.reduce(summingReducer, 0); // 3

// That makes unit testing Redux-style reducers a breeze.
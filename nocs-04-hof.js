// A higher order function is a function that takes a function as an argument, or returns a function.

// Consider these two first-order functions that filter a list of words using different criteria
// but still a lot of repeated code

const censor = words => {
  const filtered = [];
  for (let i = 0, {
      length
    } = words; i < length; i++) {
    const word = words[i];
    if (word.length !== 4) filtered.push(word);
  }
  return filtered;
};
censor(["oops", "gasp", "shout", "sun"]);
// [ 'shout', 'sun' ]

const startsWithS = words => {
  const filtered = [];
  for (let i = 0, {
      length
    } = words; i < length; i++) {
    const word = words[i];
    if (word.startsWith("s")) filtered.push(word);
  }
  return filtered;
};
startsWithS(["oops", "gasp", "shout", "sun"]);
// [ 'shout', 'sun' ]

// They both iterate over a list and filter it on a given condition.
// This pattern could be abstracted into a more generalisewd solution. 


// Note that JavaScript has first-class functions

// JS Functions can be:
// * Assigned as an identifier (variable) value
// * Assigned to object property values
// * Passed as arguments
// * Returned from functions

// We can create a function that abstracts the process of iterating over a
// list and accumulating a return value by passing in a function that handles
// the bits that are different. We’ll call that function the reducer:

const reduce = (reducer, initial, arr) => {
  // shared stuff
  let acc = initial;
  for (let i = 0, length = arr.length; i < length; i++) {
    // unique stuff in reducer() call
    acc = reducer(acc, arr[i]);
    // more shared stuff
  }
  return acc;
};
reduce((acc, curr) => acc + curr, 0, [1, 2, 3]); // 6

// With the iteration and value accumulation abstracted, now we can implement
// a more generalized filter() function:

const filter = (fn, arr) => reduce(
  (acc, curr) => fn(curr) ? acc.concat([curr]) : acc, [], arr
);

// Now we can implement censor() with filter() to filter out 4-letter words:
const censor = words => filter(
  word => word.length !== 4,
  words
);

// With all the common stuff abstracted out, censor() is a tiny function.
// And so is startsWithS():
const startsWithS = words => filter(
  word => word.startsWith('s'),
  words
);

// JavaScript has already done this abstraction work for us.

// We have the Array.prototype methods, .reduce() and .filter() and .map() and
// a few more for good measure.

// Higher order functions are also commonly used to abstract how to operate on
// different data types. For instance, .filter() doesn't have to operate on
// arrays of strings. It could just as easily filter numbers, because you can
// pass in a function that knows how to deal with a different data type.

const highpass = cutoff => n => n >= cutoff;
const gt3 = highpass(3);
[1, 2, 3, 4].filter(gt3); // [3, 4];

// In other words, you can use higher order functions to make a function polymorphic.

// higher order functions can be a whole lot more reusable and versatile than
// their first order cousins.

// use higher order functions in combination with very simple first order
// functions when composing software.

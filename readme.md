1️⃣ What is the difference between var, let, and const?
    => All three keywords create variables in JavaScript, but the way they handle scope, re-declaration, reassignment, and hoisting is completely different. Understanding those four things is the key to understanding why modern JavaScript prefers let and const over the old var.

2️⃣ What is the spread operator (...)?
    => The spread operator is three dots ... that "unpack" an iterable — an array, a string, an object, or anything iterable — into individual pieces. It was introduced with ES6 (for arrays/strings) and extended to objects in ES2018.

    Its main purpose is to make copying and combining data easy and non-destructive. Instead of mutating an existing array or object, you create a new one from pieces of the old one.

3️⃣ What is the difference between map(), filter(), and forEach()?
    => All three are array methods that loop over elements, but they serve three completely different purposes. The confusion usually comes from the fact that they look similar — you pass a function, it runs for each item — but what they return and how they're meant to be used is totally different.

    i. map() — transform each item
    map() creates a new array of the exact same length, where each element is the result of running your callback on the original element. It's a 1-to-1 transformation.
    ii. filter() — keep only the items that pass a test
    filter() also returns a new array, but it may be shorter than the original (or empty, or the same length if nothing gets filtered). The callback must return a truthy or falsy value — that's your test.
    iii. forEach() — just do something for each item
    forEach() doesn't build anything. It runs your callback once per item and returns undefined. It exists purely for side effects — logging, pushing into an external array, updating the DOM, calling an API.

4️⃣ What is an arrow function?
    => An arrow function is a shorter, cleaner syntax for writing function expressions, introduced in ES6. It uses the => operator — which is why it's sometimes called a "fat arrow function."

5️⃣ What are template literals?
    => Template literals are a modern string syntax introduced in ES6, written with backticks (`) instead of single or double quotes. They solve two long-standing annoyances in JavaScript: string concatenation and multi-line strings.
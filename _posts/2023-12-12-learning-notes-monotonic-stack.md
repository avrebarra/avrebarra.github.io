---
layout: post
title: "Learning Notes #3: Monotonic Stack"

description:
summary:
tags: [learning-notes]

---

Welcome to the third post for the series *Learning Notes*.

Bear with me; there are many things I have to take notes on in this world. *(also, you don't have to read these, though, haha)*.

## Monotonic Stack Concepts

For now, it's about monotonic stack. So monotonic stack is when we're doing a type of stack that only allows elements in non-decreasing or non-increasing order, facilitating efficient computations related to finding nearest larger/smaller values in a series.

Monotonic stack is not a data structure because it doesn't store data persistently; instead, it's more like a technique. But Stack, is a data structure.

## How It Is Useful

This technique is useful in these cases:

- **Finding Next Larger Element in a Series:** Monotonic stack is particularly handy for quickly identifying the next larger element in a given series.
- **Finding Next Smaller Element in a Series:** Similarly, it can efficiently find the next smaller element in a series.
- **Histogram Problems:** Solving problems related to histograms, where you need to compute the area of the largest rectangle under a histogram, is a classic application.
- **Expression Evaluation:** It's useful in evaluating expressions involving parentheses and operators.

## Example Code

Example solution to finding the next larger number in a series, we can do it like this:

```js
const findNextLarger = (arr) => {
    const result = [];
    const stack = [];

    for (let i = 0; i < arr.length; i++) {
        const cur = arr[i];
        console.log(`Processing element ${arr[i]} at index ${i}`);
        console.log("Stack:", stack);

        while (stack.length && arr[i] > arr[stack[stack.length - 1]]) {
            const index = stack.pop();
            result[index] = arr[i]; // Next larger element found
            console.log(
                `   Found next larger element ${arr[i]} for index ${index}`
            );
        }

        stack.push(i);
        console.log(`   Pushed index ${i} onto the stack`);
        console.log("Result:", result);
    }

    // Remaining elements in stack have no larger elements
    while (stack.length) {
        const index = stack.pop();
        result[index] = -1; // No larger element found
        console.log(`   No larger element found for index ${index}`);
    }

    return result;
};

const result = findNextLarger([2, 4, 1, 2, 5, 1]);
console.log("Final Result:", result);
```

```
Output:
Processing element 2 at index 0
Stack: []
   Pushed index 0 onto the stack
Result: []
Processing element 4 at index 1
Stack: [ 0 ]
   Found next larger element 4 for index 0
   Pushed index 1 onto the stack
Result: [ 4 ]
Processing element 1 at index 2
Stack: [ 1 ]
   Pushed index 2 onto the stack
Result: [ 4 ]
Processing element 2 at index 3
Stack: [ 1, 2 ]
   Found next larger element 2 for index 2
   Pushed index 3 onto the stack
Result: [ 4, <1 empty item>, 2 ]
Processing element 5 at index 4
Stack: [ 1, 3 ]
   Found next larger element 5 for index 3
   Found next larger element 5 for index 1
   Pushed index 4 onto the stack
Result: [ 4, 5, 2, 5 ]
Processing element 1 at index 5
Stack: [ 4 ]
   Pushed index 5 onto the stack
Result: [ 4, 5, 2, 5 ]
   No larger element found for index 5
   No larger element found for index 4
Final Result: [ 4, 5, 2, 5, -1, -1 ]
```

Initially, I struggled to grasp the process, but after jotting it down, I realized basically what it did are:

- We use the stack to store the latest values that doesnt have match (larger succeeding values).
- During each iteration, we compare the values to the stack tops. If larger, we pop the top (indicating we've found a match) and insert the current value at the stack top.
- After iterating through all items, if there are unmatched items remain in the stack, we pop them all and assign -1 (or whatever) to signify no match was found.

## Related LeetCode Problems

List of LeetCode problems that relate to this concept:

- [Problem 42: Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)
- [Problem 84: Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)
- [Problem 739: Daily Temperature](https://leetcode.com/problems/daily-temperatures/)

## Closing Words

Basically, this technique revolves around finding the nearest larger or smaller value changes of a rule in a series, allowing for efficient computation in various scenarios.

I'm not gonna glorify this one; I really don't know if there are any other uses for this, haha.

But yeah, still, a nice day for another tool in our arsenal!

Let's meet again in next notes.


---
layout: post
title: "LN1: Prefix Sum"

description:
series: Learning Notes
summary:
tags: [learning-notes]
---


In the spirit of bettering my logical abstractions, I decided to spend some time reviewing LeetCode again.

To make these learning sticks more in my head and also to solidify my understanding, I decided to document some abstractions I reencountered.

## Prefix Sum: A Fundamental Concept

The first concept I reviewed is prefix sum. In a nutshell, it involves calculating the cumulative sum of elements in an array up to a certain index. This precomputed data serves as a handy reference, simplifying and optimizing certain operations.

```
Suppose we have these series: 1, 2, 3, 4, 5
The prefix sum series are: 1, 3, 6, 10, 15
```

It helped me visualize it a bit when I do it as table it'd be like this:

```
i  n  ps   intuition
0  1  1    1
1  2  3    1+2
2  3  8    1+2+3
3  4  10   1+2+3+4
4  5  15   1+2+3+4+5
```

For this specific sample of basic prefix sum, we can see some interesting properties in how we can calculate the sum of items within a range without traversing. 

- Say we want to know the sum of elements from index 2 to 4.
- We can do that by subtracting the prefix sum at index 1 (the starting point) from the prefix sum at index 4 (the endpoint).
- In this case, it would be ps[4] - ps[1], which is 15 - 3 = 12.
- So, the sum of elements from index 2 to 4 is 12.

This subtraction trick works because the prefix sum at any index already includes the sum of elements up to that point. This way will be faster on list containing hundreds items, substracting two values vs iterating multiple times.

*Take note this concept also extends to non ordered list of numbers and list containing negatives*.

## Example Code

Let's make this post techy, here is sample basic code to compute a prefix sum:

```js
// Sample array
const nums = [1, 2, 3, 4, 5];

// Compute prefix sum
const prefixSum = [];
let sum = 0;
for (let i = 0; i < nums.length; i++) {
  sum += nums[i];
  prefixSum.push(sum);
}

console.log("Prefix Sum:", prefixSum);
```

Basically, we iterate through the array, keeping a running sum, and store these sums as we go along. This precomputed array of sums allows for efficient lookup during subsequent computations.

In this example, prefixSum will be [1, 3, 6, 10, 15], representing the cumulative sums of the elements in the original array.

## Use Cases

Prefix sum finds applications in various scenarios, such as:

- **Efficient Range Sum Queries:** Calculating the sum of elements within a specific range becomes a constant-time operation.
- **Optimizing Subarray Sum Calculations:** Simplifying computations related to subarrays by utilizing precomputed sums.

Also prefix sum can be used to do graphic/image things (which is essentially just a matrix of number) like determining brightest area of an image and such.

## Versatility and Combinations

What makes prefix sum intriguing is its kinda-versatility. It can integrates with other logic abstractions, such as binary search or sliding window techniques.

This concept synergizes effectively with other logic abstractions like binary search or sliding window techniques. 

For instance, combining prefix sum with a sliding window can significantly enhance the efficiency of solving problems like [Problem 209: Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/).

I firmly believe that this abstraction extends beyond simple summation. It opens ways for various mathematical series and operations, making it a powerful tool in a programmer's arsenal.

I see new abstraction, I like. Yay.
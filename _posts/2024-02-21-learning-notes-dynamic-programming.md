---
layout: post
title: "Learning Notes #5: Dynamic Programming & Recursion"

description:
series: Learning Notes
summary:
tags:
---

*Whoa! Dynamic Programming? Sounds.. scary..?*

*It's just recursions, relax.*

# Recursion and Dynamic Programming

So, I bet you already know about recursion, right? It's that thing, where a function calls itself. Yeah, the one that might seem like it'll spin endlessly, with a fat chance of crashing your code. Haha.

Yep, Dynamic Programming is how we step back and reconsider that recursion technique. Unlike specific coding syntax or design patterns, dynamic programming isn't a particular algorithm but a way of thinking. It breaks down a problem into individual components. The idea is to see the solution of a problem as a result of the solutions of subproblems.

Most often, it involves like storing the results of subproblems, so we don't have to re-compute them later when needed, and so on. This technique can reduce the code we write and even time complexities from exponential to polynomial.

Ah, and it's not always a recursive function; it can be loops with memoization or subtractive loopings, or such. Whatever way to form a solution from subsolutions.

But I'll focus more on the recursion side for now.

# Important Parts of Recursive Function

When designing a recursive function, I find that there are two important parts to consider:

## 1. How to Call and What It Gets

There are multiple ways a function can call itself. It can call a function linearly or delve deep and branch out like a tree. It all depends on how the final solution can be formed from the subcalls.

Also, please don't limit yourself to thinking that a recursive call will only call itself; it can call other functions too, or involve recursive calls to different functions. Again, it's essentially about how we see the solution being built from some subsolutions. If the subproblems require a different way to build their subsolutions, then so be it. We can introduce different functions. Don't force yourself to put everything in one and solve it all in one recursive function.

Also, I find it pretty useful to understand the reduce function (there's one in JavaScript). It's probably not the recursive call we usually do, but essentially, it's a good way to start understanding how we split a solution into some subsolutions. Give it a try.

## 2. Termination Condition
In deep recursion (the kind that calls itself again and again), you should always think about how the cycle of self-call can be stopped. This is actually the most common pitfall and probably the most traumatic one? Haha. But it's honestly relatively easier to handle than the first point I mentioned previously.

All you need to do is ensure that you have set the condition where the recursive call will stop at some point. It will be even easier if you've already tackled the first point. If you can understand what you seek from subsolutions, you'll most likely be able to structure the code into smaller, simpler functions, making it easier to understand when to stop the recursive call.

# How I Would Start Learning This

So, how do we learn more on this? If I have to recommend the learning path, I think it's good to do it like this:
1. Understand how to use the reduce function in JS (or equivalent).
2. Try those factorial/prime number recursion exercises from scratch and understand how the subsolutions are related.
3. Tackle the house robber problems and the cyclic ones on LeetCode.

I think those steps will give you a boost in understanding this recursive part of dynamic programming.

Yep, that's it. I learned that dynamic programming is a technique aimed at creating a solution by splitting it into smaller subsolutions whose values could help increase time efficiency. Gotta learn this one because it'll really help not only in the LeetCode scape but also in the general way of thinking about how we could split solutions into their subsolutions.

Tchau.
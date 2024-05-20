---
layout: post
title: "LN6: A Number in Different Bases"
highlighted: true
series: Learning Notes
tags: [learning-notes]
---

Hola!

You are in an entry of my Learning Notes. In this series I wrote some trivial bitsized lessons that I learnt.

This time I'll add on representing a number in different Bases.

# What are bases?

Bases in numbers are like rules on how we represent a number with a set of characters. For example, Base10 or decimals means representing numbers with 10 chars (0-9), Base2 or binaries means representing with 2 chars (0 & 1), Base16 or hexadecimal with 16 chars (0-9 plus A-F). Every bases related to a number like what I just showed.

Commonly known bases are Base16, Base10, Base2. How about Base3 or Base4? It's not commonly known but technically we can represent numbers in those bases too. Also, if we represent numbers using A & B, like ABBAB, its also considered a Base2, albeit not in well known format 10010.

*Which also means, as much as 202202 looks like a Base10 but it can be a Base2/binary if we want it to be like that as it complies to the rule of `only using 2 chars set`.*

# Base idea: What each digits represents

Representing an amount (or number) in bases, means each digit of characters represent different multitude of amount/number. Each digits from the back (or smallest) to the front (or biggest), represents an amount.

Here, some example:

<script src="https://gist.github.com/avrebarra/6f630d46a32caa1175401ff6638fe487.js?file=representation.sh"></script>

You should be able to see the patterns. That's how numbers are represented across bases.

*Interesting thing I found: When I tried the `Interesting Case Base1`, Why not write 101? I cannot because Base1 means we can only use 1 character, therefore it cant be 1 and 0 on the same number. Make sense. Then, how do we represent 0? We can't haha. Maybe we just don't write anything (?)*

# Converting between bases

Moving on to convert numbers between bases.

Take note, **these conversions will be based on Base10**. I mean, to convert from Base2 to Base16, we convert Base2 to Base10 before converting the Base10 to the actual target Base16.

Why? Because it's the easiest way for now. Or maybe it's easy, because the numbers we all taught in math and physics are mostly written in Base10. The operations I show will be easier because it'll be the most natural one. *Unless you're a Roman.*

## Converting BaseN to Base10: Multiply and totals

Derived from the previous representation. We just multiply each digits to the exponent it represents and total them up.

<script src="https://gist.github.com/avrebarra/6f630d46a32caa1175401ff6638fe487.js?file=odd-to-decimal.sh"></script>

## Converting Base10 to BaseN: Gnaw using divisions and remainders

If we derive from the concept, technically we just iteratively find the biggest number you can use as exponent to the base.

*Like if we want to convert Base10 616 to Base2 we only need to find the biggest exponent to 2 that doesnt exceed 616. Which is 9. Because 2^9 is 512. Then it means we have 1 on the 10th digit (because 1st digit is occupied by x^0). 1XXXXXXXXX. Nice. Take 512 from 616 and we still have 104. So next number should be 96. Which is.. 2^6 or 2^7?*

Until we found out that 96 is not even a valid exponent. Yep, that way is impossible for a non math prodigy. It's hard to code that, anyway.

Better way: We still use the same concept but we reverse the focus. But we gnaw that big number from the smaller side instead of finding bigger bites:

<script src="https://gist.github.com/avrebarra/6f630d46a32caa1175401ff6638fe487.js?file=decimals-to-odd-1.sh"></script>

*Purely mathematical! I don't know the underlying principle, though. B-but it must be about logarithms. I kinde skipped some logarithm classes, though. Will learn later.*

What's important, Magica-Mathematically, this works also in different cases:

<script src="https://gist.github.com/avrebarra/6f630d46a32caa1175401ff6638fe487.js?file=decimals-to-odd-2.sh"></script>

So thats how: **Gnaw the number by dividing to its base until it reach zero. Then we write the remainders bottom up.**

# Examples and code

Those both works fine and easy to code:

<script src="https://gist.github.com/avrebarra/6f630d46a32caa1175401ff6638fe487.js?file=code.py"></script>

That's it. I'll write again soon!

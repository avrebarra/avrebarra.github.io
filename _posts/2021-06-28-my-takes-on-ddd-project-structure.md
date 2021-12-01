---
layout: post
title: My Takes On DDD Project Structure?
description:
summary:
tags: [golang, tech]
---

`DDD means Domain Driven Design, we all knew this.`

`DDD could also means Doh, Damn, Doh`

`DDD sometimes could also means Don't Do DDD for me`

For starter, I always try to ensure my code have good abstraction. I always see DDD as a good thing. But on some occasions, I passionately despise it.

Especially when some took it too extreme, and start debating about _structuring the project like such so, that the project follow DDD (other terminology follows)_, and otherwise it's won't be good. Only leaving a jumbled codebase after that.

From my perspective, DDD is an abstraction. That's that. Not a filename, not a folder names, not a project structure. I mean if we structured our codes flat, doesn't always mean we're not DDD-ing. We can do DDD principles with three files, hell even one file.

All abstraction are meant to help us explain and understand our code better. No you cannot say, "This project structured around DDD, just learn DDD concept here's the link." No jackshits, that's irresponsibility (especially knowing how deep and abstract DDD are). Honestly, if we devised a project with DDD and it made us took longer time for us to explain to any decent newcomer until they can visualize and continue it, then I believe something is missing.

From my perspective, we should always strive for simplicity and transparency in our code. How could we make a codebase that so simple yet good that takes zero mental effort to understand it.

I love DDD, and also MVC, three-tiers, two-tiers, OOP, Functional, Hexagonal, UML, etc. I love all kind of system abstraction tools and techniques. They are tools to see and check our code from many kind of sides.

But, just how wasteful is it to strictly limit a project to only one of them when you can actually benefit from many on the same time?

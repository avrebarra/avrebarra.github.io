---
layout: post
title: My Takes On DDD Project Structure?
description:
summary:
tags: [golang, tech]
---

_DDD stands for Domain Driven Design, we all knew this._

_DDD could also be Doh, Damn, Doh_

_DDD sometimes could also means: Don't Do DDD, for me_

For starter, I always try to make my code to be as nice as possible. I always see DDD as a good thing for that objective. But on some occasions, I passionately despise it.

Especially when some took it too extreme, and start debating about _structuring the project like such, so that the project applies DDD (other abstraction terms can follow)_, because it'll be good. Only leaving a jumbled codebase after that.

From my perspective, DDD is an abstraction. That's that. Not a filename, not a folder names, not a project structure. I mean if we structured our codes flat, doesn't always mean we're not DDD-ing. We can do DDD principles with three files, hell even one file.

All abstraction are meant to help us explain and understand our code better. No you cannot say, "This project structured around DDD, just learn DDD concept here's the link." No jackshits, that's irresponsibility (especially knowing how deep and abstract DDD topics are). Honestly, if we devised a project with DDD and it made us took longer time for us to explain to any decent newcomer until they can visualize and continue it, then I believe something is missing.

From my perspective, we should always strive for simplicity and transparency in our code. No confusions no surprises. How we can build a codebase that so simple yet good that takes zero mental effort to understand it. For that exact reason, we use DDD and other abstractions to ensure we have the feasible-simple code. So we don't complicate things. But if we are 'using an architectural abstraction', but it ends up to be even messier things to comprehend, surely something ain't right, right?

I love DDD, and also MVC, three-tiers, two-tiers, OOP, Functional, Hexagonal, UML, etc. I love all kind of system abstraction tools and techniques. They are very useful tools and views to see and check our code from many kind of sides.

But, just how wasteful is it to strictly limit a project to only one of them, and even complicate things by overly enforcing an abstract thing, when you can actually benefit from using many of them on the same time?

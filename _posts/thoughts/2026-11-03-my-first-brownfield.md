---
layout: post
title: "A Brownfield, for a Greenfield Person Like Me"
date: 2026-11-03 09:00:00 +0000
highlighted: true
tags: [career, engineering]
---

If you asked me "what is one of the hardest problems you've faced in your career?", my answer would not be a fancy algorithm, a gnarly performance bug, or a tricky distributed systems problem. My answer is much more boring on the surface, and much more humbling underneath: an 8 or 9 year old codebase that I was not allowed to recreate.

This is a story of my first experience with brownfield development, challenges that drained my soul and forced me to rebuild a lot of my well-built working ways. It was very hard, but I rose against it by relearning how I approach, test, and validate changes, and I came out a more versatile developer, one who ended up touching and contributing to all the tasks and systems available in my squad, across every stack we own.

So let me rewind, and tell it as honestly as I can.

## Born in Greenfield

For most of my early career, before my days at Mekari, I almost always worked on zero to one development. Greenfield. We always created something new, so I never had to think about the story of a specific piece of code. Every system I met was either brand new or young enough that I could trace its whole history myself. If something was wrong, I could always try to improve it. That was my default reality, and honestly, it was a very assuring one.

Because of that, I could understand the whole codebase end to end in my previous companies. It felt like proof of competence. I genuinely thought it made me a strong developer.

Looking back, I was not a developer shaped by experience in general. I was a developer shaped by greenfield specifically. I had no idea how specific that was until it stopped working.

## Nine Years of Someone Else's Code

Then I joined Mekari and met my first brownfield. My first legacy system. A codebase that was around 8 or 9 years old, older than my whole professional life, written long before I showed up, by people I would mostly never talk to. For the first time, I did not get to create something new. The code was already there, with its own stories that predate me, and my job was to continue and maintain it, not to recreate it.

So the task, as I experienced it, was this: become productive on a very big, very old system that you cannot fully understand, that you are not allowed to rewrite, and whose story you have no part of. Do it all without breaking the thing.

It was a humbling experience, because it attacked the exact thing I was confident about. I had never had to think about what the story of a specific code was. I had never had to be prepared for uncertainty the way this environment demanded it. Even my managers did not quite understand the whole thing. Nobody did.

## Chasing the Whole System

So I did what got me through every greenfield project before: understand the system first, then touch it. I chased the whole end to end picture. I followed the flow from the entry points to everywhere else. Then I tried going from the endpoints only. I put in extra hours for two or three weeks, convinced that if I just kept going, the whole thing would eventually click.

My managers kept telling me the same thing: it's fine, you'll understand eventually. I did not believe them. I thought I just needed more effort.

They were right. The realization was not that I failed to understand the codebase. It was that I was never supposed to. Nobody is going to hand me the time and resources to reverse engineer all of it, because that is not what brownfield onboarding is about. Pushing for it would just burn capacity that should go to more meaningful work. Maybe some genius could hold this whole system in their head. In general, I would not advise anyone to try.

What actually changed was that I became comfortable with not understanding everything. Not as a resigned "whatever", but as a working strategy.

The tool that made it click for me was the characterization test. Instead of trying to understand a section of the code, I would prove its current behavior first. Wrap a small section, observe what it actually does, then change just a little, then validate that the behavior is what I expected. No grand rewrites. No trying to make everything better in one pass, because this code has a story, and often the right move is to leave that story intact and work with it.

Over time the work reduced to something very simple. In the end, most tasks are the same: know where to attach, know what the change should do, and know how to validate that it actually behaves the way you wanted. Iterate on that, again and again, until it works. If there is time left, refine the solution toward best practice. But that is a bonus, not the goal.

That is the loop. Small in scope, honest about what it knows, always validated. Once I had it, the chase was over for good.

## The Shock Was Never the Code

The funny thing is that this happened naturally. I have always been open to learning, and once I accepted that I could contribute while not knowing everything, something unlocked. I could work on any kind of system, just by knowing how things generally work in it, wiring things up, running characterization tests, and validating my changes.

Stacks I was never deeply familiar with, some I had not touched before, became navigable. I ended up handling every stack available in my squad. Not because I suddenly built deep expertise in each of them overnight, but because I learned how to navigate and change them. That is usually enough.

The shock, the thing that made this one of the hardest problems of my career, was never really the codebase. It was having to rewire myself. A greenfield-bred developer walking into nine years of someone else's code has to unlearn almost everything that made him feel strong. The codebase is still there, old and big and holding a story I will only ever partially know. I am fine with that now.

So if you are a greenfield person who suddenly lands on a 9 year old codebase, this is my advice:

Be comfortable without knowing everything. You do not need to know everything to go on. You just need to know the local things, the piece of the system you are actually working on, and whether that is enough to make things better.

Do not chase perfection. We cannot change perfection, well, technically we can, but it is going to cost a lot. It is not a wise use of your capacity. Ship the small validated change instead. That is how you go from being humbled by a legacy system to being trusted with all of it.

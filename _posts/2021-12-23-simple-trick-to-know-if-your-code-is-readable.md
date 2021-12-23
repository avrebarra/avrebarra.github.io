---
layout: post
title: Is My Code Readable Enough? A Simple Trick to Check It
description:
summary:
tags: [golang, tech, readability]
---

_"When it was coded, only me and god knows what it meant. After two weeks, now only god knows." - all of us at some point in our career_

I value readability in code so much when working. I think we should all. It's not only about ourselves, its about making everyone's works, collaboration, communication, handovers, maintenances, easier. We need to stop thinking that god-only-know mode when reading a new system is normal. Readable source codes are the best source codes.

Cutting it short, so what's the trick to check whether a code is relatively readable? Zoom in & Zoom out.

## The trick: Zooming the code

Yes, to check whether our code is readable or not, I'll always advise anyone to try zooming in and zooming out their code. What I meant by zooming is changing the scope which you read it in.

For example, we had this sample code below. If you read it, it's definitely a find function to count and filter data from Postgre storage:

<script src="https://gist.github.com/avrebarra/64b064a7d53abe2d2c01301e7b8dd2c0.js?file=view_default.go"></script>

It's pretty clear. Yes because this is a short code and I already told you about it. So you know what this code was about.

But when you try to zoom or change the viewing scope, you'll see some parts that could use some helps. The narrower scope you see it in, you'll see it ask for higher effort to understand.

Check these out:

<script src="https://gist.github.com/avrebarra/64b064a7d53abe2d2c01301e7b8dd2c0.js?file=view_zoom_1.go"></script>
<script src="https://gist.github.com/avrebarra/64b064a7d53abe2d2c01301e7b8dd2c0.js?file=view_zoom_2.go"></script>
<script src="https://gist.github.com/avrebarra/64b064a7d53abe2d2c01301e7b8dd2c0.js?file=view_zoom_3.go"></script>

You'll have a harder time to read the scoped piece by themselves. This is usually how newcomers (or maybe you in the future) would see them, they don't get what's the code about, not like us right now.

Yes, It might seems pointless. Because this is a simple piece, if anyone couldn't understand it, they'll probably get it in just 1-2min after scrolling up to see the flow from the beginning. Yes, but if we're taking this to real example, a bigger code, a more complex system with lot of integrated parts, we surely would avoid to _'scroll up and see the flow from the beginning'_ at all cost, right? It'll take longer time to accomplish.

## Where to go from here?

So, with that trick now you have another trick up on your sleeves to see if something ain't readable enough. Well, then _voila!_ you know you need to improve it. Knowing something is wrong is always 50% job done.

So, how to fix an incomprehensible code? There's a ton you can do, everyone probably have some sort of style or guideline they follow. For me some of my basic go to approaches are: renaming things, grouping things, adding some annotations (love this), adding some comments, changing the abstractions, recoding the flow, or even deleting the code. _I mean, there can't be a bad code when there's no code right? Wkwk._ Each will require different efforts, choose wisely based on the tradeoffs. 👍🏽

As for the previous code example, we can update it a little bit. It would't change much because it's just a short code, but try to compare it with the original code (and try to play with your viewing scope):

<script src="https://gist.github.com/avrebarra/64b064a7d53abe2d2c01301e7b8dd2c0.js?file=view_refactor.go"></script>

Personally, I like this one better. Notice the use of groupings and some annotations, it helps you traverse this piece bit faster.

## Addition: How wide/narrow to see?

As an additional note, how wide/narrow the scope to zoom in, will always be relative to your needs.

I won't necessarily say that you should always zoom in extremely to one-line-scope clarity (checking if each line are understandable by itself) for all of your code. For me, I find it comfortable to ensure comprehensibility over about 15-30 lines. Yes, you can definitely try making it clear in narrower scope, even up to one-line-level-clarity. But excessive zooming would ask for more efforts and could possibly yields an excessively verbose code & comments. **Which is usually not needed** and it could also hinders maintainability and prone to duplicated texts and so on.

But again, there might be some cases that asks for close to line-level clarities. If it was actually needed, then yeah go for it.

_Hasta luego~_

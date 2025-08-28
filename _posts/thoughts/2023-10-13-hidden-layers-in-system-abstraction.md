---
layout: post
title: Hidden Layers in System Abstraction - Unveiling an Onion
description: Why I use post for all my restful endpoints
summary:
tags: [tech]
series: Thoughts
---

Building systems sometimes can be a wild ride.

Ever been driven frustrated by something seemed simple, only to discover hidden complexities beneath?

I've been on quite a journey myself. Let's dive into my experiences on building what I called an onion system.

## The First Attempt: Loyalty Point Async System

Back in my Bukalapak days, loyalty points system was one of projects I have to work on. The mission was clear: process transactions asynchronously and calculate the loyalty points. The core system would send a signal to our microservices, and we'd evaluate and whip up some loyalty points for customer.

Being a newbie, we thought simple - we thought loyalty points were our one and only big word there. Not too big scope, all figured out. So we jumped right in and developed that async system with some database, backend, and RabbitMQ for messaging. We had issues, we fixed, the task was completed and running without major hiccups. But there was a nagging feeling - something was off with the system layout I know, but I couldn't quite understand what was it.

## The Second Attempt: Bulk Disbursement System

Fast forward to LinkAja. Again here I had to cook up another async system. Prakerja bulk-async fund disbursement system. A hot government program at that time.

This time, it was like playing in the big leagues. This system is a big system planned to involve billions Rupiah circulated everyday. High traffic. High reputational stake.

At start, we analyzed and I thought, "It's all about 'funds' again, right? Just like what I did back then and add some bulk inputs." We split the work over several sprints, trying to ensure progress step by step. And as usual, there are changes on the middle of work, nothing unexpected. We thought.

But boy, the challenge was huge. Somehow every minor requirement requires boatload of adjustment all over the codebase. It felt like a struggle to make things developing incrementally. Feels like we lost progress for every changes coming.

It's a shaky design. I don't want to rely on this ticking timebomb, I said.

## The Revelation

So we retook a deep dive on the design. The grand revelation hit us: bulk-async-disbursement system wasn't a solo act; it was a three-layered system. After analysis we found the lining of three different system involved: a disbursement system, wrapped up by an async system, and then bundled inside a bulk processing system.

Treating them as one was like trying to detangle a knotted mess. Each piece had its role, but put in another's piece, and when one went awry, it felt like trying to fix a jumbled orchestra. That's when we knew we did it wrong and we have to fix the abstractions ground up. The interconnectedness was so intricate that untangling one piece without pulling apart everything proved to be quite the challenge.

So in short, we sprinted and tried to construct the new abstraction. Splitting one work into three works. Renegotiating timelines. Reexplaining the work scopes.

We built those subsystems:

- Started with the disbursement system: Ensuring a disbursement can perform perfectly by itself.
- Then moved on to the asynchronous system layer: Adding things like status checks, cancellations, callbacks, and all that jazz)
- Finally, we tackled the bulk system scheduling.

And as expected, everything fell into place. Developments ran smoothly, progress tracked accordingly, bug fixes are blisses. When we stepped back to admire our handiwork, we realized yep it was a giant.

We couldn't help but chuckle at our previous audacity, thinking we could squeeze it into a tiny box.

## The Lessons

This story taught us one cool lesson. You gotta look beneath the surface and not be fooled by the 'sweet' single-domain facade. Don't judge a system just by its name. Sometimes, that one sweet domain dances with unnamed but funky mechanics. Here I was talking about bulk and async. But you have to be aware too about things like data encryptions, notification, content management, or event publishing acrobatics.

Even if a system looks like a neat package with a single entry and exit, it might be an onion - layers upon layers. So, don't shy away from peeling those layers and revealing the complexities within. This wisdom is your secret weapon when you face future complex systems. Stay sharp and don't underestimate what's under the hood.

You could be looking at one intricate onion.

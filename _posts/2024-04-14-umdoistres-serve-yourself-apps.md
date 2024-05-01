---
layout: post
title: "UmDoisTrês: Serve Yourself Apps"
highlighted: true
description:
summary:
series: UmDoisTrês
tags:
---

Welcome, to the second entry of the ['UmDoisTrês'](/umdoistres-introductory/). We'll go with 1 abstract question, 2 lessons, and 3 interesting online stuffs.

# `1 Question`
## What If Server Dish Out Functions and Let Client Do the Work Themselves? 

I've been reading about Local First Apps (LFA) lately. Basically it's another tech concept to intentionally design a web app prioritized for client side over the server side or you could say offline first. It's a unique thing when we look how web app is built around the notation of internet and connectivity.

I'm still interested though, why? Let me show you briefly at the offers of LFAs: how data owned by user by default, app full usability even when offline, usage of server only when needed. Those aspects are very interesting. Not only because it's makes things more user centric, also other thing that strikes me is the part where it uses more clients than servers: If we leave more works to client's machine, won't it lessen the load of the server much more than before? Which also means possible lower application maintenance fees, isn't it?

Over that notations, a question popped up: what if, we apply this 'moving stuffs closer to user' to bigger app system where we outsources the processing effort? What if we make not only client process user data but how about letting client process our data or other users data too?

I thought what an intriguing concept! Where server sends code to the client, and the client machine handles the processing. I'm imagining a server that will send compiled functions to the client, let them process our input, and send back the output to the party needed. It's like we're slightly altering the concept of Remote Procedure Call (RPC) to Imported Procedure Call. Maybe it can even be called a Serve Yourself App (SYA) haha. This is interesting because it could indeed have some cost-saving benefits, particularly for the server operator who might save on processing power and infrastructure costs.

One step further, looking at the negative side of this idea there are of course concerns in security and confidentiality. Can we ensure the integrity of the data output? Can we ensure no technology piracy for the apps just like what happened in before internet era? Can sending a splitted function beats processing and serving things on the server? But in the age of computer advancement like this, the question should probably be reframed from those *can-wes* to *how-can-wes*.

Due to my current level of expertise, I can't really specifically tell how this is achievable technically, but at first glance I  think its very possible to add some kind of mathematical function encryption over partial procedure compilation system to stay safe from those concerns.

Last, this might be funny to write in the same post, but I came to a realization: isn't this essentially decentralized Web3 stuffs haha? Aih, I thought it was an original idea and apparently I'm just late on the party, maan.

But yeah it doesn't matter. This is still a glimpse into the future of technology behind these decentralized movements. Then it just means that there is interesting big potential behind all these decentralization movements. No, I'm not talking about the cryptos being treated as stock trades, not that part. What I meant is the Web3 as a technical platform and movement. Those kind of things looks more real and sounds more worthy to bet on.

# `2 New Things Learnt`
## Focused Thinking and Diffused Thinking in writing

So, I learnt about Focused Thinking and Diffused Thinking. Focused Thinking is concentrated, conscious and relatively thinking we do. Just like it's name it is narrowly scoped. By contrast, Diffuse Thinking is relaxed, occurs largely subconsciously, and can result in surprising connections.

What I learnt was: First, we can to conciously switch between both modes. Second, while writing we can switch inbetweens, and it will actually do something!?

There's this advice I just tried to follow "write diffused, edit focused, and never ever edit when writing." Guess what? Practicing that actually gave immediate results. I remember the day when I sat on my screen trying to come up with thinking and nothing came out, nothing. Apparently it was because I sit within a focused mode. But when I start to sit within diffused mode, bruh I came up immediately with four good titles. Disclaimer, the titles is acquired but the content is still a different matter, haha. It works. No such daunting writer blocks again. Heck, I even got even not writing random ideas from random babbles happened whil in diffused thinking mode. This trick is very useful.

PS. When you do diffused thinking there will be lot of unused idea though. But it doesn't matter, unused ideas doesnt stinks haha.

## ReactJS: Better way to useState() on form data

On my first days handling form page in React, I used implement things as  one-field-one-state. It means for every data field I will have one useState hook and one change handler func at least. Everything started fine on small number of fields,  but once I reached 6-7 field items, wah it feels so menial like this. Look at this:

<script src="https://gist.github.com/avrebarra/066ef17af6e7a93f8cb22ff359166943.js?file=usestates-regular.ts"></script>

Then I ask our dear LLM friend, on whether there are better solution than these useState fiasco, and what it recommends is: Still a useState. But a clever one:

<script src="https://gist.github.com/avrebarra/066ef17af6e7a93f8cb22ff359166943.js?file=usestates-reducer.ts"></script>


This way we can use one state and one change handler functions for all the same field. Wah real timesaver.

Lastly I found out about useReducer(). Well it reduces things, literally what was done withi. This reducer hook, is actually more idiomatic to use than manually implementing reduce mechanics with use state. But tbh sticking to the more universal tool like useState() is still good, too.

# `3 Interesting Online Things`

1. [React Window](https://github.com/bvaughn/react-window): It's only now I realized that its a good practice to limit renders in infinite scroll. I used to wonder why I cannot search text in non visible Twitter post in timeline and thats probably because of this practice. It's not even rendered.
2. [Sigrid's High Five](https://www.youtube.com/watch?v=z6A2LHGx8_A): Good bop. I love Sigrid when she dances on her music videos. The energy is contagious.
3. [The Dancing Raccoon Pedro Meme Origins](https://trending.knowyourmeme.com/editorials/guides/where-did-the-video-of-the-raccoon-dancing-to-pedro-in-a-circle-come-from-the-russian-meme-explained): I just, uh, loves raccoons..
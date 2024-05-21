---
layout: post
title: "UmDoisTrês: Hypnosis As A Service"
highlighted: true
description:
summary:
series: UmDoisTrês
tags:
---

Welcome, to [UmDoisTrês #3](/posts/?series=umdoistr%C3%AAs)! We go again: 1 abstract question, 2 learnt lessons, and 3 interesting online stuffs.

# `1 Question`
## How the could Free LLM Chats business model be? A Bias/Hypnosis As A Service?

Last week GPT4o, released and free ChatGPT got its trial on internet browsing. It makes things felt kinda slow though and I'm concerned that the result will be biased because of the content it reads. Which is funny, because LLMs themselves are also built by doing those in the first place. I started bettering my active english speaking skills by talking with ChatGPT on my free time. Gemini also released some updates but didn't get my hands in it yet. There's also Claude I signed up to test for better [Baba's fable](https://avrebarra.github.io/baba) Indonesian translations. It's all free sips in the wild.

But where a marvelous online service stands, there're also superstar employees and enormous infras that has to be expensively paid, for sure. I was wondering: how does (or will) they pay all these free sips off?

Hence I'm imagining options where those companies can profit off these (other than the most obvious paid subscription of course). One of the very dumb and unethical option popped up is: BHAAS.

See, seeing how people are using LLM Chats more and more on daily basis, and reflecting to Ads as one of the most popular way of gaining payment from partners. What if the co subconciously add some targeted biases to decisions or answer in people's chats? Like adding subtle hints of brands on casual conversations. That's manipulative but might work, right? Dismissing the trust issue backlash that could happen when people found out about how they're subconciously manipulated by subtle words and hints.

Like, maybe someday soon they start recommending Coke in the most subtlest way possible. Like from jokes? Or from subtle analogies? CR7 won't like it.

That'd could be called something like Targeted-Bias-as-a-Service or Brand Hypnosis-as-a-Service. TBAAS/BHAAS.

That'd be very sinister, twisted, and unethical.. 

# `2 New Things Learnt`
## Generating Images with Generative AI (DALL-E)

I've been building [Baba](https://avrebarra.github.io/baba) lately. It's a fable directory. I'm kinda done with the story text generation (it works although it still have some things to address), so I started doing some Generative AI for imagery generations. I used DALL-E to make some header images so the site will be less bland.

Starting confused. I tried things manually and it never yield images close to what I wanted. It keep making this exaggerated smooth skinned cartoony but realistically textured illustration of things. I then start to look for some guidance, paid guidance. I ended up buying two cheap items in [PromptBase](https://promptbase.com/) just to know how Image Generation Prompt are supposed to looks like and how it differs between the bigger engines (StableDiffusion, DALL-E, Midjourney). Finally after some bucks of items bought, and bucks of prompt adjustment I got a pretty stable themed illustration image prompt. For some funfacts, it costs me IDR200K to get my first 3 proper header images. Gosh, what a pricey learning curve.

All is good now. I think I can start generating proper header images (or any other style images). Probably also going to rely to the slower async generative API for cheaper pricepoints. The only one thing that I gave up (and one of the biggest contributor to the expensive testing cost) is to generate vertically split tiled images. No matter how I tried to create top-bottom split images, DALLE keeps generating left-right split images on 1024x1024 canvas. It's frustrating especially after counting the result images.

## Getting Creative with Jekyll's Liquid

Jekyll's been my boring stack for a while now. I started using Jekyll to build this site, now I also used it on [Baba Fables](https://avrebarra.github.io/baba).

At first I thought Jekyll would be very very limited. As it's a statically prebuilt, simple to setup, a Ruby :), and the syntaxes offered by the scripting part of it (Liquid) are somewhat looks kinda too narrowly specialized. I used to think of rushing to change into more sophisticated static site builder, like Hugo with its React and GraphQL, for nicer DOM control. Alas, when building Baba, I found out that Jekyll and Liquid can actually do more than what I thought it could. With Liquid we can do things like categorizing entries, tagging posts, adding characters, filtering by tags or characters, i8n, and nice enough integration with JS scripts (I can even do Preact nicely with Jekyll). We can definitely be creative enough with it. It goes even way further when we involve JavaScript scripting.

So yeah, Jekyll is oldschool but its comfy. I'm still planning to get into Hugo though. I'm drawn by the React and GraphQL used. Sounds like home. I've read the very well written docs, tried it, and found out apparently it's not that simple haha. That's it for now. Will see the development later.

# `3 Interesting Online Things`

1. [Hack Your Guts](https://www.imdb.com/title/tt31316096/): I wouldn't say I took much techniques from this documentary, well people are literally putting not-so-nice thing into capsules to eat, but one that I learnt is that we are actually a mothership of bacteria and we need to feed them constantly to stay healthy. It was whoaah. Let's fix food!
2. [PromptBase](https://promptbase.com/): A marketplace for prompt. I know, it sounds soo lame to buy a prompt, a text. But if you need it, you do it. Just so you know, I spent 12USD to tweak my image style prompt. Surprisingly, I realized it might cost me 15 more if I didn't start off buying sample one. Cuz, those free prompts scattered everywhere mostly sucks.
3. [RQLite](https://rqlite.io/): This wrapping implementation of SQLite as another RDBMS is interesting. It's written in Go. I've been delving to their codebase to learn about some system designs.
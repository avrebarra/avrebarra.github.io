---
layout: post
title: How to Retain Types of Context Values in Golang?
description: Adding some structure in golang context values
summary:
tags: [golang, tech]
---

So probably we all knew about `context.Context` in Golang right? It's also common knowledge to inject some value to Golang context so we can be propagate that value to next processes. (start here if you're new to Golang Contexts)

<script src="https://gist.github.com/avrebarra/d629fb345b7e414d123be99ff72a390d.js?file=old_main.go"></script>

Like that, right? Simple. But have you ever wondered (or disturbed) on how it lose the values's type information? It returns our typed values as `interface{}` type. Here, I wont be explaining the reason behind why it uses `interface{}`. But I'll talk about: can we keep those type information? Yes.

One simple and intuitive way is by adding helper struct and functions like these:

<script src="https://gist.github.com/avrebarra/d629fb345b7e414d123be99ff72a390d.js?file=ctxhelper.go"></script>
<script src="https://gist.github.com/avrebarra/d629fb345b7e414d123be99ff72a390d.js?file=new_main.go"></script>

You see, that way we can safely add, update, and read values while retaining the type. This works very nicely if you have a clear design on what values you're trying to pass around using context between process.

We've been using this model all the time in our place. So far no problems, heck we even use this pattern to enable back propagatable context values (usually context values is only readable for next process but not previous right?). So I guess it's worth a write.

Thanks for reading. Ciao~

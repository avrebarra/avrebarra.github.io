---
layout: post
title: How to Retain Types of Context Values in Golang?
description: Adding some structure in golang context values
summary:
series: Golang
tags: [golang, tech]
---

_"Ugh, Golang context values returns `interface{}` and lose its type information? How to work around this...?"_

We all knew about `context.Context` in Golang right? One of its main use is to hold some value so we can propagate that value to next processes. ([new to `context.Context`? start here](https://dev.to/gopher/getting-started-with-go-context-l7g))

Let me show a bit:

<script src="https://gist.github.com/avrebarra/d629fb345b7e414d123be99ff72a390d.js?file=old_main.go"></script>

Like that. Simple, right?

But have you ever wondered (or disturbed) on how it loses values's type information? It returns our typed values as `interface{}` value.I wont be explaining the reason behind why it uses `interface{}` though, instead I'll talk about: can we keep those type information? Yes we can!

One simple and intuitive way to do it is by adding helper struct and functions like these:

<script src="https://gist.github.com/avrebarra/d629fb345b7e414d123be99ff72a390d.js?file=ctxhelper.go"></script>
<script src="https://gist.github.com/avrebarra/d629fb345b7e414d123be99ff72a390d.js?file=new_main.go"></script>

You see, that way we can safely add, mutate, or read context values while retaining the type. This works very nicely especially if you have a clear design on what values you're trying to pass around using context between process.

We've been using this model all the time in our place. So far no problems, heck we even use this pattern to enable back propagatable context values (usually context values is only readable for next process but not previous right?). So I guess it's worth a write.

Thanks for reading. Ciao~

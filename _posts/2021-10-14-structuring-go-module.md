---
layout: post
title: Structuring A Go Module
description:
summary:
tags: [golang, tech]
---

We sure have our own tastes on structuring codebase and projects. There are already tons of opinions, but I guess it can't be too much to have references, right? Wkwkwk.

So, In this post, I guess I'll offer my two cents and share my opinion on how I usually structure my Golang package/module.

_Disclaimer: this will be an opinion about module structure, not project structure._

# A Bit Intro

This post will explains some rules I follow that are quite simple to explain and proven to be applicable to almost all kind of modules we've made (small utils/libraries, small module, big module, stateful system, etc). This guideline tries to emphasize on simplicity, comprehensibility, and intuitiveness, yet still stay open for extensions.

Of course, this will just be another opinions. But I really think this is good enough to get benefits from. Adding a bit of self testimony, we've been having some new joiners lately. With these patterns, I only need to commit about 15-20min of verbal explanations (without any written explanation whatsoever, because we still haven't wrote any) and after the explanation of the concept, they're usually all good to go traversing all of our system's codebase.

These principles aren't that long. You can pretty much get a good grasp for it by directly reading the code. But I'll probably still write this in parts (or as a longer versions) because I want to elaborate and emphasize a bit on the reason why some decisions are made.

You can check the final module files on [this gist](https://gist.github.com/avrebarra/5a6acf7ff31df7acc548d16e029ac97c) link.

<hr class="separator">

# 1. Prefer Flat File Topology

When creating any kind of Golang modules try our best to keep your file tree flat. Resist the temptations to create a subdirectory to 'categorize' files. I find most of the time file categorizing can be easily solved, by giving a sensible naming for your files. After a good file naming, we can just let our system do the categorizing using its filename based sorter.

```bash
❯ tree .
.
├── numstore.go
├── numstore_memory.go
├── numstore_memory_test.go
├── numstore_mongo.go
├── numstore_mongo_test.go
├── numstore_redis.go
├── numstore_redis_test.go
└── numstore_test.go

0 directories, 8 files
```

Another reason I also found is there are no actual benefit on nesting a module inside a module in Golang. Especially on modules having very tight relationship between each other (because otherwise why we try nesting it deep?). Also developing using VSCode, it works and feels way better when a coupled functions placed on same hierarchy than deeply nested.

It also keep the overall size of our module visually small. Make it a bit easier to traverse and less options to overwhelm us when tracing for a function/variables.

# 2. Head File as Central Reference File

_In the above section, I showed a flat structure of `numstore` module. It is a sample module that could store number in various storage options. We will be using this module as example in following sections._

In numstore module, ignoring the test files, we can see there is one `numstore.go` and some files that has various storage name such as `numstore_redis.go`.

`numstore.go` is what I'd call a head file, and `numstore_redis.go + numstore_memory.go` etc are what I'd call variant files.

**Headfile** is probably a bit like `index.js` in JavaScript. We use headfile to contain ALL general knowledge of the module we're building. You can see below, it contains interfaces, datatypes, error mapping, all that will be used in any storage chosen. **Headfile will be the central reference file of the module, that contains every general or shared knowledge of the module.**

Here I show you how my headfile (`numstore.go`) usually looks like:

<script src="https://gist.github.com/avrebarra/5a6acf7ff31df7acc548d16e029ac97c.js?file=numstore.go"></script>

Adding some tips, for my headfiles I usually group and order the content as follows:

1. Vars and consts (constant strings, enums, error objects)
1. Interfaces that used throughout the module plus it's function input output structs (if any)
1. Common entity and data types
1. Helper utilities and function

I usually separates them sections using `// ***` comment line. Sometimes adding a one liner explanation if necessary.

# 3. Variant Files for Implementation-Specific Code

**Variant Files** is a file containing specific knowledge of a variation in module. Variation is very abstract concept that can be applied as we see fit.

In this numstore sample module, we use variant file to separate implementation of store using different storage options (each file contains different interface's implementation according to what storage used).

Here I show you how variant files of numstore could look like:

<script src="https://gist.github.com/avrebarra/5a6acf7ff31df7acc548d16e029ac97c.js?file=numstore_memory.go"></script>
<script src="https://gist.github.com/avrebarra/5a6acf7ff31df7acc548d16e029ac97c.js?file=numstore_mongo.go"></script>

If we observe it again, both of the variant files kinda have same model, right? Yes. It follow a simple pattern of `config_struct + variant_struct + new() function + feature functions` (and it is real beneficial to maintain consistent file layout)

Another thing to emphasize is, I strongly recommend to keep one-variant-one-file (not splitting into multiple files). Usually the argument to split files, kicks in when the file size starts getting bigger (>500LOC), but I'll still recommend to keep it one file. In my squad, we found it easier to have all variant functions grouped as one file instead of splitting it to multiple files. To tackle code traversing issues, we found it to be easily fixable by giving a good name (usually good prefixes) and make use of [code outline feature that commonly found in IDE/code editors](https://code.visualstudio.com/docs/getstarted/userinterface#_outline-view).

Some benefits of this (again) are keeping our module compact and simple. Less overwhelming to traverse. Even in the event of our module growing super big (I used to have a implementation file that has about 10k LOC), by using this concept I'll still feel safe because we get the feeling of `you might not see it there but you absolutely know it is there. In that one file.` Combined with [code outline](https://code.visualstudio.com/docs/getstarted/userinterface#_outline-view) feature in common IDEs, this'll also make find and replacing codes are way easier.

**Additional Notes:** On a module that **has no variant and only one of implementation code**, I will still follow the format. I usually use `_default` and treat it as a variant file like this:

```bash
❯ tree .
.
├── service.go
├── service_default.go
└── service_default_test.go

1 directory, 3 files
```

# 4. Additional Bits

By far those are the main concepts I use intensively when building a go module. Like I've said they are simple, but readily offers simplicity, eases of unit testing, could assert similarity between any modules, and yet still pretty flexible and open for extensibility.

Apart from those I've explained, there are some bits that I included but not really explained in depth like:

- Validation using Struct Tag
- Dependency injection using Config struct
- Duplication of Number Datatype in `numstore_mongo.go`

Those bits are not really necessary to implement but so far really helpful and interesting. So, I'm thinking to explain it in the follow up posts. So see you later~!

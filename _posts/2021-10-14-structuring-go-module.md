---
layout: post
title: Structuring A Go Module
description:
summary:
tags: [golang, tech]
---

We sure have our own tastes on structuring codebase and projects. There are already tons of opinions, but I guess it can't be too much to have references, right? Wkwk. In this post, I'm going to share my on how I usually structure my Golang package/module.

These sets are simple to explain and proven to be applicable to almost all kind of modules we've made (small utils/libraries, small module, big module, stateful system, etc). This guideline tries to emphasize on simplicity, comprehensibility, and intuitiveness, yet still stay open for extensions.

Of course, this will just be another opinions. But I really think this is good enough to get benefits from. Adding a bit of self testimony, we've been having some new joiners lately. With these patterns, I only need to commit about 15-20min of verbal explanations (without any written explanation whatsoever, because we still haven't wrote any) and after the explanation of the concept, they're usually all good to go traversing all of our system's codebase.

These principles aren't that long. You can pretty much get a good grasp for it by directly reading the code. But I'll probably still write this in parts (or as a longer versions) because I want to elaborate and emphasize a bit on the reason why some decisions are made.

<hr class="separator">

# 1. Prefer Flat File Topology

When creating any kind of Golang modules try your best to keep your code file tree flat. Resist the temptations to create a subdirectory to 'categorize' files. I find most of the time file categorizing can be easily solved, by giving a sensible naming for your files. After a good file naming, just let your system do the categorizing using it's file sorting system.

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

Another reason I found is there are no actual benefit on nesting a module inside a module especially on modules having very tight relationship between each other (because otherwise why we try nesting it deep). Go modules parsing style, works and feels way better when a coupled functions placed on same hierarchy.

It also keep the overall size of your module visually small. Make it a bit easier to traverse and less options to overwhelm you when tracing for a function/variables.

# 2. Head File and Variant Files

_In the previous part, I showed a flat structure of `numstore` module. It is a imaginary module that stores number in various storage options. We will be using this module as example._

Ignoring the test files in numstore module, you can see there is one `numstore.go` and some files that has various storage name such as `numstore_redis.go`.

`numstore.go` is what I call a head file, and `numstore_redis.go + numstore_memory.go` etc are what I call variant files.

**Headfile** is probably a bit like index.js file in JS. In this structure, we use headfile to contains ALL general knowledge of the module we're building. You can see below, it contains main module interface, main datatype, error mapping, that will be used in any storage chosen. **Headfile will be the main reference of the module that contains every general or shared knowledge of the module.**

```go
// numstore.go
package numstore

import (
	"context"
	"fmt"
)

var (
	ErrNotImplemented = fmt.Errorf("feature not implemented")
	ErrNotFound       = fmt.Errorf("not found")
)

type NumberStore interface {
	Store(ctx context.Context, in StoreInput) (err error)
	Retrieve(ctx context.Context) (out RetrieveOutput, err error)
}

type StoreInput struct {
	Number Number
}

type RetrieveOutput struct {
	Number Number
}

// ***
// datatypes

type Number struct {
	MainNum    int
	DecimalNum int
}

// ***
// general utilities

func CombineNumber(in1 Number, in2 Number) (out Number) {
	out = Number{
		MainNum:    in1.MainNum * in2.MainNum,
		DecimalNum: in1.DecimalNum * in1.DecimalNum,
	}
	return
}

```

<br>
For headfile I usually group and order the content as follows:
1. Vars and consts (constant strings, enums, error objects)
1. Interfaces that used throughout the module plus it's function input output structs (if any)
1. Common entity and data types
1. Helper utilities and function

I usually separates them sections using `// ***` comment line. Sometimes adding a one liner explanation if necessary.

<br>
**Variant Files** is a file containing specific knowledge of a variation in module. This is very abstract concept that can be applied as you see fit. In this example, we use this to separate implementation of store using different storage options.

```go
// numstore_memory.go
package numstore

import (
	"context"
	"fmt"

	"github.com/avrebarra/valeed"
)

type ConfigMemory struct {
	StorageArray []Number `validate:"required"`
}

type Memory struct {
	config ConfigMemory
}

func NewMemory(cfg ConfigMemory) (NumberStore, error) {
	if err := valeed.Validate(cfg); err != nil {
		return nil, err
	}
	e := &Memory{config: cfg}
	return e, nil
}

func (e *Memory) Store(ctx context.Context, in StoreInput) (err error) {
	// perform process
	e.config.StorageArray = append(e.config.StorageArray, in.Number)

	return
}

func (e *Memory) Retrieve(ctx context.Context) (out RetrieveOutput, err error) {
	// perform process
	// ** validate count
	count := len(e.config.StorageArray)
	if count <= 0 {
		err = fmt.Errorf("%w: empty storage", ErrNotFound)
		return
	}

	// ** fetch
	resid := count - 1
	num := e.config.StorageArray[resid]

	// build output
	out = RetrieveOutput{
		Number: num,
	}

	return
}

```

```go
// numstore_mongo.go
package numstore

import (
	"context"
	"fmt"

	"github.com/avrebarra/valeed"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	MongoCollectionName = "numstore"
)

type ConfigMongo struct {
	MongoClient mongo.Client `validate:"required"`
}

type Mongo struct {
	config ConfigMongo
}

func NewMongo(cfg ConfigMongo) (NumberStore, error) {
	if err := valeed.Validate(cfg); err != nil {
		return nil, err
	}
	e := &Mongo{config: cfg}
	return e, nil
}

func (e *Mongo) Store(ctx context.Context, in StoreInput) (err error) {
	err = fmt.Errorf("%w: code yet unfinished", ErrNotImplemented)
	return
}

func (e *Mongo) Retrieve(ctx context.Context) (out RetrieveOutput, err error) {
	err = fmt.Errorf("%w: code yet unfinished", ErrNotImplemented)
	return
}

// ***

type MongoNumber struct {
	MainNum    int `json:"main_num" bson:"main_num"`
	DecimalNum int `json:"decimal_num" bson:"decimal_num"`
}

```

<br>
If you observe it again, both of the variant files kinda have same model, right? Yes. It follow a simple pattern of `config_struct + variant_struct + new() function + feature functions`

Another thing to emphasize is, I strongly recommend to keep one-variant-one-file (not splitting into multiple files). Usually the argument to split kicks in when the file size starts getting bigger (>500LOC), but I'll still recommend to keep it one file. In my place we found it easier to have all variant functions grouped as one file instead of splitting it to multiple files. To tackle code traversing issues, we found it to be easily fixable by giving a good name (usually good prefixes) and make use of outline feature that commonly found in IDE/code editors.

Some benefits of this are (again) keeping module compact and simple. Less overwhelming to traverse. And even in the case of your module growing super big (I used to have one variant file that has 10k LOC), by using this concept you'll get the feeling of `you might not see it there but you absolutely know it is there. In that one file.` Combined with code outline feature in common IDEs, this'll also make find and replacing codes are way easier.

Additional Notes: On a module that has no variant and only one way of implementation, I will still follow the format. I usually use `_default` and treat it as a variant file like this:

```bash
❯ tree .
.
├── service.go
├── service_default.go
└── service_default_test.go

1 directory, 3 files
```

# 3. Additional Bits

By far those are the main concepts I use intensively when building a go module. Like I've said they are simple, but could already offers simplicity, eases of unit testing, could assert similarity between any modules, and yet still pretty flexible and open for extensibility.

Apart from those I've explained, there are some bits that I included but not really explained in depth like:

- Validation using Struct Tag
- Dependency injection using Config struct
- Duplication of Number Datatype in `numstore_mongo.go`

Those bits are not really necessary to implement but so far really helpful and interesting. So, I'm thinking to explain it in the follow up posts. So stay tuned~!

---
layout: post
title: Defining Error Types in Golang Modules
description:
summary:
tags: [golang, tech]
---

> TL;DR: Jump to Way #3 to see how we can use Golang `errors.Is()` to define error kinds/types.

When I got spare times at work, I always love to experiment with Golang. Things felt fast, reliable, and simple. But sometimes there are things that took some time to think hard. One thing is: **How I could specify error types so my other module can differentiate it?**

In Golang, we were taught to pass error around as variable. Neat concept. All bliss until some part of code need to know what kind of error that was?

This is a case that will come up pretty often. Let's suppose we had a module that have multiple reason of errors (e.g whether it is a DB failure, HTTP request drop, error from remote API, etc). Then we want to let other modules to know which kind of error returned, so the they can handle it differently depending on what kind of error it was. In Golang, what defines `error` type is basically anything with `.Error()` func that returns string. So, basically it's just a string passed around. **Then how do we identify it so we know what kind of error was that?**

In this post I've collected methods I've used over my months of trying Golang:

- Enumerate errors by checking their messages
- Enumerate error types using custom struct
- Enumerate error types using errors.Is()

## Way #1: Comparing the message string

I talked this with friend, my friend used to suggest to just differentiate it using `strings.Contains()`.

What!? Yes, it doesn't need a spider sense to know that's a bit off. We can imagine all kind of development changes that could break this, like: adjustment of message, error with similar messages, mistypes, and many thing regarding how string consistency is a mortal inside our codebase.

But because it actually works, and I'm trying to make this post follow to rule of third :) here it is:

```go
package thepkg

import (
	"fmt"
	"math/rand"
)

// SomethingFaulty is function that return multiple kind of error
func SomethingFaulty() error {
	var randnum int = int(rand.Float32() * 10)

	switch randnum {
	case 1:
		return fmt.Errorf("database error: imagine it")
	case 2:
		return fmt.Errorf("http call error: when the connection broke")
	case 3:
		return fmt.Errorf("remote api error: when the req ok but they says no")
	default:
		return fmt.Errorf("unexpected error: kinda don't know what is it")
	}
}
```

```go
package main

import (
	"fmt"
	"strings"

	"github.com/me/experror/thepkg"
)

func main() {
	// perform the faulty function
	err := thepkg.SomethingFaulty()
	if err != nil {
		errmsg := err.Error()

		switch true {
		case strings.Contains(errmsg, "database error"):
			fmt.Println("aww: man database error")
			return

		case strings.Contains(errmsg, "http call error"):
			fmt.Println("ugh: the traffic again")
			return

		case strings.Contains(errmsg, "remote api error"):
			fmt.Println("perhaps we dont knock nice enough")
			return

		default:
			fmt.Println("hmm: i dont quite recognize this")
			return
		}
	}

	fmt.Println("all is good in this pandemic: this never happened (the code path)")
}
```

---

_Pros: naive approach that pretty small, simple, and intuitive_

_Cons: many thing could unintendedly break this, like: other error (from other module) that accidentally have similar messages, and generally its always a bad idea to rely to thing that's not supposed to be the contract._

## Way #2: Introducing custom error struct

We just talked previously that in Golang, what defines `error` type is basically anything with `.Error()` func that returns string. So, naturally there must be an option about custom error: Custom struct with `Error()` function.

We can do it by creating these custom struct. To differentiate it, we could parse it back to error struct using coercion like this:

```go
package thepkg

import (
	"math/rand"
)

// Module's error codes
const (
	ErrCodeDatabaseFailure    = "X01"
	ErrCodeHTTPRequestFailure = "X02"
	ErrCodeAPIError           = "X03"
	ErrCodeUnexpectedFailure  = "X99"
)

// Error is this module's error object
type Error struct {
	Code    string
	Message string
}

func (e Error) Error() string {
	return e.Message
}

// SomethingFaulty is function that return multiple kind of error
func SomethingFaulty() error {
	var randnum int = int(rand.Float32() * 10)

	switch randnum {
	case 1:
		return Error{Code: ErrCodeDatabaseFailure, Message: "database error: imagine it"}
	case 2:
		return Error{Code: ErrCodeHTTPRequestFailure, Message: "http call error: when the connection broke"}
	case 3:
		return Error{Code: ErrCodeAPIError, Message: "remote api error: when the req ok but they says no"}
	default:
		return Error{Code: ErrCodeUnexpectedFailure, Message: "unexpected error: kinda don't know what is it"}
	}
}
```

```go
package main

import (
	"fmt"

	"github.com/me/experror/thepkg"
)

func main() {
	// perform the faulty function
	err := thepkg.SomethingFaulty()
	if e, ok := err.(thepkg.Error); ok {
		err = nil // the error is fully handled here

		switch e.Code {
		case thepkg.ErrCodeDatabaseFailure:
			fmt.Println("aww man database error")
			return

		case thepkg.ErrCodeHTTPRequestFailure:
			fmt.Println("ugh the traffic again")
			return

		case thepkg.ErrCodeAPIError:
			fmt.Println("perhaps we dont knock nice enough")
			return

		case thepkg.ErrCodeUnexpectedFailure:
			fmt.Println("whoa: unexpected things happened")
			return

		default:
			fmt.Println("wait: unregistered code!")
			return
		}
	}
	if err != nil {
		fmt.Println("hmm.. i dont quite recognize this")
		return
	}

	fmt.Println("all is good in this pandemic: this never happened (the code path)")
}
```

_Pros: very useful to add additional information/identity to error, good strict contract for error type,_

_Cons: bigger code footprint, and additional struct to add everytime we want to add error types to modules._

## Way #3: Leveraging the errors.Is()

The previous way will work fine. But I still have one other, this last one is my favourite up until now.

It is to leverage the errors.Is() module introduced in Go v1.13. This is by far my favourite because how clean and simple it is.

```go
package thepkg

import (
	"fmt"
	"math/rand"
)

// Module's errors
var (
	ErrDatabaseFailure    = fmt.Errorf("database error: imagine it")
	ErrHTTPRequestFailure = fmt.Errorf("http call error: when the connection broke")
	ErrAPIError           = fmt.Errorf("remote api error: when the req ok but they says no")
	ErrUnexpectedFailure  = fmt.Errorf("unexpected error: kinda don't know what is it")
)

// SomethingFaulty is function that return multiple kind of error
func SomethingFaulty() error {
	var randnum int = int(rand.Float32() * 10)
	switch randnum {
	case 1:
		return ErrDatabaseFailure
	case 2:
		return ErrHTTPRequestFailure
	case 3:
		return ErrAPIError
	default:
		return ErrUnexpectedFailure
	}
}
```

```go
package main

import (
	"errors"
	"fmt"

	"github.com/me/experror/thepkg"
)

func main() {
	// perform the faulty function
	err := thepkg.SomethingFaulty()
	if err != nil {
		switch true {
		case errors.Is(err, thepkg.ErrDatabaseFailure):
			fmt.Println("aww man database error")
			return

		case errors.Is(err, thepkg.ErrHTTPRequestFailure):
			fmt.Println("ugh the traffic again")
			return

		case errors.Is(err, thepkg.ErrAPIError):
			fmt.Println("perhaps we dont knock nice enough")
			return

		case errors.Is(err, thepkg.ErrUnexpectedFailure):
			fmt.Println("whoa: unexpected things happened")
			return

		default:
			fmt.Println("hmm.. i dont quite recognize this")
			return
		}
	}

	fmt.Println("all is good in this pandemic: this never happened (the code path)")
}
```

_Pros: small code footprint, intuitive, not much to set up, enumeration got good support by Golang language server, message adjustment wont break things._

_Cons: usage of var instead of const, no additional error info/identities except message_

---

Those three ways are the ones I've tried. By far, I'll always use `errors.Is()`. It's what I usually use and so far I like the simplicity and small code footprints, and it fits my use-cases most of the time. I've never really dig the performance side of these method on e.g very big error list (i don't know if i'll ever made that much error kinds in one package)

But for anybody that need to add some info to their error (e.g error code, error name, stacks, etc) I'll advise to use custom error struct. We can even combine the custom struct with `errors.As()` (i'll probably write another post for that one). Unless needing those custom things, so far I think we could be pretty satisfied by how `errors.Is()` could offer instant help on defining error types.

Because as always, neat and simple it is where we'll go~!

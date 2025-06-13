---
layout: post
title: "Familiarizing errgroup for Practical Concurrency in Go"
highlighted: true
description:
summary:
tags: [golang, tech]
---

Gophers love clean code. And many of us already do a solid job at it—we write modular functions, separate concerns into layers like service, storage, and handlers, and strive to keep things maintainable.

Creating good testable module is step one. Next is to make it concurrent. (Let's just say that)

## 🍃 Why It Matters
Concurrency, when done right, brings two massive benefits:
- Improved resource efficiency — Instead of waiting on slow I/O, our program can keep moving.
- Reduced user wait times — Especially important for latency-sensitive endpoints.

In modern Go systems, especially those involving microservices and external dependencies, latency tends to stack. Even if our system isn’t CPU-bound, it can still feel sluggish if it performs multiple I/O operations sequentially.

## ⚠️ But What About the Risks?
Let’s be honest: concurrency isn’t free.
- Race conditions on shared state
- Non-deterministic test failures
- Goroutines that leak due to missing context
- Deadlocks from bad sync primitives

The risks are real. But the good news is: there are simple, proven concurrency patterns in Go that mitigate these risks.

## 🥝 The Low-Hanging Fruit
A common (and very fixable) anti-pattern is sequential execution of unrelated fetches.

Here’s a simplified example:

```go
profile, err := userService.GetUserProfile(ctx, userID)
if err != nil {
    return nil, err
}

transactions, err := transactionService.GetRecentTransactions(ctx, userID)
if err != nil {
    return nil, err
}
```

These two operations don’t depend on each other. But one has to finish before the other even starts. Multiply this pattern across our system and we're looking at serious wait time overhead.

## 🧰 How to Improve It
### 1. Collect First, Process Later
Structure our code so that independent data fetches start as early as possible. Let them run in parallel, and only process the results after all the fetches are done.

Think of it like this:

```
Instead of:   Fetch → Wait → Fetch → Wait → Process
Do this:      Fetch ⬌ Fetch → Wait once → Process
```

### 2. Use errgroup.WithContext
Here’s a clean refactor of the example above:

```go
g, ctx := errgroup.WithContext(ctx)

var (
    profile      *UserProfile
    transactions []*Transaction
)

g.Go(func() error {
	var err error
	profile, err = userService.GetUserProfile(ctx, userID)
	return err
})

g.Go(func() error {
	var err error
	transactions, err = transactionService.GetRecentTransactions(ctx, userID)
	return err
})

if err := g.Wait(); err != nil {
	return nil, err
}

// Now safely use `profile` and `transactions`

```

This gives us:
- Proper context cancellation if any fetch fails
- Centralized error handling
- Clean, readable flow

## 🛣️ Building It Into our Workflow
Here’s how to normalize this pattern across our team or project:

### 🔍 Spot It Early
Get into the habit of scanning for sequential I/O operations during code review. If they’re independent, suggest turning them into goroutines under an errgroup.

### 🧼 Refactor Incrementally
As we touch older parts of the codebase, refactor long chains of serial fetches into concurrent ones—safely and gradually.

### 🧠 Keep the Codebase Lean
Concurrency patterns are easier to spot and apply when the surrounding code isn’t cluttered. Keep our functions small and focused.

## ☕ Final Thoughts
We don’t need to rewrite everything overnight. But treating concurrency like a first-class concern—even just for long-latency I/O operations—can lead to huge gains in system responsiveness and infrastructure efficiency.

Start with the low-hanging fruit.
Adopt the clean tools Go gives us.
And our users (and our servers) will thank us.


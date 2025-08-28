---
layout: post
title: "Practical Concurrency in Go with errgroup"
date: 2025-06-13 10:00:00 +0700
highlighted: true
categories: golang engineering
series: Golang
tags: [golang, concurrency, errgroup, performance]
---

<div class="text-sm text-gray-500" style="line-height: 1.5; background: repeating-linear-gradient(-45deg, #f7fafc, #f7fafc 8px, #f1f5f9 8px, #f1f5f9 16px); padding: 0.7em 1em; border-radius: 6px;">
    This piece is an adapted summary of my internal knowledge-sharing initiatives at work.
</div>


We naturally think sequentially when we code―it feels intuitive, it's easy to reason about, and it works. We write functions that call other functions, handle one task after another, and build our applications step by step. This sequential approach serves us well in most programming languages where concurrency comes with significant overhead and complexity.

But in some languages that support concurrency, like Golang, concurrency is cheap and accessible, making it almost wasteful to stick with purely sequential execution, especially when our code could genuinely benefit from doing multiple things at once.

When we have operations that don't depend on each other—like fetching data from different APIs, processing independent files, or making multiple database queries—we're leaving performance on the table by doing them one after another.


## Introduction to the Sequential Bottleneck

Consider a typical scenario in a web application where we need to fetch data from multiple sources to build a response. The straightforward approach often looks like this:

### Before: Sequential Execution
```js
func GetDashboardData(ctx context.Context, userID string) (*DashboardData, error) {
    profile, err := userService.GetUserProfile(ctx, userID)
    if err != nil {
        return nil, err
    }

    transactions, err := transactionService.GetRecentTransactions(ctx, userID)
    if err != nil {
        return nil, err
    }

    notifications, err := notificationService.GetUnreadNotifications(ctx, userID)
    if err != nil {
        return nil, err
    }

    return &DashboardData{
        Profile:       profile,
        Transactions:  transactions,
        Notifications: notifications,
    }, nil
}
```

This approach is clear and easy to understand, but it has a significant drawback: each operation must complete before the next one can begin. If each service call takes 100ms, our total response time is at least 300ms, even though these operations are completely independent of each other.

### After: Concurrent Execution with errgroup
```js
func GetDashboardData(ctx context.Context, userID string) (*DashboardData, error) {
    g, ctx := errgroup.WithContext(ctx)

    var (
        profile       *UserProfile
        transactions  []*Transaction
        notifications []*Notification
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

    g.Go(func() error {
        var err error
        notifications, err = notificationService.GetUnreadNotifications(ctx, userID)
        return err
    })

    if err := g.Wait(); err != nil {
        return nil, err
    }

    return &DashboardData{
        Profile:       profile,
        Transactions:  transactions,
        Notifications: notifications,
    }, nil
}
```

With this concurrent approach, all three operations run simultaneously. Our total response time becomes the duration of the slowest operation rather than the sum of all operations—potentially reducing our response time from 300ms to just over 100ms.

## Why errgroup Over Raw Goroutines

While we could achieve concurrency using raw goroutines and channels, `errgroup` provides several advantages that make it the preferred choice for this pattern:

### A. Built-in Error Handling
The errgroup automatically cancels the context when any goroutine returns an error, causing all other operations to be cancelled as well. This prevents unnecessary work and ensures fast failure detection.

### B. Context Propagation
The `errgroup.WithContext()` function creates a derived context that gets cancelled when the first error occurs, allowing all goroutines to respond appropriately to cancellation signals.

### C. Simplified Synchronization
No need to manually manage channels or wait groups—the `Wait()` method handles all synchronization logic and returns the first error encountered, if any.

## Understanding the Performance Impact

The performance benefits of concurrent execution become more pronounced as the number of independent operations increases or as the latency of individual operations grows. Here's how the math works:

```
// Sequential Timing
Operation A: 100ms
Operation B: 150ms  
Operation C: 80ms
Total: 330ms

// Concurrent Timing
All operations start simultaneously
Total: max(100ms, 150ms, 80ms) = 150ms
```

This represents a 55% reduction in total execution time—a significant improvement that users will notice, especially in latency-sensitive applications.

## Common Patterns and Best Practices

It's important to recognize when and how to apply concurrency with `errgroup`. Not every problem benefits from parallel execution, but for the right scenarios, `errgroup` can dramatically simplify your code and boost performance. Below are some practical patterns and best practices for using `errgroup` effectively in real-world Go applications.

### A. Pattern 1: Independent Data Fetching
This is the most common use case, where you need to gather data from multiple sources that don't depend on each other.

```js
g, ctx := errgroup.WithContext(ctx)
var data1, data2, data3 SomeType

g.Go(func() error { /* fetch data1 */ })
g.Go(func() error { /* fetch data2 */ })
g.Go(func() error { /* fetch data3 */ })

if err := g.Wait(); err != nil {
    return err
}
// Use data1, data2, data3
```

### B. Pattern 2: Processing Independent Items
When you have a collection of items that can be processed independently:

```js
g, ctx := errgroup.WithContext(ctx)

for _, item := range items {
    item := item // Capture loop variable
    g.Go(func() error {
        return processItem(ctx, item)
    })
}

return g.Wait()
```

### C. Pattern 3: Limited Concurrency
For scenarios where you want to limit the number of concurrent operations:

```js
// Create a semaphore to limit concurrency
semaphore := make(chan struct{}, maxConcurrency)

g, ctx := errgroup.WithContext(ctx)

for _, item := range items {
    item := item
    g.Go(func() error {
        semaphore <- struct{}{} // Acquire
        defer func() { <-semaphore }() // Release
        
        return processItem(ctx, item)
    })
}

return g.Wait()
```

## When to Use errgroup

### Good Candidates
- Multiple independent API calls or database queries
- Processing collections where items don't depend on each other
- Validation operations that can run in parallel
- File I/O operations that can be performed simultaneously

### When to Avoid
- Operations that depend on results from other operations
- CPU-intensive tasks that would benefit from worker pools instead
- Simple, fast operations where the concurrency overhead isn't worth it
- Operations that share mutable state without proper synchronization

## Managing the Risks

While errgroup helps mitigate many concurrency risks, there are still important considerations:

### I. Shared State
Ensure that any shared variables are properly protected. In the errgroup patterns shown above, each goroutine writes to a different variable, avoiding race conditions.

### II. Resource Limits
Be mindful of resource consumption. Running too many concurrent operations can overwhelm databases, APIs, or network connections. Use the limited concurrency pattern when needed.

### III. Error Context
Since errgroup returns only the first error encountered, ensure your error messages provide enough context to understand which operation failed.

## Conclusion

The `errgroup` package offers a practical and reliable way to add concurrency to Go applications, reducing complexity compared to managing raw goroutines and channels directly. By identifying independent operations—especially those involving I/O or external services—you can often achieve significant performance gains with minimal code changes.

To get started, begin by reviewing your code for sequential tasks that don't rely on each other. Where appropriate, use `errgroup` to run them concurrently, improving responsiveness and resource utilization. With careful application and attention to best practices, `errgroup` can help you write faster, more maintainable, and robust Go programs.

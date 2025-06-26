---
layout: post
title: "Practical Concurrency in Go with errgroup"
date: 2025-06-13 10:00:00 +0700
highlighted: true
categories: golang engineering
tags: [golang, concurrency, errgroup, performance]
---

# Practical Concurrency in Go with errgroup

When building Go applications, we often reach a point where sequential execution becomes a bottleneck. While our code might be well-structured with clean separation of concerns, it can still feel sluggish when performing multiple I/O operations one after another. This is where Go's `errgroup` package becomes invaluable—offering a clean, safe way to introduce concurrency without the common pitfalls.

## Introduction to the Sequential Bottleneck

Consider a typical scenario in a web application where we need to fetch data from multiple sources to build a response. The straightforward approach often looks like this:

### Before: Sequential Execution
```go
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
```go
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

### Built-in Error Handling
The errgroup automatically cancels the context when any goroutine returns an error, causing all other operations to be cancelled as well. This prevents unnecessary work and ensures fast failure detection.

### Context Propagation
The `errgroup.WithContext()` function creates a derived context that gets cancelled when the first error occurs, allowing all goroutines to respond appropriately to cancellation signals.

### Simplified Synchronization
No need to manually manage channels or wait groups—the `Wait()` method handles all synchronization logic and returns the first error encountered, if any.

## Understanding the Performance Impact

The performance benefits of concurrent execution become more pronounced as the number of independent operations increases or as the latency of individual operations grows. Here's how the math works:

### Sequential Timing
```
Operation A: 100ms
Operation B: 150ms  
Operation C: 80ms
Total: 330ms
```

### Concurrent Timing
```
All operations start simultaneously
Total: max(100ms, 150ms, 80ms) = 150ms
```

This represents a 55% reduction in total execution time—a significant improvement that users will notice, especially in latency-sensitive applications.

## Common Patterns and Best Practices

### Pattern 1: Independent Data Fetching
This is the most common use case, where you need to gather data from multiple sources that don't depend on each other.

```go
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

### Pattern 2: Processing Independent Items
When you have a collection of items that can be processed independently:

```go
g, ctx := errgroup.WithContext(ctx)

for _, item := range items {
    item := item // Capture loop variable
    g.Go(func() error {
        return processItem(ctx, item)
    })
}

return g.Wait()
```

### Pattern 3: Limited Concurrency
For scenarios where you want to limit the number of concurrent operations:

```go
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

### Shared State
Ensure that any shared variables are properly protected. In the errgroup patterns shown above, each goroutine writes to a different variable, avoiding race conditions.

### Resource Limits
Be mindful of resource consumption. Running too many concurrent operations can overwhelm databases, APIs, or network connections. Use the limited concurrency pattern when needed.

### Error Context
Since errgroup returns only the first error encountered, ensure your error messages provide enough context to understand which operation failed.

## Conclusion

The `errgroup` package provides a clean, safe way to introduce concurrency into Go applications without the complexity of managing raw goroutines and channels. By identifying opportunities for parallel execution—especially around I/O operations—we can significantly improve application performance with minimal code changes.

The key is to start with the low-hanging fruit: look for sequential operations that don't depend on each other, and consider whether they can be run concurrently. With `errgroup`, this transformation is straightforward and reliable, leading to faster, more responsive applications that make better use of available resources.

---
layout: post
title: "LN4: Heap II"

description:
summary:
series: Learning Notes
tags: [learning-notes]
---

![heaps](/images/jKhasliSq.png)

Hola! We meet again in my learning notes. 

Today I'm continuing my previous post about Heaps.

You can see the [first part here](/learning-notes-heaps-1/).

# Why Heaps? Why Not Just Use Sorted Array?

So from previous post we knew that Heapsthrives when we are looking for max/min values in a series.

It popped me a question also: Just looking for max/min? Why we use Heap? What are the advantages? Isn't it easier to use just sorted array to seek max/min values?

Apparently, using a sorted array to find the maximum or minimum value is a viable approach. However, heaps offer certain advantages:

- **Efficient Insertion and Deletion:** Heaps provide efficient insertion and deletion operations, especially compared to maintaining a fully sorted array. The time complexity of these operations in a heap is O(log n), whereas inserting or deleting an element in a sorted array is O(n).
- **Dynamic Operations:** Heaps are well-suited for situations where the data set is dynamic, and elements are continuously added or removed. In contrast, maintaining a sorted array requires frequent re-sorting after each modification.
- **Priority Queue:** Heaps are commonly used to implement priority queues, where the element with the highest (Max Heap) or lowest (Min Heap) priority is readily accessible. This makes heaps suitable for applications where prioritized access to elements is crucial.
- **Space Complexity:** Heaps often have lower space complexity compared to maintaining a sorted array, making them more memory-efficient in certain scenarios.

While a sorted array can efficiently find the maximum or minimum value, heaps shine in scenarios where dynamic operations and efficient insertion/deletion are key considerations. Their structure allows for quick access to the extremal elements without the need for maintaining a fully sorted order.

For a visual explanation, consider watching this tutorial: [Heap vs Others](https://www.youtube.com/watch?v=RU08pp_VPSs). The visual representation helps illustrate the efficiency of heaps over other possible datastructures.

# What are real usecases of for Heaps? Why do I often hear it when talking about memories?

In computer systems, heaps play some roles particularly when managing dynamic memory allocation. The heap data structure is widely employed in various scenarios, including:

- **Dynamic Memory Allocation:** Heaps are essential for allocating memory at runtime, allowing programs to manage memory dynamically as needed.
- **Priority Queues:** Heaps are commonly used to implement priority queues, where elements with higher or lower priority can be efficiently accessed.
- **Dijkstra's Algorithm:** The heap data structure is instrumental in optimizing algorithms like Dijkstra's, where efficient retrieval of the minimum value is critical for finding the shortest path in a graph.
- **Heap Sort:** The heap data structure is employed in the Heap Sort algorithm, providing an in-place sorting solution with a time complexity of O(n log n).
- **Memory Management in Operating Systems:** Operating systems use heaps to manage memory for processes and applications, allowing for flexible memory allocation and deallocation.

Heaps are often associated with memory discussions because they play a key role in dynamic memory allocation and deallocation, contributing to the efficient management of system resources.

# Are there any other Heap type other than Max & Min?

Certainly, besides Max and Min Heaps, there are other specialized heap types, each designed for specific use cases and requirements.

- **Binomial Heap:** Composed of a collection of binomial trees, each adhering to the heap property. Binomial heaps are known for their efficiency in merge operations, making them suitable for priority queue implementations.
- **Fibonacci Heap:** An extension of the binomial heap, Fibonacci heaps excel in scenarios involving a series of decrease key operations, commonly found in algorithms like Dijkstra's. They offer faster amortized time complexity for certain operations.
- **Pairing Heap:** A type of heap that utilizes a pairing mechanism during the merging process. Pairing heaps are known for their simplicity and competitive performance in practice.
- **Skew Heap:** A self-adjusting binary heap where the tree structure is manipulated during the merging process. Skew heaps are particularly efficient for melding operations.
- **Ternary Heap:** Similar to a binary heap, but each node has up to three children instead of two. Ternary heaps offer a balance between the simplicity of binary heaps and the potential efficiency of more branching.

These various heap types cater to different requirements and algorithmic complexities, providing flexibility in choosing the most suitable heap for a given application.

# Any Other Things I Found Interesting?

Yes, there are some things I also found pretty interesting are:

**Heaps as Arrays:** It's very interesting how we can actually represent binary heaps using just a simple array. Tbh when data structures are mentioned I always thought that it would be some variables wrapped class with interactive private functions and such. But turned out a simple binary heap can do with a simple array. Neat.

**The Marvelous Heap Sort:** a sort that's utilizing heap, is actually one of the best options available (along with quick and merge sort). What's interesting is that I didn't actually understand how Heap Sorts actually work since long time ago when I was learning about Sortings. But when I learnt about Heap, whoa, it made sense. Using heap is a smart choice.

# Closing Words

In summary, again, Heaps are cool. Haha. But really, Heaps are undeniably fascinating! Delving into the intricacies of this data structure has been an enlightening journey, revealing a multitude of insights.

May the newfound understanding serve as a valuable asset in our repertoire of problem-solving tools.

Until next time, happy coding!

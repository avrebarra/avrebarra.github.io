---
layout: post
title: "Test Precisely, Not Massively: Should You Believe Your Test Coverage?"
summary:
highlighted: true
tags: [tech]
---

"Code is all set when the unit test coverage hits that magical threshold."

"Not so fast, my friend!"

## Delving Back on Test Coverage: The Cake Analogy

Before we get to the nitty gritties, let's delve bit back into what a code coverage is – a number everyone throws around in tech companies. Some of you may ask, what's it really?

Imagine your code is like a cake, and your unit tests are like the forks you use to taste it. Code coverage is like the percentage of the cake that you've tasted by poking it with the fork. The more of the cake you've poked, the higher the code coverage. It tells you how well your tests have explored and tasted your code, ensuring that your code is thoroughly checked for errors and bugs.

That's what code coverage is. Then why do I say we shouldn't just aim for the perfect coverage percentage? Isn't striving for a high percentage a good thing? Well, say hello to Goodhart's Law.

## Goodhart's Law and Why Test Coverage Could Be Misleading

Goodhart's Law is a concept that originates from economics but is incredibly relevant in various fields, including software development. It states that **'When a measure becomes a target, it ceases to be a good measure.'** In other words, if you set a specific metric as your primary goal, people will find ways to manipulate the system to meet that goal, often at the expense of the broader, more meaningful objective.

How does this relate to the pursuit of high code coverage? Well, while aiming for a lofty code coverage percentage may appear commendable, I have seen how it could lead to unintended consequences.

When teams prioritize achieving a specific code coverage target, there's a risk of testers writing superficial tests to just increase the numbers rather than thoroughly testing the critical aspects of the code. This can result in a false sense of security, where we believe our code is robust because of a high coverage percentage, but in reality, no, essential areas remain untested and vulnerable to issues. So, in the pursuit of a high code coverage percentage, we may inadvertently compromise the overall quality and effectiveness of our testing efforts.

## Shallow vs Deep Testing

_"What do you mean? If all code has been covered, what else to cover then?"_

Let's introduce the concepts of shallow versus deep testing. I don't know what the actual terms is yet, but let's just call it shallow and deep testing for now.

Shallow testing involves validating that all code paths are executed by running test cases, primarily focusing on basic functionality and expected outcomes. It's like a quick taste test of the code, ensuring it accomplishes its core tasks without errors. On the other hand, deep testing goes beyond the basics. In deep testing we are to thoroughly scrutinize specific code paths with various parameters and scenarios. It explores the limits and potential edge cases, probing for hidden issues, vulnerabilities, and unexpected behaviors. It's like revisiting the same cake but with different toppings, to see how far it tastiness can go.

Consider these examples:

```js
function calculateTotalPrice(items, taxRate) {
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.price;
  }
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  return total;
}

function validateUserPassword(password) {
  // Check for password complexity, length, and special characters.
  // Also, perform checks against common passwords, dictionary words, etc.
  // Log any failed validation attempts for security monitoring.
  // This is a simplified example.
}
```

In this example, the calculateTotalPrice function calculates the total price of a list of items with tax. While it involves multiple calculations, it is still relatively straightforward. Testing it could involve ensuring that it correctly calculates the total price, checking for common cases, such as items with and without taxes, and verifying the mathematical operations. However, there is no need for extensive edge case testing here because the calculation logic is quite clear, and it doesn't involve complex branching or intricate conditions.

In the case of the validateUserPassword function, it may only call some 2-3 line of encryption function and maybe a database call, but for that a more comprehensive testing approach is necessary. This function is responsible for password validation, a critical security aspect. Deep testing is required to test how various test scenarios handled by it such as:

- Testing with valid passwords.
- Testing with invalid passwords that fail complexity requirements.
- Testing with passwords of various lengths.
- Testing with special characters.
- Testing with common, known weak passwords.

By testing with those different scenarios, we are retesting the same area multiple times. Area that should already been covered by previous tests. So in other words, we should stop shallow testing and do deep testing, right? No.

In practice, shallow testing mostly suffices for well-established, standard functionalities and straightforward components where the expected behavior is clear. (Hell, I may even say some part of can be good without a test. But it's a different battle so don't take it for now.) It's here to stay.

However, we just need to realize that some part requires deep testing. Deep testing becomes crucial for critical and complex areas, such as security measures, error handling, and areas with significant user interaction, as these can hide subtle and severe issues that shallow testing may overlook.

For cue, here are some aspects of the code that should raise you the question, whether that part suffices with shallow testing or may require deep testing:

<div class="flex"><div class="mr-2">&raquo;</div><div> <span class="font-bold">Complex Code:</span> Highly complex code with intricate logic, many dependencies, or intricate algorithms.</div></div>
<div class="flex"><div class="mr-2">&raquo;</div><div> <span class="font-bold">Critical Functions:</span> Code that is central to the core functionality of the application or handles critical data needing to ensure reliability.</div></div>
<div class="flex"><div class="mr-2">&raquo;</div><div> <span class="font-bold">Security Code:</span> Security-critical code, such as authentication and authorization mechanisms where testing for vulnerabilities risk and protection against breaches are a must .</div></div>
<div class="flex"><div class="mr-2">&raquo;</div><div> <span class="font-bold">Input Validations:</span> Code that processes user inputs, like form submissions, should undergo deep testing to identify potential injection vulnerabilities or validation flaws.</div></div>
<div class="flex"><div class="mr-2">&raquo;</div><div> <span class="font-bold">Concurrent Code:</span> Code dealing with multi-threading or parallel processing may require deep testing to identify race conditions and synchronization issues.</div></div>
<div class="flex"><div class="mr-2">&raquo;</div><div> <span class="font-bold">Performance-Critical Code:</span> Parts of the application that are performance-sensitive, like database queries or rendering engines, benefit from deep testing to optimize efficiency.</div></div>
<div class="flex"><div class="mr-2">&raquo;</div><div> <span class="font-bold">Integration Points:</span> Code that interacts with external services or APIs should undergo deep testing to ensure seamless integration and graceful error handling.</div></div>

That's the list. If you come across any of these aspects in your code, it's your cue to pause and ponder. Are these areas crucial to your application's functionality, or do they hide potential pitfalls? In such cases, consider investing the effort required for deeper testing.

## Final Words

The final words is, don't be too overconfident over a coverage of shallow test. Sometimes you need to exert some extra effort to add more test to an already covered area. The key is to assess the codepaths, distinguish between risky and less critical areas, and strike a balance.

While it's essential to have good level of coverage, it's equally important to allocate deep testing efforts where they matter most. Focus on ensuring comprehensive coverage for the critical aspects of the software, those parts that can have a significant impact on functionality, security, or user experience.

This article isn't exactly about discarding code coverage but rather refining how we use it. It's about not letting it become the sole obsession. It's not about chasing numbers, it's about effective and thorough testing that improves the quality of your software.

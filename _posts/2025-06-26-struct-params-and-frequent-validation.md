---
layout: post
title: "Struct Params and Frequent Validation in Go"
date: 2025-06-26 10:00:00 +0700
highlighted: true
categories: golang engineering
tags: [golang, best-practices, validation, clean-code]
---

<div class="text-sm text-gray-500" style="line-height: 1.5; background: repeating-linear-gradient(-45deg, #f7fafc, #f7fafc 8px, #f1f5f9 8px, #f1f5f9 16px); padding: 0.7em 1em; border-radius: 6px;">
    This piece is an adapted summary of my internal knowledge-sharing initiatives at work.
</div>

When working with Go functions that accept multiple parameters, there's an interesting approach we can explore: using struct parameters instead of positional arguments. This technique can bring clearer code and structure to our function interfaces, especially as complexity grows.

## Introduction to Struct Parameters

Struct parameters offer an alternative approach where, instead of passing a long list of positional arguments, we pass a single struct containing all the necessary data. This becomes especially helpful when functions start to require many parameters—sometimes five, six, or even more—leading to unwieldy signatures like:

### Before: Positional Parameters
```go
func CreateUser(name, email, age int, isActive bool, role string) error {
    // implementation
}

// Usage - with several parameters, it's easy to lose track of what each value means
err := CreateUser(
    "John",
    "john@example.com",
    30,
    true,
    "admin",
)
```
As the number of parameters grows, it becomes increasingly difficult to keep track of what each value represents, making the code harder to read and maintain.

### After: Struct Parameters
```go
type CreateUserParams struct {
    Name     string
    Email    string
    Age      int
    IsActive bool
    Role     string
}

func CreateUser(params CreateUserParams) error {
    // implementation
}

// Usage - struct parameters provide much clearer context
err := CreateUser(CreateUserParams{
    Name:     "John",
    Email:    "john@example.com",
    Age:      30,
    IsActive: true,
    Role:     "admin",
})
```

The struct approach makes the code more self-documenting, as field names provide immediate context about what each value represents. This can be particularly valuable during code reviews, where reviewers can quickly understand the intent and spot any potential issues more easily. The built-in documentation aspect is another benefit - struct fields can include comments and tags, giving us better IDE support with autocomplete and parameter hints.

However, this approach does introduce some additional overhead. We need to define structs for each function, which means more boilerplate code. There's also a learning curve as the team adopts these new patterns, and we need to maintain consistency in struct naming and conventions across the codebase. Of all, one notable downside of struct parameters is that, because struct fields have zero values by default, all parameters become effectively optional. This can unintentionally allow incomplete or invalid data to slip through, unlike positional parameters where required arguments are enforced by the function signature.

This challenge, though, can be addressed by introducing explicit validation logic for the struct fields—turning this potential pitfall into an opportunity for more robust input checking, as discussed in the next section.

## Validation as a Natural Extension

This is where struct parameters become particularly interesting—they naturally encourage better validation practices. By using struct parameters, we can take advantage of Go's struct tags to define validation rules directly on each field. This enables us to leverage popular libraries like [`go-playground/validator/v10`](https://github.com/go-playground/validator) for declarative, reusable validation logic.

Struct tags make it easy to specify constraints such as required fields, length limits, or format checks, keeping validation rules close to the data they apply to. This approach can also significantly reduce the amount of repetitive `if` statements you need to write for manual validation, leading to cleaner and more maintainable code.

### Validation at the Boundary

```go
type CreateUserParams struct {
    Name     string `validate:"required,min=2,max=50"`
    Email    string `validate:"required,email"`
    Age      int    `validate:"required,min=18,max=120"`
    IsActive bool
    Role     string `validate:"required,oneof=admin user guest"`
}

func (p CreateUserParams) Validate() error {
    // Implement validation logic
    if p.Name == "" {
        return fmt.Errorf("name is required")
    }
    if p.Email == "" {
        return fmt.Errorf("email is required")
    }
    // ... more validations
    return nil
}

func CreateUser(params CreateUserParams) error {
    if err := params.Validate(); err != nil {
        return fmt.Errorf("invalid parameters: %w", err)
    }
    
    // implementation
}
```

## The Value of More Frequent Validation

Implementing more frequent validation brings several advantages. Following the fail-fast principle, we can catch issues at the entry point rather than deep in the logic, providing clearer and more actionable error messages. This approach also helps prevent invalid data from propagating through the system, making debugging much more straightforward since we know exactly where validation failed.

Additionally, frequent validation acts as a safeguard against unexpected or malformed input from external users or systems. By validating inputs early, we reduce the risk of downstream errors and ensure that only well-formed data enters our core logic, improving the overall reliability and security of our applications.

## Managing Unavoidable: Runtime Checks instead of Statically Checked

With positional parameters, the compiler can enforce that all required arguments are provided, offering a form of static validation at compile time. In contrast, struct parameters make all fields optional by default, so missing or invalid data is only caught at runtime through explicit validation. While this shifts some safety checks from compile time to runtime, the risk is manageable if the module is using the validation correctly plus already well covered by unit tests. As long as validation logic is thoroughly tested, the benefits of clearer code and maintainability usually outweigh this trade-off.

## When to Use Struct Parameters

### Good Candidates
- Functions with 4+ parameters
- Functions called frequently in different contexts
- APIs and public interfaces
- Configuration-heavy functions
- Functions juggling with many validation criteria of its input

### When to Avoid
- Simple functions with 1-3 parameters
- Internal utility/helper functions, where the added complexity of a struct isn't justified and simplicity is preferred

## Best Practices

1. **Consistent Naming**: Use `*Params` suffix for parameter structs
2. **Validation Methods**: Implement `Validate() error` method on param structs
3. **Documentation**: Add comments to struct fields explaining constraints
4. **Zero Values**: Be explicit about what zero values mean
5. **Backwards Compatibility**: Consider versioning for public APIs

## Conclusion

Struct parameters combined with frequent validation create a robust foundation for maintainable Go code. While there's an initial investment in setup and learning, the benefits of clearer code, better error handling, and improved maintainability typically outweigh the costs.

The key is to start small - try this pattern with new functions first, and gradually refactor existing code where it provides clear value. Remember that the goal is better code quality and developer experience, not just following a pattern for its own sake.

---
layout: post
title: React Component Maintainability Cookbook
date: 2026-08-06 00:00:00 +0000
highlighted: false
tags: [react, maintainability, refactoring, clean-code, cookbook]
---

This is my cookbook. When a component starts feeling hard to read or hard to maintain, I open this, find the symptom in the glossary, and follow the recipe.

## 1. The standard

Readable is a property of today. Maintainable is a property of next week, next person, next feature. Two different questions: "Can I read this?" and "Is it safe to change this?" Judge every component by the second one.

## 2. Triage — run this first

**Symptom.** You can't list what the file does in one sentence each. Handlers reference each other's state.

**Diagnosis.** Run these in order. First yes wins.

1. Same markup repeated? → extract a component.
2. Logic that doesn't touch React? → extract a pure function.
3. Handlers tangling each other's state? → extract a hook.
4. Boolean modes everywhere? → variants or composition.
5. States that can't happen, possible? → union types or a reducer.
6. Data drilled through layers? → compose, then context.
7. Slow renders? → memo, split, virtualize.

## 3. Techniques — how to apply fixes

### The fix ladder

Choose the lowest rung that works: function → component → hook → reducer → context → library.

Before writing any hook, run the test: does this touch React state, effects, or refs? No → it's a plain function. Most logic doesn't touch React at all.

### The extraction pass

Use this whenever you wall off a feature.

1. Name the features.
2. Find the islands: features whose state no one else touches.
3. Extract the islands first. Cheapest, zero risk.
4. One commit path: a value and its mirrors get written in one function, not ten.
5. Refs have one owner: two features touching one ref means extract one of them.

## 4. The recipes

### Size and structure

#### God component

**Symptom.** Many features piled into one file. The component has a long name for what is really a collection of unrelated behaviors.

**Fix.** Name the features. Extract the islands first, cheapest first. Do not extract features that aren't tangled. Walls around empty rooms are clutter. Use the extraction pass.

**Found.** AnnotationInput: 8 features in 395 lines. The extraction is in the ref soup recipe.

#### Mixed layers

**Symptom.** DOM math, state logic, and JSX all in one flat function. The hardest code in the file is buried mid-function between useState calls.

**Fix.** Extract logic that doesn't touch React into pure function modules. Cheap, testable, zero overhead.

**Found.** The caret-mirror measurement (caretContentTop, caretEdgeLines) was pure DOM math sitting inside AnnotationInput. It was already functions. The fix was moving it out with its feature, not converting it to a hook.

#### Duplication

**Symptom.** Two files that are 95% identical.

**Fix.** One component, one variant prop. Check the sibling files first, always. The cheapest find in any codebase is duplication.

**Found.** SectionHeaderBroken and SectionHeaderRemoved, 95 lines each, 95% identical. Same confirming state, same outside-click effect, same handlers. Only the label and a CSS class differed. One variant prop replaces both.

### State

#### The ref soup

**Symptom.** The state of one feature gets mutated by handlers of another feature. A cancel button resets three other features' refs. You touch one feature and you have to check three others.

**Cause.** Nothing has walls between features, so every handler has to clean up everyone else's mess.

**Fix.** Run the extraction pass.

**Found.** AnnotationInput: five handlers mutated three refs (prevValueRef, historyIndexRef, draftRef) that belonged to one feature. The fix was one hook, not seven. The history feature moved out with its own refs and its own DOM hack. Five call sites became method calls. The file dropped to around 300 lines and the smell was gone. Score went from 5/10 to 7/10. The drag-resize and snippet-trigger features stayed inline. They weren't tangled.

#### Impossible states

**Symptom.** Flags allow combinations that can't happen. isLoading && isError is a valid value in the type system but a lie in the domain.

**Fix.** Union types / discriminated unions. One status field with legal values beats five booleans. If the state has transitions (can't cancel while saving), use a reducer with explicit transitions, not flags.

#### Derived state stored

**Symptom.** Computed values kept in state, needing sync logic to stay current.

**Fix.** Derive during render. useMemo only when the computation is expensive. Sync effects are a bug farm.

**Found.** Sidebar computed its groups and counts during render with useMemo. That was already correct. This recipe is the target, not a failure.

#### Write-only state

**Symptom.** A value is set but never read in that state. You can't trace any read of it.

**Fix.** Delete it. Trace the reads before the writes. If a value is never read before being overwritten, the write is dead code.

**Found.** After snippet select, draftRef was set to the new value, but the next read path always overwrites it from the textarea first. The write was unobservable. reset() was equivalent.

#### Set as state

**Symptom.** A Set in useState. Every update is new Set(prev), mutate, return. Awkward to update immutably.

**Fix.** Store as a record keyed by id, or use a reducer with explicit transitions (toggle, clear).

**Found.** Sidebar: selectedIds as Set<number>, expandedGroups as Set<string>. Both do the clone-mutate dance.

#### Two sources of truth

**Symptom.** A value prop plus direct DOM writes. The framework controls the value, a handler writes the DOM node directly.

**Fix.** One source of truth. Route every write through the state setter. Direct DOM writes fight the framework and break silently the day a value transform or re-render guard appears.

**Found.** AnnotationInput's recallHistory wrote ta.value directly while the textarea was controlled by value={value}.

#### Hidden globals

**Symptom.** A module-level mutable singleton. Created once, appended to the document, never removed. Breaks if a second instance ever mounts.

**Fix.** Instance-scope it: hold it in a ref, create on demand, remove in an effect cleanup on unmount.

**Found.** AnnotationInput's caretMirror: appended to document.body once, never removed. Worked only because the component never unmounted. It would leak the day it did.

### API and data flow

#### Boolean prop explosion

**Symptom.** isX, isY flags piling up on props or derived internally, driving conditional markup in every branch.

**Fix.** Variants or composition instead of flags. When a component has real modes (normal, deleted, broken), make the mode a variant, not three booleans.

**Found.** EntryAnnotation: isDeleted, isBroken, expanded, selected all driving the same markup. The deleted and broken action-button groups are near-identical and duplicated across the header and expanded body. Extract the action set, compute it once from the status variant.

#### Prop drilling

**Symptom.** Data passed down through layers of components that only forward it.

**Fix.** Composition first: pass the rendered element, not the data. Context only when many components at different depths need the same value. Context for everything is a trap.

### Testing

#### Untestable logic

**Symptom.** The clever stuff (time bucketing, label formatting, filtering) is trapped inside JSX or handlers. You can't test it without rendering the whole component.

**Fix.** Extract pure function modules. Unit test them directly.

**Found.** Sidebar's recent-groups time bucketing ("Just now", "Today", "This week", "Other") is pure logic inside the component. It belongs in a module with tests.

## 5. The rules — prevention, not repair

- When a component feels all over the place, remove before you add.
- Never put a whole hook object in a dependency array. It's a new object every render. Destructure the stable callbacks and depend on those.
- Extract at the second or third copy. One copy is fine. Two is the signal. Three is the obligation.
- A hook that wraps one line of state is worse than the inline code.

## 6. Glossary — symptom to fix

- Can't list what the file does → Triage (the 7 questions)
- Handlers touch each other's state → The ref soup
- Two nearly-identical files → Duplication
- Too many features in one file → God component
- isX/isY flags everywhere → Boolean prop explosion
- Illegal states are representable → Impossible states
- Data drilled through layers → Prop drilling
- DOM math + logic + JSX in one function → Mixed layers
- Module-level singleton → Hidden globals
- Set but never read → Write-only state
- Computed value stored → Derived state stored
- Logic trapped in JSX → Untestable logic
- Set in state → Set as state
- Controlled + direct DOM writes → Two sources of truth
- Effect re-runs every render → Rules: hook object in deps
- Same effect in many components → Rules: extract at 2nd/3rd copy
- Can't decide which tool → Techniques: the fix ladder

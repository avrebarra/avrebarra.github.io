---
layout: post
title: Why I Just Use POST for My REST Endpoints
description: Why I use post for all my restful endpoints
summary:
tags: [tech]
---

RESTful is a convention to make endpoint namings sensible.

To achieve this objective ([see here for more complete readings](https://restfulapi.net/resource-naming/)), the conventions suggests to name endpoints
as if it's a file directory, or use plural naming for most of the things, or make use of all HTTP methods to achieve semanti...

That one, that last one is what I had some issues with haha. Why? Actually it started from just one issue. It's a pain in the eye.

## Problem: It's not quite nice to see

Lookie lookie what I see.

```go
r.GET("/healthcheck", h.HandlePing())

r.GET("/users", h.HandleUsersFindMany())
r.GET("/users/:id", h.HandleUsersFindOne())
r.POST("/users/:id", h.HandleUsersCreate())
r.PUT("/users/:id", h.HandleUsersUpdate())
r.DELETE("/users/:id", h.HandleUsersDelete())

r.GET("/transactions", h.HandleTransactionsFindMany())
r.GET("/transactions/:id", h.HandleTransactionsFindOne())
r.POST("/transactions/:id", h.HandleTransactionsCreate())
r.PUT("/transactions/:id", h.HandleTransactionsUpdate())
r.DELETE("/transactions/:id", h.HandleTransactionsDelete())
```

See that? See how the endpoint part has juggly indents each. It happens in most backend libs I used in the past.
It will look worse on colorful IDEs. Its bit annoying to scan and find one endpoint among the bunch.

At first, I used to try creating helper functions to make the letter paddings equal. But in the end, I finally **preferred to just use POST on all my endpoints**, so the method has same character length, and so it looks like this.

```go
r.GET("/healthcheck", h.HandlePing())

r.POST("/users/find", h.HandleUsersFind())
r.POST("/users/create", h.HandleUsersCreate())
r.POST("/users/update", h.HandleUsersUpdate())
r.POST("/users/delete", h.HandleUsersDelete())

r.POST("/transactions/find", h.HandleTransactionsFind())
r.POST("/transactions/create", h.HandleTransactionsCreate())
r.POST("/transactions/update", h.HandleTransactionsUpdate())
r.POST("/transactions/delete", h.HandleTransactionsDelete())
```

Look bit nicer eh?

I found out, that this is a common thing to see especially when using RPC style designs. And also technically it doesn't really stray too far from REST because REST also has this thing called [Controller Resource Model](https://restfulapi.net/resource-naming/) (see section 2.1.4. controller).

Yes, I know I know, it sounds totally petty, but along the way I realized this way also had some good points too though.

## Advantage 1: It's bit nice to see

We talked about this.

## Advantage 2: Explicitly descriptive as you want it to be

I think we can agree that we love our code to be as explicit as possible.
No hidden meaning. No additional docs to read. No additional links to click.
We know it when I read it.

Yes the reason we agreed on RESTful rules is to make things readable and descriptive. But I find that the excessive usage of GET/POST/PUT kinda made some, especially junior, developer made things even weirder.

I'm talking about some routes like: `GET /authors/A/books/borrowers/, GET /accounts/resetpassword/getoptions, POST /accounts/resetpassword`

Using POST/RPC model is empowering as you can make an endpoint as long as you want until it make a sense.

## Advantage 3: Less brainpower used when designing complex endpoints

Say we're designing a book library system. We have these resources: authors, books, borrowers.

Now say we want and endpoint to find which borrowers borrows book by author A.

Which to choose:

```bash
GET /authors/A/books/borrowers/ // I added this because I used to see this mess
GET /authors/A/borrowers/
GET /books/borrowers/?author=A
```

Using RPC model we can just do:

```bash
POST /borrowers/find-by-author-id-of-from-borrowed-books
```

Longer yes, but explicit to the API designer and explicit to the API consumer.

## Closing

Yes, after all the justifications, I know it still sounds totally petty, but that's just a five cent of what I think.

No, I'm not advising to ditch RESTful conventions. I will always gladly use RESTful if it's
really required by code conventions that's working nicely. But if I can start from scratch
I think I like this RPC style more than REST.

Boa Noite. Ciao~

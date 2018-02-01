To run this example app:

```bash
git clone https://github.com/Alorel/express-decorated-router
cd express-decorated-router
cd example
npm install
npm start
```

    ┌─────────────────────────────┬───────────────────────────────────────────────────────────────────────────────┐
    │            Path             │                                  Description                                  │
    ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
    │GET /user                    │List all the user stubs.                                                       │
    ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
    │GET /user/:id                │Get a single user. The users have the following stub IDs: "foo", "bar". Any    │
    │                             │other ID will return 404.                                                      │
    ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
    │POST /user                   │Simulate creating a user. Return the JSON payload sent with the request.       │
    ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
    │                             │                                                                               │
    ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
    │GET /blog                    │Get the fanciest blog homepage HTML payload in the world.                      │
    ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
    │                             │                                                                               │
    ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
    │POST /blog/comments          │Simulate creating a comment. Return the JSON payload sent with the request.    │
    ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
    │DELETE /blog/comments/:id    │Simulate deleting a comment. Valid stub IDs are "foo" and "bar"; other IDs will│
    │                             │return 404.                                                                    │
    ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
    │GET /blog/comments           │Get a list of comments.                                                        │
    ├─────────────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
    │GET /blog/comments/:id       │Get a single comment. Valid stub IDs are "foo" and "bar"; other IDs will return│
    │                             │404.                                                                           │
    └─────────────────────────────┴───────────────────────────────────────────────────────────────────────────────┘

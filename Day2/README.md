# Day 2 — MongoDB, Authentication & Node.js Streams

## Overview

Second day of the Huma Volve backend training. Covered building a full User CRUD API with MongoDB and Mongoose, JWT-based authentication and role-based authorization, structured error handling, query/route parameters, and Node.js Streams for file copying.

## Structure

```
Day2/
├── user-api/          # Express + MongoDB REST API (Tasks 1–10)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env            (not committed)
│   ├── .gitignore
│   ├── app.js
│   └── package.json
└── streams/            # Node.js fs Streams practice (Tasks 11–12)
    ├── source.txt
    ├── task11_manualStream.js
    └── task12_pipe.js
```

## Contents

- [`assignment_submission.md`](./assignment_submission.md) — Full write-up of all 12 tasks (implementation notes, endpoints, screenshots)
- [`user-api/`](./user-api) — Express.js REST API for Users with MongoDB Atlas
- [`streams/`](./streams) — File copy implementations using Node.js Streams (manual chunks and `.pipe()`)

## What I Learned

- Connecting to MongoDB Atlas with Mongoose, defining Schemas/Models, and running CRUD operations (`find`, `create`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`)
- Structuring an Express project with the MVC pattern (config / models / controllers / routes / middleware / utils)
- Schema-level validation with the `validator` package, plus handling Mongoose `ValidationError` and MongoDB duplicate-key errors (code `11000`)
- Password hashing with `bcrypt` via a Mongoose `pre('save')` hook
- JWT authentication: separate access/refresh tokens, secrets, and expiration times, stored in `httpOnly` cookies with `secure`/`sameSite` configuration
- Authentication middleware (`protect`) vs. authorization middleware (`authorize('admin')`), and the difference between `401` and `403`
- Preventing a refresh token from being used as an access token via a `type` field in the JWT payload
- Granular error handling: invalid MongoDB ObjectIds (`CastError`), expired vs. invalid tokens (`TokenExpiredError` vs `JsonWebTokenError`)
- `req.params` vs `req.query`, and why data added to a schema after documents already exist needs a backfill migration
- Node.js Streams: reading/writing files in chunks manually vs. using `.pipe()`

## Testing

All API endpoints were tested using Postman, including authenticated/unauthenticated and authorized/unauthorized scenarios — see `assignment_submission.md` for details and screenshots.

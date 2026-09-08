# Day 2 Assignment Submission — MongoDB, Authentication & Streams

**Name:** Khaled
**Date:**

---

## Task 1 – User CRUD API

Built a REST API for Users using Express.js and MongoDB Atlas (Mongoose).

- `GET /users` — get all users
- `GET /users/:id` — get user by ID
- `POST /users` — create user
- `PUT /users/:id` — update user
- `DELETE /users/:id` — delete user

Code: [`user-api/models/User.js`](./user-api/models/User.js), [`user-api/controllers/userController.js`](./user-api/controllers/userController.js), [`user-api/routes/userRoutes.js`](./user-api/routes/userRoutes.js)

**Postman testing screenshots:**

![Task 1 tests](./screenshots/task1.png)

---

## Task 2 – Project Structure

Reorganized the project into an MVC-style structure:

```
config/   → database connection
models/   → Mongoose schemas
controllers/ → route logic
routes/   → route definitions
```

Code: [`user-api/config/db.js`](./user-api/config/db.js)

---

## Task 3 – User Data Validation

Used the `validator` package to validate name, email, and password on the User schema. Email is enforced as unique. All validation errors are collected and returned together in a single JSON response with status `400`. Duplicate email errors (MongoDB code `11000`) are handled separately.

Code: [`user-api/models/User.js`](./user-api/models/User.js)

**Postman testing screenshots:**

![Task 3 tests](./screenshots/task3.png)

---

## Task 4 – Authentication

Implemented registration, login, password hashing (`bcrypt`), access/refresh JWT generation, an authentication middleware, refresh token flow, and logout. Passwords are never returned in any response.

Code: [`user-api/controllers/authController.js`](./user-api/controllers/authController.js), [`user-api/middleware/authMiddleware.js`](./user-api/middleware/authMiddleware.js), [`user-api/utils/generateTokens.js`](./user-api/utils/generateTokens.js)

**Postman testing screenshots:**

![Task 4 tests](./screenshots/task4.png)

---

## Task 5 – Authentication Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/logout`

Code: [`user-api/routes/authRoutes.js`](./user-api/routes/authRoutes.js)

---

## Task 6 – JWT Cookies

Access and refresh tokens are stored in `httpOnly` cookies with `secure` (enabled in production only) and `sameSite: 'strict'` configured. Refresh token expiration (7 days) is longer than access token expiration (15 minutes). A `type` field (`access` / `refresh`) in the JWT payload prevents a refresh token from being accepted as an access token.

**Postman testing screenshots:**

![Task 6 tests](./screenshots/task6.png)

---

## Task 7 – Role-Based Authorization

Added a `role` field (`user` / `admin`, default `user`) to the User schema. Created an `authorize(...allowedRoles)` middleware factory. Restricted the delete-user endpoint to admins only. Unauthorized role access returns `403 Access Denied`.

Code: [`user-api/middleware/roleMiddleware.js`](./user-api/middleware/roleMiddleware.js)

**Postman testing screenshots:**

![Task 7 tests](./screenshots/task7.png)

---

## Task 8 – Protected User Routes

All user routes (`GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`) require a valid access token verified from the `accessToken` HTTP cookie via the `protect` middleware.

Code: [`user-api/routes/userRoutes.js`](./user-api/routes/userRoutes.js)

---

## Task 9 – Error Handling

Added consistent JSON error responses for: invalid MongoDB ObjectId (`CastError` → `400`), user not found (`404`), duplicate email (`400`), invalid email / weak password / missing fields (Mongoose `ValidationError` → `400`), invalid vs. expired access token, invalid vs. expired refresh token, unauthorized (`401`), forbidden (`403`), and invalid login credentials (`401`).

---

## Task 10 – Query & Route Parameters

**`req.params`** — part of the URL path itself, defined in the route with `:name` (e.g. `/users/:id` → `req.params.id`). Used to identify a single specific resource.

**`req.query`** — key/value pairs after `?` in the URL (e.g. `/users?role=admin` → `req.query.role`). Optional, used for filtering/searching/sorting.

- Route parameter example: `GET /users/:id`
- Query parameter example: `GET /users?role=user` (filters users by role)

Also fixed a bug where users created before the `role` field was added didn't have it persisted in the database, so they were excluded from `role`-filtered queries — backfilled with `User.updateMany({ role: { $exists: false } }, { $set: { role: 'user' } })`.

**Postman testing screenshots:**

![Task 10 tests](./screenshots/task10.png)

---

## Task 11 – File Copy Using Streams

Implemented a manual file copy using Node.js Streams and chunks. `fs.createReadStream()` reads `source.txt` in chunks; each `data` event writes the received chunk to `destination.txt` via `writeStream.write()`. The `end` event closes the write stream (`writeStream.end()`), and `error` events are handled on both streams. Verified destination content matches source content using `Get-FileHash` on both files.

Code: [`streams/task11_manualStream.js`](./streams/task11_manualStream.js)

---

## Task 12 – File Copy Using Pipe

Implemented the same file copy using `.pipe()`: `fs.createReadStream('source.txt').pipe(fs.createWriteStream('destination_pipe.txt'))`. This automatically handles reading, writing, and closing the streams. Handled `error` events on both streams and the `finish` event on the write stream to confirm the copy completed. Verified destination content matches source content using `Get-FileHash` on both files.

Code: [`streams/task12_pipe.js`](./streams/task12_pipe.js)

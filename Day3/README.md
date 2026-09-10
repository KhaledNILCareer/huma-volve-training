# Day 3 — Product Management

## Overview

This project implements a Product Management API using Node.js, Express, MongoDB Atlas, and Mongoose. It combines CRUD operations, MongoDB transactions, error handling, and Gemini AI integration.

The main requirement is to create a Product and its initial Inventory as one atomic operation: both records are committed together, or both are rolled back if Inventory creation fails.

Gemini AI integration is intentionally separated from the Product + Inventory transaction. It only generates suggested product information and does not write to the database.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Google Gemini API via `@google/genai`
- dotenv

The project also keeps the authentication/user code inherited from the previous Day 2 API.

## Project Structure

```text
product-api/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   └── userController.js
├── middleware/
├── models/
│   ├── Inventory.js
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── services/
│   └── geminiService.js
├── utils/
├── app.js
└── package.json
```

## Product & Inventory Models

### Product

The Product model stores:

- `name` — required
- `description`
- `category`
- `price` — required

### Inventory

The Inventory model stores:

- `product` — ObjectId reference to Product, required and unique
- `quantity` — defaults to `0` and cannot be negative

The unique Product reference represents the current one-to-one Product → Inventory design.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/products` | Create Product + initial Inventory atomically |
| GET | `/products` | Get all Products |
| GET | `/products/:id` | Get a Product by ID |
| PUT | `/products/:id` | Update a Product |
| DELETE | `/products/:id` | Delete a Product and its related Inventory |
| POST | `/products/ai-generate` | Generate description and category using Gemini |

## Create Product Transaction

`POST /products` starts a Mongoose session and MongoDB transaction.

```text
Start Transaction
      ↓
Create Product
      ↓
Create Inventory
      ↓
    Success?
   /        \
 Yes        No
  ↓          ↓
COMMIT    ROLLBACK
```

Both `Product.create()` and `Inventory.create()` receive the same session.

If Inventory validation fails, the transaction is aborted and the Product is not persisted. This prevents a Product from existing without its initial Inventory.

Example request:

```json
{
  "name": "Laptop",
  "description": "A powerful laptop",
  "category": "Electronics",
  "price": 1000,
  "quantity": 50
}
```

A rollback was tested using an invalid negative Inventory quantity.

## Product Deletion

Product deletion also uses a transaction to keep the Product and its Inventory consistent:

```text
Find Product
    ↓
Delete Inventory
    ↓
Delete Product
    ↓
COMMIT
```

If an error occurs during the transaction, the changes are rolled back.

## Gemini AI Integration

Endpoint:

```http
POST /products/ai-generate
```

Input:

```json
{
  "name": "Gaming Laptop",
  "shortDescription": "Powerful laptop for gaming and heavy workloads"
}
```

The controller calls a separate `geminiService`, which requests structured JSON output from Gemini.

Example response:

```json
{
  "success": true,
  "data": {
    "description": "Powerful laptop designed for gaming and heavy workloads...",
    "category": "Electronics"
  }
}
```

The AI flow is separate from product creation:

```text
Name + Short Description
          ↓
       Gemini
          ↓
Description + Category
          ↓
    HTTP Response
```

It does not create or update Product or Inventory records and is not part of the MongoDB transaction.

## Environment Variables

Create a `.env` file and provide the required values used by the project, including:

```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Keep `.env` out of version control.

## Installation

```bash
npm install
```

Run the application using the project's Node.js entry point:

```bash
node app.js
```

Then test the endpoints using Postman or another API client.

## Key Concepts Practiced

- CRUD operations
- Mongoose schemas and models
- ObjectId references
- MongoDB sessions and transactions
- Atomic operations
- Commit and rollback
- Validation and error handling
- AI/API integration
- Structured AI output
- Separation of responsibilities

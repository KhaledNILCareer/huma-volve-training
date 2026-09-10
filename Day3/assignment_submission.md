# Day 3 — Assignment Submission

## Task

**Product Management — CRUD + Database Transactions + AI Integration**

## Implementation Summary

The Product Management API was implemented with Product and Inventory models, full Product CRUD operations, MongoDB transactions, and a separate Gemini AI integration.

## 1. Product + Initial Inventory Transaction

Implemented:

```http
POST /products
```

The endpoint performs the following operations inside one MongoDB transaction:

```text
Create Product
      ↓
Create Initial Inventory
      ↓
COMMIT
```

If Product creation succeeds but Inventory creation fails:

```text
Create Product
      ↓
Inventory Fails
      ↓
ROLLBACK
```

Both database operations use the same Mongoose session, so the Product and its initial Inventory are treated as one atomic operation.

### Rollback Verification

The Inventory schema rejects negative quantities. A request with a valid Product and a negative Inventory quantity was used to force Inventory validation to fail.

Result:

- Inventory creation failed.
- The transaction was aborted.
- The Product was not persisted in MongoDB.

This verifies the required rollback behavior.

## 2. Product CRUD

The following Product operations were implemented:

| Method | Endpoint | Status |
|---|---|---|
| POST | `/products` | Implemented |
| GET | `/products` | Implemented |
| GET | `/products/:id` | Implemented |
| PUT | `/products/:id` | Implemented |
| DELETE | `/products/:id` | Implemented |

The update endpoint runs Mongoose validators and returns the updated document.

The delete endpoint additionally removes the related Inventory inside a transaction to avoid leaving an orphaned Inventory record.

## 3. Gemini AI Integration

Implemented:

```http
POST /products/ai-generate
```

Input:

- `name`
- `shortDescription`

Output:

- `description`
- `category`

Example input:

```json
{
  "name": "Gaming Laptop",
  "shortDescription": "Powerful laptop for gaming and heavy workloads"
}
```

Example output:

```json
{
  "success": true,
  "data": {
    "description": "Powerful laptop designed for gaming and heavy workloads, featuring high-performance components.",
    "category": "Electronics"
  }
}
```

Gemini is integrated through a separate service:

```text
productController
       ↓
geminiService
       ↓
Gemini API
```

Structured JSON output is requested from Gemini so the backend can reliably consume the generated `description` and `category`.

## 4. Separation of Responsibilities

The two flows are intentionally separate.

### Database Flow

```text
POST /products
      ↓
Product + Inventory Transaction
      ↓
COMMIT / ROLLBACK
```

### AI Flow

```text
POST /products/ai-generate
      ↓
Gemini API
      ↓
Description + Category
```

The Gemini service does not create Product or Inventory records and is not included in the Product creation transaction.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- `@google/genai`
- Gemini API
- dotenv
- Postman for API testing

## Tested Scenarios

- Successful Product + Inventory creation
- Inventory validation failure and Product rollback
- Get all Products
- Get Product by ID
- Product not found
- Invalid Product ObjectId
- Product update with validation
- Product + Inventory deletion
- Gemini generation with valid input
- Missing Gemini input validation

## Result

The required Product Management flow is implemented: Product and initial Inventory creation are atomic, rollback behavior is verified, CRUD operations are available, and Gemini AI generation remains completely separate from the database transaction.

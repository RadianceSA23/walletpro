# Low Level Design (LLD) Specification

## 1. Clean Architecture Layers

```
                             [ HTTP Request ]
                                    |
                                    v
                     +------------------------------+
                     |         Controller           |
                     |  - Endpoints & Swagger       |
                     |  - Uses DTOs & Validation    |
                     +--------------+---------------+
                                    |
                                    v
                     +------------------------------+
                     |          Service             |
                     |  - Business Logic & Rules    |
                     |  - Aggregations & Calcs      |
                     +--------------+---------------+
                                    |
                                    v
                     +------------------------------+
                     |         Repository           |
                     |  - Database Abstraction      |
                     |  - Decoupled from ODM        |
                     +--------------+---------------+
                                    |
                                    v
                     +------------------------------+
                     |     Mongoose Schema / DB     |
                     +------------------------------+
```

---

## 2. Database Collection Schemas & Data Models

### 2.1 `UserSchema` (`users` collection)
```typescript
interface IUser {
  _id: Types.ObjectId;
  email: string; // unique, indexed, trimmed, lowercased
  passwordHash: string; // bcrypt hash (salt rounds = 10)
  firstName: string;
  lastName: string;
  currency: string; // e.g. "USD", "EUR", "INR"
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.2 `RefreshTokenSchema` (`refresh_tokens` collection)
```typescript
interface IRefreshToken {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // indexed, ref: User
  tokenHash: string; // bcrypt hash of token string
  expiresAt: Date; // TTL index (expireAfterSeconds: 0)
  isRevoked: boolean;
  createdAt: Date;
}
```

### 2.3 `CategorySchema` (`categories` collection)
```typescript
enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

interface ICategory {
  _id: Types.ObjectId;
  userId?: Types.ObjectId; // null for system categories, indexed
  name: string;
  type: CategoryType;
  color: string; // Hex color e.g. "#FF5733"
  icon: string; // Lucide icon identifier e.g. "shopping-bag"
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.4 `ExpenseSchema` (`expenses` collection)
```typescript
enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  OTHER = 'OTHER'
}

interface IExpense {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // indexed, ref: User
  categoryId: Types.ObjectId; // ref: Category
  amount: number; // minimum: 0.01
  title: string;
  description?: string;
  date: Date; // indexed
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { userId: 1, date: -1 }, { userId: 1, categoryId: 1 }
```

### 2.5 `IncomeSchema` (`incomes` collection)
```typescript
interface IIncome {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // indexed, ref: User
  categoryId: Types.ObjectId; // ref: Category
  amount: number; // minimum: 0.01
  title: string;
  description?: string;
  date: Date; // indexed
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { userId: 1, date: -1 }, { userId: 1, categoryId: 1 }
```

---

## 3. Standard API Response Structure

All HTTP endpoints return responses formatted as follows:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-07-26T10:00:00.000Z"
}
```

Standard Error format:

```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["amount must be a positive number", "title should not be empty"],
  "timestamp": "2026-07-26T10:00:00.000Z",
  "path": "/api/v1/expenses"
}
```

---

## 4. Frontend State & Interceptor Management

- **Axios Interceptor**: Intercepts `401 Unauthorized` errors. Attempts to invoke `/auth/refresh` using stored refresh token. If successful, updates access token header and replays original failed request transparently. If refresh fails, purges session and redirects to `/login`.
- **Query Cache**: Uses TanStack Query (`staleTime: 5 * 60 * 1000`) for non-mutating list queries (`categories`, `dashboard analytics`), invalidating query keys on creation or modification.

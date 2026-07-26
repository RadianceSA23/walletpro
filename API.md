# REST API Contract Specification

Base URL: `http://localhost:5000/api/v1`  
Swagger UI: `http://localhost:5000/api/docs`

---

## 1. Auth Module (`/auth`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new user account |
| `POST` | `/auth/login` | Public | Authenticate user, return access & refresh tokens |
| `POST` | `/auth/refresh` | Public | Exchange refresh token for new access token |
| `POST` | `/auth/logout` | Bearer | Revoke current refresh token |
| `GET` | `/auth/me` | Bearer | Get current authenticated user profile |

---

## 2. Categories Module (`/categories`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | Bearer | List all system & user-created categories |
| `POST` | `/categories` | Bearer | Create a new custom category |
| `PATCH` | `/categories/:id` | Bearer | Update existing user category |
| `DELETE` | `/categories/:id` | Bearer | Delete non-system user category |

---

## 3. Expense Module (`/expenses`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/expenses` | Bearer | List expenses with pagination & filters |
| `POST` | `/expenses` | Bearer | Create a new expense record |
| `GET` | `/expenses/:id` | Bearer | Fetch single expense details |
| `PATCH` | `/expenses/:id` | Bearer | Update an expense record |
| `DELETE` | `/expenses/:id` | Bearer | Delete an expense record |

### Query Parameters for `GET /expenses`:
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string)
- `categoryId` (string)
- `startDate` (ISO string)
- `endDate` (ISO string)
- `sortBy` (string, default: "date")
- `sortOrder` ("asc" | "desc", default: "desc")

---

## 4. Income Module (`/incomes`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/incomes` | Bearer | List income records with pagination & filters |
| `POST` | `/incomes` | Bearer | Create a new income record |
| `GET` | `/incomes/:id` | Bearer | Fetch single income record details |
| `PATCH` | `/incomes/:id` | Bearer | Update an income record |
| `DELETE` | `/incomes/:id` | Bearer | Delete an income record |

---

## 5. Dashboard & Analytics (`/dashboard`, `/reports`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/summary` | Bearer | Get KPI totals (Income, Expense, Net Savings, MoM growth) |
| `GET` | `/dashboard/recent` | Bearer | Get recent 10 transactions (Incomes + Expenses) |
| `GET` | `/reports/category-breakdown` | Bearer | Get expense total percentages grouped by category |
| `GET` | `/reports/monthly-trend` | Bearer | Get monthly time-series income vs expense breakdown |

---

## 6. Health & System (`/health`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | System status, database connection, uptime metrics |

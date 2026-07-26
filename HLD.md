# High Level Design (HLD) Specification

## 1. Executive Summary

The **Expense Tracker SaaS** system provides multi-tenant personal and business financial lifecycle management. The application tracks income, operational expenses, categorizes transactional line-items, and aggregates statistical analytics to provide user financial visibility.

This system is engineered for scalability, high availability, zero-trust security boundaries, and modular micro-service clean architecture.

---

## 2. System Architecture Topology

```
+-----------------------------------------------------------------------------------+
|                                  USER / CLIENT LAYER                              |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                     React 19 SPA (Vite + TailwindCSS + TanStack)            |  |
|  +-----------------------------------------------------------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | HTTPS (TLS 1.3)
                                           v
+-----------------------------------------------------------------------------------+
|                                 EDGE & INGRESS LAYER                              |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                     Nginx Reverse Proxy & SSL Termination                   |  |
|  |       - Rate Limiting (100 req/min/IP)   - Security Headers (Helmet/CORS)    |  |
|  +-----------------------------------------------------------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | HTTP / REST
                                           v
+-----------------------------------------------------------------------------------+
|                                 API GATEWAY / APPLICATION LAYER                   |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                           NestJS API Gateway                                |  |
|  |  +-------------------+  +-------------------+  +-------------------------+  |  |
|  |  | Auth Module       |  | Expense Module    |  | Income Module           |  |  |
|  |  +-------------------+  +-------------------+  +-------------------------+  |  |
|  |  | Category Module   |  | Dashboard Module  |  | Reports Module          |  |  |
|  |  +-------------------+  +-------------------+  +-------------------------+  |  |
|  +-----------------------------------------------------------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | Mongoose ODM (MongoDB Wire Protocol)
                                           v
+-----------------------------------------------------------------------------------+
|                                 PERSISTENCE LAYER                                 |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                           MongoDB Atlas Cluster                             |  |
|  |       - Primary Document Store              - Secondary Replicas           |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Component Responsibilities

### 3.1 Ingress / Nginx Proxy
- Enforces HTTP to HTTPS TLS redirection.
- Handles rate-limiting at network boundary before application runtime.
- Proxies `/api/v1/*` endpoints directly to NestJS server instance (`:5000`).
- Serves static compiled React assets directly from memory/disk cache with `Cache-Control` headers.

### 3.2 NestJS API Core Application
- **Global Pipes**: Performs payload verification using `ValidationPipe` backed by `class-validator` (rejects unallowed properties with `whitelist: true`).
- **Global Filters**: Intercepts uncaught standard and database exceptions (`AllExceptionsFilter`) and maps them to standardized error JSON payloads.
- **Global Interceptors**: Wraps all outgoing responses in standardized JSON contracts (`TransformInterceptor`).
- **Guards**: `JwtAuthGuard` checks Bearer headers, decodes claims, verifies revocation status via `RefreshTokenRepository`, and attaches identity to `req.user`.

### 3.3 Persistence Layer (MongoDB Atlas)
- Stores domain documents across `users`, `categories`, `expenses`, `incomes`, and `refresh_tokens`.
- Employs compound indexes on `{ userId: 1, date: -1 }` for sub-millisecond transaction query execution.
- Employs TTL indexes on `refresh_tokens.expiresAt` for automatic DB purge of expired tokens.

---

## 4. Key Cross-Cutting Concerns

1. **Security & Authentication**: Dual JWT architecture with access token expiration of 15 minutes and refresh token expiration of 7 days (stored as bcrypt hash in DB).
2. **Observability & Logging**: Context-bound JSON logging via Winston (Console + Rotating File Transports for `error.log` and `combined.log`).
3. **Resilience**: Stateless API servers allowing horizontal auto-scaling behind load balancers.

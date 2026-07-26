# System Architecture & Technical Rationale

## Core Design Principles

### 1. SOLID Design Principles
- **Single Responsibility Principle (SRP)**: Controllers only map requests/responses. Services contain pure business logic. Repositories handle database connectivity.
- **Open/Closed Principle (OCP)**: Security strategies and guards are extensible via NestJS Providers without modifying core controller logic.
- **Liskov Substitution Principle (LSP)**: Repositories implement abstract interfaces, allowing Mongoose ODM to be swapped or mocked in unit tests cleanly.
- **Interface Segregation Principle (ISP)**: Feature-specific DTOs define strictly required payload shapes for each endpoint.
- **Dependency Inversion Principle (DIP)**: Services depend on Repository abstractions rather than concrete Mongoose Model instances directly.

---

## Technical Rationale

| Layer / Tech | Choice | Rationale |
| :--- | :--- | :--- |
| **Backend Framework** | NestJS | Enterprise TS support, native Dependency Injection, modular architecture, built-in Open API Swagger, robust testing utilities. |
| **Database** | MongoDB Atlas + Mongoose | Highly flexible document storage suitable for variable transactional line-item metadata, fast indexing on dynamic user queries. |
| **Frontend Framework**| React 19 + Vite | Ultra-fast HMR build toolchain, latest React 19 concurrent features, low bundle footprint. |
| **UI Library** | TailwindCSS + shadcn/ui | Modern accessible headless primitives, clean dark/light mode CSS variables, complete control over design tokens. |
| **State & Data Fetching** | TanStack Query | Automated background revalidation, query key caching, simple optimistic update management. |
| **Authentication** | Passport + JWT | Stateless, scalable session handling with short-lived tokens and refresh token revocation support. |

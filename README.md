# Enterprise Expense Tracker SaaS

A production-grade, enterprise-ready Expense Tracker SaaS application designed with **Clean Architecture**, robust security, scalable NestJS micro-service modularity, and modern React 19 visual excellence.

---

## Architecture Highlights

* **Clean Hexagonal Architecture**: Strict layer separation across Controller, Service, Repository, and Schema layers in NestJS.
* **Feature-Based Modular Frontend**: React 19 + TypeScript + Vite + TailwindCSS + shadcn/ui + TanStack Query.
* **Dual-Token JWT Security**: Short-lived Access Tokens + long-lived Refresh Token rotation hashed in MongoDB Atlas with TTL auto-purge.
* **Automated Data Seeding**: Automated startup seeder for `demo@expensetracker.com` / `Password@123` with 6 months of realistic financial data.
* **Structured Logging**: Contextual Winston Logger tracing API requests, response times, error tracebacks, and operational metrics.
* **API Documentation**: Automated OpenAPI / Swagger documentation at `/api/docs`.
* **CI/CD & Container Deployment**: GitHub Actions workflow deploying multi-stage Docker images to AWS ECR and AWS EC2 with automatic rollback.

---

## Directory Layout

```
ExpenseTracker/
├── .github/workflows/        # CI/CD Automation
│   └── deploy.yml            # GitHub Actions Build, Test, ECR Push & EC2 Deployment
├── docs/                     # System Specifications & Deployment Guides
│   ├── HLD.md                # High-Level Architecture & System Blueprint
│   ├── LLD.md                # Low-Level Component & Database Schema Specification
│   ├── API.md                # REST API OpenAPI Contract & Endpoint Specifications
│   ├── Architecture.md       # Architectural Principles & System Design Patterns
│   └── DEPLOYMENT.md         # AWS EC2, ECR, Docker & SSL Deployment Guide
├── ADR/                      # Architectural Decision Records
│   ├── 0001-clean-architecture-and-tech-stack.md
│   └── 0002-jwt-token-rotation.md
├── backend/                  # NestJS API Engine
├── frontend/                 # React 19 Feature-Driven Web App
├── docker-compose.yml        # Production Docker Orchestration
├── docker-compose.override.yml # Local Development Overrides
└── README.md                 # System Documentation Index
```

---

## Quickstart (Local Development)

### Prerequisites
* **Node.js**: `v20+`
* **npm**: `v10+`

### Local Execution
```bash
# Start backend API (Port 5001)
cd backend && npm install && npm run start:dev

# Start frontend web app (Port 3000)
cd frontend && npm install && npm run dev
```

- Web App: `http://localhost:3000`
- Swagger API Docs: `http://localhost:5001/api/docs`
- Demo Credentials: `demo@expensetracker.com` / `Password@123`

---

## Documentation Index

- [High Level Design (HLD)](file:///Users/subburajalagammal/Desktop/SASM Projects/ExpenseTracker/HLD.md)
- [Low Level Design (LLD)](file:///Users/subburajalagammal/Desktop/SASM Projects/ExpenseTracker/LLD.md)
- [API Specification](file:///Users/subburajalagammal/Desktop/SASM Projects/ExpenseTracker/API.md)
- [System Architecture](file:///Users/subburajalagammal/Desktop/SASM Projects/ExpenseTracker/Architecture.md)
- [AWS Cloud & CI/CD Deployment Guide](file:///Users/subburajalagammal/Desktop/SASM Projects/ExpenseTracker/docs/DEPLOYMENT.md)
- [ADR 0001: Clean Architecture & Tech Stack](file:///Users/subburajalagammal/Desktop/SASM Projects/ExpenseTracker/ADR/0001-clean-architecture-and-tech-stack.md)
- [ADR 0002: Dual Token JWT Rotation](file:///Users/subburajalagammal/Desktop/SASM Projects/ExpenseTracker/ADR/0002-jwt-token-rotation.md)

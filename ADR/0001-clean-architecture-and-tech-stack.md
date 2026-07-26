# ADR 0001: Adoption of Clean Architecture and Modular Micro-Layering

## Context & Problem Statement
We need an enterprise-grade backend design for an Expense Tracker SaaS that avoids tight coupling between HTTP handlers, database queries, and business logic.

## Decision Drivers
- Testability: Business logic must be testable without starting a real MongoDB server.
- Maintainability: Clear boundaries between Controllers, Services, and Repositories.
- Scalability: Standardized framework convention (NestJS) enforcing Dependency Injection.

## Decision Outcome
Adopt Clean Architecture in NestJS:
- **Controllers**: Thin controllers handling HTTP requests, response DTO mapping, and Swagger decorators.
- **Services**: Business domain orchestration.
- **Repositories**: Abstract database data-access layer encapsulating Mongoose ODM queries.
- **Schemas**: Mongoose document schemas representing MongoDB entities.

## Consequences
- **Positive**: Clean separation of concerns, high unit testability, easy swapping of persistence layers.
- **Negative**: Slightly higher initial file count per module (DTO, Controller, Service, Repository, Schema).

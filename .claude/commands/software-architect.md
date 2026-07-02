---
description: High-level system design, Clean Architecture principles, SOLID applications, and code refactoring strategies.
---

# Software Architect Skill

## Project Constraints

- This project uses Next.js 16.2.9.
- All internal APIs must live under `/api` according to the project's existing structure.
- TypeScript strict mode is required.
- Avoid `any`, unsafe casts, and untyped API contracts.
- Prefer incremental refactors.
- Follow existing project conventions before introducing new patterns.
- Do not add new dependencies without justification.

## Instructions

1. **Pragmatic Architecture:** Apply a pragmatic Clean Architecture approach. Separate UI, services, data access, and domain logic clearly without over-engineering.
2. **SOLID & DDD:** Apply SOLID principles with common sense. Use lightweight Domain-Driven Design (DDD) concepts only when they add tangible value to business logic.
3. **Modularity:** Architect by feature where appropriate, maintaining low coupling and high cohesion.
4. **Refactoring:** Emphasize incremental refactoring rather than giant rewrite PRs.
5. **Decision Tracking:** Document major architectural decisions and trade-offs.

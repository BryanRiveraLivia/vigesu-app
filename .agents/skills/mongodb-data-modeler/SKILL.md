---
name: mongodb-data-modeler
description: Use this skill when designing document schemas, indexing strategies, resolving N+1 query issues, or building data access layers for MongoDB.
---

# MongoDB Data Modeler Skill

## Project Constraints

- This project uses Next.js 16.2.9.
- All internal APIs must live under `/api` according to the project's existing structure.
- TypeScript strict mode is required.
- Avoid `any`, unsafe casts, and untyped API contracts.
- Prefer incremental refactors.
- Follow existing project conventions before introducing new patterns.
- Do not add new dependencies without justification.

## Instructions

1. **Document Modeling:** Design schemas optimizing for read/write patterns (embedding vs referencing) appropriate for MongoDB. Use `ObjectId` properly.
2. **Performance:** Apply necessary indexes to support queries. Actively look for and eliminate N+1 query problems.
3. **Pagination & Filtering:** Implement efficient pagination and filtering mechanisms.
4. **Validation:** Implement schema-level validation or application-level validation (e.g., Zod) before inserting documents into the database.
5. **Separation of Concerns:** Keep database access code inside dedicated repositories or data access services. Never expose Raw MongoDB models directly to the UI; map them to Domain Entities or DTOs first.

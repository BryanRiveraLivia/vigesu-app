---
description: Writing SQL, designing relational tables, handling transactions, or avoiding SQL injections for PostgreSQL databases.
---

# PostgreSQL Query Designer Skill

## Project Constraints

- This project uses Next.js 16.2.9.
- All internal APIs must live under `/api` according to the project's existing structure.
- TypeScript strict mode is required.
- Avoid `any`, unsafe casts, and untyped API contracts.
- Prefer incremental refactors.
- Follow existing project conventions before introducing new patterns.
- Do not add new dependencies without justification.

## Instructions

1. **Relational Design:** Enforce proper relational design utilizing foreign keys and necessary constraints.
2. **Indexing:** Add appropriate indexes for performance on frequently queried columns.
3. **Transactions:** Handle transactions robustly to maintain data integrity during multi-step mutations.
4. **Security:** Use parameterized queries strictly. Avoid string concatenation for SQL statements to prevent SQL injection vulnerabilities.
5. **Separation of Concerns:** Abstract data access into services/repositories. Maintain separation between the data layer and HTTP handlers.
6. **Migrations:** Ensure database schema changes are tracked properly through migrations compatible with the project's ORM or query builder.

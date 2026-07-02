---
name: security-code-reviewer
description: Use this skill to review code for vulnerabilities, handle authentication/authorization, manage secrets, and ensure input sanitization.
---

# Security Code Reviewer Skill

## Project Constraints

- This project uses Next.js 16.2.9.
- All internal APIs must live under `/api` according to the project's existing structure.
- TypeScript strict mode is required.
- Avoid `any`, unsafe casts, and untyped API contracts.
- Prefer incremental refactors.
- Follow existing project conventions before introducing new patterns.
- Do not add new dependencies without justification.

## Instructions

1. **Secrets Management:** Ensure no hardcoded secrets exist in the codebase. Verify that `.env` files and environment variables are used properly and securely.
2. **Auth & Boundaries:** Maintain strict server/client boundaries. Do not leak server-side secrets or models to the client. Implement proper authentication and granular authorization checks.
3. **Data Sanitization:** Validate all inputs (e.g., via Zod) and sanitize all outputs. 
4. **Headers & Cookies:** Ensure secure headers are configured. Cookies should have Secure, HttpOnly, and SameSite attributes where applicable.
5. **OWASP Basics:** Conduct basic OWASP vulnerability checks on new code.
6. **Logging:** Avoid logging sensitive PII or credentials. 
7. **Rate Limiting:** Recommend or implement rate limiting on public or sensitive API endpoints.

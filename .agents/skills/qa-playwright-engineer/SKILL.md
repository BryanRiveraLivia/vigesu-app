---
name: qa-playwright-engineer
description: Use this skill when writing automated tests, E2E tests with Playwright, integration testing, or verifying system workflows.
---

# QA Playwright Engineer Skill

## Project Constraints

- This project uses Next.js 16.2.9.
- All internal APIs must live under `/api` according to the project's existing structure.
- TypeScript strict mode is required.
- Avoid `any`, unsafe casts, and untyped API contracts.
- Prefer incremental refactors.
- Follow existing project conventions before introducing new patterns.
- Do not add new dependencies without justification.

## Instructions

1. **Testing Scope:** Implement unit, integration, or E2E tests focusing on critical user flows and API validation.
2. **Playwright E2E:** For UI workflows, utilize Playwright. Implement the Page Object Model (POM) pattern if the test suite complexity warrants it.
3. **Robust Selectors:** Prefer `data-testid` or accessible roles for element selection to avoid fragile tests bound to CSS classes.
4. **Fixtures:** Use well-defined test fixtures for predictable test states.
5. **Smoke Tests:** Maintain lightweight smoke tests that verify core functionality quickly.
6. **Reporting:** Ensure test results and failures generate clear, actionable reports.

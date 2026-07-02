---
name: terraform-iac-reviewer
description: Use this skill when writing, reviewing, or applying Terraform infrastructure as code (IaC) configurations.
---

# Terraform IaC Reviewer Skill

## Project Constraints

- This project uses Next.js 16.2.9.
- All internal APIs must live under `/api` according to the project's existing structure.
- TypeScript strict mode is required.
- Avoid `any`, unsafe casts, and untyped API contracts.
- Prefer incremental refactors.
- Follow existing project conventions before introducing new patterns.
- Do not add new dependencies without justification.

## Instructions

1. **Modern Terraform:** Write modern HCL code leveraging reusable modules.
2. **Variables & Outputs:** Use strongly typed variables and clear outputs. 
3. **State Management:** Enforce the use of a remote state backend.
4. **Conventions:** Follow standard naming conventions and tag all applicable resources properly for cost tracking.
5. **Security:** Never hardcode secrets. Inject them via secure variables or secret managers.
6. **Safe Execution:** Always run and review `terraform plan` before applying. Never perform destructive actions (like destroying infrastructure) without explicit user confirmation.

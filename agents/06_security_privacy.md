# Agent: Security & Privacy

## Mission
Threat-model the prototype and implement pragmatic security/privacy guards.

## Scope
- PDF upload risks
- PII & sensitive data handling
- Prompt injection / untrusted input (if using LLM parsing)
- Logging, secrets, headers

## Deliverables
1) SECURITY.md:
   - top risks
   - mitigations
   - "what we do not store" policy
2) Code changes:
   - file type validation (PDF only)
   - size limits
   - safe filenames / path handling
   - timeouts and error handling
   - safe logging (no raw invoice text)
   - env var pattern for secrets (if any)
3) Quick checklist for production hardening (optional)

## Constraints
Prototype-level: keep changes minimal but meaningful.

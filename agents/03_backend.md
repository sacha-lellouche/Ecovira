# Agent: Backend/API Engineer

## Mission
Provide API endpoints and data models for the Ecovira prototype, aligned with /contracts/CONTRACTS.md.

## Deliverables
1) Implement endpoints:
   - POST /api/invoices/upload : accept PDF, return { invoice_id, extracted: InvoiceExtracted }
   - PUT /api/invoices/:id     : accept edited InvoiceExtracted fields, return updated extracted
   - GET /api/dashboard?invoice_id=... : return Dashboard
2) Storage:
   - Prototype-friendly (in-memory store) for invoices + extracted + dashboard
3) Validation:
   - Validate inputs against schema (pydantic/zod)
   - File checks: pdf only, size limit, safe filename
4) Use fixtures first if extraction not ready; later call parser module.

## Rules
- Keep it simple and stable for the frontend.
- Return predictable errors (400/415/413/500).
- Do not log raw invoice text; log invoice_id and metadata only.

## Output
Code + a short API usage note (curl examples optional).

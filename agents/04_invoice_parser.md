# Agent: Invoice Parser (Document Extraction)

## Mission
Extract structured fields from uploaded energy/water PDF invoices into InvoiceExtracted schema, with confidence + missing_fields.

## Input
- PDF file (energy or water invoice)

## Output (must match contracts)
InvoiceExtracted:
- supplier_name
- invoice_date
- billing_period_start
- billing_period_end
- total_amount
- consumption_value
- unit (kWh, m3, etc.)
- confidence (0-1)
- missing_fields: string[]
- raw_text_excerpt (optional, short, safe)

## Requirements
- Use robust heuristics + regex
- Normalize:
  - dates to ISO
  - amounts to numeric
  - consumption value numeric
  - units standardized ("kWh", "m3")
- If ambiguous, lower confidence and add to missing_fields
- Keep it deterministic and testable (pure function style)

## Deliverables
1) extract_invoice(pdf_bytes) -> InvoiceExtracted
2) Unit tests with 2–3 fixtures (mocked text is fine)
3) Notes about common patterns and fallbacks

## Rules
- No external network calls
- Do not store full raw invoice contents; only minimal excerpt if needed

# Agent: Frontend Engineer

## Mission
Implement Ecovira UI: landing page + dashboard + editable extracted-fields table + display KPIs/anomalies/recommendations/labels.

## Assumptions
- Use the contracts defined in /contracts/CONTRACTS.md as the source of truth.
- Backend may initially return fixtures; build UI against contracts.

## Deliverables
1) Landing page:
   - Hero (Ecovira + tagline + CTA)
   - Features section
   - Team banner (Rayene, Sacha, Vianney)
   - CTA button routes to /app (or scrolls to upload)
2) App page / dashboard:
   - PDF upload UI
   - Extracted data verification table (editable cells)
   - "Validate" button to confirm and refresh dashboard
   - KPI cards + anomalies + recommendations + certification prep section
3) UX polish:
   - loading states, empty states, error states
   - missing fields highlighted; form validation
   - responsive layout

## Integration points
- POST upload endpoint (returns invoice_id + InvoiceExtracted)
- PATCH/PUT to update extracted fields (optional; or send full object back)
- GET dashboard endpoint (returns Dashboard)

## Rules
- Keep components small and reusable (KpiCard, Alert, RecommendationCard, EditableTable)
- No auth
- Do not invent schema fields: follow contracts

## Output
Code changes only + brief notes.

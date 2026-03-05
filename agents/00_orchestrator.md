# Agent: Orchestrator (Lead / PM-Tech)

## Mission
Coordinate multiple agents in parallel to ship the Ecovira prototype. Define contracts first, then parallelize implementation, then integrate and polish.

## Non-goals
Do not over-engineer. Keep it prototype-grade, deterministic contracts, and fast iteration.

## Deliverables (in order)
1) Write /contracts/CONTRACTS.md:
   - Data schemas: InvoiceExtracted, KPI, Anomaly, Recommendation, LabelFields, Dashboard
   - API endpoints spec (even if mocked first)
   - Validation rules + examples (JSON fixtures)
2) Break down work into parallel tasks for: UI/UX, Frontend, Backend, Parser, Insights, Security, QA
3) Define "Definition of Done" per agent and integration checklist
4) Integration pass: ensure the full flow works end-to-end:
   Upload PDF -> Extracted fields table (editable) -> Validate -> Dashboard -> Export label fields

## Context (minimal)
Product name: Ecovira
User: GM of independent 4-star hotel (25–80 rooms)
Inputs: PDF invoices (energy/water first)
Outputs: KPI dashboard + anomaly detection + ROI actions + label prep (Green Key / Green Globe)

## Hard requirements
- Landing page + team banner (Rayene, Sacha, Vianney)
- Invoice extraction table with manual edits
- Dashboard sections: KPIs, Anomalies, Recommendations w/ ROI, Certification Preparation
- Clean green/beige SaaS style
- No auth, single-page or minimal routing

## First action
Create CONTRACTS.md now. Include example JSON objects for each schema.

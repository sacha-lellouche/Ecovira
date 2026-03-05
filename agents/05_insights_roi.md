# Agent: Insights/ROI (ESG + anomalies + recommendations)

## Mission
Given one or more extracted invoices, compute KPIs, detect anomalies, generate ROI-focused recommendations, and prepare certification fields (Green Key / Green Globe).

## Inputs
- InvoiceExtracted objects (energy/water first)
- Optional hotel metadata (rooms_count, occupancy_estimate) if available; otherwise make reasonable assumptions and mark them.

## Outputs (must match contracts)
Dashboard:
- kpis: KPI[]
- anomalies: Anomaly[]
- recommendations: Recommendation[]
- label_fields: LabelFields

## KPI requirements
- Total consumption and cost for the period
- Basic "per room" metrics if rooms_count provided
- Simple CO2 estimate (document assumptions in a field or note)

## Anomaly detection
- Spike vs previous invoice periods (if multiple invoices)
- Cost increase not explained by consumption increase
- Very high consumption per room (if available)

## Recommendations (3–5)
Each recommendation must include:
- action title
- rationale tied to observed data
- estimated annual savings (range ok)
- difficulty (low/med/high)
- ROI/payback estimate (rough ok)

## Certification Preparation
- Provide structured fields that can be copied into forms:
  - energy consumption (kWh) by period
  - water consumption (m3) by period
  - notes/assumptions

## Deliverables
- A deterministic module: build_dashboard(invoices, hotel_meta) -> Dashboard
- Fixtures and unit tests

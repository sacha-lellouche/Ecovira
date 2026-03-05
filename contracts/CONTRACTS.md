# Ecovira API Contracts & Data Schemas

This document defines all data schemas, API endpoints, and validation rules for the Ecovira prototype.

---

## Data Schemas

### 1. InvoiceExtracted

Structured data extracted from uploaded PDF invoices.

```typescript
interface InvoiceExtracted {
  invoice_id: string;           // Unique identifier
  invoice_type: "energy" | "water" | "waste";
  supplier_name: string;
  invoice_date: string;         // ISO 8601 format: "2024-01-15"
  billing_period_start: string; // ISO 8601 format: "2023-12-01"
  billing_period_end: string;   // ISO 8601 format: "2023-12-31"
  total_amount: number;         // EUR
  consumption_value: number;
  unit: string;                 // "kWh", "m3", "kg", etc.
  confidence: number;           // 0.0 to 1.0
  missing_fields: string[];     // e.g., ["supplier_name", "billing_period_start"]
  raw_text_excerpt?: string;    // Optional, max 500 chars
}
```

**Example (Energy Invoice):**
```json
{
  "invoice_id": "inv_20240115_energy_001",
  "invoice_type": "energy",
  "supplier_name": "EDF",
  "invoice_date": "2024-01-15",
  "billing_period_start": "2023-12-01",
  "billing_period_end": "2023-12-31",
  "total_amount": 3250.50,
  "consumption_value": 18500,
  "unit": "kWh",
  "confidence": 0.95,
  "missing_fields": [],
  "raw_text_excerpt": "Facture N° 2024-001-XYZ | Période: 01/12/2023 - 31/12/2023"
}
```

**Example (Water Invoice with Missing Fields):**
```json
{
  "invoice_id": "inv_20240120_water_001",
  "invoice_type": "water",
  "supplier_name": "",
  "invoice_date": "2024-01-20",
  "billing_period_start": "2023-12-01",
  "billing_period_end": "2023-12-31",
  "total_amount": 850.00,
  "consumption_value": 320,
  "unit": "m3",
  "confidence": 0.72,
  "missing_fields": ["supplier_name"],
  "raw_text_excerpt": "Consommation d'eau: 320 m³"
}
```

**Validation Rules:**
- `invoice_id`: Required, unique
- `invoice_type`: Required, enum ["energy", "water", "waste"]
- `invoice_date`, `billing_period_start`, `billing_period_end`: ISO 8601 dates
- `total_amount`, `consumption_value`: Must be >= 0
- `confidence`: Must be between 0 and 1
- `unit`: Standardized values ("kWh", "m3", "kg")

---

### 2. KPI

Key Performance Indicator for dashboard display.

```typescript
interface KPI {
  metric: string;          // "Energy Consumption", "Water Usage", "Total Cost", "CO2 Emissions"
  value: number;
  unit: string;            // "kWh", "m3", "EUR", "kg CO2e"
  period: string;          // "Dec 2023", "2023", "Last 30 days"
  trend?: number;          // % change vs previous period (optional)
  per_room?: number;       // Normalized value per room (optional)
  benchmark?: number;      // Industry benchmark value (optional)
}
```

**Example:**
```json
{
  "metric": "Energy Consumption",
  "value": 18500,
  "unit": "kWh",
  "period": "Dec 2023",
  "trend": -3.2,
  "per_room": 336.4,
  "benchmark": 291.7
}
```

---

### 3. Anomaly

Detected anomaly or alert from invoice data.

```typescript
interface Anomaly {
  id: string;
  severity: "info" | "warning" | "critical";
  category: "consumption" | "cost" | "efficiency";
  title: string;
  description: string;
  detected_value: number;
  expected_range: string;    // e.g., "250-300 kWh/room"
  impact_estimate?: string;  // e.g., "€500/year excess cost"
}
```

**Example:**
```json
{
  "id": "anom_001",
  "severity": "warning",
  "category": "consumption",
  "title": "Energy consumption spike",
  "description": "December energy usage is 15% higher than the 3-month average (336 kWh/room vs 292 kWh/room expected).",
  "detected_value": 336.4,
  "expected_range": "250-300 kWh/room",
  "impact_estimate": "€580/year if trend continues"
}
```

---

### 4. Recommendation

Actionable recommendation with ROI estimate.

```typescript
interface Recommendation {
  id: string;
  title: string;
  rationale: string;         // Why this action matters (tied to data)
  action_steps: string[];    // Concrete steps
  difficulty: "low" | "medium" | "high";
  estimated_savings: string; // e.g., "€1,200-1,800/year"
  payback_period?: string;   // e.g., "18-24 months"
  roi_percentage?: number;   // e.g., 45 (for 45%)
  environmental_impact: string; // e.g., "Reduce CO2 by 2.5 tons/year"
}
```

**Example:**
```json
{
  "id": "rec_001",
  "title": "Install LED lighting in common areas",
  "rationale": "Current energy usage suggests 30% of consumption is lighting. LED retrofit can reduce this by 60%.",
  "action_steps": [
    "Audit current lighting inventory",
    "Get quotes from 2-3 LED suppliers",
    "Replace high-use areas first (lobby, hallways)",
    "Monitor energy savings monthly"
  ],
  "difficulty": "low",
  "estimated_savings": "€1,200-1,800/year",
  "payback_period": "18-24 months",
  "roi_percentage": 45,
  "environmental_impact": "Reduce CO2 by 2.5 tons/year"
}
```

---

### 5. LabelFields

Structured data for sustainability certification forms (Green Key, Green Globe, etc.).

```typescript
interface LabelFields {
  certification_type: "Green Key" | "Green Globe" | "ISO 14001";
  fields: {
    [key: string]: {
      label: string;
      value: string | number;
      unit?: string;
      notes?: string;
    };
  };
  generated_at: string;  // ISO 8601 timestamp
}
```

**Example:**
```json
{
  "certification_type": "Green Key",
  "fields": {
    "energy_consumption_total": {
      "label": "Total Energy Consumption (Annual)",
      "value": 222000,
      "unit": "kWh",
      "notes": "Based on Dec 2023 extrapolated to 12 months"
    },
    "energy_per_guest_night": {
      "label": "Energy per Guest Night",
      "value": 45.2,
      "unit": "kWh",
      "notes": "Assumes 70% occupancy, 55 rooms"
    },
    "water_consumption_total": {
      "label": "Total Water Consumption (Annual)",
      "value": 3840,
      "unit": "m3"
    },
    "co2_emissions": {
      "label": "Estimated CO2 Emissions",
      "value": 51.7,
      "unit": "tons CO2e/year",
      "notes": "Using France grid factor 0.233 kg CO2e/kWh"
    }
  },
  "generated_at": "2024-01-22T14:30:00Z"
}
```

---

### 6. Dashboard

Complete dashboard data returned by the insights engine.

```typescript
interface Dashboard {
  hotel_info: {
    rooms_count: number;
    occupancy_estimate?: number;  // 0.0 to 1.0
  };
  period: string;                 // e.g., "Dec 2023"
  kpis: KPI[];
  anomalies: Anomaly[];
  recommendations: Recommendation[];
  label_fields: LabelFields;
}
```

**Example:**
```json
{
  "hotel_info": {
    "rooms_count": 55,
    "occupancy_estimate": 0.72
  },
  "period": "Dec 2023",
  "kpis": [
    {
      "metric": "Energy Consumption",
      "value": 18500,
      "unit": "kWh",
      "period": "Dec 2023",
      "trend": -3.2,
      "per_room": 336.4,
      "benchmark": 291.7
    },
    {
      "metric": "Water Usage",
      "value": 320,
      "unit": "m3",
      "period": "Dec 2023",
      "per_room": 5.82,
      "benchmark": 10.0
    },
    {
      "metric": "Total Cost",
      "value": 4100.50,
      "unit": "EUR",
      "period": "Dec 2023",
      "trend": 2.1
    },
    {
      "metric": "CO2 Emissions",
      "value": 4310.5,
      "unit": "kg CO2e",
      "period": "Dec 2023",
      "per_room": 78.4
    }
  ],
  "anomalies": [
    {
      "id": "anom_001",
      "severity": "warning",
      "category": "consumption",
      "title": "Energy consumption spike",
      "description": "December energy usage is 15% higher than expected.",
      "detected_value": 336.4,
      "expected_range": "250-300 kWh/room",
      "impact_estimate": "€580/year if trend continues"
    }
  ],
  "recommendations": [
    {
      "id": "rec_001",
      "title": "Install LED lighting in common areas",
      "rationale": "Current energy usage suggests 30% is lighting.",
      "action_steps": ["Audit inventory", "Get quotes", "Replace high-use areas"],
      "difficulty": "low",
      "estimated_savings": "€1,200-1,800/year",
      "payback_period": "18-24 months",
      "roi_percentage": 45,
      "environmental_impact": "Reduce CO2 by 2.5 tons/year"
    }
  ],
  "label_fields": {
    "certification_type": "Green Key",
    "fields": {
      "energy_consumption_total": {
        "label": "Total Energy Consumption (Annual)",
        "value": 222000,
        "unit": "kWh"
      }
    },
    "generated_at": "2024-01-22T14:30:00Z"
  }
}
```

---

## API Endpoints

### POST /api/invoices/upload

Upload a PDF invoice and extract structured data.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: PDF file (required)
  - `invoice_type`: "energy" | "water" | "waste" (optional, auto-detected if not provided)

**Response (200 OK):**
```json
{
  "invoice_id": "inv_20240115_energy_001",
  "extracted": {
    "invoice_id": "inv_20240115_energy_001",
    "invoice_type": "energy",
    "supplier_name": "EDF",
    "invoice_date": "2024-01-15",
    "billing_period_start": "2023-12-01",
    "billing_period_end": "2023-12-31",
    "total_amount": 3250.50,
    "consumption_value": 18500,
    "unit": "kWh",
    "confidence": 0.95,
    "missing_fields": []
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing file or invalid invoice_type
- `413 Payload Too Large`: File exceeds size limit (10MB)
- `415 Unsupported Media Type`: Not a PDF file
- `500 Internal Server Error`: Extraction failed

---

### PUT /api/invoices/:id

Update extracted invoice fields (after manual correction).

**Request:**
- Content-Type: `application/json`
- Body: Partial or full `InvoiceExtracted` object

```json
{
  "supplier_name": "Veolia Eau",
  "billing_period_start": "2023-11-15"
}
```

**Response (200 OK):**
```json
{
  "invoice_id": "inv_20240120_water_001",
  "extracted": {
    "invoice_id": "inv_20240120_water_001",
    "invoice_type": "water",
    "supplier_name": "Veolia Eau",
    "invoice_date": "2024-01-20",
    "billing_period_start": "2023-11-15",
    "billing_period_end": "2023-12-31",
    "total_amount": 850.00,
    "consumption_value": 320,
    "unit": "m3",
    "confidence": 0.95,
    "missing_fields": []
  }
}
```

**Error Responses:**
- `404 Not Found`: Invoice ID not found
- `400 Bad Request`: Invalid field values

---

### GET /api/dashboard

Get complete dashboard data (KPIs, anomalies, recommendations, certification fields).

**Query Parameters:**
- `invoice_ids`: Comma-separated invoice IDs (optional, defaults to all)
- `period`: Time period filter (optional, e.g., "2023-12", "2023-Q4")

**Example:**
```
GET /api/dashboard?invoice_ids=inv_001,inv_002&period=2023-12
```

**Response (200 OK):**
```json
{
  "hotel_info": {
    "rooms_count": 55,
    "occupancy_estimate": 0.72
  },
  "period": "Dec 2023",
  "kpis": [...],
  "anomalies": [...],
  "recommendations": [...],
  "label_fields": {...}
}
```

**Error Responses:**
- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Dashboard generation failed

---

## Validation Rules

### File Upload
- **Allowed MIME types**: `application/pdf`
- **Max file size**: 10 MB
- **Filename sanitization**: Remove special characters, limit length to 255 chars

### Date Fields
- **Format**: ISO 8601 (`YYYY-MM-DD`)
- **Range**: 2000-01-01 to current date + 1 year
- **Billing periods**: `billing_period_end` must be >= `billing_period_start`

### Numeric Fields
- **total_amount**: >= 0, max 999999.99
- **consumption_value**: >= 0, max 99999999
- **confidence**: >= 0.0, <= 1.0

### Enums
- **invoice_type**: ["energy", "water", "waste"]
- **severity**: ["info", "warning", "critical"]
- **difficulty**: ["low", "medium", "high"]
- **certification_type**: ["Green Key", "Green Globe", "ISO 14001"]

---

## Integration Flow

```
1. User uploads PDF
   ↓
2. POST /api/invoices/upload
   → Returns InvoiceExtracted with confidence & missing_fields
   ↓
3. Frontend displays verification table
   → User edits missing/incorrect fields
   ↓
4. PUT /api/invoices/:id (with corrections)
   → Returns updated InvoiceExtracted
   ↓
5. GET /api/dashboard?invoice_ids=...
   → Returns Dashboard with KPIs, anomalies, recommendations, label_fields
   ↓
6. Frontend displays dashboard
   → User exports certification fields or CSV
```

---

## Notes for Implementers

- **Parser Agent**: Return confidence < 0.8 if extraction is uncertain; populate `missing_fields` array
- **Frontend Agent**: Highlight missing fields in red; validate edits before submission
- **Backend Agent**: Use fixtures initially; swap in real parser module later
- **Insights Agent**: Use industry benchmarks (see [benchmarks.md](../fixtures/benchmarks.md)) for anomaly detection
- **Security Agent**: Sanitize filenames, validate file types, limit file size, do not log raw invoice text

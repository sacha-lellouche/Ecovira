# Ecovira - ESG Intelligence for Independent Hotels

**Tagline:** We help independent hotels analyze costs to operate efficiently

## Overview

Ecovira is a web-based ESG (Environmental, Social, and Governance) assistant designed specifically for general managers of independent 4-star hotels (25–80 rooms). The platform transforms operational data from energy, water, and waste invoices into actionable sustainability insights and simplified reporting.

## Architecture

This project uses a **multi-agent development approach** to ensure clean separation of concerns, parallel development, and contract-driven integration.

### Agent Structure

```
agents/
├── 00_orchestrator.md      # Lead/PM - coordinates all agents
├── 01_ui_ux.md            # Design system and interaction specs
├── 02_frontend.md         # UI implementation
├── 03_backend.md          # API endpoints and data models
├── 04_invoice_parser.md   # PDF extraction engine
├── 05_insights_roi.md     # KPIs, anomalies, recommendations
├── 06_security_privacy.md # Security guidelines
└── 07_qa_tests.md         # Testing and quality assurance
```

### Development Workflow

1. **Contracts First**: All agents follow schemas defined in [contracts/CONTRACTS.md](contracts/CONTRACTS.md)
2. **Parallel Development**: UI, backend, parser, and insights agents work independently
3. **Integration**: Orchestrator ensures end-to-end flow works seamlessly
4. **Quality Gates**: QA agent validates with fixtures and tests

### Data Flow

```
PDF Upload → Parser → InvoiceExtracted → Verification Table → 
User Edits → Backend → Insights Engine → Dashboard → Export
```

## Features

### 1. **Intelligent Invoice Analysis**
- Upload energy, water, and waste invoices in PDF format
- Automatic data extraction:
  - Supplier name
  - Invoice date
  - Billing period
  - Total amount
  - Consumption value
  - Unit (kWh, m³, kg, etc.)
- Verification table for reviewing and editing extracted data
- Manual data entry option

### 2. **Centralized ESG Dashboard**
- Real-time KPIs for:
  - Energy consumption
  - Water usage
  - Waste generation
  - Carbon footprint
- Cost tracking and analysis
- Trend indicators (positive/negative/neutral)
- Industry benchmarking against 4-star hotel standards

### 3. **Anomaly Detection**
- Automatic alerts for unusual consumption patterns
- Benchmark comparisons
- Severity classifications (warning/critical)
- Identification of:
  - Consumption above industry benchmarks
  - Unusual spikes between periods
  - Potential leaks or inefficiencies

### 4. **Recommended Actions with ROI**
- 3–5 personalized recommendations per analysis
- Each recommendation includes:
  - Estimated annual savings (€)
  - Reduction percentages
  - ROI period (months)
- Examples:
  - LED lighting upgrades
  - Water-saving fixtures
  - Smart room controls
  - Waste sorting optimization
  - Real-time energy monitoring

### 5. **Certification-Ready Reports**
- One-click export for:
  - Green Key certification
  - Green Globe certification
  - Custom CSV reports
- Structured JSON data format
- Meets sustainability certification requirements

## Project Structure

```
Ecovira code/
├── agents/                     # Agent development specifications
│   ├── 00_orchestrator.md      # Project coordination and integration
│   ├── 01_ui_ux.md            # Design system and UX specs
│   ├── 02_frontend.md         # Frontend implementation guide
│   ├── 03_backend.md          # API and backend specs
│   ├── 04_invoice_parser.md   # PDF extraction logic
│   ├── 05_insights_roi.md     # Analytics and recommendations
│   ├── 06_security_privacy.md # Security guidelines
│   └── 07_qa_tests.md         # Testing strategy
├── contracts/
│   └── CONTRACTS.md           # Data schemas and API contracts
├── fixtures/                   # Test data and benchmarks
│   ├── invoice_energy_complete.json
│   ├── invoice_water_complete.json
│   ├── invoice_energy_missing_fields.json
│   ├── dashboard_complete.json
│   └── benchmarks.md
├── landing.html               # Marketing/info page
├── landing-styles.css         # Landing page styles
├── dashboard.html             # ESG dashboard interface
├── dashboard-styles.css       # Dashboard styles
├── dashboard-app.js           # Dashboard logic (currently frontend-only)
└── README.md                  # This file
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- No server or database required - runs entirely in the browser

### Installation

1. Clone or download this repository
2. Open `landing.html` in your web browser

OR

3. Open `dashboard.html` directly to access the dashboard

### Usage

#### Landing Page (`landing.html`)
- View product overview
- Learn about features
- Meet the founding team
- Navigate to dashboard

#### Dashboard (`dashboard.html`)

**Upload Invoices:**
1. Click "Upload Invoices" tab
2. Drag & drop PDF files or click to browse
3. Wait for automatic data extraction (simulated)
4. Review extracted data in verification table
5. Edit any incorrect values
6. Click "Confirm & Add Data"

**Manual Entry:**
1. Click "Manual Entry" tab
2. Select data type (Energy/Water/Waste)
3. Enter billing period
4. Input consumption, unit, and cost
5. Click "Add Data"

**View Dashboard:**
- Monitor KPIs in real-time
- Compare against benchmarks
- Review anomaly alerts
- Explore recommendations

**Export Data:**
- Click export buttons for Green Key, Green Globe, or CSV
- Files download automatically

## For Developers

### Data Contracts

All data structures are defined in [contracts/CONTRACTS.md](contracts/CONTRACTS.md). Key schemas:

- **InvoiceExtracted**: Parsed invoice data with confidence scores
- **KPI**: Performance metrics for dashboard
- **Anomaly**: Detected issues with severity levels
- **Recommendation**: Action items with ROI calculations
- **Dashboard**: Complete dashboard payload
- **LabelFields**: Certification-ready export data

### Testing with Fixtures

Use the JSON fixtures in `/fixtures` for development and testing:

```javascript
// Example: Load complete energy invoice fixture
fetch('fixtures/invoice_energy_complete.json')
  .then(r => r.json())
  .then(data => console.log(data));
```

Available fixtures:
- `invoice_energy_complete.json` - Perfect extraction
- `invoice_water_complete.json` - Perfect extraction
- `invoice_energy_missing_fields.json` - Partial extraction (confidence: 0.68)
- `dashboard_complete.json` - Full dashboard response
- `benchmarks.md` - Industry benchmarks for validation

### Agent Workflow

1. **Read the orchestrator guide**: [agents/00_orchestrator.md](agents/00_orchestrator.md)
2. **Review contracts**: [contracts/CONTRACTS.md](contracts/CONTRACTS.md)
3. **Pick an agent role**: UI/UX, Frontend, Backend, Parser, Insights, Security, or QA
4. **Follow your agent's spec**: Each agent file has clear deliverables
5. **Use fixtures for testing**: Build against known data first
6. **Integration**: Orchestrator validates end-to-end flow

### Current Status

**✅ Completed (Prototype):**
- Landing page with hero, features, team section
- Dashboard UI with upload, verification table, KPIs, anomalies, recommendations
- Export functionality (Green Key, Green Globe, CSV)
- Design system (Cormorant Garamond + Manrope, terracotta/forest palette)

**🚧 In Progress:**
- Multi-agent architecture setup
- Contract-driven development

**📋 Planned:**
- Real PDF parsing (currently simulated)
- Backend API implementation
- Data persistence
- Multi-hotel support
- User authentication

## Design System

### Typography
- **Headings:** Cormorant Garamond (serif, distinctive)
- **Body:** Manrope (sans-serif, readable)

### Color Palette
- **Forest Dark:** `#1a3a2e` (primary brand)
- **Sage:** `#5a7f72` (muted green)
- **Terracotta:** `#d4744d` (warm accent)
- **Amber:** `#f2a154` (highlight)
- **Stone:** `#faf8f5` (background)
- **Parchment:** `#f5f1ea` (cards)

### Animation Principles
- Staggered entrance animations (0.1s-1.2s delays)
- Cubic-bezier easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Subtle micro-interactions (hover states, floating icons)
- Backdrop blur for depth

### Typography
- Font: Inter, San Francisco, Segoe UI (system fonts)
- Clean, modern, professional appearance

## Technical Details

### Sample Data
The prototype includes sample data for demonstration:
- Energy: 15,200 kWh (€2,736) and 14,800 kWh (€2,664)
- Water: 520 m³ (€1,820) and 485 m³ (€1,697.50)
- Waste: 1,450 kg (€174) and 1,380 kg (€165.60)

### Benchmarks (4-Star Hotels)
- Energy: 3,500 kWh per room per year
- Water: 120 m³ per room per year
- Waste: 350 kg per room per year
- Carbon: 0.233 kg CO₂e per kWh

### Hotel Configuration
- **Demo Hotel:** 4-star, 55 rooms

## Team

- **Rayene Hassan** - Co-founder (ESG strategy and hospitality operations)
- **Sacha Lellouche** - Co-founder (Product development and data analytics)
- **Vianney Hartmann** - Co-founder (Technology infrastructure and certification)

## Future Enhancements

- Real PDF parsing using PDF.js or similar library
- Backend API for data persistence
- User authentication and multi-hotel management
- Advanced analytics and predictive modeling
- Integration with property management systems
- Mobile app version
- Real-time energy monitoring integrations

## License

© 2026 Ecovira. All rights reserved.

## Contact

For questions or feedback, please contact the founding team.

---

**Built for the future of sustainable hospitality** 🌿

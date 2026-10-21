# Certified Power Exchange

Role & Authority: 
You are a Principal Full-Stack Engineer and UX Architect. You are tasked with translating a complex business brief for LAMPROS POWER TECH into a production-ready Web Application (built from scratch). 
Your output will be used by coding agents to implement the UI, logic, assets, and database architecture.

Aesthetic Alignment (Based on image_0.png):
* Dominant Brand Tone: Deep Navy Blue (#0B1A30, high trust, industrial stability) from the image_0.png background.
* Primary CTA / Accent: Solar Orange (#F99D1C, energy, warmth) from the roof outline and sun in image_0.png.
* Base Typography & Highlights: Sharp White (#FFFFFF) & Soft Off-White (#F8F9FA) from the logo text.
No other accent colors can be introduced. The palette must retain a high-contrast, professional, B2B enterprise aesthetic.

---

[PHASE 1] THE ADVERSARIAL SCAN (Evaluating Competitive Failures)
Before generating, inspect the "Sourcing, Refurbishment, and Resale of Used Generators" and "Energy Project and Loan Assessment" components:
* Danger: If the refurbishment pipeline looks like a "used junk" catalog, it will ruin B2B customer confidence. Force a visual badge of "LAMPROS INSPECTED & CERTIFIED" with condition reports.
* Danger: If the "Energy Loan Assessment" page looks like a generic form, it fails the integrity test required by institutions. Force an intake flow that mimics an evaluation portal with strict input boundaries and a file upload mechanism.

---

[PHASE 2] THE SITE ARCHITECTURE & CORE FEATURES
Construct the app utilizing a multi-page routing framework or a robust, high-performance single-page application with logical visual sections:

1. HOME & HERO
* Massive value-prop display: "Dependable Energy Products. Practical Power Solutions."
* Split CTR focus: [Request an Energy Audit] (Audit / B2B) & [Browse Supplies & Equipment] (Retail / Sourcing).
* Image/Illustration Grid representing: Solar setups, electrical cables, refurbished power equipment, and site energy audits.

2. RENEWABLE ENERGY & ELECTRICAL SUPPLIES (Unified Product Catalog UI)
* Build a searchable, filterable dynamic catalog.
* Categorization:
  - Cat A: Renewable Energy (Solar Panels, Inverters, Batteries, Controllers, Mounting).
  - Cat B: Electrical Components (Wires, Cables, Switches, Breakers, Distribution Boards, Conduits).
* Functional Action: Multi-item "Quote Cart" (add to quote request) instead of an immediate payment gateway, allowing LAMPROS to finalize freight and project specs offline.

3. POWER EQUIPMENT SOURCING & REFURBISHMENT
* An interactive dynamic pipeline showing "How it Works" (Sourcing -> Rigorous Inspection & Refurbishment -> Testing -> Certified Resale).
* Live inventory table or card interface for Used/Faulty Generators with visual tags: [Certified Refurbished], [Tested & Warranted]. Provide a "Sell or Trade-In Your Equipment" form.

4. ENERGY AUDITING & PROJECT ASSESSMENT (Dynamic Lead Intake)
* Service Detail Pages: Auditing & Energy Project/Loan Assessments.
* Interactive Energy Auditing Estimator: A simple UI where clients select "Sector" (Residential, Commercial, Industrial), "Estimated Monthly Power Cost", and "Primary Power Outage Frequency". Form submits to backend/email while displaying a "Estimation Received - Preparing Your Assessment Scope" success page.
* Loan Assessment portal: Multi-step upload wizard for uploading "Equipment specifications", "Energy requirements", "Project cost estimates", and "Financing paperwork". Include strict B2B legal disclaimer based on the agreed scope.

5. THE TRUST & BRAND FOUNDATION (About Us, Mission, Values)
* High-density typographic sections for About, Mission, Vision, and Core Values (Reliability, Quality, Integrity, Innovation, Customer Satisfaction).
* Embed a trust matrix showing warranty policies, certified engineer tags, and quick response times.

---

[PHASE 3] STRESS TEST & LOGIC VALIDATION
Ensure the codebase implements this exact logic before finalizing deployment:

* Gap Check: Does the form system validation enforce appropriate inputs? Require email, phone, location, and precise energy load information before generating a quote or auditing estimate.
* Bias Sweep: Review the Copywriting style against "get-rich-quick" or over-promising solar tropes. Explicitly emphasize the company's real focus: practical, cost-effective alternatives and transparent equipment recovery.
* De-risking: Ensure upload inputs on the Loan Assessment upload page utilize client-side size limitations (e.g., max 10MB per PDF/Image) and file-type restriction to prevent security and pipeline crashes.

Provide a complete technical spec including the full Site Map, Detailed UI/UX components with styling matching image_0.png, database/intake schemas, and execution route to take this from brand overview to a functional application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c60f939a-f93f-4b74-943b-d125264e4446).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? Install [Bun](https://bun.sh/docs/installation), then configure the variables in `.env.example`.

```sh
bun install
bun run dev
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for production configuration, migration, verification, and operational requirements.

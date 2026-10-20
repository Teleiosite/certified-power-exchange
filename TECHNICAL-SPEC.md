# Lampros Power Tech — Website & Intake Specification

## Purpose

A high-contrast, B2B-focused website for renewable energy products, electrical supplies, power equipment recovery, energy audits, project evaluation, and quote requests. Supply pricing, freight, project engineering, equipment availability, warranties, and any financing terms are confirmed offline; the site does not take payment or promise outcomes.

## Public site map

| Page | URL | Main purpose |
| --- | --- | --- |
| Home | `/` | Introduce the service and direct visitors to an energy audit or catalogue. |
| About | `/about` | Mission, vision, values, and evidence-based trust standards. |
| Services | `/services` | Renewable energy, electrical supply, sourcing, and evaluation overview. |
| Supplies catalogue | `/catalog` | Search/filter solar, storage, cables, protection, switches, and conduits; add items to a quote list. |
| Power equipment | `/equipment` | Explain sourcing, inspection, refurbishment, testing, and condition evidence. |
| Quote request | `/quote` | Review a persistent multi-item list and submit project/contact details. |
| Energy audit | `/audit` | Collect sector, monthly power cost/currency, outage frequency, site, and estimated load. |
| Project evaluation | `/assessment` | Guided organizational, project-scope, and supporting-document intake. |
| Sell or trade in | `/trade-in` | Collect equipment identity, known condition, history, and optional documentation. |

Each public page is a file-based route, renders a shared site page, and provides page-specific title, description, Open Graph title/description/type, and Twitter card metadata. Images bundled with the site are not used as absolute social image URLs.

## UI and content structure

- Shared shell: branded navigation, mobile menu, footer, and quote-list provider.
- Home: image-led statement, separate audit and catalogue calls to action, service overview, equipment-recovery explanation, and quote entry point.
- Catalogue: text search, category filters, product specifications, add-to-quote actions, and offline-pricing notice.
- Quote list: adjustable quantities, removal, clear-list action, browser persistence, required contact/location/load details, and no checkout.
- Equipment: four-stage recovery process; `LAMPROS INSPECTED & CERTIFIED` is conditional on unit-specific completed inspection and test evidence. Shown profiles are labeled illustrative, not live listings or certificates.
- Audit: required sector, estimated monthly cost and currency, outage frequency, location, contact, and positive estimated load; completion says “Estimation received — preparing your assessment scope.”
- Evaluation: three steps (organization/contact, project scope, documents), organization authorization, privacy warning, and preliminary-review/legal disclaimer.
- Trade-in: equipment details and optional condition-report/photo upload.

## Intake and storage

### Inquiry data

All public writes pass through `submitLamprosInquiry` in `src/lib/intake.functions.ts`, where Zod validates the payload, a server-side IP fingerprint is rate-limited, and accepted requests are stored in `public.lampros_inquiries`.

The database row includes inquiry type, contact and organization, email, phone, location, estimated load in kW, optional monthly power cost, outage frequency, sector, details, product items, attached-document metadata, IP fingerprint, and creation time. The rate-limit RPC is `claim_lampros_submission_slot`.

### Validation

- Contact name: 2–100 characters; email: valid, maximum 254; phone: 7–32 characters using phone punctuation/digits; location: 2–160 characters.
- Estimated power load: finite, positive, maximum 1,000,000 kW.
- Audit: monthly power cost, outage frequency, and sector are required.
- Quote: one or more items are required; each quantity is a positive integer up to 100,000; at most 50 items.
- Documents: at most 8 files; 10 MiB maximum per file; accepted types are PDF, JPEG, PNG, and WebP. The browser checks the file header before upload, and the submitted object path must be a UUID plus a matching extension.
- Loan documents are stored in the private `lampros-assessment-files` bucket and are grouped as equipment specifications, energy requirements, project cost estimates, or financing paperwork.

Email notifications are not configured. The intake stores submissions but does not send an email; an owner notification address/provider must be supplied and configured separately.

## Execution path

1. A visitor opens a public page and optionally builds a quote list; that list persists in the same browser.
2. The client checks required contact/project values and file limits/signatures.
3. Selected files upload to private storage under UUID filenames with the correct extension.
4. The form invokes the validated server function; the server applies request-rate limiting and saves the inquiry plus document metadata.
5. The page shows the appropriate confirmation. Quote, audit, loan, and trade-in requests are reviewed offline; no payment or automatic email is implied.

## Verification scope

The project includes route coverage for all nine public paths and intake tests for contact requirements, audit requirements, quote contents, document type/size/header checks, and UUID file paths. Visual and server-side customer submission verification should be completed in the running preview; external email delivery remains unavailable until configured.
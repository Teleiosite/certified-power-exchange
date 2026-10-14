# Complete Lampros Power Tech website

## Plan
- Replace the home placeholder with a finished, image-led overview using the established navy, orange, white, and off-white identity.
- Build the public pages already referenced by navigation: About, Services, Catalog, Equipment, Quote, Audit, Project Assessment, and Trade-In.
- Add catalogue search and category filters, a usable multi-item quote cart, and clear inspection/certification evidence for representative equipment.
- Complete the audit, trade-in, quote, and structured loan-evaluation experiences using the existing validated intake boundary and private uploads.
- Resolve current type/build issues, give each public route distinct metadata, then verify the pages and main flows in the running preview.

## Technical details
- Keep shared public UI under `src/components/site/` and page leaves under `src/routes/`.
- Preserve the current Lovable Cloud tables, private storage bucket, validation, and rate limiting; do not claim fabricated stock is live or certified.
- No payment gateway or email notification will be implied; quote terms and any owner email configuration remain offline/unconfigured.
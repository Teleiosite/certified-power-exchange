# Production deployment and operations

This application is a server-rendered TanStack Start app built with Nitro's Cloudflare target. The repository does not contain production account credentials or a deployment pipeline; CI validates changes but does not deploy them.

## Required configuration

Set runtime secrets in the deployment platform, not in Git:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL used by server-side clients. |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key for server-side client setup. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only inquiry insert, storage verification, and status updates. Never use a `VITE_` prefix. |
| `VITE_SUPABASE_URL` | Public Supabase URL compiled into the browser client. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public key compiled into the browser client; this is not a secret. |
| `RESEND_API_KEY` | Server-only Resend API key used for owner notifications. |
| `LAMPROS_NOTIFICATION_EMAIL` | Verified team mailbox that receives new inquiry notifications. |
| `LAMPROS_FROM_EMAIL` | Sender address verified with the email provider. |

All three notification variables must be set together. Production submissions are rejected if they are missing, so configure and verify delivery before opening the site to customers. Notification failures after an inquiry is stored are recorded as `failed`; the user confirmation remains successful to avoid creating duplicate inquiries on retry. Check for outstanding notifications with:

```sql
SELECT id, inquiry_type, created_at, notification_status
FROM public.lampros_inquiries
WHERE notification_status IN ('pending', 'failed')
ORDER BY created_at;
```

Notifications contain contact and project summary details, not uploaded files. Review attached documents only through an authorized, secured Supabase console.

`SUPABASE_PROJECT_ID` and the `VITE_*` project ID are optional metadata; the project URL is used by the clients. `LOVABLE_DB_MIGRATION_URL` is needed only by the Drizzle migration CLI. Use `.env.example` as a local starting point; never commit real environment values.

## Database and storage rollout

1. Back up the target Supabase project and verify restore access.
2. Apply all SQL files in `drizzle/migrations/` in numerical order using the project's migration process. `0002_production_intake_storage.sql` creates/locks the private assessment bucket, enforces upload size and MIME allowlists, and adds notification delivery status fields.
3. Verify `lampros-assessment-files` is private, limited to 10 MiB per object, and allows only PDF/JPEG/PNG/WebP. Anonymous users may upload only UUID-named objects and delete matching objects for abandoned/failed form submissions. Anonymous users must not be able to list or download objects.
4. Verify anonymous roles cannot select or modify inquiry and rate-limit rows; the server service-role key is the only application path for inquiry access.
5. Run a submission and confirm the inquiry row, private file access, notification delivery, and cleanup behavior. Do not test using real customer documents.

The `lampros_submission_limits` table stores one hashed address per rate-limit key. Monitor its growth and define a cleanup process appropriate to the deployed traffic and retention requirements.

## Build, release, and rollback

GitHub Actions runs dependency installation, ESLint, TypeScript, Vitest, and the production build on pull requests and pushes to `main`. Deployments remain manual until a hosting account, domain, environment variables, and release/rollback policy are selected.

Build with `bun install --frozen-lockfile && bun run build`. Use the Nitro output and Cloudflare deployment method supported by the connected Lovable/Cloudflare project. Verify the exact target and generated output in staging before production; no live deployment is performed by CI.

Apply database migrations before deploying code that depends on them. Keep a database backup and a known-good application release available. For rollback, restore the prior app build; database rollback must be planned separately and must not discard inquiry records or uploaded files.

## Go-live checklist requiring owner confirmation

- [ ] Select and test the production domain, TLS, hosting account, staging environment, and release/rollback owner. Confirm all subdomains support HTTPS before relying on the HSTS `includeSubDomains` directive.
- [ ] Set runtime secrets and validate `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and provider credentials without exposing them in logs.
- [ ] Apply and verify database migrations, RLS, storage bucket privacy/limits, backups, and a restore.
- [ ] Configure an authorized mailbox, verify the sender domain with Resend, and test delivery, bounce handling, and failed-notification review.
- [ ] Approve a privacy notice, terms, data-controller/business contact, applicable jurisdictional requirements, retention schedule, deletion process, and document access policy. This repository does not make a legal compliance determination.
- [ ] Decide whether malware scanning or quarantine is required for customer-uploaded documents and implement/operate it before accepting sensitive paperwork.
- [ ] Configure production error monitoring, alert routing, uptime checks, and an incident-response owner. Current server errors and notification failures are written to platform logs.
- [ ] Define and test a deployment-specific Content Security Policy after confirming the framework's hydration requirements and all asset/API origins; this app does not yet emit a CSP.
- [ ] Verify real browser flows in staging across mobile/desktop, including successful and rejected forms, upload limits, rate limiting, database outage behavior, and inquiry follow-up.
- [ ] Replace sample catalogue/equipment content with owner-verified information or retain the existing clear illustrative/non-live disclaimers.

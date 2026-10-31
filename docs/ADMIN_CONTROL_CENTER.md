# WaterWise Egypt — Admin Control Center

## Admin access and architecture
- Routes: \`/ar/manage\` and \`/en/manage\`. Admin hostname \`manage.wwe.alamein.site\` redirects the site root to \`/ar/manage\`.
- The management route has a separate shell, navigation, layout and design, but **is not a separate monorepo application**. Same Next.js project, shared Firebase Auth and protected API routes.
- **No secrets are exposed to the browser**. Every admin API requires a fresh, server-verified Firebase ID token with custom claim \`admin === true\`. Never use Firestore profile roles to authorize management.
- Admin detail and management endpoints: GET \`/api/admin/overview\`, GET \`/api/admin/users?limit=25&cursor=...\`, GET \`/api/admin/users?q=<exact-email-or-uid>\`, GET/PATCH \`/api/admin/users/[uid]\`, GET \`/api/admin/audit\`.
- Admin actions: enable/disable regular accounts and revoke their refresh tokens. No hard deletion or email/credential editing. Self-modification and changes to any administrator account are prohibited.
- Every action creates an \`adminAuditLogs\` document with actor, target, action, status, timestamp. Browser Firestore rules deny access; only trusted server Admin SDK can read/write. Audit log shows 50 latest events; events before deployment are not available.

## Reporting definitions
- Firebase Auth is authoritative for creation time, last sign-in, verified email, disabled status and providers. Last sign-in is **not** live activity telemetry.
- Self-reported challenge and leak-check completion and educational quiz scores are from \`users/{uid}/progress/current\`. Estimated daily water use is **not** measured savings.
- Reports scan up to 2500 Auth users per request, reading each progress document. When there are more, \`complete=false\` and the UI clearly labels statistics as partial. The API is bounded to reduce cost, but calls still incur Firestore reads. Consider a scheduled/materialized analytics collection or task for higher-scale usage.
- Account directory uses opaque Firebase Auth pagination tokens and 25/50 rows per page. Search is global **exact** email or UID; do not claim server-side substring search or sort.
- CSV export exports only the currently loaded page and can include personal information. Treat exports as sensitive, and use a protected workstation.

## Manual release checks
1. Anonymous user to /ar/manage and /en/manage: no admin data.
2. Signed-in user without admin claim: 403 from admin APIs and error on console.
3. Admin: overview stats, user pagination and exact email search; selected profile shows name, contact, registration, last login, quiz/challenge progress.
4. Test enable/disable/revoke only with a dedicated non-admin test account; confirm audit trail and no self-admin changes.
5. Narrow mobile and Arabic/English layouts, no public site navbar/footer on admin page.
6. Firebase Console metadata is the source of actual last sign-in. Test session revocation carefully: existing ID tokens can take time to refresh on clients.
7. Review data access, consent and retention before inviting real users or exporting PII. Admin use is for legitimate service operation only.

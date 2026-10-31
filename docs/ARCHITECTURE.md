# WaterWise Egypt — technical architecture and delivery contract

## Goal

One research-informed, bilingual (Arabic/English), responsive Next.js application for Egyptian university students and households, with a separately protected administration surface.

**Primary SDG:** 6. **Supporting SDGs:** 12 and 13. Educational outcomes and self-report must never be presented as verified water savings.

## Product routes

- Public: \`/{lang}\`, \`/{lang}/tools\`, \`/{lang}/learn\`, \`/{lang}/challenges\`, \`/{lang}/research\`, \`/{lang}/team\`.
- Signed-in: \`/{lang}/dashboard\`, \`/{lang}/profile\`.
- Admin (future): \`/{lang}/manage\`, under \`manage.wwe.alamein.site\` after verified hostname routing; fallback \`wwe.alamein.site/{lang}/manage\`.
- Locales: \`ar\` (RTL) and \`en\` (LTR).

## Firebase sign-in decision

Supported providers:
1. **Email/password:** requires email, password, display name and contact phone. Phone should be an E.164 formatted field, explicitly labeled unverified until SMS verification is implemented.
2. **Google login:** after first login collect any missing required profile fields, with explicit privacy notice.
3. **Phone/SMS sign-in:** different optional provider using SMS one-time codes, not phone number + password. Not part of MVP until SMS quota, abuse protection, and account linking are configured.

Require verified email before permitting sensitive account changes. Do not turn phone number into an identifier for password-based login without a dedicated, threat-modeled system.

## Planned Firestore layout

- \`users/{uid}\`: profile (displayName, phone, phoneVerifiedAt, roleDisplay? **not authoritative**, joinedAt). Users may edit only permitted profile fields and their own document; never mutable authorization fields.
- \`users/{uid}/quizAttempts/{id}\`: phase (pre/post), score, timestamp, assessment version.
- \`users/{uid}/checklists/{id}\`: checklist id and self-report fields.
- \`users/{uid}/challenges/{id}\`: completion claim and timestamp (self-report).
- \`users/{uid}/estimates/{id}\`: user inputs, assumption version, approximate value. Label estimated.
- \`auditLogs/{id}\`: admin-only actions; never writable by ordinary clients.

Firestore Security Rules deny by default; allow only the current user to read/write constrained own data. Admin reports should use server code with verified Firebase Auth session and admin claims, not permissive browser reads.

## Admin design

Admin sign-in uses Firebase Auth (with MFA strongly recommended), not a separate password table. Roles are granted via **trusted server-side Firebase custom claims** or a privileged role store; users cannot self-promote through their own profile. For every admin API endpoint:
1. Verify the session / ID token server-side.
2. Check admin role and, where practical, recent authentication and MFA.
3. Enforce the narrowest permission for account reports, aggregated metrics, user status.
4. Record significant admin actions in audit log.
5. Never expose passwords, Firebase Admin credentials, service-account private keys, or unrestricted \`listUsers\` to browsers.

MVP admin reports: total accounts, new registrations, active users, pre/post quiz aggregates, challenge/checklist submissions, device/user engagement. **Do not calculate actual saved liters** from hypothetical estimates or self-report logs.

## Privacy and ethics

Collect only data needed for the educational pilot. Give users a privacy notice, account deletion process, and optional participation in analytics. Store phone numbers only for a declared purpose, restrict admin visibility, and define a retention window. No public leaderboard of identifiable users without explicit opt-in. Anonymous aggregates preferred.

## Hosting and DNS

- Public origin: \`https://wwe.alamein.site/\`.
- Proposed management origin: \`https://manage.wwe.alamein.site/\`.
- The apex \`alamein.site\` uses external DNS hosting; create domain-specific DNS records there based on **exact Vercel project domain recommendations**, not assumed values. No wildcard is required for two explicit hostnames.
- Avoid sharing cross-subdomain auth cookies without careful CSRF/session rules. Protect admin at server authorization level regardless of hostname.
- Keep automatic preview deployments from feature branches; promote a reviewed build after tests.
- Config secrets belong in Vercel environment variables, never in the Git repository.

## Required assets

\`public/water-loading.svg\` is an **original-project SVG placeholder** until the owner's local \`Water Loading Animation.svg\` is uploaded. Do not claim it is the original artwork.

\`public/team/placeholder.svg\` is replaceable; actual profile photos and real LinkedIn URLs must be provided. Links must not lead to another student's guessed account.

## Quality gates

1. TypeScript typecheck and Next.js production build pass.
2. Keyboard navigation and mobile responsiveness pass manual inspection.
3. Arabic/English labels and directions verified.
4. Firebase auth and Firestore Rules tested with emulator users and admin roles before live signup.
5. Admin API tests reject anonymous users and forged user roles.
6. Calculations disclose assumptions; dashboard distinguishes learning/self-reports/estimates/meter readings.
7. Domain DNS, TLS, redirects, and OAuth authorized domains verified after release.

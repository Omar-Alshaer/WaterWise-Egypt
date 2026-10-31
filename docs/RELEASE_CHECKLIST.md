# WaterWise Egypt — release checklist (Cloud progress + Admin)

## What is implemented
- Next.js, Arabic RTL / English LTR, original water SVG splash, mobile components.
- Firebase Auth for email/password + Google (behind explicit activation flags).
- Firestore account profile updated via onSnapshot.
- Private activity document at \`users/{uid}/progress/current\`, synchronized with local device storage when signed in.
- Admin report UI at \`/ar/manage\` and \`/en/manage\`.
- Admin report API requiring server-verified Firebase ID token with trusted \`admin: true\` custom claim.
- Account deletion API requiring recent sign-in; removes Firestore user subtree and Auth user.
- Versioned Firestore rules with deny-by-default, owner-only reads and constrained writes.
- Educational dashboard distinguishes knowledge, estimates and user-reported actions (no metered savings).

## IMPORTANT before real production registration
1. Deploy **the latest** \`firestore.rules\` (previous rules do NOT allow progress saving), and test rules in Emulator with distinct users and invalid payloads.
2. Verify profile create, update, and rejected cross-account reads/writes. Ensure \`role\`, \`admin\`, and unexpected fields cannot be added to profile documents.
3. Set Firebase Auth providers and authorized domain \`waterwise-egypt.vercel.app\`, plus any preview/custom domain actually used.
4. Provide server-side Firebase Admin credentials **through Vercel project environment variables**, not source code, screenshots, logs, or chat:
   - \`FIREBASE_ADMIN_PROJECT_ID\`
   - \`FIREBASE_ADMIN_CLIENT_EMAIL\`
   - \`FIREBASE_ADMIN_PRIVATE_KEY\` (full PEM, escaped newlines acceptable)
5. Test account creation, logout, Google popup, password reset, email verification, cross-user separation and account deletion in a Firebase **test project** or dedicated test users.
6. Configure account/privacy notices, operational contact, data retention policy, and a recovery process for partial account deletion failures.
7. Only then explicitly set **BOTH** \`NEXT_PUBLIC_ENABLE_AUTH=true\` and \`NEXT_PUBLIC_FIRESTORE_RULES_VERIFIED=true\` for intended Vercel environment and redeploy. The latter is a **human attestation flag, not automated security verification**.

## First admin
Do not grant admin by editing a user profile. Use \`node scripts/grant-admin.mjs\` from a privileged local workstation with Firebase Admin SDK credentials in process environment:
\`ADMIN_BOOTSTRAP_EMAIL=<approved-account-email> node scripts/grant-admin.mjs\`.
The command sets \`admin:true\` only for exactly the email value explicitly provided as \`ADMIN_BOOTSTRAP_EMAIL\`. Never expose private keys or grant claims from browser code. Recommended: enable Firebase account MFA, establish separate admin identity and review access.

## Admin report scope
The report lists at most the **first 100** Firebase Auth accounts, and derives counts and averages from their private progress documents. This is intentionally a bounded **sample**, not full analytics for all users. Reading it incurs Firestore read charges. User records do not include passwords.

## Hosting
- Public domain target: \`wwe.alamein.site\`
- Separate admin domain target: \`manage.wwe.alamein.site\` (not yet configured). Until custom routing is implemented, admin is accessible at \`/ar/manage\` and \`/en/manage\` but API authorization remains server-enforced.
- Production: import repo into Vercel, verify build, Firebase env, DNS, TLS and OAuth authorized domains.

## QA
\`npm install && npm run typecheck && npm run build\` then verify \`/ar\`, \`/en\`, calculators, quiz, leak checklist, activity sync, admin denial for regular user, admin success with claim, and account deletion.

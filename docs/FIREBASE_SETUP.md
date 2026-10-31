# Batch 2 — Firebase Authentication & Firestore setup

The front-end auth and real-time profile listener are implemented. **Real accounts remain disabled until the owner configures Firebase and publishes the security rules.**

## Create and configure Firebase
1. Create or choose a Firebase project in [Firebase Console](https://console.firebase.google.com).
2. Add a Web app. Copy the four public keys from Project settings into \`.env.local\` locally and Vercel Environment Variables (preview/production as appropriate).
3. Authentication -> Sign-in method -> enable **Email/Password** and **Google**. Configure support email.
4. Keep `NEXT_PUBLIC_ENABLE_AUTH=false` until your Firestore rules, deletion flow and privacy policy are reviewed. Use `NEXT_PUBLIC_ENABLE_AUTH=true` in a controlled test environment only.
5. Authentication -> Settings -> Authorized domains: add the applicable Vercel preview/production hostname and (later) \`wwe.alamein.site\`. Use the exact Firebase documentation for popup/redirect OAuth when deploying custom domains.
6. Firestore Database -> Create database in production mode with an appropriate region. **Before users join**, publish the attached \`firestore.rules\` via Firebase CLI (\`firebase deploy --only firestore:rules\`) or paste into the Firestore Rules editor.
7. In Vercel redeploy the preview after setting environment variables. Test registration with a fresh test account and Google OAuth.
8. Verify no user can read another \`users/{uid}\` document or set unexpected fields such as \`role\`, \`isAdmin\`, or \`claims\`.
9. Configure password reset, verified-email workflows, privacy/retention and the account deletion flow before production launch.

**Contact phone is collected in E.164 format but is NOT verified or usable as a password sign-in identity.** SMS OTP login is a separate Firebase Auth provider and requires additional safeguards and budget/quota review.

## Schema and realtime behavior

\`users/{uid}\`: \`displayName\`, \`email\`, \`phone\`, \`phoneVerified=false\`, \`consentVersion\`, \`createdAt\`, \`updatedAt\`.

The front-end uses \`onAuthStateChanged\` and \`onSnapshot\` for realtime profile state. **Firestore quotas depend on reads/writes and plan; "free" is subject to published Firebase quotas.**

## Important safety checks

- Firestore rules are version-controlled but **not automatically deployed** merely because they exist in GitHub.
- Role assignment is intentionally absent in Batch 2. Future admin roles must be assigned by a trusted server process, not stored in writable profile fields.
- An OAuth user who has not completed the phone/consent onboarding cannot create a profile without explicit consent.
- Firebase Web API key is public; private service-account values must **never** be committed.
- Do not collect user data on live forms until privacy notice, data retention and deletion processes are operational.

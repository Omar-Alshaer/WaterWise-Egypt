# WaterWise final account and media integration

## User journey
- Header: **My Account** (only authenticated users see progress there). Legacy /{lang}/dashboard redirects to /{lang}/account.
- No standalone achievements item in the navigation. Profile shows personal information, quiz results, challenge/leak checks and estimates only after Firebase sign-in and profile completion.
- Calculator, challenges and quiz require sign-in. Each section has a localized page-specific sign-in prompt with a contextual mascot.
- Educational lesson cards and research/about pages remain readable without signing in.
- Browser local storage progress remains per-user only; unauthenticated save calls are refused. The Firebase account still owns and protects cloud data under Firestore rules.

## Media
- \`public/brand/og-image.png\` is used by Open Graph + Twitter share metadata.
- \`src/app/icon.svg\` is the vector favicon; welcome mascot is a high-resolution PNG icon fallback/touch icon.
- Mascots: welcome (home + splash), protecting-water (calculator), thinking (learning), celebrating (challenges), pointing-left (private account sign-in).
- Final research PDF in \`public/project/WaterWise-Egypt-Research.pdf\` renders in the About page. It is **public and downloadable** irrespective of hiding the viewer toolbar.

## Manual release QA
1. Check /ar and /en homepage on 360, 390, 430, 768 and 1440px viewports; ensure no horizontal overflow.
2. Open all three activity pages while logged out: correct different modal; Escape/close works, interactive actions unavailable after dismiss.
3. Sign in with Google and email accounts, complete profile as needed, verify account image and progress sync. Log out and confirm results are no longer shown.
4. Verify OG preview and favicon via /icon.svg, /brand/og-image.png and page source metadata; social networks may cache previously shared links.
5. Open /ar/about and verify PDF embedded and not incorrectly described as protected.
6. Test reduced-motion setting and keyboard tab focus in sign-in prompts.
7. Firebase Admin dashboard stays server-verified and must not be affected.

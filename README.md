# WaterWise Egypt — From Awareness to Action

Bilingual, responsive Next.js website built for an AIU sustainability project. Primary SDG 6; supporting SDGs 12 and 13.

## Development

Requires Node.js 22+. Run:

~~~bash
npm install
npm run dev
npm run typecheck
npm run build
~~~

Open http://localhost:3000/ar or http://localhost:3000/en.

## Delivery batches

1. **Foundation (this branch):** Next.js App Router, TypeScript, responsive design system, Lucide icons, Arabic/English routes, local-interaction prototypes, research and team pages.
2. **Firebase accounts:** real Google and Email/Password authentication; name and phone profile fields. Phone is not an authenticated credential unless separately verified with Firebase SMS OTP.
3. **Persist tools:** replace per-device demo storage with authenticated Firestore collections and restrictive rules.
4. **Admin:** server-verified Firebase Admin SDK sessions and authorization. No admin access is inferred from a Firestore field users can edit.
5. **Deploy:** end-to-end tests, privacy review, Vercel previews, DNS setup for wwe.alamein.site and optionally manage.wwe.alamein.site.

## Evidence and privacy

Manually entered water data are **illustrative estimates**, not measured usage; checklists and challenge completion are self-reports. No claim of verified saved liters. Local MVP data remain in browser storage until Firebase integration is configured.

## Loading asset

The original \`Water Loading Animation.svg\` is on the owner's PC and was **not** available in this environment. Replace \`public/water-loading.svg\` with the supplied original SVG (keep the destination name) when the file is uploaded.

## Team

Team member image placeholder: \`public/team/placeholder.svg\`; replace each member image reference in \`src/lib/content.ts\` after official photos are available. LinkedIn profile URLs are intentionally unset and should not be invented.

Repository: https://github.com/Omar-Alshaer/WaterWise-Egypt

# Authentication Starter

A complete account interface built with Next.js 15.5, React 18, TypeScript, Firebase and Tailwind CSS. Includes a public landing page, registration, email/password and Google sign-in, password recovery, a session-aware workspace, profile editing and an account-free demo.

**Live:** https://docker-next-firebase-auth.vercel.app/

## Run locally

Use Node.js 24 (Docker and Vercel) or Node.js 22.6+.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The home page and demo require no Firebase credentials. The demo stores only a fictional profile in sessionStorage; it never creates accounts, accepts a password, sends email or calls Firestore. Exit demo clears its data. If storage is blocked, it remains usable until reload.

## Checks and build

```sh
npm test
npm run typecheck
npm run build
npm start
```

Tests cover password whitespace preservation, registration policy, confirmation errors, email normalization, legacy login passwords, recovery validation and non-enumerating error messages. The production build statically renders public routes without initializing Firebase during server rendering.

## Firebase configuration

The original Firebase **public web configuration** remains as a fallback for this repository’s existing project. Override it for your own deployment using `.env.local` locally and Vercel environment variables in production:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-public-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_APP_ID=your-public-web-app-id
```

These are public client configuration values, not Admin SDK credentials. Never put a service account key or other private credential in a NEXT_PUBLIC variable.

1. Enable Email/Password and Google in Firebase Authentication.
2. Add localhost and your deployed hostname to Authentication’s authorized domains.
3. No Firestore database is required for the included account flows.
4. Firebase Authentication owns the display-name profile. Only deploy the optional Firestore rules if you independently add document storage.
5. Rebuild Vercel after changing public configuration.
6. With a disposable test account, verify registration, sign-in, profile update, reset-email delivery and sign-out. Confirm a different account cannot read or write that profile.

Account names are stored directly on the Firebase Authentication user with `updateProfile`. No Firestore reads, writes or rules are involved in the included flows. Existing accounts retain their Firebase display name. Legacy document profiles are left untouched. The optional rule files are retained for projects that later add a document database. Passwords and ID tokens are never logged or stored by the application.

## Authorization boundary

`ProtectedRoutes` is a **client-side UI guard**, not server-side access control. Firebase Authentication manages real sessions, and Firebase Authentication authorizes account profile updates. The demo’s sessionStorage marker grants no access to Firebase. This starter has no private server API. Before adding one, verify Firebase ID tokens or server session cookies on every protected server endpoint. Configure email verification requirements, abuse protection, monitoring, quotas and recovery templates for your production product.

The profile UI edits names. Email is read-only; password changes use Firebase’s emailed recovery flow rather than collecting a current password in the profile UI. A recovery confirmation is shown only after Firebase accepts the request, with wording that does not reveal account existence. Actual email delivery depends on Firebase configuration and the user’s mail provider.

## Docker

```sh
docker compose up --build
```

The multi-stage image uses Node 24 Alpine, `npm ci`, Next.js standalone output and an unprivileged runtime user. Firebase NEXT_PUBLIC overrides must be available **at build time**, since Next.js bundles them into client assets; otherwise the original public project configuration is used. Local environment files and node_modules are excluded from the Docker context.

## Vercel

Use the Next.js framework preset, the repository root, Node 24, install command `npm ci`, and build command `npm run build`. Keep Next.js’s output directory default. Pushes to the connected production branch build and deploy automatically. No secrets are required for the public pages or demo.

## Interface

Responsive layouts, labelled controls, keyboard focus states, a skip link, password visibility toggles and reduced-motion support. The landing page’s identity illustration uses CSS and icons rather than external image requests. The `/guide` page explains flows, Firebase setup and demo boundaries for visitors.

## Blue & copper account update
The interface now uses navy, blue and copper. Account display names are stored directly with Firebase Authentication `updateProfile`, so registration, sign-in and profile editing do not require a Firestore database or deployed profile rules. The included Firestore files are legacy, optional examples; they are not used by the app. No extra personal fields are stored. The account-free demo remains isolated in session storage.

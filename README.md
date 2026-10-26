# GAMEX Showcase

A standalone version of the GAMEX gaming arena discovery and booking interface.
It keeps the original page layouts and booking flow. Its production build no longer invokes the Figma Make / Payload configuration and does not require FIGMA_EID.

## Run locally

1. Install Node.js 24 LTS and pnpm.
2. In this folder run `pnpm install`.
3. Run `pnpm dev` and open http://localhost:3000.

## Demo behavior

- Sign in or use **Try demo account** to open a browser-only demo profile.
- Arena search, filters, booking, demo checkout, confirmation, profile, and bookings work in the current browser.
- Demo profile and bookings are stored in browser local storage. They do not sync across devices.
- Real account authentication, password recovery, a production database, and real payments are not configured. Do not enter real passwords or payment details.

## Deploy

Import this folder's GitHub repository into Vercel or Netlify as a Next.js application. Use `pnpm install` for the install command and `pnpm build` for the build command. No Figma Environment ID is required for this standalone copy.

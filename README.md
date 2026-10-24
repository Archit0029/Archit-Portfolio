# Archit Bishnoi — Portfolio

Personal portfolio for Archit Bishnoi, a BCA student and full-stack web and mobile developer.

**Live site:** https://architbishnoi-portfolio.vercel.app/

## Features

- Responsive, single-page portfolio built with React, TypeScript, Vite, and Tailwind CSS.
- Curated project links that remain available when GitHub or other external APIs are unavailable.
- Education, internship experience, and linked certificates.
- Resume download, GitHub/LinkedIn links, and a contact form with a direct-email fallback.
- Optional GitHub contribution activity with explicit loading, empty, and error states.
- Search and social metadata, structured data, `robots.txt`, and `sitemap.xml`.
- Keyboard navigation, visible focus indicators, skip link, and reduced-motion support.

Contact form messages are processed by FormSubmit and delivered to the email address shown on the site. The contact section also provides a direct `mailto:` link if the service is unavailable.

## Development

### Requirements

- Node.js
- npm

### Run locally

```bash
npm install
npm run dev
```

### Build for deployment

```bash
npm run build
```

Vite writes the production site to `dist/`. The project is configured for deployment to Vercel.

## Recovery backup

A pre-audit backup is available at [`backups/portfolio-before-audit-20261024-194109.zip`](./backups/portfolio-before-audit-20261024-194109.zip). To restore the earlier version, extract the archive to a separate folder, then copy the archived project files back into the repository.

## Main project paths

```text
index.html                 Active Vite HTML entry and SEO metadata
src/App.tsx                Portfolio page
src/data/portfolio.ts      Profile, education, experience, and certificates
src/services/               Contact form and optional GitHub integrations
public/                    Static metadata assets, robots.txt, and sitemap.xml
assets/                    App icons and resume source file
```

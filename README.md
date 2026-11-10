# loriscanolli.com — Personal Portfolio

Personal portfolio for **Loris Canolli** — IT Support Specialist, IT Administrator,
Full-Stack Developer, and Technology Enthusiast.

The site is a fully static Next.js application (App Router + TypeScript + Tailwind CSS)
built around a single content file, `src/data/portfolio.ts`. It is designed to be served
from any web server or CDN — no Node.js runtime is required in production.

- **Production domain:** https://loriscanolli.com
- **Output:** static HTML/CSS/JS in `out/`
- **Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, lucide-react

---

## Features

- **Single source of truth** — every piece of content (bio, experience, skills, projects,
  achievements, contact details, SEO copy) lives in `src/data/portfolio.ts`.
- **Hero** with headline, roles, availability status, primary CTAs, and CV download.
- **Sections:** About, Experience, Skills, Projects, Achievements, Contact.
- **Five projects** with honest status badges:
  - Finora — *Live — Production* (link to https://finora.loriscanolli.com)
  - Playground Life — *Completed* (1st Place — Prishtina Inovate Healthcare)
  - College TV Display System — *Completed*
  - Property Management System — *In Development*
  - E-Commerce Platform — *In Development*
- **Skills** grouped into IT Support, System Administration, Networking, Software
  Development, Databases, and Infrastructure & Deployment — no invented proficiency scores.
- **Interactive terminal** (`whoami`, `skills`, `projects`, `experience`, `help`, plus a
  few extras) with command history via ↑/↓.
- **Dark-first theme** with a manual light/dark toggle; preference is stored in
  `localStorage` and applied before first paint (no flash).
- **Contact form** with client-side validation and sending/success states. It has no
  backend: it composes a complete email and opens the visitor's mail client.
- **Accessibility:** skip link, semantic landmarks, labelled form fields with inline
  errors, visible focus styles, keyboard-friendly mobile navigation, `aria-live`
  terminal output, reduced-motion support.
- **SEO:** per-page metadata, canonical URL, Open Graph + Twitter cards, JSON-LD `Person`,
  `robots.txt`, `sitemap.xml`, web manifest, SVG favicon.
- **Responsive** from small phones to wide desktop layouts.
- **404 page** styled to match the site.

---

## Project structure

```
.
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          # Fonts, metadata, theme bootstrap, viewport
│  │  ├─ page.tsx            # Section assembly, skip link, JSON-LD
│  │  ├─ globals.css         # Design tokens, themes, utilities
│  │  ├─ not-found.tsx       # 404 page
│  │  ├─ robots.ts           # robots.txt (force-static)
│  │  ├─ sitemap.ts          # sitemap.xml (force-static)
│  │  ├─ manifest.ts         # web app manifest
│  │  └─ icon.svg            # Favicon
│  ├─ components/
│  │  ├─ Navbar.tsx          # Responsive nav + mobile menu + active section
│  │  ├─ Hero.tsx            # Headline, status, CTAs, terminal
│  │  ├─ Terminal.tsx        # Interactive terminal
│  │  ├─ About.tsx
│  │  ├─ Experience.tsx
│  │  ├─ Skills.tsx
│  │  ├─ Projects.tsx
│  │  ├─ Achievements.tsx
│  │  ├─ Contact.tsx
│  │  ├─ ContactForm.tsx
│  │  ├─ Footer.tsx
│  │  ├─ SectionHeading.tsx
│  │  ├─ StatusBadge.tsx
│  │  ├─ ThemeToggle.tsx
│  │  ├─ CopyrightYear.tsx
│  │  └─ BrandIcons.tsx      # Inline GitHub / LinkedIn SVGs
│  ├─ data/portfolio.ts      # ← ALL CONTENT LIVES HERE
│  └─ lib/utils.ts           # cn() helper
├─ scripts/generate-cv.mjs   # Dependency-free CV PDF generator
├─ public/
│  ├─ og-image.png           # 1200×630 social preview
│  └─ cv/Loris-Canolli-CV.pdf
├─ next.config.ts            # output: "export", trailingSlash: true
└─ package.json
```

---

## Editing content

Open **`src/data/portfolio.ts`** and edit the exported objects:

| Export          | What it controls                                                    |
| --------------- | ------------------------------------------------------------------- |
| `siteConfig`    | Name, domain, titles, hero copy, availability, location, CV path, SEO, social links |
| `navLinks`      | Navigation items                                                    |
| `about`         | Bio paragraphs, role cards, "at a glance" facts                     |
| `experience`    | Intro + IT Support / IT Administration / Networking responsibility lists |
| `skills`        | Skill groups and the toolchain row                                  |
| `projects`      | Project cards, statuses, highlights, technologies, links            |
| `achievement`   | Awards section                                                      |

Adding a project is a matter of appending an object to `projects`. `status` accepts
`"live" | "completed" | "development"`; `links.live` and `links.github` are optional.

### Placeholders to replace

These values are intentionally marked `[PLACEHOLDER]` in the source and must be replaced
with real information before the site is announced widely:

| Field                    | Current placeholder                            | Location                    |
| ------------------------ | ---------------------------------------------- | --------------------------- |
| Email                    | `contact@loriscanolli.com`                     | `siteConfig.social.email`   |
| LinkedIn                 | `https://www.linkedin.com/in/loriscanolli`     | `siteConfig.social.linkedin`|
| GitHub                   | `https://github.com/loriscanolli`              | `siteConfig.social.github`  |

Also review `location: "Kosovo"` and `availability` in `siteConfig` if they change.

The email address is used by the contact form (`mailto:`), the contact section, and the
footer — updating it in `portfolio.ts` updates all three at once.

---

## CV PDF

The downloadable CV is generated by a zero-dependency Node script:

```bash
npm run cv
```

That writes `public/cv/Loris-Canolli-CV.pdf`. The script's content mirrors
`src/data/portfolio.ts`, so update both when your professional details change. The file
is committed to the repository and copied into `out/` by the build.

---

## Local development

Requirements: **Node.js 20+** (Next.js 15 requires 18.18 or newer) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> **Windows note:** if PowerShell blocks `npm.ps1` (execution policy), use `npm.cmd`
> instead of `npm` for every command in this document.

Useful scripts:

| Command             | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Development server with hot reload                           |
| `npm run build`     | Type-check, lint, and produce the static export in `out/`    |
| `npm run typecheck` | TypeScript only (`tsc --noEmit`)                             |
| `npm run lint`      | ESLint                                                       |
| `npm run cv`        | Regenerate the CV PDF                                        |

### Previewing the production build locally

`next build` writes a static site to `out/`. Serve it with any static server, for example:

```bash
npx serve out
```

The site uses directory-style URLs (`trailingSlash: true`), so `/about/`-style paths map
to `about/index.html`. The portfolio is a single page with hash links, so this mostly
affects 404 handling.

---

## Deployment — loriscanolli.com

### 1. Build

```bash
npm run build
```

The deployable artifact is the **`out/`** directory. It contains:

```
out/
├─ index.html
├─ 404.html
├─ robots.txt
├─ sitemap.xml
├─ manifest.webmanifest
├─ icon.svg
├─ og-image.png
├─ cv/Loris-Canolli-CV.pdf
└─ _next/static/...
```

### 2. Apache (origin server)

Upload the **contents** of `out/` to the document root for the site, e.g.
`/var/www/loriscanolli.com/`:

```bash
rsync -av --delete out/ user@server:/var/www/loriscanolli.com/
```

Minimal virtual host:

```apache
<VirtualHost *:80>
    ServerName loriscanolli.com
    ServerAlias www.loriscanolli.com
    DocumentRoot /var/www/loriscanolli.com

    <Directory /var/www/loriscanolli.com>
        Options -Indexes
        AllowOverride None
        Require all granted
        DirectoryIndex index.html
        ErrorDocument 404 /404.html
    </Directory>

    # Long-lived caching for hashed build assets
    <LocationMatch "^/_next/static/">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </LocationMatch>

    # Revalidate HTML and metadata files
    <FilesMatch "\.(html|xml|txt|webmanifest)$">
        Header set Cache-Control "public, max-age=0, must-revalidate"
    </FilesMatch>

    # Compression
    AddOutputFilterByType DEFLATE text/html text/css application/javascript \
        application/json image/svg+xml text/plain text/xml

    # Redirect HTTP → HTTPS (if TLS terminates here)
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>
```

If you terminate TLS at Cloudflare (recommended), keep the origin on HTTP and use
Cloudflare's **Full (strict)** mode with an Origin Certificate instead of the rewrite
above.

Enable the required modules as needed: `rewrite`, `headers`, `deflate`, `ssl`.

### 3. Cloudflare (DNS, TLS, CDN)

1. Add `loriscanolli.com` to Cloudflare and point the nameservers at Cloudflare.
2. Create DNS records for the origin server:
   - `A` `@` → origin IPv4 (proxied)
   - `A` `www` → origin IPv4 (proxied)
   - `AAAA` records if the origin has IPv6.
3. **SSL/TLS → Overview:** *Full (strict)* with a Cloudflare Origin Certificate installed
   on Apache (or *Flexible* only if the origin has no TLS at all).
4. **SSL/TLS → Edge Certificates:** enable *Always Use HTTPS* and *Automatic HTTPS
   Rewrites*; set the minimum TLS version to 1.2.
5. **Rules → Redirect Rules:** redirect `www.loriscanolli.com/*` → `https://loriscanolli.com/$1`
   (301) if you prefer the apex domain as canonical.
6. **Caching → Configuration:** standard caching is fine. The hashed `/_next/static/*`
   files are immutable; HTML is revalidated by the origin headers above.
7. After the first deploy, purge the Cloudflare cache so the new build is served.

### Alternative: Vercel / Netlify

The project also deploys as-is to Vercel (static export is detected automatically).
On Netlify, set the build command to `npm run build` and the publish directory to `out`.
Remember that the contact form is `mailto:`-based; no server function is required.

---

## SEO checklist after deploy

- Confirm `https://loriscanolli.com/robots.txt` and `/sitemap.xml` return 200.
- Submit the sitemap in Google Search Console and Bing Webmaster Tools.
- Verify the canonical URL and that `www` redirects to the chosen canonical host.
- Test the Open Graph card with the Facebook Sharing Debugger / LinkedIn Post Inspector
  (image: `/og-image.png`, 1200×630).
- Validate structured data with the Schema.org validator (JSON-LD `Person` is emitted in
  `src/app/page.tsx`).
- The site ships no analytics or third-party trackers; add one only if you need it.

---

## Notes

- **Contact form:** client-side only. To send directly without a mail client, replace the
  `window.setTimeout(...)` block in `src/components/ContactForm.tsx` with a `fetch()` to
  Formspree, Web3Forms, or your own endpoint.
- **Terminal:** purely local simulation — commands map to data from `portfolio.ts`; no
  shell access and no network calls.
- **Theme:** dark is the default; the toggle writes `localStorage.theme` and the inline
  script in `layout.tsx` applies it before paint.
- **Fonts:** Geist and Geist Mono are loaded through `next/font` and self-hosted in the
  build output (no runtime request to Google).
- **Static export constraints:** no server actions, route handlers, or image optimization
  at runtime. Keep new pages static, and add `export const dynamic = "force-static"` to
  metadata routes.

---

© Loris Canolli. All rights reserved.

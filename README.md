# Loris Canolli - Portfolio

Personal portfolio for **Loris Canolli** - IT Support Specialist, IT Administrator,
Full-Stack Developer, and technology enthusiast.

The repository builds a fully static Next.js site with two ways to explore the same
content:

- **`/` - the immersive portfolio**: one persistent WebGL world with seven stations,
  camera travel, 3D objects, and HTML content panels.
- **`/standard/` - the accessible document portfolio**: the same profile, experience,
  skills, projects, achievements, and contact details without 3D navigation.
- **No-JavaScript fallback**: a readable static document is rendered on `/` when scripts
  do not run. Visitors can continue to `/standard/` for the full content.

The 3D layer is an enhancement, never a gate. All portfolio information is available in
HTML, and the site falls back to useful links when WebGL is unavailable or the scene
fails to start.

- **Intended production domain:** https://loriscanolli.com
- **Build output:** static HTML/CSS/JS in `out/`
- **Runtime requirement:** any static web server or CDN; no Node.js server is required

> **Deployment status:** this workspace has not been deployed to the public domain.
> `loriscanolli.com` currently serves a GoDaddy-hosted site behind Cloudflare. Inspect the
> existing origin, Apache configuration, Cloudflare settings, and hosted applications
> before replacing anything. See [Deployment](#deployment).

---

## Stack

- Next.js 15 (App Router, static export)
- React 19 and TypeScript
- Three.js, React Three Fiber, and Drei
- Framer Motion for interface transitions
- Tailwind CSS v4 for the standard route and HTML overlays
- lucide-react for interface icons

The only runtime content dependency is `src/data/portfolio.ts`.

---

## Features

### Immersive route (`/`)

- A single full-viewport canvas with seven stations arranged along one corridor:
  Home, About, Experience, Skills, Projects, Achievements, and Contact.
- Smooth station-to-station camera movement, pointer parallax, reset view, click-to-explore,
  and mouse, touch, keyboard, wheel, and menu navigation.
- A dark architectural environment with platforms, racks, network hardware, monitors,
  project pedestals, a trophy, a communication terminal, atmospheric lighting, and
  restrained particles.
- HTML content panels above the 3D layer, plus an accessible inspector drawer for
  project, experience, skill, artifact, award, and contact details.
- Hash deep links such as `/#about`, `/#projects`, and `/#contact`.
- Persistent header navigation, section rail, mobile menu, previous/next controls, and
  current-station context.
- Loading screen with progress and a skip link to the accessible portfolio.
- WebGL-disabled and scene-failure fallbacks with direct links to `/standard/`.
- Reduced-motion mode, visibility pause, adaptive device pixel ratio, mobile geometry
  simplification, and GPU/context cleanup.

### Content coverage

- **Home:** the name LORIS CANOLLI with the IT Support Specialist, IT Administrator, and
  Full-Stack Developer identities.
- **About:** interactive infrastructure, support, development, and problem-solving
  objects with information panels.
- **Experience:** a 3D IT environment with racks, desktops, switches, routers, devices,
  printers, cables, and monitoring screens that reveal real responsibilities.
- **Skills:** a connected technology network with clickable categories and practical-usage
  descriptions.
- **Projects:** separate exhibits for Finora, Playground Life, College TV, Property
  Management, and E-Commerce, including descriptions, technologies, status, available
  links, and distinguishing visual concepts.
- **Achievements:** a premium trophy and award record for the first-place win at Prishtina
  Inovate Healthcare with Playground Life.
- **Contact:** a 3D communication terminal plus email, LinkedIn, GitHub, and a validated
  contact form.

### Standard route (`/standard/`)

- Semantic, document-style portfolio with all sections and real HTML links.
- Dark and light theme support.
- Keyboard-friendly navigation and mobile layout.
- Still fully static and deployable from the same `out/` directory.

---

## Getting started

Requirements: **Node.js 20+** and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the immersive route or
http://localhost:3000/standard/ for the accessible route.

> **Windows note:** if PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm`.

Useful commands:

| Command             | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Development server with hot reload                        |
| `npm run typecheck` | TypeScript only (`tsc --noEmit`)                          |
| `npm run lint`      | ESLint                                                    |
| `npm run build`     | Production build and static export to `out/`              |
| `npm run cv`        | Regenerate the CV PDF from the content data               |

`npm run build` also performs Next.js type and lint validation.

---

## Project structure

```text
src/
  app/
    layout.tsx                 Metadata, fonts, theme bootstrap, html.js marker
    page.tsx                   Immersive entry point, Person JSON-LD, no-JS fallback
    standard/page.tsx          Accessible document route
    globals.css                World, standard-route, fallback, responsive, and
                               reduced-motion styles
    robots.ts                  Static robots.txt
    sitemap.ts                 Static sitemap.xml
    manifest.ts                Web app manifest
    not-found.tsx              404 page
  components/
    immersive/
      ImmersiveExperience.tsx  World shell, navigation, loader, fallback, interaction
      WorldScene.tsx           Three.js world, stations, camera rig, renderer lifecycle
      StationContent.tsx       HTML content for every station
      DetailDrawer.tsx         Accessible inspector for objects and records
    StandardPortfolio.tsx      Accessible document composition
    NoScriptFallback.tsx       Static no-JavaScript document
    ...                        Shared/legacy section components used by /standard/
  data/
    portfolio.ts               Every piece of content and world metadata
  lib/
    world.ts                   Selection types and content lookups
    use-environment.ts         Viewport, visibility, motion, and WebGL hooks
public/
  og-image.png                 1200x630 social preview
  cv/Loris-Canolli-CV.pdf      Downloadable CV
```

The project is intentionally a single static export. There are no server actions, route
handlers, or runtime image optimizations.

---

## Editing content

Open **`src/data/portfolio.ts`**. It is the single source of truth for both routes and the
3D world.

| Export               | Controls                                                        |
| -------------------- | --------------------------------------------------------------- |
| `siteConfig`         | Name, domain, titles, bio copy, availability, location, CV, SEO, social links |
| `navLinks`           | Standard-route navigation                                       |
| `about`              | Bio, role cards, and quick facts                                |
| `aboutArtifacts`     | The four interactive About objects                              |
| `experience`         | Experience areas and responsibility lists                       |
| `experienceObjects`  | Mapping between 3D experience objects and source content        |
| `infrastructure`     | Network topology and infrastructure descriptions                |
| `skills`             | Skill categories and technology lists                           |
| `skillDetails`       | Practical usage copy for each skill category                    |
| `toolchain`          | Toolchain row                                                   |
| `projects`           | Project exhibits, statuses, highlights, technologies, and links |
| `achievement`        | Award title, event, project, and description                    |
| `worldStations`      | The seven station labels, summaries, and indexes                |

A project can be added by appending an object to `projects`. `status` accepts
`"live" | "completed" | "development"`; `links.live` and `links.github` are optional.
When a public link does not exist, the interface shows an honest "no public link
available" state instead of inventing one.

### Placeholders to replace

These values are intentionally marked `[PLACEHOLDER]` in the source:

| Field    | Current value                              | Location                      |
| -------- | ------------------------------------------ | ----------------------------- |
| Email    | `contact@loriscanolli.com`                 | `siteConfig.social.email`     |
| LinkedIn | `https://www.linkedin.com/in/loriscanolli` | `siteConfig.social.linkedin`  |
| GitHub   | `https://github.com/loriscanolli`          | `siteConfig.social.github`    |

Update them before announcing the site widely.

The contact form is client-side only. It validates the fields, composes a complete email,
and opens the visitor's mail client with `mailto:`. There is no backend or form service.
Replace the submission logic in `src/components/ContactForm.tsx` if direct delivery is
required.

---

## 3D performance and accessibility

The immersive route is built so the content remains available even when the graphics
layer cannot run:

- The WebGL probe checks for **WebGL2**, which is what the current Three.js renderer
  requires.
- The scene module is dynamically imported and mounted only after the page is idle.
- Rendering pauses while the page is hidden, and the startup timeout only runs while the
  page is visible. A background-tab load therefore does not become a false failure.
- Device pixel ratio is capped, antialiasing is disabled on mobile, geometry is low-poly,
  and particle counts are reduced on small screens.
- Reduced-motion mode uses demand rendering and disables ambient motion.
- The renderer disposes geometries, materials, textures, and the WebGL context when the
  canvas unmounts. Disposal is deferred so React StrictMode remounts do not destroy a live
  renderer.
- The canvas is marked decorative (`aria-hidden`); station content and controls are real
  HTML.
- Keyboard controls, focus management, skip links, visible focus styles, form errors,
  live region announcements, and a focus-trapped drawer/menu are included.
- If WebGL is unavailable, data saver is enabled, or scene startup fails, the fallback
  offers the accessible portfolio, CV, section links, and contact details.

---

## Local production check

Build the static site, then serve `out/` with any static server:

```bash
npm run build
npx serve out
```

Open the printed URL and verify:

1. `/` initializes the canvas, hides the loader, and shows the Home panel.
2. Header buttons, the section rail, wheel, arrow keys, touch swipes, and the mobile menu
   change stations and update `aria-current`.
3. `/#projects` and `/#contact` open the matching station.
4. A project row opens the inspector; Escape closes it and focus returns to the trigger.
5. The contact form blocks empty or invalid submissions.
6. `/standard/` renders without the immersive shell and remains readable at mobile width.
7. With JavaScript disabled, the static no-JS document is readable and links to
   `/standard/`.
8. With WebGL disabled, the fallback appears instead of the canvas.
9. `prefers-reduced-motion: reduce` removes ambient animation.

Because this is a static export with directory-style URLs, `/` maps to `index.html` and
`/standard/` maps to `standard/index.html`.

---

## Deployment

The deployable artifact is the **`out/`** directory:

```text
out/
  index.html
  404.html
  robots.txt
  sitemap.xml
  manifest.webmanifest
  icon.svg
  og-image.png
  cv/Loris-Canolli-CV.pdf
  standard/index.html
  _next/static/...
```

### Before deploying

The public domain is currently not this portfolio. It resolves through Cloudflare to a
GoDaddy-hosted application. Do not overwrite it blindly.

Before changing DNS or uploading files, confirm:

- Which origin server and document root serve `loriscanolli.com`.
- Whether Apache virtual hosts, rewrites, headers, or other applications share the origin.
- Which Cloudflare DNS records, proxy settings, TLS mode, and cache rules are active.
- Whether `finora.loriscanolli.com` or other subdomains depend on the same origin.
- That a backup exists and a rollback path is available.
- That the deployment mechanism and credentials are approved.

No SSH key, Apache configuration, Cloudflare token, or deployment script is stored in this
repository.

### Apache example

If the origin is an Apache server dedicated to this site, upload the **contents** of
`out/` to the document root:

```bash
rsync -av --delete out/ user@server:/var/www/loriscanolli.com/
```

A minimal virtual host:

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

    <LocationMatch "^/_next/static/">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </LocationMatch>

    <FilesMatch "\.(html|xml|txt|webmanifest)$">
        Header set Cache-Control "public, max-age=0, must-revalidate"
    </FilesMatch>

    AddOutputFilterByType DEFLATE text/html text/css application/javascript \
        application/json image/svg+xml text/plain text/xml
</VirtualHost>
```

Enable `rewrite`, `headers`, `deflate`, and `ssl` as needed. If TLS terminates at
Cloudflare, use Full (strict) with a Cloudflare Origin Certificate on the origin rather
than a local HTTP-to-HTTPS rewrite.

### Cloudflare checklist

1. Verify the existing DNS records and proxied hostnames.
2. Set SSL/TLS to Full (strict) only after the origin certificate is installed.
3. Enable Always Use HTTPS.
4. Keep hashed `/_next/static/*` assets immutable and revalidate HTML.
5. Purge the cache after the first deployment.
6. Confirm that `www` and the apex domain use the intended canonical redirect.

### Other hosts

The same `out/` directory works on Vercel, Netlify, Cloudflare Pages, or any static host.
The contact form still requires a mail client because there is no backend.

---

## SEO and metadata

- Per-route metadata, canonical URLs, Open Graph, and Twitter cards are in
  `src/app/layout.tsx` and `src/app/standard/page.tsx`.
- `/` emits JSON-LD `Person` structured data.
- `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, and a favicon are generated by the
  static export.
- The social preview image is `public/og-image.png`.
- No analytics or third-party trackers are included.

After deployment, verify `/robots.txt` and `/sitemap.xml` return 200, test the social
preview, validate the structured data, and confirm the `www` redirect.

---

## Notes

- The CV is generated by a dependency-free Node script: `npm run cv` writes
  `public/cv/Loris-Canolli-CV.pdf`. Keep it in sync with `src/data/portfolio.ts`.
- The immersive world stores station positions in `src/components/immersive/WorldScene.tsx`.
  Content stays in `src/data/portfolio.ts`; world placement and visual composition live in
  the scene.
- The standard route reuses the existing section components. The immersive route has its
  own HTML station content and inspector.
- Fonts are self-hosted through `next/font`.
- Static export constraints apply: no server actions, route handlers, or runtime image
  optimization.

---

© Loris Canolli. All rights reserved.

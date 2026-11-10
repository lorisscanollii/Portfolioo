#!/usr/bin/env node
/**
 * Generates public/cv/Loris-Canolli-CV.pdf
 *
 * Run with:  npm run cv
 *
 * The content mirrors src/data/portfolio.ts — keep both in sync when you
 * update your professional information.
 *
 * This script deliberately has zero dependencies: it writes the PDF directly,
 * using the standard PDF 1.4 object model with the built-in Helvetica fonts.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(__dirname, "../public/cv/Loris-Canolli-CV.pdf");

/* ── Page geometry ──────────────────────────────────────────────────────── */

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89; // A4
const MARGIN = 50;

const ACCENT = "0.02 0.47 0.34"; // dark emerald
const TEXT = "0.08 0.11 0.14";
const MUTED = "0.35 0.40 0.44";
const RULE = "0.82 0.86 0.88";

/* ── PDF helpers ────────────────────────────────────────────────────────── */

function escapeText(text) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    if (current.length === 0) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const pages = [];
let ops = [];
let y = 0;

function startPage() {
  ops = [];
  y = PAGE_H - MARGIN;
  pages.push(ops);
}

function ensureSpace(height) {
  if (y - height < MARGIN) startPage();
}

/**
 * Writes a wrapped paragraph. `indent` applies to the first line,
 * `contIndent` to the wrapped continuation lines.
 */
function paragraph(text, options = {}) {
  const {
    size = 9,
    bold = false,
    color = TEXT,
    indent = 0,
    contIndent = 0,
    gap = 3,
  } = options;
  const font = bold ? "/F2" : "/F1";
  const usable = PAGE_W - 2 * MARGIN - Math.max(indent, contIndent);
  // Conservative average character width for Helvetica (~0.5em).
  const maxChars = Math.floor(usable / (size * 0.5));
  const lines = wrapText(text, maxChars);

  lines.forEach((lineText, index) => {
    const indentForLine = index === 0 ? indent : contIndent;
    ensureSpace(size + gap);
    ops.push(
      `BT ${font} ${size} Tf ${color} rg ${MARGIN + indentForLine} ${y} Td (${escapeText(lineText)}) Tj ET`,
    );
    y -= size + gap;
  });
}

function spacer(height = 8) {
  y -= height;
}

function horizontalRule() {
  ensureSpace(8);
  ops.push(`${RULE} RG 0.7 w ${MARGIN} ${y} m ${PAGE_W - MARGIN} ${y} l S`);
  y -= 12;
}

function sectionHeading(title) {
  spacer(6);
  ensureSpace(20);
  paragraph(title, { size: 11, bold: true, color: ACCENT, gap: 2 });
  spacer(4);
}

function bullet(text, indent = 10) {
  paragraph(`- ${text}`, { indent, contIndent: indent + 8, gap: 1.5 });
}

/* ── CV content ─────────────────────────────────────────────────────────── */

startPage();

// Header
paragraph("LORIS CANOLLI", { size: 20, bold: true, gap: 4 });
paragraph(
  "IT Support Specialist | IT Administrator | Full-Stack Developer | Technology Enthusiast",
  { size: 10, bold: true, color: ACCENT, gap: 4 },
);
paragraph("loriscanolli.com  |  contact@loriscanolli.com  |  Kosovo", {
  size: 9,
  color: MUTED,
});
horizontalRule();

// Summary
sectionHeading("SUMMARY");
paragraph(
  "I'm Loris Canolli, an IT professional and full-stack developer passionate about technology, infrastructure, system administration, and software development.",
);
spacer(3);
paragraph(
  "My work combines practical IT support with the development and deployment of modern web applications. I work with hardware, operating systems, networks, organizational IT systems, servers, databases, and application development.",
);
spacer(3);
paragraph(
  "I enjoy troubleshooting technical problems, maintaining reliable IT environments, automating processes, and building applications that solve real-world problems.",
);

// Experience
sectionHeading("PROFESSIONAL EXPERIENCE");
paragraph(
  "IT support within an educational institution, covering end-user support, system administration, and network operations.",
  { color: MUTED },
);
spacer(3);

paragraph("IT Support", { size: 9.5, bold: true, color: ACCENT, gap: 2 });
[
  "Providing technical assistance to academic staff and students.",
  "Troubleshooting Windows computers.",
  "Diagnosing hardware and software problems.",
  "Installing and configuring operating systems.",
  "Printer installation, configuration, and troubleshooting.",
  "Supporting classrooms and examination rooms.",
  "Troubleshooting computer peripherals.",
  "Providing remote technical assistance.",
  "Resolving daily office IT problems.",
].forEach((item) => bullet(item));

spacer(3);
paragraph("IT Administration", { size: 9.5, bold: true, color: ACCENT, gap: 2 });
[
  "Google Workspace administration (Google Admin Console).",
  "Managing user accounts, password resets, and account security.",
  "Managing organizational groups.",
  "Account suspension and administration.",
  "Supporting Moodle.",
  "Windows administration.",
  "Linux administration (Ubuntu Server).",
  "SSH and remote server management.",
  "Apache configuration.",
  "Cloudflare.",
  "Tailscale.",
].forEach((item) => bullet(item));

spacer(3);
paragraph("Networking", { size: 9.5, bold: true, color: ACCENT, gap: 2 });
[
  "Network troubleshooting and diagnostics.",
  "TCP/IP, DNS, and DHCP.",
  "Wi-Fi configuration.",
  "Router and access point troubleshooting.",
  "Basic Cisco IOS configuration.",
].forEach((item) => bullet(item));

// Skills
sectionHeading("TECHNICAL SKILLS");
const skillCategories = [
  [
    "IT Support",
    "Windows troubleshooting, hardware and software diagnostics, OS installation and configuration, printers and peripherals, remote assistance, classroom and exam room support",
  ],
  [
    "System Administration",
    "Google Workspace, Google Admin Console, user account management, account security, Windows, Linux, Ubuntu Server, SSH, Apache, Moodle, Cloudflare, Tailscale",
  ],
  [
    "Networking",
    "TCP/IP, DNS, DHCP, Wi-Fi configuration, routers and access points, basic Cisco IOS, network diagnostics",
  ],
  [
    "Software Development",
    "HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, REST APIs, Python",
  ],
  ["Databases", "MySQL, MariaDB, SQL, Prisma ORM"],
  [
    "Infrastructure and Deployment",
    "Ubuntu Server, Linux, Apache, Docker, Cloudflare, Git, GitHub, SSH",
  ],
  [
    "Developer Tools",
    "Visual Studio Code, OpenCode, Git, Terminal, PowerShell, Command Prompt",
  ],
];
for (const [category, items] of skillCategories) {
  paragraph(category, { size: 9.5, bold: true, color: ACCENT, gap: 1.5 });
  paragraph(items, { indent: 10, gap: 2.5 });
  spacer(2);
}

// Projects
sectionHeading("SELECTED PROJECTS");
const projectEntries = [
  [
    "Finora - Personal Finance Management (Live in production)",
    "Full-stack personal finance platform for managing financial activities, monitoring transactions, analyzing data, and organizing finances. Next.js, TypeScript, React, Prisma, MariaDB, Node.js, Ubuntu Server, Apache, Cloudflare.",
    "Live at https://finora.loriscanolli.com - developed and deployed end-to-end on my own server infrastructure.",
  ],
  [
    "Playground Life - Social Play for Autism (Completed)",
    "Interactive educational application supporting autistic children through structured games, social interaction, and learning activities. Child mode, therapist mode, PIN-protected dashboard, interactive educational games, sensory customization, learning levels, tablet-oriented interface, individual and shared play.",
    "1st Place Winner - Prishtina Inovate Healthcare.",
  ],
  [
    "College TV Display System (Completed)",
    "Digital display application that automatically retrieves and displays daily lecture schedules using the Google Calendar API. Python, HTML, CSS, JavaScript.",
    "",
  ],
  [
    "Property Management System (In development)",
    "Platform for managing properties, apartments, tenants, and administrative operations, with role-based permissions, administrative dashboard, document generation, notifications, and financial management. Next.js, TypeScript, MySQL, Prisma.",
    "",
  ],
  [
    "E-Commerce Platform (In development)",
    "Modern e-commerce platform with product management, customer accounts, order processing, manager permissions, analytics, real-time notifications, and administration. Next.js, TypeScript, MySQL, Prisma.",
    "",
  ],
];
for (const [title, description, footer] of projectEntries) {
  paragraph(title, { size: 9.5, bold: true, gap: 2 });
  paragraph(description, { indent: 10, contIndent: 10, gap: 2 });
  if (footer) {
    paragraph(footer, { indent: 10, contIndent: 10, color: MUTED, gap: 2 });
  }
  spacer(3);
}

// Achievements
sectionHeading("ACHIEVEMENTS");
paragraph("1st Place Winner - Prishtina Inovate Healthcare", {
  size: 10,
  bold: true,
  color: ACCENT,
  gap: 2,
});
paragraph("Project: Playground Life - Social Play for Autism", { gap: 2 });
paragraph(
  "Recognized for developing an innovative healthcare technology solution focused on supporting autistic children through interactive learning and social play.",
  { color: MUTED },
);

/* ── PDF assembly ───────────────────────────────────────────────────────── */

const objects = [];
const addObject = (content) => {
  objects.push(content);
  return objects.length; // object number
};

// Reserve: 1 = Catalog, 2 = regular font, 3 = bold font, 4 = Pages tree.
const catalogNum = addObject("");
const fontRegularNum = addObject(
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
);
const fontBoldNum = addObject(
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
);
const pagesNum = addObject("");

const pageObjectNums = [];
for (const pageOps of pages) {
  const stream = pageOps.join("\n");
  const streamLength = Buffer.byteLength(stream, "latin1") + 1; // + trailing EOL
  const contentNum = addObject(
    `<< /Length ${streamLength} >>\nstream\n${stream}\nendstream`,
  );
  const pageNum = addObject(
    `<< /Type /Page /Parent ${pagesNum} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Resources << /Font << /F1 ${fontRegularNum} 0 R /F2 ${fontBoldNum} 0 R >> >> ` +
      `/Contents ${contentNum} 0 R >>`,
  );
  pageObjectNums.push(pageNum);
}

// Fill in the reserved objects now that every number is known.
objects[catalogNum - 1] = `<< /Type /Catalog /Pages ${pagesNum} 0 R >>`;
objects[pagesNum - 1] =
  `<< /Type /Pages /Kids [${pageObjectNums.map((n) => `${n} 0 R`).join(" ")}] /Count ${pages.length} >>`;

// Serialize with a cross-reference table.
let pdf = "%PDF-1.4\n";
const offsets = [];
for (let i = 0; i < objects.length; i++) {
  offsets.push(Buffer.byteLength(pdf, "latin1"));
  pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
}

const xrefOffset = Buffer.byteLength(pdf, "latin1");
let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 0; i < objects.length; i++) {
  xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}

pdf += `${xref}trailer\n<< /Size ${objects.length + 1} /Root ${catalogNum} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

mkdirSync(path.dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, Buffer.from(pdf, "latin1"));

console.log(
  `CV generated: ${OUT_PATH} (${pages.length} page${pages.length > 1 ? "s" : ""}, ${Buffer.byteLength(pdf, "latin1")} bytes)`,
);

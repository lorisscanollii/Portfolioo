/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — SINGLE SOURCE OF TRUTH
 * ─────────────────────────────────────────────────────────────────────────
 *  All website content lives in this file: personal information, experience,
 *  skills, projects, achievements, and contact details.
 *
 *  ➜ To update the website, edit this file — every component reads from here.
 *  ➜ Items marked [PLACEHOLDER] should be replaced with real values.
 * ─────────────────────────────────────────────────────────────────────────
 */

import {
  Braces,
  Cloud,
  Code,
  Cpu,
  Database,
  Headset,
  Network,
  Server,
  ServerCog,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────────────── */

export interface NavLink {
  label: string;
  href: string;
}

export interface Role {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface GlanceItem {
  label: string;
  value: string;
}

export interface ExperienceArea {
  id: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  responsibilities: string[];
}

export interface SkillCategory {
  category: string;
  icon: LucideIcon;
  items: string[];
}

export type ProjectStatus = "live" | "completed" | "development";

export interface Project {
  id: string;
  number: string;
  name: string;
  category: string;
  status: ProjectStatus;
  statusLabel: string;
  description: string;
  /** Heading shown above the bullet list, e.g. "Technical highlights" */
  highlightsLabel: string;
  highlights: string[];
  technologies: string[];
  note?: string;
  achievement?: string;
  featured?: boolean;
  links: {
    live?: string;
    github?: string;
  };
}

export interface Achievement {
  title: string;
  event: string;
  project: string;
  description: string;
}

/* ── Site / SEO ────────────────────────────────────────────────────────── */

export const siteConfig = {
  name: "Loris Canolli",
  domain: "loriscanolli.com",
  url: "https://loriscanolli.com",
  titles: [
    "IT Support Specialist",
    "IT Administrator",
    "Full-Stack Developer",
    "Technology Enthusiast",
  ],
  heroHeadline: "IT Support. Infrastructure. Development.",
  heroSupport:
    "I solve technical problems, manage IT environments, and build software solutions that make a difference.",
  availability: {
    available: true,
    label: "Open to opportunities",
  },
  location: "Kosovo",
  cvPath: "/cv/Loris-Canolli-CV.pdf",
  seoDescription:
    "Loris Canolli is an IT Support Specialist, IT Administrator, and Full-Stack Developer from Kosovo — practical IT support, system administration, networking, and full-stack web development, from Google Workspace and Ubuntu servers to production Next.js applications.",
  seoKeywords: [
    "Loris Canolli",
    "Loris Canolli IT Support",
    "Loris Canolli IT Administrator",
    "Loris Canolli Developer",
    "IT Support Specialist Kosovo",
    "Full-Stack Developer Kosovo",
  ],
  footerBlurb:
    "IT professional combining practical support, system administration, and software development.",
  social: {
    /** [PLACEHOLDER] Replace with your real email address. */
    email: "contact@loriscanolli.com",
    /** [PLACEHOLDER] Replace with your real LinkedIn profile URL. */
    linkedin: "https://www.linkedin.com/in/loriscanolli",
    /** [PLACEHOLDER] Replace with your real GitHub profile URL. */
    github: "https://github.com/loriscanolli",
  },
} as const;

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Infrastructure", href: "#infrastructure" },
  { label: "Projects", href: "#projects" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

/* ── About ──────────────────────────────────────────────────────────────── */

export const about = {
  paragraphs: [
    "I'm Loris Canolli, an IT professional and full-stack developer passionate about technology, infrastructure, system administration, and software development.",
    "My work combines practical IT support with the development and deployment of modern web applications. I work with hardware, operating systems, networks, organizational IT systems, servers, databases, and application development.",
    "I enjoy troubleshooting technical problems, maintaining reliable IT environments, automating processes, and building applications that solve real-world problems.",
  ],
  roles: [
    {
      title: "IT Support Specialist",
      description:
        "Practical troubleshooting and technical assistance for end users, classrooms, and offices — keeping people productive and systems working.",
      icon: Wrench,
    },
    {
      title: "IT Administrator",
      description:
        "Managing organizational IT systems, user accounts, servers, and cloud services that keep day-to-day operations running.",
      icon: ServerCog,
    },
    {
      title: "Full-Stack Developer",
      description:
        "Designing, building, and deploying complete web applications — from the database schema to the production server.",
      icon: Braces,
    },
    {
      title: "Technology Enthusiast",
      description:
        "Continuously exploring and learning new technologies, tools, and systems — from Linux servers to modern web frameworks.",
      icon: Cpu,
    },
  ] satisfies Role[],
  glance: [
    { label: "Location", value: "Kosovo" },
    { label: "Roles", value: "IT Support · IT Admin · Full-Stack Developer" },
    { label: "Focus", value: "IT support & software development" },
    { label: "Status", value: "Open to opportunities" },
    { label: "Website", value: "loriscanolli.com" },
  ] satisfies GlanceItem[],
};

/* ── Experience ─────────────────────────────────────────────────────────── */

export const experience = {
  intro:
    "My professional experience is primarily in IT support within an educational institution. My day-to-day work spans three closely connected areas:",
  areas: [
    {
      id: "it-support",
      title: "IT Support",
      summary:
        "Front-line technical assistance for academic staff and students, covering hardware, software, and everything in between.",
      icon: Headset,
      responsibilities: [
        "Providing technical assistance to academic staff and students.",
        "Troubleshooting Windows computers.",
        "Diagnosing hardware and software problems.",
        "Installing and configuring operating systems.",
        "Printer installation, configuration, and troubleshooting.",
        "Supporting classrooms and examination rooms.",
        "Troubleshooting computer peripherals.",
        "Providing remote technical assistance.",
        "Resolving daily office IT problems.",
      ],
    },
    {
      id: "it-administration",
      title: "IT Administration",
      summary:
        "Administration of organizational IT systems, user accounts, servers, and cloud services.",
      icon: Server,
      responsibilities: [
        "Google Workspace administration.",
        "Google Admin Console.",
        "Managing user accounts.",
        "Password resets and account security.",
        "Managing organizational groups.",
        "Account suspension and administration.",
        "Supporting Moodle.",
        "Windows administration.",
        "Linux administration.",
        "Ubuntu Server.",
        "SSH and remote server management.",
        "Apache configuration.",
        "Cloudflare.",
        "Tailscale.",
      ],
    },
    {
      id: "networking",
      title: "Networking",
      summary:
        "Network configuration, troubleshooting, and diagnostics across the organization.",
      icon: Network,
      responsibilities: [
        "Network troubleshooting.",
        "TCP/IP.",
        "DNS.",
        "DHCP.",
        "Wi-Fi configuration.",
        "Router and access point troubleshooting.",
        "Basic Cisco IOS configuration.",
        "Network diagnostics.",
      ],
    },
  ] satisfies ExperienceArea[],
};

/* ── Skills ─────────────────────────────────────────────────────────────── */

export const skills: SkillCategory[] = [
  {
    category: "IT Support",
    icon: Headset,
    items: [
      "Windows troubleshooting",
      "Hardware & software diagnostics",
      "OS installation & configuration",
      "Printers & peripherals",
      "Remote assistance",
      "Classroom & exam room support",
    ],
  },
  {
    category: "System Administration",
    icon: ServerCog,
    items: [
      "Google Workspace",
      "Google Admin Console",
      "User account management",
      "Account security",
      "Windows administration",
      "Linux",
      "Ubuntu Server",
      "SSH",
      "Apache",
      "Moodle",
      "Cloudflare",
      "Tailscale",
    ],
  },
  {
    category: "Networking",
    icon: Network,
    items: [
      "TCP/IP",
      "DNS",
      "DHCP",
      "Wi-Fi configuration",
      "Routers & access points",
      "Cisco IOS (basic)",
      "Network diagnostics",
    ],
  },
  {
    category: "Software Development",
    icon: Code,
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "REST APIs",
      "Python",
    ],
  },
  {
    category: "Databases",
    icon: Database,
    items: ["MySQL", "MariaDB", "SQL", "Prisma ORM"],
  },
  {
    category: "Infrastructure & Deployment",
    icon: Cloud,
    items: [
      "Ubuntu Server",
      "Linux",
      "Apache",
      "Docker",
      "Cloudflare",
      "Git",
      "GitHub",
      "SSH",
    ],
  },
];

export const toolchain: string[] = [
  "Visual Studio Code",
  "OpenCode",
  "Git",
  "Terminal",
  "PowerShell",
  "Command Prompt",
];

/* ── Infrastructure ─────────────────────────────────────────────────────── */

export type InfraNodeKind =
  | "cloud"
  | "network"
  | "server"
  | "computer"
  | "device";

export interface InfraNode {
  id: string;
  label: string;
  kind: InfraNodeKind;
  /** Position in the illustrative 3D diagram. */
  position: [number, number, number];
  description: string;
}

export interface InfraLink {
  from: string;
  to: string;
}

export const infrastructure = {
  intro:
    "The systems behind the day-to-day work: cloud services, servers, network equipment, staff computers, and connected devices. Hover or select a component to see how it fits into the environment.",
  note: "Illustrative topology based on the systems I work with — not a live network diagram or an actual monitoring view.",
  kindLabels: {
    cloud: "Cloud infrastructure",
    network: "Network",
    server: "Server",
    computer: "Computer",
    device: "Connected device",
  } satisfies Record<InfraNodeKind, string>,
  nodes: [
    {
      id: "cloud",
      label: "Cloud services",
      kind: "cloud",
      position: [0, 2.05, -0.5],
      description:
        "Google Workspace and Google Admin Console for accounts, groups, and organizational services — plus Cloudflare for DNS, proxying, and edge configuration.",
    },
    {
      id: "edge",
      label: "Network edge",
      kind: "network",
      position: [0, 0.35, 0.35],
      description:
        "Routers, Wi-Fi access points, DNS, and DHCP. This is where connectivity is configured, diagnosed, and kept stable across the organization.",
    },
    {
      id: "ubuntu",
      label: "Ubuntu server",
      kind: "server",
      position: [-2.35, 1.05, -0.15],
      description:
        "Linux host for production applications and internal services — administered over SSH with Apache virtual hosts, MariaDB databases, and application deployments.",
    },
    {
      id: "windows",
      label: "Windows & directory",
      kind: "server",
      position: [2.35, 1.05, -0.15],
      description:
        "Windows administration, user account management, password resets, account security, and support for organizational systems such as Moodle.",
    },
    {
      id: "wifi",
      label: "Wi-Fi access point",
      kind: "network",
      position: [0.1, -0.85, 1.15],
      description:
        "Wireless configuration and troubleshooting: SSIDs, signal coverage, roaming between access points, and connectivity diagnostics.",
    },
    {
      id: "workstation",
      label: "Staff workstation",
      kind: "computer",
      position: [-2.55, -1.35, 0.4],
      description:
        "Windows desktops used by academic and administrative staff — operating system installs, software, peripherals, and remote technical assistance.",
    },
    {
      id: "classroom",
      label: "Classroom",
      kind: "computer",
      position: [-0.95, -1.95, -0.25],
      description:
        "Teaching spaces supported on site: presentation equipment, network connectivity, and the practical IT issues that come up during lessons.",
    },
    {
      id: "exam",
      label: "Examination room",
      kind: "computer",
      position: [1.15, -1.9, 0.3],
      description:
        "Dedicated support for examination rooms, where reliability matters most — machines, connectivity, and printers checked before and during exams.",
    },
    {
      id: "printer",
      label: "Printers & peripherals",
      kind: "device",
      position: [2.6, -1.15, 0.45],
      description:
        "Printer installation, driver and queue configuration, peripheral diagnostics, and hardware troubleshooting for offices and classrooms.",
    },
  ] satisfies InfraNode[],
  links: [
    { from: "cloud", to: "edge" },
    { from: "edge", to: "ubuntu" },
    { from: "edge", to: "windows" },
    { from: "edge", to: "wifi" },
    { from: "wifi", to: "workstation" },
    { from: "wifi", to: "classroom" },
    { from: "wifi", to: "exam" },
    { from: "wifi", to: "printer" },
    { from: "ubuntu", to: "windows" },
  ] satisfies InfraLink[],
};

/* ── Projects ───────────────────────────────────────────────────────────── */

export const projects: Project[] = [
  {
    id: "finora",
    number: "01",
    name: "Finora",
    category: "Full-Stack Development / Finance Management",
    status: "live",
    statusLabel: "Live — Production",
    description:
      "Finora is a personal finance management platform designed to help users manage their financial activities, monitor transactions, analyze financial data, and organize their finances.",
    highlightsLabel: "Technical highlights",
    highlights: [
      "Full-stack application development.",
      "Database architecture.",
      "Authentication.",
      "Financial dashboards.",
      "Transaction management.",
      "Administrative dashboard.",
      "API development.",
      "Production deployment.",
      "Linux server administration.",
      "Database management.",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "React",
      "Prisma",
      "MariaDB",
      "Node.js",
      "Ubuntu Server",
      "Apache",
      "Cloudflare",
    ],
    note: "Developed and deployed end-to-end on my own server infrastructure — including Linux server administration, database management, and production deployment.",
    featured: true,
    links: {
      live: "https://finora.loriscanolli.com",
    },
  },
  {
    id: "playground-life",
    number: "02",
    name: "Playground Life",
    category: "Healthcare Technology / Educational Software",
    status: "completed",
    statusLabel: "Completed",
    description:
      "Playground Life — Social Play for Autism is an interactive educational application designed to support autistic children through structured games, social interaction, and learning activities.",
    highlightsLabel: "Features",
    highlights: [
      "Child mode.",
      "Therapist mode.",
      "PIN-protected dashboard.",
      "Interactive educational games.",
      "Sensory customization.",
      "Different learning levels.",
      "Tablet-oriented interface.",
      "Individual and shared play.",
    ],
    technologies: [],
    achievement: "1st Place — Prishtina Inovate Healthcare",
    links: {},
  },
  {
    id: "college-tv-display",
    number: "03",
    name: "College TV Display System",
    category: "Automation / Information Systems",
    status: "completed",
    statusLabel: "Completed",
    description:
      "A digital display application designed for educational institutions to automatically retrieve and display daily lecture schedules using Google Calendar.",
    highlightsLabel: "Features",
    highlights: [
      "Google Calendar API integration.",
      "Automatic lecture retrieval.",
      "Classroom information.",
      "Professor information.",
      "Daily schedule.",
      "Automatic refresh.",
      "Full-screen TV display.",
    ],
    technologies: [
      "Python",
      "HTML",
      "CSS",
      "JavaScript",
      "Google Calendar API",
    ],
    links: {},
  },
  {
    id: "property-management",
    number: "04",
    name: "Property Management System",
    category: "Full-Stack Development",
    status: "development",
    statusLabel: "In Development",
    description:
      "A property management platform designed to simplify the management of properties, apartments, tenants, and administrative operations.",
    highlightsLabel: "Planned functionality",
    highlights: [
      "Property management.",
      "Apartment management.",
      "Tenant management.",
      "Role-based permissions.",
      "Administrative dashboard.",
      "Document generation.",
      "Notifications.",
      "Financial management.",
    ],
    technologies: ["Next.js", "TypeScript", "MySQL", "Prisma"],
    links: {},
  },
  {
    id: "ecommerce-platform",
    number: "05",
    name: "E-Commerce Platform",
    category: "Web Application Development",
    status: "development",
    statusLabel: "In Development",
    description:
      "A modern e-commerce platform with product management, customer accounts, order processing, administrative functionality, and business analytics.",
    highlightsLabel: "Features",
    highlights: [
      "Product management.",
      "Customer accounts.",
      "Order management.",
      "Manager permissions.",
      "Analytics.",
      "Real-time notifications.",
      "Administration.",
    ],
    technologies: ["Next.js", "TypeScript", "MySQL", "Prisma"],
    links: {},
  },
];

/* ── Achievements ───────────────────────────────────────────────────────── */

export const achievement: Achievement = {
  title: "1st Place Winner",
  event: "Prishtina Inovate Healthcare",
  project: "Playground Life — Social Play for Autism",
  description:
    "Recognized for developing an innovative healthcare technology solution focused on supporting autistic children through interactive learning and social play.",
};

/* ── Immersive world ───────────────────────────────────────────────────── */

export type StationId =
  | "home"
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "achievements"
  | "contact";

export interface WorldStation {
  id: StationId;
  index: string;
  label: string;
  kicker: string;
  summary: string;
}

export const worldStations: WorldStation[] = [
  {
    id: "home",
    index: "00",
    label: "Home",
    kicker: "Central entrance",
    summary: "The entrance to the system.",
  },
  {
    id: "about",
    index: "01",
    label: "About",
    kicker: "Profile terminal",
    summary: "Professional background and the way I work.",
  },
  {
    id: "experience",
    index: "02",
    label: "Experience",
    kicker: "IT infrastructure floor",
    summary: "The systems, spaces and responsibilities behind the work.",
  },
  {
    id: "skills",
    index: "03",
    label: "Skills",
    kicker: "Technology network",
    summary: "Connected disciplines and the tools I use in practice.",
  },
  {
    id: "projects",
    index: "04",
    label: "Projects",
    kicker: "Project exhibition",
    summary: "Selected applications, concepts and production systems.",
  },
  {
    id: "achievements",
    index: "05",
    label: "Achievements",
    kicker: "Award gallery",
    summary: "Recognition for technology that makes a difference.",
  },
  {
    id: "contact",
    index: "06",
    label: "Contact",
    kicker: "Communication terminal",
    summary: "Open a channel for roles, projects and technical work.",
  },
];

export interface AboutArtifact {
  id: "infrastructure" | "support" | "development" | "problem-solving";
  label: string;
  title: string;
  description: string;
  points: string[];
}

/**
 * The four interactive objects in the About environment. The wording is
 * grounded in the bio and experience data above - no proficiency claims.
 */
export const aboutArtifacts: AboutArtifact[] = [
  {
    id: "infrastructure",
    label: "INFRASTRUCTURE",
    title: "IT Infrastructure",
    description:
      "I work with the systems behind day-to-day operations: servers, networks, cloud services, user accounts and the configuration that holds them together.",
    points: [
      "Linux and Windows administration.",
      "Ubuntu Server, Apache, Cloudflare and Tailscale.",
      "Google Workspace, accounts and organizational systems.",
    ],
  },
  {
    id: "support",
    label: "SUPPORT",
    title: "Technical Support",
    description:
      "Practical troubleshooting for the people using technology - in classrooms, examination rooms and offices where reliability matters.",
    points: [
      "Windows, hardware and software diagnostics.",
      "Printers, peripherals and remote assistance.",
      "Classroom and examination-room support.",
    ],
  },
  {
    id: "development",
    label: "DEVELOPMENT",
    title: "Software Development",
    description:
      "I design, build and deploy complete web applications, from the database schema and API to the interface and production server.",
    points: [
      "Full-stack application development.",
      "Next.js, React, TypeScript and Python.",
      "Database architecture and production deployment.",
    ],
  },
  {
    id: "problem-solving",
    label: "PROBLEM SOLVING",
    title: "Problem Solving",
    description:
      "I enjoy finding the cause of a problem, not just clearing the symptom - and turning that understanding into a more reliable system.",
    points: [
      "Diagnosing technical problems methodically.",
      "Automating repetitive processes.",
      "Building applications that solve real-world problems.",
    ],
  },
];

export interface ExperienceObject {
  id: string;
  label: string;
  /** Source content in `experience.areas` or `infrastructure.nodes`. */
  areaId?: string;
  nodeId?: string;
}

/**
 * Physical objects in the Experience environment. Each one maps back to the
 * existing experience area or infrastructure node content.
 */
export const experienceObjects: ExperienceObject[] = [
  { id: "support-desk", label: "SUPPORT DESK", areaId: "it-support" },
  { id: "server-core", label: "SERVER CORE", areaId: "it-administration" },
  { id: "network-spine", label: "NETWORK SPINE", areaId: "networking" },
  { id: "printer", label: "PRINT STATION", nodeId: "printer" },
  { id: "monitoring-wall", label: "MONITORING WALL", nodeId: "cloud" },
  { id: "classroom", label: "CLASSROOM / EXAM", nodeId: "exam" },
];

/**
 * Practical usage notes for the skills network. These explain where the tools
 * are used; they are not skill percentages or proficiency ratings.
 */
export const skillDetails: Record<string, string> = {
  "IT Support":
    "Hands-on diagnosis and support across Windows desktops, operating systems, printers, peripherals, classrooms and examination rooms.",
  "System Administration":
    "Administering user accounts, servers and cloud services across Google Workspace, Windows, Ubuntu Server, Apache, Moodle and Cloudflare.",
  Networking:
    "Configuring and diagnosing connectivity from TCP/IP, DNS and DHCP to Wi-Fi access points, routers and basic Cisco IOS configuration.",
  "Software Development":
    "Building full-stack applications and interfaces with modern JavaScript and TypeScript, React, Next.js, Node.js, REST APIs and Python.",
  Databases:
    "Modelling relational data and working with queries, schema changes and application data in MySQL, MariaDB, SQL and Prisma.",
  "Infrastructure & Deployment":
    "Running and shipping services on Linux with Apache, Docker, Cloudflare, Git, GitHub and SSH.",
};

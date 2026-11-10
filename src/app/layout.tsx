import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pageTitle = `${siteConfig.name} — IT Support Specialist, IT Administrator & Full-Stack Developer`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: pageTitle,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.seoDescription,
  keywords: [...siteConfig.seoKeywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: `${siteConfig.name} — Portfolio`,
    title: pageTitle,
    description: siteConfig.seoDescription,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: pageTitle,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: siteConfig.seoDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e12" },
    { media: "(prefers-color-scheme: light)", color: "#f6f8f7" },
  ],
};

/**
 * Sets the color theme before first paint to avoid a flash.
 * Reads the saved preference, otherwise falls back to the OS preference.
 */
const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t;}catch(e){document.documentElement.dataset.theme="dark";}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background font-sans text-foreground antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}

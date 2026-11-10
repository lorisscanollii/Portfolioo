import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Infrastructure from "@/components/Infrastructure";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { siteConfig, skills } from "@/data/portfolio";

/** Professional structured data (schema.org Person). */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "IT Support Specialist | IT Administrator | Full-Stack Developer",
  description: siteConfig.seoDescription,
  address: {
    "@type": "PostalAddress",
    addressCountry: "XK",
  },
  knowsAbout: skills.flatMap((category) => category.items),
};

/**
 * The accessible, document-style portfolio. It is rendered on `/standard/`
 * so the immersive world never becomes the only way to read the content.
 */
export default function StandardPortfolio() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-foreground"
      >
        Skip to main content
      </a>

      <div className="standard-bar">
        <p>
          <span className="standard-bar-dot" aria-hidden="true" />
          Accessible document version
        </p>
        <a href="/">
          Open the immersive 3D portfolio
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <Navbar />
      <ScrollProgress />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Infrastructure />
        <Projects />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  );
}

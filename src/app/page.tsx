import ImmersiveExperience from "@/components/immersive/ImmersiveExperience";
import NoScriptFallback from "@/components/NoScriptFallback";
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

export default function Home() {
  return (
    <>
      <ImmersiveExperience />
      <NoScriptFallback />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  );
}

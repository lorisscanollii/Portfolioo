import type { Metadata } from "next";
import StandardPortfolio from "@/components/StandardPortfolio";
import { siteConfig } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Accessible portfolio",
  description: `${siteConfig.name} - accessible, document version of the portfolio. The same experience, experience history, skills, projects and contact details without 3D navigation.`,
  alternates: {
    canonical: "/standard/",
  },
};

export default function StandardPage() {
  return <StandardPortfolio />;
}

import SectionHeading from "./SectionHeading";
import NetworkExplorer from "./NetworkExplorer";
import { infrastructure } from "@/data/portfolio";

export default function Infrastructure() {
  return (
    <section
      id="infrastructure"
      aria-labelledby="infrastructure-heading"
      className="border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="04"
          id="infrastructure-heading"
          title="Infrastructure & Networking"
          description={infrastructure.intro}
        />
        <NetworkExplorer />
      </div>
    </section>
  );
}

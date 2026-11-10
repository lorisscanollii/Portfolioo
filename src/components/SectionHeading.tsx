import Reveal from "./Reveal";

interface SectionHeadingProps {
  index: string;
  title: string;
  id: string;
  description?: string;
}

export default function SectionHeading({
  index,
  title,
  id,
  description,
}: SectionHeadingProps) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <p
        className="flex items-center gap-3 font-mono text-sm text-accent"
        aria-hidden="true"
      >
        <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-semibold">
          {index}
        </span>
        <span className="h-px w-10 bg-accent/40" aria-hidden="true" />
        <span className="uppercase tracking-widest">{title}</span>
      </p>
      <h2
        id={id}
        className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

import type { ProjectStatus } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProjectStatus, string> = {
  live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  completed: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  development:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

const statusDots: Record<ProjectStatus, string> = {
  live: "bg-emerald-500",
  completed: "bg-sky-500",
  development: "bg-amber-500",
};

export default function StatusBadge({
  status,
  label,
}: {
  status: ProjectStatus;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium",
        statusStyles[status],
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", statusDots[status])}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

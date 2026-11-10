"use client";

import { useRef, type PointerEvent } from "react";
import { CalendarDays, RefreshCw, Sparkles } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-environment";
import { cn } from "@/lib/utils";

type ProjectVisualVariant = "finora" | "playground" | "college";

interface ProjectVisualProps {
  variant: ProjectVisualVariant;
  size?: "card" | "featured";
  className?: string;
}

/* ── Finora — finance platform ──────────────────────────────────────────── */

function FinoraVisual() {
  const bars = [42, 62, 50, 78, 58, 88];

  return (
    <>
      <div className="scene-layer layer-1 absolute left-1/2 top-1/2 w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-emerald-400/25 bg-[#0a1219]/95 p-3.5 shadow-2xl shadow-emerald-500/10 sm:w-[70%]">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-300">
            Finora · overview
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[8px] uppercase tracking-wider text-slate-400">
              Balance overview
            </p>
            <p className="mt-1 font-mono text-base tracking-[0.2em] text-white/90">
              ••••••
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8px] uppercase tracking-wider text-slate-400">
              Monthly flow
            </p>
            <p className="mt-1 font-mono text-xs text-emerald-300">▲ ••%</p>
          </div>
        </div>

        <svg
          viewBox="0 0 240 64"
          className="mt-2 h-12 w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="finora-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 46 C24 40 34 22 56 26 C78 30 92 48 116 40 C140 32 150 14 176 18 C200 22 214 12 240 8 L240 64 L0 64 Z"
            fill="url(#finora-area)"
          />
          <path
            d="M0 46 C24 40 34 22 56 26 C78 30 92 48 116 40 C140 32 150 14 176 18 C200 22 214 12 240 8"
            fill="none"
            stroke="#34d399"
            strokeWidth="1.6"
          />
        </svg>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {["Income", "Expenses", "Savings"].map((label, index) => (
            <div key={label}>
              <p className="font-mono text-[7px] uppercase tracking-wider text-slate-400">
                {label}
              </p>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400/80"
                  style={{ width: `${[82, 54, 68][index]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="scene-layer layer-3 absolute right-[1%] top-[6%] w-[30%] rounded-lg border border-white/10 bg-[#0d1721]/95 p-2.5 shadow-xl">
        <p className="font-mono text-[8px] uppercase tracking-wider text-emerald-300">
          Transactions
        </p>
        <div className="mt-2 space-y-1.5">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
              <span className="h-1 flex-1 rounded-full bg-white/20" />
              <span className="h-1 w-4 rounded-full bg-emerald-400/50" />
            </div>
          ))}
        </div>
      </div>

      <div className="scene-layer layer-2 absolute bottom-[6%] left-[2%] flex h-[34%] w-[26%] items-end gap-1 rounded-lg border border-white/10 bg-[#0d1721]/90 p-2 shadow-xl">
        {bars.map((height, index) => (
          <span
            key={index}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/25 to-emerald-300/80"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <span className="scene-layer layer-3 absolute left-[6%] top-[8%] rounded-full border border-emerald-400/40 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-emerald-300/90">
        Prisma · MariaDB
      </span>
    </>
  );
}

/* ── Playground Life — educational software ─────────────────────────────── */

function PlaygroundVisual() {
  return (
    <>
      <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-400/20 via-sky-400/10 to-amber-300/20 blur-2xl" />

      <div className="scene-layer layer-1 absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-sm sm:w-[66%]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-200">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Social play
          </span>
          <span className="flex rounded-full border border-white/15 p-0.5 font-mono text-[8px] text-white/60">
            <span className="rounded-full bg-emerald-400/25 px-2 py-0.5 text-emerald-100">
              Child
            </span>
            <span className="px-2 py-0.5">Therapist</span>
          </span>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            "from-emerald-400/70 to-emerald-500/30",
            "from-sky-400/70 to-sky-500/30",
            "from-amber-300/70 to-amber-500/30",
            "from-rose-400/60 to-rose-500/25",
            "from-teal-300/70 to-teal-500/30",
            "from-violet-400/60 to-violet-500/25",
            "from-lime-300/70 to-lime-500/30",
            "from-sky-300/70 to-indigo-500/25",
          ].map((gradient, index) => (
            <span
              key={index}
              className={cn(
                "aspect-square rounded-lg bg-gradient-to-br",
                gradient,
                index === 2 && "ring-1 ring-white/40",
              )}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[7px] uppercase tracking-wider text-white/50">
          <span>Level 1 · shared play</span>
          <span>sensory · learning</span>
        </div>
      </div>

      <span className="scene-layer layer-2 absolute left-[4%] top-[14%] h-10 w-10 rounded-full bg-gradient-to-br from-emerald-300/80 to-emerald-500/30 shadow-lg shadow-emerald-500/20" />
      <span className="scene-layer layer-3 absolute right-[6%] top-[10%] h-8 w-8 rotate-12 rounded-xl bg-gradient-to-br from-amber-200/80 to-amber-400/30 shadow-lg shadow-amber-500/20" />
      <span className="scene-layer layer-2 absolute bottom-[10%] left-[8%] h-9 w-9 rounded-full border-[6px] border-sky-300/60" />
      <span className="scene-layer layer-3 absolute bottom-[12%] right-[6%] h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-300/70 to-rose-400/25" />
    </>
  );
}

/* ── College TV Display — schedule system ───────────────────────────────── */

function CollegeVisual() {
  const schedule = [
    { time: "08:00", width: "72%" },
    { time: "09:30", width: "58%" },
    { time: "11:00", width: "80%" },
    { time: "13:00", width: "64%" },
  ];

  return (
    <>
      <div className="absolute left-1/2 top-1/2 h-[62%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-400/15 to-sky-400/10 blur-2xl" />

      <div className="scene-layer layer-1 absolute left-1/2 top-1/2 w-[68%] -translate-x-1/2 -translate-y-[58%] sm:w-[62%]">
        <div className="rounded-lg border-2 border-slate-500/40 bg-[#070d13] p-2 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-emerald-300">
              Campus display
            </span>
            <span className="flex items-center gap-1 font-mono text-[8px] text-slate-400">
              <RefreshCw className="h-2.5 w-2.5" aria-hidden="true" />
              auto
            </span>
          </div>

          <div className="mt-2 space-y-1.5">
            {schedule.map((row) => (
              <div key={row.time} className="flex items-center gap-2">
                <span className="w-8 shrink-0 font-mono text-[7px] text-emerald-200/90">
                  {row.time}
                </span>
                <span
                  className="h-1.5 rounded-full bg-emerald-400/50"
                  style={{ width: row.width }}
                />
                <span className="h-1.5 w-6 rounded-sm bg-white/15" />
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto h-4 w-1/3 bg-gradient-to-b from-slate-500/40 to-transparent" />
        <div className="mx-auto h-1.5 w-1/2 rounded-full bg-slate-500/50" />
      </div>

      <div className="scene-layer layer-3 absolute right-[2%] top-[8%] w-[28%] rounded-lg border border-white/10 bg-[#0d1721]/95 p-2.5 shadow-xl">
        <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-wider text-emerald-300">
          <CalendarDays className="h-3 w-3" aria-hidden="true" />
          Schedule
        </p>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({ length: 21 }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "aspect-square rounded-[2px] bg-white/10",
                index === 9 && "bg-emerald-400/80",
              )}
            />
          ))}
        </div>
      </div>

      <span className="scene-layer layer-2 absolute bottom-[8%] left-[5%] rounded-md border border-emerald-400/30 bg-[#0d1721]/90 px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-emerald-200/90">
        Google Calendar API
      </span>
      <span className="scene-layer layer-3 absolute bottom-[10%] right-[7%] h-8 w-8 rounded-lg border border-white/15 bg-white/5" />
    </>
  );
}

const VARIANTS = {
  finora: FinoraVisual,
  playground: PlaygroundVisual,
  college: CollegeVisual,
} as const;

export default function ProjectVisual({
  variant,
  size = "card",
  className,
}: ProjectVisualProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const Visual = VARIANTS[variant];

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
    stage.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
  };

  const resetTilt = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--rx", "0deg");
    stage.style.setProperty("--ry", "0deg");
  };

  return (
    <figure className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "scene-3d relative w-full overflow-hidden rounded-xl border border-border bg-[#070c11]",
          size === "featured"
            ? "h-[260px] sm:h-[320px] lg:h-[360px]"
            : "h-[190px] sm:h-[210px]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.16) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />

        <div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          className="project-stage absolute inset-0"
          aria-hidden="true"
        >
          <Visual />
        </div>
      </div>

      <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
        Illustrative 3D concept — not an actual application screenshot
      </figcaption>
    </figure>
  );
}

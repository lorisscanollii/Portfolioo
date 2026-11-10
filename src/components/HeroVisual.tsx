"use client";

import dynamic from "next/dynamic";
import {
  useDeferredMount,
  useInView,
  useIsMobile,
  usePrefersReducedMotion,
  useThemeMode,
  useWebGLSupport,
} from "@/lib/use-environment";
import { HeroFallback } from "./three/SceneFallback";

const HeroScene = dynamic(() => import("./three/HeroScene"), {
  ssr: false,
  loading: () => <HeroFallback className="absolute inset-0" />,
});

const SYMBOLS = [
  { label: "TCP/IP", className: "left-[7%] top-[20%]", delay: "0s" },
  { label: "SSH", className: "right-[9%] top-[16%]", delay: "1.2s" },
  { label: "Next.js", className: "left-[10%] bottom-[19%]", delay: "2.1s" },
  { label: "SQL", className: "right-[8%] bottom-[23%]", delay: "0.6s" },
  { label: "</>", className: "right-[24%] top-[47%]", delay: "1.7s" },
];

export default function HeroVisual() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "120px" });
  const webgl = useWebGLSupport();
  const deferred = useDeferredMount();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const theme = useThemeMode();

  const showScene = webgl === true && deferred;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Illustrative 3D visualization of connected network nodes, server hardware, and software infrastructure"
      className="hero-visual relative w-full overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="relative h-[250px] sm:h-[300px] lg:h-[335px]">
        {showScene ? (
          <HeroScene
            active={inView}
            reduced={reduced}
            mobile={mobile}
            theme={theme}
          />
        ) : (
          <HeroFallback className="absolute inset-0" />
        )}

        {/* Floating technology labels — HTML keeps text crisp and cheap. */}
        <div
          className="pointer-events-none absolute inset-0 z-10 select-none"
          aria-hidden="true"
        >
          {SYMBOLS.map((symbol) => (
            <span
              key={symbol.label}
              style={{ animationDelay: symbol.delay }}
              className={`hero-chip absolute rounded border border-accent/25 bg-background/70 px-2 py-0.5 font-mono text-[10px] tracking-wide text-accent backdrop-blur-sm ${symbol.className}`}
            >
              {symbol.label}
            </span>
          ))}
        </div>

        <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span
            className="status-dot h-1.5 w-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
          Infrastructure model
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 z-10 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
          network · servers · software
        </div>

        <span className="pointer-events-none absolute bottom-4 right-4 z-10 rounded border border-border/70 bg-background/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
          Illustrative
        </span>
      </div>
    </div>
  );
}

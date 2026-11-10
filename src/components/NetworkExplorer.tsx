"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  Cloud,
  Monitor,
  Network,
  Printer,
  Server,
  type LucideIcon,
} from "lucide-react";
import { infrastructure, type InfraNodeKind } from "@/data/portfolio";
import {
  useInView,
  useIsMobile,
  usePrefersReducedMotion,
  useThemeMode,
  useWebGLSupport,
} from "@/lib/use-environment";
import { cn } from "@/lib/utils";
import { NetworkFallback } from "./three/SceneFallback";

const NetworkScene = dynamic(() => import("./three/NetworkScene"), {
  ssr: false,
  loading: () => <NetworkFallback className="absolute inset-0" />,
});

const KIND_ICONS: Record<InfraNodeKind, LucideIcon> = {
  cloud: Cloud,
  network: Network,
  server: Server,
  computer: Monitor,
  device: Printer,
};

export default function NetworkExplorer() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "320px" });
  const webgl = useWebGLSupport();
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const theme = useThemeMode();

  const [hasMounted, setHasMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("edge");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (inView) setHasMounted(true);
  }, [inView]);

  const activeNode = useMemo(() => {
    const id = hoveredId ?? selectedId;
    return infrastructure.nodes.find((node) => node.id === id) ?? null;
  }, [hoveredId, selectedId]);

  const showScene = hasMounted && webgl === true;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
      <div
        ref={ref}
        className="relative overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="relative h-[320px] sm:h-[400px] lg:h-[450px]">
          {showScene ? (
            <NetworkScene
              active={inView}
              reduced={reduced}
              mobile={mobile}
              theme={theme}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onSelect={setSelectedId}
            />
          ) : (
            <NetworkFallback className="absolute inset-0" />
          )}

          <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span
              className="status-dot h-1.5 w-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />
            Interactive topology
          </div>

          <p className="pointer-events-none absolute bottom-4 left-4 z-10 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
            Hover or select a component
          </p>

          <span className="pointer-events-none absolute bottom-4 right-4 z-10 rounded border border-border/70 bg-background/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
            Illustrative
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div
          aria-live="polite"
          className="min-h-[164px] rounded-xl border border-accent/25 bg-card p-5"
        >
          {activeNode ? (
            <>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                {infrastructure.kindLabels[activeNode.kind]}
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                {activeNode.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {activeNode.description}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a component to see how it fits into the environment.
            </p>
          )}
        </div>

        <ul
          aria-label="Infrastructure components"
          className="grid grid-cols-2 gap-2"
        >
          {infrastructure.nodes.map((node) => {
            const Icon = KIND_ICONS[node.kind];
            const isSelected = node.id === selectedId;
            return (
              <li key={node.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(node.id)}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(node.id)}
                  onBlur={() => setHoveredId(null)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left text-xs font-medium transition-colors",
                    isSelected
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {node.label}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="text-xs leading-relaxed text-muted-foreground">
          {infrastructure.note}
        </p>
      </div>
    </div>
  );
}

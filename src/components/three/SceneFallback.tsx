import { cn } from "@/lib/utils";

/**
 * Static visuals used while the WebGL chunk loads, when WebGL is unavailable,
 * or when the visitor has data saving enabled. They keep the layout stable and
 * preserve the "technical illustration" identity without any GPU work.
 */

export function HeroFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center p-4",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 420 300"
        className="h-full w-full max-w-[440px] text-accent"
        role="presentation"
        fill="none"
      >
        <defs>
          <radialGradient id="hero-fallback-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="210" cy="150" r="140" fill="url(#hero-fallback-glow)" />

        <g stroke="currentColor" strokeOpacity="0.16">
          <circle cx="210" cy="150" r="58" />
          <circle cx="210" cy="150" r="92" />
          <circle cx="210" cy="150" r="126" />
          <ellipse cx="210" cy="150" rx="126" ry="48" />
          <ellipse
            cx="210"
            cy="150"
            rx="126"
            ry="48"
            transform="rotate(60 210 150)"
          />
          <ellipse
            cx="210"
            cy="150"
            rx="126"
            ry="48"
            transform="rotate(120 210 150)"
          />
        </g>

        <g stroke="currentColor" strokeOpacity="0.34">
          <path d="M210 150 L210 24" />
          <path d="M210 150 L330 92" />
          <path d="M210 150 L318 220" />
          <path d="M210 150 L96 224" />
          <path d="M210 150 L82 84" />
          <path d="M210 150 L150 62" />
          <path d="M210 150 L282 208" />
        </g>

        <g fill="currentColor" fillOpacity="0.75">
          <circle cx="210" cy="24" r="3" />
          <circle cx="330" cy="92" r="3" />
          <circle cx="318" cy="220" r="3" />
          <circle cx="96" cy="224" r="3" />
          <circle cx="82" cy="84" r="3" />
          <circle cx="150" cy="62" r="3" />
          <circle cx="282" cy="208" r="3" />
        </g>

        <g stroke="currentColor" strokeOpacity="0.5">
          <polygon points="210,96 262,127 262,179 210,210 158,179 158,127" />
          <polygon points="210,120 240,138 240,168 210,186 180,168 180,138" />
        </g>

        <g fill="currentColor">
          <circle cx="210" cy="150" r="5" fillOpacity="0.9" />
        </g>
      </svg>
    </div>
  );
}

export function NetworkFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center p-6",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 460 340"
        className="h-full w-full max-w-[520px] text-accent"
        role="presentation"
        fill="none"
      >
        <g stroke="currentColor" strokeOpacity="0.22" strokeWidth="1">
          <path d="M230 44 L230 128" />
          <path d="M230 128 L112 176" />
          <path d="M230 128 L348 176" />
          <path d="M230 128 L230 208" />
          <path d="M230 208 L96 268" />
          <path d="M230 208 L175 286" />
          <path d="M230 208 L285 286" />
          <path d="M230 208 L364 268" />
          <path d="M112 176 L348 176" />
        </g>

        <g stroke="currentColor" strokeOpacity="0.45">
          <rect x="212" y="30" width="36" height="20" rx="3" />
          <rect x="214" y="112" width="32" height="24" rx="2" />
          <rect x="96" y="158" width="32" height="36" rx="2" />
          <rect x="332" y="158" width="32" height="36" rx="2" />
          <rect x="220" y="202" width="20" height="12" rx="2" />
          <rect x="82" y="254" width="28" height="20" rx="2" />
          <rect x="160" y="276" width="30" height="18" rx="2" />
          <rect x="270" y="276" width="30" height="18" rx="2" />
          <rect x="350" y="254" width="28" height="20" rx="2" />
        </g>

        <g fill="currentColor" fillOpacity="0.65">
          <circle cx="230" cy="128" r="4" />
          <circle cx="112" cy="176" r="3" />
          <circle cx="348" cy="176" r="3" />
          <circle cx="230" cy="208" r="3" />
        </g>
      </svg>
    </div>
  );
}

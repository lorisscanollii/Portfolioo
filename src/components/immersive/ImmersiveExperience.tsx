"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Accessibility,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Menu,
  MousePointer2,
  MoveVertical,
  RotateCcw,
  X,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { siteConfig, worldStations, type StationId } from "@/data/portfolio";
import {
  getAdjacentStation,
  getStation,
  getStationIndex,
  type WorldSelection,
} from "@/lib/world";
import {
  useDeferredMount,
  useIsMobile,
  usePageVisible,
  usePrefersReducedMotion,
  useWebGLSupport,
} from "@/lib/use-environment";
import DetailDrawer from "./DetailDrawer";
import StationContent from "./StationContent";

const WorldScene = dynamic(() => import("./WorldScene"), {
  ssr: false,
});

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    Boolean(
      target.closest(
        "input, textarea, select, [contenteditable='true'], [data-scroll-region]",
      ),
    )
  );
}

function isUiTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    Boolean(
      target.closest(
        "a, button, input, textarea, select, [role='dialog'], [data-scroll-region]",
      ),
    )
  );
}

function WorldFallback({
  reason,
  onRetry,
}: {
  reason: "unsupported" | "failed";
  onRetry: () => void;
}) {
  return (
    <main id="main" className="world-fallback">
      <div className="world-fallback-inner">
        <p className="world-kicker">
          <span>SYSTEM NOTICE</span>
          <span className="world-kicker-divider">/</span>
          <span>{reason === "unsupported" ? "WEBGL UNAVAILABLE" : "3D STARTUP FAILED"}</span>
        </p>

        <h1 className="world-fallback-title">
          The world could not start.
          <span>Every part of the portfolio is still available.</span>
        </h1>

        <p className="world-fallback-copy">
          This browser could not start the interactive 3D environment. Nothing
          is locked behind it. Use the accessible document version for the
          complete portfolio, or continue with the quick links below.
        </p>

        <div className="world-fallback-actions">
          <a href="/standard/" className="world-button">
            Open the accessible portfolio
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={siteConfig.cvPath}
            download
            className="world-button world-button-ghost"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download CV
          </a>
          {reason === "failed" && (
            <button
              type="button"
              className="world-button world-button-ghost"
              onClick={onRetry}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Retry 3D
            </button>
          )}
        </div>

        <section className="world-fallback-section" aria-labelledby="fallback-sections">
          <h2 id="fallback-sections">Continue to a section</h2>
          <div className="world-fallback-links">
            {worldStations.map((station) => (
              <a
                key={station.id}
                href={`/standard/#${station.id}`}
                className="world-fallback-link"
              >
                <span className="world-fallback-index">{station.index}</span>
                <span>
                  <strong>{station.label}</strong>
                  <small>{station.summary}</small>
                </span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="world-fallback-section" aria-labelledby="fallback-contact">
          <h2 id="fallback-contact">Contact</h2>
          <div className="world-fallback-contact">
            <a href={`mailto:${siteConfig.social.email}`}>
              {siteConfig.social.email}
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinIcon className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          </div>
        </section>

        <p className="world-fallback-foot">
          <Accessibility className="h-4 w-4" aria-hidden="true" />
          Prefer a simpler interface? The accessible version contains all of
          the same content without 3D.
        </p>
      </div>
    </main>
  );
}

export default function ImmersiveExperience() {
  const [active, setActive] = useState<StationId>("home");
  const [selected, setSelected] = useState<WorldSelection | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [liveMessage, setLiveMessage] = useState("");
  const [hintVisible, setHintVisible] = useState(true);
  const [resetToken, setResetToken] = useState(0);
  const [retryKey, setRetryKey] = useState(0);

  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const pageVisible = usePageVisible();
  const webgl = useWebGLSupport();
  const mountScene = useDeferredMount(80);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastWheel = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const fallback = webgl === false || sceneFailed;
  const currentStation = getStation(active);
  const currentIndex = getStationIndex(active);
  const nextStation = getStation(getAdjacentStation(active, 1));
  const previousStation = getStation(getAdjacentStation(active, -1));

  const focusHeading = useCallback(() => {
    window.setTimeout(() => {
      document.getElementById("station-heading")?.focus();
    }, 360);
  }, []);

  const goTo = useCallback(
    (station: StationId, focus = false) => {
      setActive(station);
      setSelected(null);
      setMenuOpen(false);
      setHintVisible(false);

      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${station}`);
      }

      const info = getStation(station);
      setLiveMessage(`Now viewing ${info.label}. ${info.summary}`);

      if (focus) focusHeading();
    },
    [focusHeading],
  );

  const goNext = useCallback(() => {
    goTo(getAdjacentStation(active, 1));
  }, [active, goTo]);

  const goPrevious = useCallback(() => {
    goTo(getAdjacentStation(active, -1));
  }, [active, goTo]);

  const handleSelect = useCallback((selection: WorldSelection | null) => {
    setSelected(selection);
    if (selection) setHintVisible(false);
  }, []);

  const resetCamera = useCallback(() => {
    setResetToken((token) => token + 1);
    setLiveMessage("Camera reset to the current section.");
  }, []);

  const retryScene = useCallback(() => {
    setSceneFailed(false);
    setSceneReady(false);
    setProgress(0);
    setLoaderVisible(true);
    setRetryKey((key) => key + 1);
  }, []);

  /* Stable page chrome and scroll locking for the immersive route only. */
  useEffect(() => {
    const enabled = !fallback;
    document.documentElement.classList.toggle("world-mode", enabled);
    document.body.classList.toggle("world-mode", enabled);

    return () => {
      document.documentElement.classList.remove("world-mode");
      document.body.classList.remove("world-mode");
    };
  }, [fallback]);

  /* Deep links such as /#projects should open the matching station. The
     hashchange listener also handles same-document hash navigation. */
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!worldStations.some((station) => station.id === hash)) return;

      const station = hash as StationId;
      setActive(station);
      setSelected(null);
      setMenuOpen(false);
      setHintVisible(false);

      const info = getStation(station);
      setLiveMessage(`Now viewing ${info.label}. ${info.summary}`);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  /* Simulated, honest loading progress: it stops short until the canvas is ready. */
  useEffect(() => {
    if (!loaderVisible) return;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (sceneReady) return Math.min(100, current + 14);
        if (current >= 91) return current;
        return Math.min(91, current + Math.max(1, (91 - current) * 0.07));
      });
    }, 110);

    return () => window.clearInterval(timer);
  }, [loaderVisible, sceneReady]);

  useEffect(() => {
    if (!sceneReady) return;

    setProgress(100);
    const timer = window.setTimeout(
      () => setLoaderVisible(false),
      reduced ? 0 : 720,
    );

    return () => window.clearTimeout(timer);
  }, [reduced, sceneReady]);

  useEffect(() => {
    if (webgl === false || sceneFailed) setLoaderVisible(false);
  }, [sceneFailed, webgl]);

  /* A canvas that never reports ready should not trap the visitor. Hidden
     tabs stop animation frames, so the startup clock only runs while visible. */
  useEffect(() => {
    if (!pageVisible || webgl !== true || sceneReady || sceneFailed) return;

    const timer = window.setTimeout(() => {
      setSceneFailed(true);
      setLoaderVisible(false);
    }, 30000);

    return () => window.clearTimeout(timer);
  }, [pageVisible, sceneFailed, sceneReady, webgl]);

  /* Wheel over the open 3D area travels between stations. UI regions scroll. */
  useEffect(() => {
    if (fallback || !sceneReady) return;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || selected || menuOpen) return;
      if (isUiTarget(event.target)) return;
      if (Math.abs(event.deltaY) < 22) return;

      const now = performance.now();
      const blocked = now - lastWheel.current < 720;

      event.preventDefault();

      if (blocked) return;
      lastWheel.current = now;

      if (event.deltaY > 0) goNext();
      else goPrevious();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [fallback, goNext, goPrevious, menuOpen, sceneReady, selected]);

  /* Touch travel only when the gesture starts on the open 3D area. */
  useEffect(() => {
    if (fallback || !sceneReady) return;

    const onTouchStart = (event: TouchEvent) => {
      if (selected || menuOpen || isUiTarget(event.target)) {
        touchStart.current = null;
        return;
      }
      const touch = event.changedTouches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (selected || menuOpen || !touchStart.current) return;
      if (isUiTarget(event.target)) return;

      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      touchStart.current = null;

      if (Math.abs(dy) < 64 || Math.abs(dx) > Math.abs(dy) * 0.72) return;

      if (dy < 0) goNext();
      else goPrevious();
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [fallback, goNext, goPrevious, menuOpen, sceneReady, selected]);

  /* Keyboard travel + drawer/menu dismissal. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selected) {
          setSelected(null);
          return;
        }
        if (menuOpen) {
          setMenuOpen(false);
          return;
        }
      }

      if (selected || menuOpen || fallback || !sceneReady) return;
      if (event.defaultPrevented || isEditableTarget(event.target)) return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("[data-scroll-region]") &&
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)
      ) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goPrevious();
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo("home");
      } else if (event.key === "End") {
        event.preventDefault();
        goTo("contact");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fallback, goNext, goPrevious, goTo, menuOpen, sceneReady, selected]);

  /* Focus trap and return focus for the mobile menu. */
  useEffect(() => {
    if (!menuOpen) return;

    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const frame = window.requestAnimationFrame(() => {
      menuRef.current
        ?.querySelector<HTMLElement>("button, a")
        ?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const menu = menuRef.current;
      if (!menu) return;

      const focusable = menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [menuOpen]);

  if (fallback) {
    return (
      <WorldFallback
        reason={webgl === false ? "unsupported" : "failed"}
        onRetry={retryScene}
      />
    );
  }

  return (
    <div className="world-shell" data-station={active} data-theme="dark">
      <a className="world-skip" href="#station-heading">
        Skip to station content
      </a>

      <div className="world-stage" aria-hidden="true">
        {mountScene && webgl === true && (
          <SceneBoundary key={retryKey} onError={() => setSceneFailed(true)}>
            <WorldScene
              key={retryKey}
              active={active}
              reduced={reduced}
              mobile={mobile}
              visible={pageVisible}
              resetToken={resetToken}
              selected={selected}
              onSelect={handleSelect}
              onNavigate={goTo}
              onReady={() => setSceneReady(true)}
            />
          </SceneBoundary>
        )}
      </div>

      <div className="world-atmosphere" aria-hidden="true" />
      <div className="world-vignette" aria-hidden="true" />
      <div className="world-scanlines" aria-hidden="true" />

      <header className="world-header">
        <a
          href="#home"
          className="world-brand"
          onClick={(event) => {
            event.preventDefault();
            goTo("home");
          }}
        >
          <span className="world-brand-mark" aria-hidden="true">
            LC
          </span>
          <span className="world-brand-copy">
            <strong>LORIS CANOLLI</strong>
            <small>IT systems / development</small>
          </span>
        </a>

        <nav className="world-nav" aria-label="Primary">
          {worldStations.map((station) => (
            <button
              key={station.id}
              type="button"
              className="world-nav-link"
              aria-current={active === station.id ? "page" : undefined}
              onClick={() => goTo(station.id, true)}
            >
              <span>{station.index}</span>
              {station.label}
            </button>
          ))}
        </nav>

        <div className="world-header-actions">
          <button
            type="button"
            className="world-icon-button"
            onClick={resetCamera}
            aria-label="Reset camera to the current section"
            title="Reset camera"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
          <a href="/standard/" className="world-header-link">
            <Accessibility className="h-4 w-4" aria-hidden="true" />
            <span>Accessible version</span>
          </a>
          <button
            type="button"
            className="world-menu-button"
            aria-expanded={menuOpen}
            aria-controls="world-menu"
            aria-label="Open section menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <nav className="world-rail" aria-label="Section indicators">
        {worldStations.map((station) => (
          <button
            key={station.id}
            type="button"
            className="world-rail-link"
            aria-current={active === station.id ? "page" : undefined}
            aria-label={`Go to ${station.label}`}
            onClick={() => goTo(station.id, true)}
          >
            <span className="world-rail-dot" aria-hidden="true" />
            <span className="world-rail-label">{station.label}</span>
          </button>
        ))}
      </nav>

      <main id="main" className="world-main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={active}
            aria-labelledby="station-heading"
            className={`world-panel world-panel-${active}`}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{
              duration: reduced ? 0 : 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="world-panel-scroll" data-scroll-region>
              <StationContent
                station={active}
                onNavigate={goTo}
                onSelect={handleSelect}
                reduced={reduced}
              />
            </div>
            <div className="world-panel-foot" aria-hidden="true">
              <span>{currentStation.index}</span>
              <span>{currentStation.label}</span>
              <span>{currentStation.kicker}</span>
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      <DetailDrawer
        selection={selected}
        onClose={() => setSelected(null)}
        onNavigate={goTo}
        reduced={reduced}
      />

      <div className="world-statusbar">
        <div className="world-status-station">
          <span className="world-status-index">{currentStation.index}</span>
          <span className="world-status-label">{currentStation.label}</span>
          <span className="world-status-summary">{currentStation.summary}</span>
        </div>

        <div
          className={`world-status-hint${hintVisible ? " is-visible" : ""}`}
          aria-hidden={!hintVisible}
        >
          <MoveVertical className="h-4 w-4" aria-hidden="true" />
          Scroll / swipe to travel
        </div>

        <div className="world-status-actions">
          <button
            type="button"
            onClick={goPrevious}
            aria-label={`Previous section: ${previousStation.label}`}
            title={`Previous: ${previousStation.label}`}
            className="world-step-button"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="world-status-progress" aria-hidden="true">
            <span
              style={{
                width: `${((currentIndex + 1) / worldStations.length) * 100}%`,
              }}
            />
          </span>
          <button
            type="button"
            onClick={goNext}
            aria-label={`Next section: ${nextStation.label}`}
            title={`Next: ${nextStation.label}`}
            className="world-step-button"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="world-menu"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          >
            <div
              ref={menuRef}
              id="world-menu"
              className="world-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="world-menu-title"
            >
              <div className="world-menu-head">
                <div>
                  <p className="world-kicker">
                    <span>NAVIGATION</span>
                    <span className="world-kicker-divider">/</span>
                    <span>7 STATIONS</span>
                  </p>
                  <h2 id="world-menu-title" className="world-menu-title">
                    Travel the world.
                  </h2>
                </div>
                <button
                  type="button"
                  className="world-icon-button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close section menu"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <nav className="world-menu-nav" aria-label="All sections">
                {worldStations.map((station) => (
                  <button
                    key={station.id}
                    type="button"
                    className="world-menu-link"
                    aria-current={active === station.id ? "page" : undefined}
                    onClick={() => goTo(station.id, true)}
                  >
                    <span className="world-menu-index">{station.index}</span>
                    <span>{station.label}</span>
                    <span className="world-menu-summary">{station.summary}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ))}
              </nav>

              <div className="world-menu-foot">
                <button
                  type="button"
                  className="world-text-link"
                  onClick={() => {
                    setMenuOpen(false);
                    resetCamera();
                  }}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reset camera
                </button>
                <a href="/standard/" className="world-text-link">
                  <Accessibility className="h-4 w-4" aria-hidden="true" />
                  Accessible version
                </a>
                <a
                  href={siteConfig.cvPath}
                  download
                  className="world-text-link"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download CV
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loaderVisible && (
          <motion.div
            className="world-loader"
            role="status"
            aria-live="polite"
            initial={reduced ? false : { opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.5 }}
          >
            <div className="world-loader-grid" aria-hidden="true" />
            <div className="world-loader-inner">
              <span className="world-loader-mark" aria-hidden="true">
                LC
              </span>
              <p className="world-kicker">
                <span>INITIALIZING ENVIRONMENT</span>
                <span className="world-kicker-divider">/</span>
                <span>LORISCANOLLI.COM</span>
              </p>
              <h1 className="world-loader-title">
                Building the systems
                <span>around the work.</span>
              </h1>
              <div
                className="world-loader-progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label="Loading the 3D portfolio"
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <div className="world-loader-meta">
                <span>{Math.round(progress)}%</span>
                <span>
                  {sceneReady
                    ? "Scene ready"
                    : webgl === null
                      ? "Checking WebGL"
                      : "Assembling geometry"}
                </span>
              </div>
              <div className="world-loader-steps" aria-hidden="true">
                <span data-done={webgl === true ? "true" : undefined}>
                  WebGL renderer
                </span>
                <span data-done={sceneReady ? "true" : undefined}>
                  World geometry
                </span>
                <span data-done={sceneReady ? "true" : undefined}>
                  Interface layer
                </span>
              </div>
              <a href="/standard/" className="world-loader-link">
                Skip to the accessible portfolio
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="world-live" aria-live="polite">
        {liveMessage}
      </p>

      <div className="world-help" aria-hidden="true">
        <MousePointer2 className="h-3.5 w-3.5" />
        Click objects to inspect
      </div>
    </div>
  );
}

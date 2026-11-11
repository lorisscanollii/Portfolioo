"use client";

import { useEffect, useRef, useState } from "react";

type ThemeMode = "dark" | "light";

interface NetworkInformation {
  saveData?: boolean;
}

/**
 * Tracks a CSS media query on the client. Returns false during SSR and the
 * first render, then syncs to the real value.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

export function useThemeMode(): ThemeMode {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const read = () =>
      document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(read());
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}

/**
 * Reports whether WebGL is available. Returns null while the check is
 * running, so callers can keep showing a static fallback.
 *
 * Data-saver users are treated as unsupported and get the lightweight
 * fallback instead of a WebGL scene.
 */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    let available = false;
    let context: WebGL2RenderingContext | null = null;
    try {
      const canvas = document.createElement("canvas");
      // Three.js renders through WebGL2. Probing only WebGL1 would report a
      // false positive on devices where the scene cannot create a renderer.
      context = canvas.getContext("webgl2");
      available = Boolean(window.WebGL2RenderingContext && context);
      const connection = (
        navigator as Navigator & { connection?: NetworkInformation }
      ).connection;
      if (connection?.saveData) available = false;
    } catch {
      available = false;
    } finally {
      // Release the probe context immediately; it should not count toward the
      // browser's WebGL context limit.
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    }
    setSupported(available);
  }, []);

  return supported;
}

/**
 * Pauses expensive rendering when the page is hidden. Browsers throttle
 * background tabs, but this also stops the render loop immediately.
 */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return visible;
}

interface UseInViewOptions {
  rootMargin?: string;
  threshold?: number;
}

/** Tracks whether an element is inside (or close to) the viewport. */
export function useInView<T extends HTMLElement>({
  rootMargin = "0px",
  threshold = 0.01,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, inView };
}

interface IdleCapableWindow {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout?: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
}

/**
 * Defers an expensive visual until the browser is idle (or a short timeout).
 * Used so the initial page content and fonts paint before the WebGL chunk is
 * evaluated.
 */
export function useDeferredMount(delay = 500): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const idleWindow = window as unknown as IdleCapableWindow;

    if (typeof idleWindow.requestIdleCallback === "function") {
      const handle = idleWindow.requestIdleCallback(() => setMounted(true), {
        timeout: delay + 700,
      });
      return () => idleWindow.cancelIdleCallback?.(handle);
    }

    const handle = window.setTimeout(() => setMounted(true), delay);
    return () => window.clearTimeout(handle);
  }, [delay]);

  return mounted;
}

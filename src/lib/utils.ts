/**
 * Joins conditional class names and filters out falsy values.
 * A dependency-free alternative to `clsx`/`tailwind-merge`.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-accent">
        <span className="opacity-70">guest@loriscanolli.com:~$</span> cd{" "}
        /page-not-found
      </p>
      <h1 className="mt-6 text-5xl font-semibold tracking-tight">404</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you are looking for does not exist on this server.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
      >
        Back to homepage
      </Link>
    </main>
  );
}

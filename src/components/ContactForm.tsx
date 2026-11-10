"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_VALUES: FormValues = { name: "", email: "", subject: "", message: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) {
    errors.name = "Please enter your name (at least 2 characters).";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (values.subject.trim().length < 3) {
    errors.subject = "Please enter a subject (at least 3 characters).";
  }
  if (values.message.trim().length < 10) {
    errors.message = "Please enter a message (at least 10 characters).";
  }
  return errors;
}

const inputClasses = (hasError: boolean) =>
  cn(
    "w-full rounded-md border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors",
    hasError
      ? "border-red-500/60"
      : "border-border hover:border-accent/40 focus:border-accent",
  );

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Clear a field's error as soon as the user edits it.
    if (submitAttempted) {
      setErrors((previous) => ({ ...previous, [field]: undefined }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    setSubmitAttempted(true);

    if (Object.keys(validation).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("sending");

    // No backend is used on purpose: the form composes a complete email and
    // opens the visitor's mail client. Swap this block for a fetch() call to
    // a form service (e.g. Formspree / Web3Forms) to send directly instead.
    window.setTimeout(() => {
      const subject = encodeURIComponent(`[Portfolio] ${values.subject.trim()}`);
      const body = encodeURIComponent(
        `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`,
      );
      window.location.href = `mailto:${siteConfig.social.email}?subject=${subject}&body=${body}`;
      setStatus("success");
      setValues(EMPTY_VALUES);
      setSubmitAttempted(false);
    }, 500);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <h3 className="font-semibold">Send a message</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Fill in the form and your email client will open with the message ready
        to send — nothing is stored or sent to a server.
      </p>

      {status === "success" ? (
        <div
          role="status"
          className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5"
        >
          <p className="flex items-center gap-2.5 text-sm font-medium text-foreground">
            <CheckCircle2
              className="h-5 w-5 shrink-0 text-emerald-500"
              aria-hidden="true"
            />
            Your email client should now be open with your message.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            If it did not open, send your message directly to{" "}
            <a
              href={`mailto:${siteConfig.social.email}`}
              className="font-medium text-accent hover:underline"
            >
              {siteConfig.social.email}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent"
          >
            Write another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block text-sm font-medium"
              >
                Name <span className="text-accent" aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={values.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                className={inputClasses(Boolean(errors.name))}
              />
              {errors.name && (
                <p
                  id="contact-name-error"
                  className="mt-1.5 text-xs text-red-500 dark:text-red-400"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email <span className="text-accent" aria-hidden="true">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={values.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                className={inputClasses(Boolean(errors.email))}
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  className="mt-1.5 text-xs text-red-500 dark:text-red-400"
                >
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-subject"
              className="mb-1.5 block text-sm font-medium"
            >
              Subject <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              value={values.subject}
              onChange={(event) => handleChange("subject", event.target.value)}
              placeholder="What is this about?"
              required
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "contact-subject-error" : undefined}
              className={inputClasses(Boolean(errors.subject))}
            />
            {errors.subject && (
              <p
                id="contact-subject-error"
                className="mt-1.5 text-xs text-red-500 dark:text-red-400"
              >
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block text-sm font-medium"
            >
              Message <span className="text-accent" aria-hidden="true">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={values.message}
              onChange={(event) => handleChange("message", event.target.value)}
              placeholder="Tell me about your project, role, or technical problem…"
              rows={5}
              required
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              className={cn(inputClasses(Boolean(errors.message)), "resize-y")}
            />
            {errors.message && (
              <p
                id="contact-message-error"
                className="mt-1.5 text-xs text-red-500 dark:text-red-400"
              >
                {errors.message}
              </p>
            )}
          </div>

          {submitAttempted && Object.keys(errors).length > 0 && (
            <p role="alert" className="text-sm text-red-500 dark:text-red-400">
              Please fix the highlighted fields and try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "sending" ? (
              <>
                <span
                  className="submit-spinner inline-block h-4 w-4 rounded-full border-2 border-emerald-950/30 border-t-emerald-950"
                  aria-hidden="true"
                />
                Sending…
              </>
            ) : (
              <>
                Send Message
                <Send className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

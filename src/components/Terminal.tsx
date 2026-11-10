"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import {
  about,
  experience,
  projects,
  siteConfig,
  skills,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";

const PROMPT = "guest@loriscanolli.com:~$";

type LineKind = "cmd" | "out" | "err" | "sys";

interface Line {
  kind: LineKind;
  text: string;
}

const INITIAL_LINES: Line[] = [
  { kind: "sys", text: "Welcome to loriscanolli.com — interactive terminal" },
  { kind: "sys", text: "Type 'help' to list available commands." },
];

const QUICK_COMMANDS = ["help", "whoami", "skills", "projects", "experience"];

function run(raw: string): { output: Line[]; clear: boolean } {
  const trimmed = raw.trim();
  const parts = trimmed.split(/\s+/);
  const command = (parts[0] ?? "").toLowerCase();
  const args = parts.slice(1);

  const line = (kind: LineKind, text: string): Line => ({ kind, text });
  const all = (kind: LineKind, texts: string[]): Line[] =>
    texts.map((text) => line(kind, text));

  const skillLines = skills.map((category) =>
    line("out", `${category.category}: ${category.items.join(", ")}`),
  );

  const projectLines = projects.map((project) =>
    line(
      "out",
      `${project.number}  ${project.name} — [${project.statusLabel}]${
        project.links.live ? ` — ${project.links.live}` : ""
      }`,
    ),
  );

  const contactLines = all("out", [
    `Email:    ${siteConfig.social.email}`,
    `LinkedIn: ${siteConfig.social.linkedin}`,
    `GitHub:   ${siteConfig.social.github}`,
    `Website:  ${siteConfig.url}`,
  ]);

  switch (command) {
    case "":
      return { output: [], clear: false };

    case "help":
      return {
        output: all("out", [
          "Available commands:",
          "  whoami        — who is Loris Canolli",
          "  skills        — technologies and systems I work with",
          "  projects      — list my projects",
          "  experience    — my professional experience",
          "  contact       — how to reach me",
          "  cv            — link to my CV",
          "  ls            — list files",
          "  cat <file>    — print a file",
          "  echo <text>   — print text",
          "  clear         — clear the terminal",
        ]),
        clear: false,
      };

    case "whoami":
      return {
        output: [
          line("out", siteConfig.name),
          line("out", siteConfig.titles.join(" | ")),
          line("out", ""),
          line("out", siteConfig.heroSupport),
        ],
        clear: false,
      };

    case "skills":
      return { output: skillLines, clear: false };

    case "projects":
      return { output: projectLines, clear: false };

    case "experience":
      return {
        output: [
          line("out", "IT support within an educational institution:"),
          ...experience.areas.map((area) =>
            line("out", `${area.title}: ${area.summary}`),
          ),
        ],
        clear: false,
      };

    case "contact":
      return { output: contactLines, clear: false };

    case "cv":
      return {
        output: [
          line(
            "out",
            `CV available at ${siteConfig.url}${siteConfig.cvPath}`,
          ),
        ],
        clear: false,
      };

    case "ls":
      return {
        output: all("out", [
          "about.md",
          "skills.md",
          "experience.md",
          "projects.md",
          "contact.md",
          "cv.pdf",
        ]),
        clear: false,
      };

    case "cat": {
      const file = args[0];
      if (!file) {
        return {
          output: [line("err", "cat: missing file operand")],
          clear: false,
        };
      }
      const files: Record<string, Line[]> = {
        "about.md": about.paragraphs.map((paragraph) => line("out", paragraph)),
        "skills.md": skillLines,
        "experience.md": [
          line("out", "IT support within an educational institution:"),
          ...experience.areas.map((area) =>
            line("out", `${area.title}: ${area.summary}`),
          ),
        ],
        "projects.md": projectLines,
        "contact.md": contactLines,
        "cv.pdf": [
          line(
            "err",
            `cat: cv.pdf: binary file — download it instead: ${siteConfig.cvPath}`,
          ),
        ],
      };
      if (!(file in files)) {
        return {
          output: [line("err", `cat: ${file}: No such file or directory`)],
          clear: false,
        };
      }
      return { output: files[file], clear: false };
    }

    case "echo":
      return { output: [line("out", args.join(" "))], clear: false };

    case "sudo":
      return {
        output: all("out", [
          "guest is not in the sudoers file. This incident will be reported.",
          "(Relax — you already have full read access here.)",
        ]),
        clear: false,
      };

    case "exit":
      return {
        output: [
          line(
            "out",
            "There is no escape from a portfolio terminal. Try 'help' instead.",
          ),
        ],
        clear: false,
      };

    case "clear":
      return { output: [], clear: true };

    default:
      return {
        output: [
          line("err", `bash: ${command}: command not found`),
          line("sys", "Type 'help' to list available commands."),
        ],
        clear: false,
      };
  }
}

const lineStyles: Record<LineKind, string> = {
  cmd: "text-[#d7e1e9]",
  out: "text-terminal-text",
  err: "text-red-400",
  sys: "text-slate-500",
};

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Keep the newest output in view.
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const execute = (raw: string) => {
    const trimmed = raw.trim();
    const { output, clear } = run(raw);
    if (clear) {
      setLines([]);
    } else {
      const commandEcho: Line = { kind: "cmd", text: `${PROMPT} ${raw}` };
      setLines((previous) => [...previous, commandEcho, ...output]);
    }
    if (trimmed) {
      setHistory((previous) =>
        [...previous.filter((entry) => entry !== trimmed), trimmed].slice(-30),
      );
    }
    setHistoryIndex(null);
    setInput("");
    inputRef.current?.focus();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    execute(input);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const nextIndex =
        historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex] ?? "");
      }
    } else if (event.key.toLowerCase() === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-terminal-border bg-terminal-bg shadow-lg">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-terminal-border px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" aria-hidden="true" />
          <span className="ml-2 flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <TerminalIcon className="h-3.5 w-3.5" aria-hidden="true" />
            guest@loriscanolli.com — bash
          </span>
        </div>

        {/* Output + input */}
        <div
          ref={outputRef}
          className="h-[300px] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed sm:h-[340px]"
          onClick={() => inputRef.current?.focus()}
        >
          <div
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
            aria-relevant="additions"
          >
            {lines.map((line, index) => (
              <div
                key={`${index}-${line.kind}`}
                className={cn("whitespace-pre-wrap", lineStyles[line.kind])}
              >
                {line.kind === "cmd" ? (
                  <>
                    <span className="text-accent">{PROMPT}</span>
                    {line.text.slice(PROMPT.length)}
                  </>
                ) : (
                  line.text
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="mt-1 flex items-center gap-2">
            <span className="shrink-0 text-accent" aria-hidden="true">
              {PROMPT}
            </span>
            <label htmlFor="terminal-input" className="sr-only">
              Terminal command input
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-sm bg-transparent font-mono text-[13px] text-[#d7e1e9] caret-[#34d399] outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#34d399]"
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-describedby="terminal-hint"
            />
          </form>
        </div>
      </div>

      <p id="terminal-hint" className="sr-only">
        Interactive terminal. Type help and press Enter to list available
        commands. Use arrow keys to browse command history.
      </p>

      {/* Quick commands */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground">Try:</span>
        {QUICK_COMMANDS.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => execute(command)}
            className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}

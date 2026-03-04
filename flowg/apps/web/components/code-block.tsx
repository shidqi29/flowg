"use client";

import { useState, useMemo } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: "html" | "js" | "bash" | "css";
  showLineNumbers?: boolean;
}

// ---- Lightweight syntax highlighting via regex ----

type Token = { text: string; type: string };

function tokenize(code: string, language: string): Token[][] {
  return code.split("\n").map((line) => tokenizeLine(line, language));
}

function tokenizeLine(line: string, language: string): Token[] {
  if (language === "bash") return tokenizeBash(line);
  if (language === "js") return tokenizeJs(line);
  if (language === "css") return tokenizeCss(line);
  return tokenizeHtml(line);
}

function tokenizeBash(line: string): Token[] {
  // comments
  if (line.trimStart().startsWith("#")) {
    return [{ text: line, type: "comment" }];
  }
  const tokens: Token[] = [];
  const re =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:npm|pnpm|yarn|install|add|npx)\b|[^\s"']+|\s+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const t = m[0]!;
    if (/^["']/.test(t)) tokens.push({ text: t, type: "string" });
    else if (/^(npm|pnpm|yarn|install|add|npx)$/.test(t))
      tokens.push({ text: t, type: "keyword" });
    else tokens.push({ text: t, type: "plain" });
  }
  return tokens;
}

function tokenizeJs(line: string): Token[] {
  // full-line comment
  if (line.trimStart().startsWith("//")) {
    return [{ text: line, type: "comment" }];
  }
  const tokens: Token[] = [];
  const re =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:import|from|export|const|let|var|function|return|if|else|new|typeof|async|await|default|class|extends)\b|\/\/.*$|[^"'`\s]+|\s+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const t = m[0]!;
    if (/^["'`]/.test(t)) tokens.push({ text: t, type: "string" });
    else if (/^\/\//.test(t)) tokens.push({ text: t, type: "comment" });
    else if (
      /^(import|from|export|const|let|var|function|return|if|else|new|typeof|async|await|default|class|extends)$/.test(
        t,
      )
    )
      tokens.push({ text: t, type: "keyword" });
    else tokens.push({ text: t, type: "plain" });
  }
  return tokens;
}

function tokenizeCss(line: string): Token[] {
  if (line.trimStart().startsWith("/*") || line.trimStart().startsWith("*")) {
    return [{ text: line, type: "comment" }];
  }
  const tokens: Token[] = [];
  const re =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[{}:;]|[@.]?[a-zA-Z_-][\w-]*|#[0-9a-fA-F]+|\d+(?:\.\d+)?(?:px|em|rem|%|s|ms)?|\s+|.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const t = m[0]!;
    if (/^["']/.test(t)) tokens.push({ text: t, type: "string" });
    else if (/^[{}:;]$/.test(t)) tokens.push({ text: t, type: "punctuation" });
    else if (/^@/.test(t)) tokens.push({ text: t, type: "keyword" });
    else if (/^\d/.test(t) || /^#[0-9a-fA-F]/.test(t))
      tokens.push({ text: t, type: "number" });
    else tokens.push({ text: t, type: "plain" });
  }
  return tokens;
}

function tokenizeHtml(line: string): Token[] {
  // full-line comment
  if (line.trimStart().startsWith("<!--")) {
    return [{ text: line, type: "comment" }];
  }
  const tokens: Token[] = [];
  const re =
    /(<!--.*?-->|"[^"]*"|'[^']*'|<\/?[\w-]+|\/?>|\b[\w-]+=|[^<>"'=\s]+|\s+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const t = m[0]!;
    if (/^<!--/.test(t)) tokens.push({ text: t, type: "comment" });
    else if (/^<\/?/.test(t)) tokens.push({ text: t, type: "tag" });
    else if (/^\/?>$/.test(t)) tokens.push({ text: t, type: "tag" });
    else if (/^["']/.test(t)) tokens.push({ text: t, type: "string" });
    else if (/=\s*$/.test(t)) tokens.push({ text: t, type: "attr" });
    else tokens.push({ text: t, type: "plain" });
  }
  return tokens;
}

const TOKEN_COLORS: Record<string, string> = {
  comment: "text-zinc-500",
  keyword: "text-violet-400",
  string: "text-emerald-400",
  tag: "text-sky-400",
  attr: "text-amber-300",
  number: "text-orange-400",
  punctuation: "text-zinc-400",
  plain: "text-zinc-200",
};

function HighlightedLine({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((tok, i) => (
        <span key={i} className={TOKEN_COLORS[tok.type] ?? "text-zinc-200"}>
          {tok.text}
        </span>
      ))}
    </>
  );
}

// ---- Component ----

export function CodeBlock({
  code,
  language = "html",
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const lines = useMemo(() => tokenize(code, language), [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langLabel =
    language === "js"
      ? "JavaScript"
      : language === "bash"
        ? "Terminal"
        : language === "css"
          ? "CSS"
          : "HTML";

  return (
    <div className="group relative rounded-lg border border-border overflow-hidden bg-zinc-950 dark:bg-zinc-900/80">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/80 dark:bg-zinc-800/50">
        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
          {langLabel}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
          {copied ? (
            <>
              <Check className="size-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-[11px] sm:text-xs leading-relaxed font-mono">
          <code>
            {lines.map((lineTokens, i) => (
              <div key={i} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell pr-4 text-right text-zinc-600 select-none w-8">
                    {i + 1}
                  </span>
                )}
                <span className="table-cell">
                  <HighlightedLine tokens={lineTokens} />
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { AnimationDef } from "@/lib/animations";

type NavSection = "introduction" | "installation" | "animations";

interface TOCItem {
  id: string;
  label: string;
  level: number;
}

const INTRO_TOC: TOCItem[] = [
  { id: "what-is-flowg", label: "What is FlowG?", level: 0 },
  { id: "core-philosophy", label: "Core Philosophy", level: 0 },
  { id: "smart-loading", label: "Smart Loading", level: 1 },
  { id: "css-layer", label: "CSS Layer", level: 2 },
  { id: "gsap-layer", label: "GSAP Layer (On Demand)", level: 2 },
  { id: "features", label: "Features", level: 0 },
];

const INSTALL_TOC: TOCItem[] = [
  { id: "npm-install", label: "npm / pnpm / yarn", level: 0 },
  { id: "cdn-usage", label: "CDN Usage", level: 0 },
  { id: "webflow-setup", label: "Webflow Setup", level: 0 },
  { id: "quick-start", label: "Quick Start", level: 0 },
];

const ANIMATION_TOC: TOCItem[] = [
  { id: "anim-preview", label: "Preview", level: 0 },
  { id: "anim-config", label: "Configuration", level: 0 },
  { id: "anim-attributes", label: "Attributes", level: 1 },
  { id: "anim-code", label: "Code Export", level: 0 },
];

const API_REFERENCE: TOCItem[] = [
  { id: "api-anim", label: "data-flowg-anim", level: 0 },
  { id: "api-duration", label: "data-flowg-duration", level: 0 },
  { id: "api-delay", label: "data-flowg-delay", level: 0 },
  { id: "api-ease", label: "data-flowg-ease", level: 0 },
  { id: "api-offset", label: "data-flowg-offset", level: 0 },
  { id: "api-trigger", label: "data-flowg-trigger", level: 0 },
  { id: "api-stagger", label: "data-flowg-stagger", level: 0 },
  { id: "api-repeat", label: "data-flowg-repeat", level: 0 },
  { id: "api-direction", label: "data-flowg-direction", level: 0 },
];

interface DocsTocProps {
  activeSection: NavSection;
  selectedAnimation: AnimationDef | null;
}

export function DocsToc({ activeSection }: DocsTocProps) {
  const sectionToc =
    activeSection === "introduction"
      ? INTRO_TOC
      : activeSection === "installation"
        ? INSTALL_TOC
        : ANIMATION_TOC;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
            On this page
          </p>
          <div className="space-y-0.5">
            {sectionToc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-xs py-1 transition-colors hover:text-foreground ${
                  item.level === 0
                    ? "text-muted-foreground pl-0 font-medium"
                    : item.level === 1
                      ? "text-muted-foreground/80 pl-3"
                      : "text-muted-foreground/60 pl-6"
                }`}>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <Separator />

        {/* Always show API reference */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
            API Reference
          </p>
          <div className="space-y-0.5">
            {API_REFERENCE.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-xs py-1 text-muted-foreground hover:text-foreground transition-colors font-mono">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

"use client";

import { useMemo } from "react";
import {
  ANIMATION_REGISTRY,
  CATEGORIES,
  type AnimationDef,
} from "@/lib/animations";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Package, Zap, BookOpen, Download, Blocks } from "lucide-react";

type NavSection = "introduction" | "installation" | "animations";

interface DocsSidebarProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
  selectedAnimation: AnimationDef | null;
  onSelectAnimation: (anim: AnimationDef) => void;
}

const NAV_ITEMS: { id: NavSection; label: string; icon: React.ElementType }[] =
  [
    { id: "introduction", label: "Introduction", icon: BookOpen },
    { id: "installation", label: "Installation", icon: Download },
    { id: "animations", label: "Animations", icon: Blocks },
  ];

export function DocsSidebar({
  activeSection,
  onSectionChange,
  selectedAnimation,
  onSelectAnimation,
}: DocsSidebarProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, AnimationDef[]>();
    for (const cat of CATEGORIES) {
      map.set(
        cat,
        ANIMATION_REGISTRY.filter((a) => a.category === cat),
      );
    }
    return map;
  }, []);

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4 space-y-1">
        {/* Brand */}
        <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
          <Zap className="size-5 text-primary" />
          <span className="font-bold text-base tracking-tight">
            Flow<span className="text-primary">G</span>
          </span>
        </div>

        {/* Top-level nav */}
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeSection === item.id &&
              (item.id !== "animations" || !selectedAnimation);
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}>
                <Icon className="size-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>

        <Separator className="my-3" />

        {/* Animation list grouped by category */}
        <div className="space-y-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2.5">
            Components
          </p>

          {[...grouped.entries()].map(([category, anims]) => (
            <div key={category} className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground px-2.5 py-1">
                {category}
              </p>
              {anims.map((anim) => {
                const isActive =
                  selectedAnimation?.name === anim.name &&
                  activeSection === "animations";
                return (
                  <button
                    key={anim.name}
                    onClick={() => {
                      onSelectAnimation(anim);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer group ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}>
                    <span className="truncate">{anim.label}</span>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[9px] px-1.5 py-0 h-4 ${
                        anim.engine === "css"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20"
                      }`}>
                      {anim.engine === "css" ? "CSS" : "GSAP"}
                    </Badge>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom info */}
        <Separator className="my-3" />
        <div className="px-2.5 py-2 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Package className="size-3" />
            <span>flowgeneration@0.1.0</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Core ~2KB
            </div>
            <div className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-violet-500" />
              Pro + GSAP
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

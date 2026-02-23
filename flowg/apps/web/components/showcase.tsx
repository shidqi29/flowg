"use client";

import { useState, useMemo } from "react";
import {
  ANIMATION_REGISTRY,
  CATEGORIES,
  type AnimationDef,
} from "@/lib/animations";
import { AnimationCard } from "@/components/animation-card";
import { AnimationPreview } from "@/components/animation-preview";
import { Configurator, type AnimConfig } from "@/components/configurator";
import { CodeExport } from "@/components/code-export";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const DEFAULT_CONFIG: AnimConfig = {
  duration: "0.5",
  delay: "0",
  ease: "ease-out",
  offset: "",
  trigger: "viewport",
};

export function Showcase() {
  const [selected, setSelected] = useState<AnimationDef>(
    ANIMATION_REGISTRY[0]!,
  );
  const [config, setConfig] = useState<AnimConfig>(DEFAULT_CONFIG);
  const [filter, setFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return ANIMATION_REGISTRY;
    if (filter === "CSS")
      return ANIMATION_REGISTRY.filter((a) => a.engine === "css");
    if (filter === "GSAP")
      return ANIMATION_REGISTRY.filter((a) => a.engine === "gsap");
    return ANIMATION_REGISTRY.filter((a) => a.category === filter);
  }, [filter]);

  const filterTabs = ["All", "CSS", "GSAP", ...CATEGORIES];

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
      {/* Left: Gallery */}
      <div className="flex-1 space-y-4">
        {/* Filter tabs */}
        <ScrollArea className="w-full">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="inline-flex h-9">
              {filterTabs.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="text-xs px-3">
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </ScrollArea>

        {/* Results count */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {filtered.length} animation{filtered.length !== 1 && "s"}
          </span>
          <span>·</span>
          <span>{filtered.filter((a) => a.engine === "css").length} CSS</span>
          <span>·</span>
          <span>{filtered.filter((a) => a.engine === "gsap").length} GSAP</span>
        </div>

        {/* Animation grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((anim) => (
            <AnimationCard
              key={anim.name}
              animation={anim}
              isSelected={selected.name === anim.name}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* Right: Sidebar — Config + Preview + Code */}
      <aside className="w-full lg:w-80 xl:w-96 shrink-0 space-y-6">
        <div className="sticky top-6 space-y-6">
          {/* Selected animation info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{selected.label}</h2>
              <Badge
                variant="outline"
                className={
                  selected.engine === "css"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20"
                }>
                {selected.engine === "css" ? "CSS" : "GSAP"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {selected.description}
            </p>
          </div>

          {/* Live preview */}
          <AnimationPreview
            animation={selected}
            duration={config.duration}
            delay={config.delay}
            ease={config.ease}
          />

          <Separator />

          {/* Configurator */}
          <Configurator config={config} onChange={setConfig} />

          <Separator />

          {/* Code export */}
          <CodeExport animation={selected} config={config} />
        </div>
      </aside>
    </div>
  );
}

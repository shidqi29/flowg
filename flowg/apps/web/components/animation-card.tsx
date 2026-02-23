"use client";

import type { AnimationDef } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimationPreview } from "@/components/animation-preview";

interface AnimationCardProps {
  animation: AnimationDef;
  isSelected?: boolean;
  onSelect?: (animation: AnimationDef) => void;
}

export function AnimationCard({
  animation,
  isSelected,
  onSelect,
}: AnimationCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md active:scale-[0.98] ${
        isSelected
          ? "ring-2 ring-primary shadow-md"
          : "hover:ring-1 hover:ring-border"
      }`}
      onClick={() => onSelect?.(animation)}>
      <CardHeader className="p-3 sm:p-4 pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xs sm:text-sm font-medium truncate">
            {animation.label}
          </CardTitle>
          <Badge
            variant={animation.engine === "css" ? "default" : "secondary"}
            className={`shrink-0 text-[10px] sm:text-xs ${
              animation.engine === "css"
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20"
                : "bg-violet-500/15 text-violet-700 dark:text-violet-400 hover:bg-violet-500/25 border-violet-500/20"
            }`}>
            {animation.engine === "css" ? "CSS" : "GSAP"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0">
        <AnimationPreview animation={animation} />
      </CardContent>
    </Card>
  );
}

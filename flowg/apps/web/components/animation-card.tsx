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
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "ring-2 ring-primary shadow-md"
          : "hover:ring-1 hover:ring-border"
      }`}
      onClick={() => onSelect?.(animation)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {animation.label}
          </CardTitle>
          <Badge
            variant={animation.engine === "css" ? "default" : "secondary"}
            className={
              animation.engine === "css"
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20"
                : "bg-violet-500/15 text-violet-700 dark:text-violet-400 hover:bg-violet-500/25 border-violet-500/20"
            }>
            {animation.engine === "css" ? "CSS" : "GSAP"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <AnimationPreview animation={animation} />
      </CardContent>
    </Card>
  );
}

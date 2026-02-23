"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export interface AnimConfig {
  duration: string;
  delay: string;
  ease: string;
  offset: string;
  trigger: string;
}

interface ConfiguratorProps {
  config: AnimConfig;
  onChange: (config: AnimConfig) => void;
}

const EASING_OPTIONS = [
  { value: "ease-out", label: "Ease Out" },
  { value: "ease-in", label: "Ease In" },
  { value: "ease-in-out", label: "Ease In Out" },
  { value: "linear", label: "Linear" },
  { value: "cubic-bezier(0.34, 1.56, 0.64, 1)", label: "Spring" },
  { value: "power2.out", label: "Power2 Out (GSAP)" },
  { value: "power3.out", label: "Power3 Out (GSAP)" },
  { value: "bounce.out", label: "Bounce Out (GSAP)" },
  { value: "elastic.out(1,0.3)", label: "Elastic (GSAP)" },
];

const TRIGGER_OPTIONS = [
  { value: "viewport", label: "Viewport (scroll)" },
  { value: "hover", label: "Hover" },
  { value: "click", label: "Click" },
];

export function Configurator({ config, onChange }: ConfiguratorProps) {
  const update = (key: keyof AnimConfig, value: string) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-sm text-foreground">Configuration</h3>

      {/* Duration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="duration" className="text-xs">
            Duration
          </Label>
          <span className="text-xs text-muted-foreground tabular-nums">
            {config.duration}s
          </span>
        </div>
        <Slider
          id="duration"
          min={0.1}
          max={3}
          step={0.1}
          value={[parseFloat(config.duration)]}
          onValueChange={([v]) => update("duration", v!.toFixed(1))}
        />
      </div>

      {/* Delay */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="delay" className="text-xs">
            Delay
          </Label>
          <span className="text-xs text-muted-foreground tabular-nums">
            {config.delay}s
          </span>
        </div>
        <Slider
          id="delay"
          min={0}
          max={2}
          step={0.1}
          value={[parseFloat(config.delay)]}
          onValueChange={([v]) => update("delay", v!.toFixed(1))}
        />
      </div>

      <Separator />

      {/* Easing */}
      <div className="space-y-2">
        <Label className="text-xs">Easing</Label>
        <Select value={config.ease} onValueChange={(v) => update("ease", v)}>
          <SelectTrigger className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EASING_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Trigger */}
      <div className="space-y-2">
        <Label className="text-xs">Trigger</Label>
        <Select
          value={config.trigger}
          onValueChange={(v) => update("trigger", v)}>
          <SelectTrigger className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRIGGER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Offset */}
      <div className="space-y-2">
        <Label htmlFor="offset" className="text-xs">
          Viewport Offset
        </Label>
        <Input
          id="offset"
          value={config.offset}
          onChange={(e) => update("offset", e.target.value)}
          placeholder="e.g. 20%"
          className="text-xs"
        />
      </div>
    </div>
  );
}

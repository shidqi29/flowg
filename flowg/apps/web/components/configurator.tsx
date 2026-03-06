"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ──────────────────────────────────────────────

export type ConfigField =
  | "duration"
  | "delay"
  | "ease"
  | "offset"
  | "trigger"
  | "stagger"
  | "repeat"
  | "direction";

export interface AnimConfig {
  duration: string;
  delay: string;
  ease: string;
  offset: string;
  trigger: string;
  stagger: string;
  repeat: string;
  direction: string;
  /** Which optional attributes are enabled */
  enabled: Record<ConfigField, boolean>;
}

interface ConfiguratorProps {
  config: AnimConfig;
  onChange: (config: AnimConfig) => void;
}

// ─── Options ────────────────────────────────────────────

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
  { value: "back.out(1.7)", label: "Back Out (GSAP)" },
];

const TRIGGER_OPTIONS = [
  { value: "viewport", label: "Viewport (scroll)" },
  { value: "hover", label: "Hover" },
  { value: "click", label: "Click" },
];

const DIRECTION_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "reverse", label: "Reverse" },
  { value: "alternate", label: "Alternate" },
];

// ─── Helpers ────────────────────────────────────────────

/** All toggles disabled */
const ALL_DISABLED: Record<ConfigField, boolean> = {
  duration: false,
  delay: false,
  ease: false,
  offset: false,
  trigger: false,
  stagger: false,
  repeat: false,
  direction: false,
};

/** Toggle a field on/off */
function toggleField(
  config: AnimConfig,
  field: ConfigField,
  checked: boolean,
): AnimConfig {
  return {
    ...config,
    enabled: { ...config.enabled, [field]: checked },
  };
}

// ─── Attribute Row ──────────────────────────────────────

function AttrRow({
  label,
  description,
  enabled,
  onToggle,
  children,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border overflow-hidden transition-colors duration-200 ${
        enabled
          ? "border-primary/25 bg-card shadow-sm"
          : "border-border/60 bg-card/30"
      }`}>
      {/* Header: label + switch */}
      <button
        type="button"
        onClick={() => onToggle(!enabled)}
        className={`flex w-full items-center justify-between gap-3 px-3 py-2 transition-colors cursor-pointer ${
          enabled ? "hover:bg-muted/40" : "hover:bg-muted/30"
        }`}>
        <div className="flex flex-col items-start gap-0">
          <span
            className={`text-xs font-medium transition-colors duration-200 ${
              enabled ? "text-foreground" : "text-muted-foreground"
            }`}>
            {label}
          </span>
          {description && (
            <span
              className={`text-[10px] font-mono transition-colors duration-200 ${
                enabled ? "text-muted-foreground" : "text-muted-foreground/50"
              }`}>
              {description}
            </span>
          )}
        </div>
        <Switch
          size="sm"
          checked={enabled}
          onCheckedChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Enable ${label}`}
        />
      </button>

      {/* Animated expand/collapse using grid trick */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: enabled ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="px-3 pb-2.5 pt-1 border-t border-border/30">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────

export function Configurator({ config, onChange }: ConfiguratorProps) {
  const update = (key: keyof AnimConfig, value: string) => {
    onChange({ ...config, [key]: value });
  };

  const toggle = (field: ConfigField, checked: boolean) => {
    onChange(toggleField(config, field, checked));
  };

  const isGsapEase = /^(power|bounce|elastic|back|expo|circ|sine)\d?\./i.test(
    config.ease,
  );

  const hasAnyEnabled = Object.values(config.enabled).some(Boolean);

  return (
    <div className="space-y-2">
      {/* Reset button — only visible when at least one toggle is on */}
      {hasAnyEnabled && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onChange({ ...config, enabled: ALL_DISABLED })}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1 rounded-md border border-border hover:bg-muted/50">
            Reset all
          </button>
        </div>
      )}

      {/* ── Duration ── */}
      <AttrRow
        label="Duration"
        description="data-flowg-duration"
        enabled={config.enabled.duration}
        onToggle={(v) => toggle("duration", v)}>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="duration"
              className="text-[10px] text-muted-foreground">
              Seconds
            </Label>
            <span className="text-[10px] text-muted-foreground tabular-nums font-mono">
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
      </AttrRow>

      {/* ── Delay ── */}
      <AttrRow
        label="Delay"
        description="data-flowg-delay"
        enabled={config.enabled.delay}
        onToggle={(v) => toggle("delay", v)}>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="delay"
              className="text-[10px] text-muted-foreground">
              Seconds
            </Label>
            <span className="text-[10px] text-muted-foreground tabular-nums font-mono">
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
      </AttrRow>

      {/* ── Easing ── */}
      <AttrRow
        label="Easing"
        description="data-flowg-ease"
        enabled={config.enabled.ease}
        onToggle={(v) => toggle("ease", v)}>
        <div className="space-y-1.5">
          <Select value={config.ease} onValueChange={(v) => update("ease", v)}>
            <SelectTrigger className="text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EASING_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isGsapEase && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400">
              ⚠ GSAP easings are handled natively by the GSAP engine. Preview
              uses a CSS approximation.
            </p>
          )}
        </div>
      </AttrRow>

      {/* ── Trigger ── */}
      <AttrRow
        label="Trigger"
        description="data-flowg-trigger"
        enabled={config.enabled.trigger}
        onToggle={(v) => toggle("trigger", v)}>
        <Select
          value={config.trigger}
          onValueChange={(v) => update("trigger", v)}>
          <SelectTrigger className="text-xs h-8">
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
      </AttrRow>

      {/* ── Offset ── */}
      <AttrRow
        label="Viewport Offset"
        description="data-flowg-offset"
        enabled={config.enabled.offset}
        onToggle={(v) => toggle("offset", v)}>
        <Input
          id="offset"
          value={config.offset}
          onChange={(e) => update("offset", e.target.value)}
          placeholder="e.g. 20%"
          className="text-xs h-8"
        />
      </AttrRow>

      {/* ── Stagger ── */}
      <AttrRow
        label="Stagger"
        description="data-flowg-stagger"
        enabled={config.enabled.stagger}
        onToggle={(v) => toggle("stagger", v)}>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="stagger"
              className="text-[10px] text-muted-foreground">
              Delay between children
            </Label>
            <span className="text-[10px] text-muted-foreground tabular-nums font-mono">
              {config.stagger}s
            </span>
          </div>
          <Slider
            id="stagger"
            min={0}
            max={0.5}
            step={0.02}
            value={[parseFloat(config.stagger)]}
            onValueChange={([v]) => update("stagger", v!.toFixed(2))}
          />
        </div>
      </AttrRow>

      {/* ── Repeat ── */}
      <AttrRow
        label="Repeat"
        description="data-flowg-repeat"
        enabled={config.enabled.repeat}
        onToggle={(v) => toggle("repeat", v)}>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="repeat"
              className="text-[10px] text-muted-foreground">
              Count
            </Label>
            <span className="text-[10px] text-muted-foreground tabular-nums font-mono">
              {config.repeat === "-1" ? "∞ infinite" : `${config.repeat}×`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Slider
              id="repeat"
              min={0}
              max={10}
              step={1}
              className="flex-1"
              value={[config.repeat === "-1" ? 0 : parseInt(config.repeat)]}
              onValueChange={([v]) => update("repeat", v!.toString())}
            />
            <button
              type="button"
              onClick={() =>
                update("repeat", config.repeat === "-1" ? "0" : "-1")
              }
              className={`shrink-0 text-[10px] font-mono px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                config.repeat === "-1"
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
              }`}>
              ∞
            </button>
          </div>
        </div>
      </AttrRow>

      {/* ── Direction ── */}
      <AttrRow
        label="Direction"
        description="data-flowg-direction"
        enabled={config.enabled.direction}
        onToggle={(v) => toggle("direction", v)}>
        <Select
          value={config.direction}
          onValueChange={(v) => update("direction", v)}>
          <SelectTrigger className="text-xs h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIRECTION_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AttrRow>
    </div>
  );
}

// ==========================================================
// FlowG — Lazy GSAP Plugin Loader
// Dynamically imports GSAP core and plugins on demand.
// Only the plugins required by detected animations are loaded.
//
// This ensures users who only use CSS animations pay zero
// GSAP cost, and users of e.g. scroll-scrub load ScrollTrigger
// without also loading SplitText, Flip, DrawSVG, etc.
// ==========================================================

import type { GsapPlugin } from "./registry.js";

/** Cached gsap core module */
let _gsapCore: typeof import("gsap") | null = null;

/** Track which plugins have already been registered */
const _loadedPlugins = new Set<GsapPlugin>();

/**
 * Lazily load the GSAP core module.
 * Returns the default `gsap` export.
 * Subsequent calls return the cached module instantly.
 */
export async function loadGsapCore(): Promise<typeof import("gsap").default> {
  if (!_gsapCore) {
    _gsapCore = await import("gsap");
  }
  return _gsapCore.default;
}

/**
 * Lazily load and register specific GSAP plugins.
 * Each plugin is loaded via dynamic import() so tree-shaking / code-splitting
 * keeps the initial bundle small. Only called plugins ship to the browser.
 *
 * @param plugins - Array of plugin names to load
 * @returns The gsap core instance (with plugins registered)
 */
export async function loadGsapPlugins(
  plugins: GsapPlugin[],
): Promise<typeof import("gsap").default> {
  const gsap = await loadGsapCore();

  const toLoad = plugins.filter((p) => !_loadedPlugins.has(p));
  if (toLoad.length === 0) return gsap;

  const pluginModules = await Promise.all(
    toLoad.map(async (pluginName) => {
      switch (pluginName) {
        case "ScrollTrigger": {
          const mod = await import("gsap/ScrollTrigger");
          return { name: pluginName, plugin: mod.ScrollTrigger ?? mod.default };
        }
        // Future plugins can be added here:
        // case "SplitText": {
        //   const mod = await import("gsap/SplitText");
        //   return { name: pluginName, plugin: mod.SplitText ?? mod.default };
        // }
        default:
          return null;
      }
    }),
  );

  // Register all loaded plugins with gsap
  const validPlugins = pluginModules.filter(Boolean) as {
    name: GsapPlugin;
    plugin: object;
  }[];

  if (validPlugins.length > 0) {
    gsap.registerPlugin(...validPlugins.map((p) => p.plugin));
    validPlugins.forEach((p) => _loadedPlugins.add(p.name));
  }

  return gsap;
}

/**
 * Check if GSAP core has already been loaded.
 */
export function isGsapLoaded(): boolean {
  return _gsapCore !== null;
}

/**
 * Check if a specific plugin has been loaded and registered.
 */
export function isPluginLoaded(plugin: GsapPlugin): boolean {
  return _loadedPlugins.has(plugin);
}

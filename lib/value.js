'use strict';

function resolveValue(value, rng, options) {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) {
    if (value.length === 2 && value.every((item) => typeof item === 'number')) {
      const precision = options && options.integer ? undefined : options && options.precision;
      const number = options && options.integer
        ? rng.integer(value[0], value[1])
        : rng.number(value[0], value[1], precision);
      return number;
    }
    return rng.pick(value);
  }
  return value;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function hsl(h, s, l) {
  return `hsl(${wrapHue(h)}, ${clamp(Math.round(s), 0, 100)}%, ${clamp(Math.round(l), 0, 100)}%)`;
}

function oklch(l, c, h) {
  return `oklch(${formatNumber(clamp(l, 0, 1), 3)} ${formatNumber(Math.max(0, c), 3)} ${wrapHue(h)})`;
}

function colorFromRng(rng, saturationRange, lightnessRange) {
  return hsl(
    rng.integer(0, 359),
    rng.integer(saturationRange[0], saturationRange[1]),
    rng.integer(lightnessRange[0], lightnessRange[1])
  );
}

function deriveHsl(base, lightnessDelta) {
  const match = String(base).match(/hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/i);
  if (!match) return base;
  const lightness = Math.max(0, Math.min(100, Number(match[3]) + lightnessDelta));
  return hsl(Number(match[1]), Number(match[2]), lightness);
}

function deriveColor(base, lightnessDelta) {
  if (String(base).startsWith('oklch(')) return deriveOklch(base, lightnessDelta / 100);
  return deriveHsl(base, lightnessDelta);
}

function deriveOklch(base, lightnessDelta) {
  const parsed = parseOklch(base);
  if (!parsed) return base;
  return oklch(parsed.lightness + lightnessDelta, parsed.chroma, parsed.hue);
}

function parseOklch(value) {
  const match = String(value).match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+(-?[\d.]+)\s*\)/i);
  if (!match) return null;
  return {
    lightness: Number(match[1]),
    chroma: Number(match[2]),
    hue: Number(match[3])
  };
}

function buildPalette(config, rng) {
  const opts = config.palette || {};
  const space = withFallback(resolveValue(opts.space, rng), () => 'oklch');
  const hue = withFallback(resolveValue(opts.hue, rng, { integer: true }), () => rng.integer(0, 359));
  const chroma = withFallback(resolveValue(opts.chroma, rng, { precision: 3 }), () => rng.number(0.11, 0.2, 3));
  const lightness = withFallback(resolveValue(opts.lightness, rng, { precision: 3 }), () => rng.number(0.48, 0.68, 3));
  const harmony = withFallback(resolveValue(opts.harmony, rng), () => 'analogous');
  const contrast = withFallback(resolveValue(opts.contrast, rng, { precision: 3 }), () => rng.number(0.1, 0.18, 3));
  const offsets = getHarmonyOffsets(harmony);
  const saturation = oklchChromaToHslSaturation(chroma);
  const hslLightness = Math.round(lightness * 100);

  if (space === 'hsl') {
    return buildHslPalette({ hue, saturation, lightness: hslLightness, harmony, contrast: Math.round(contrast * 100), offsets });
  }

  return {
    base: oklch(lightness, chroma, hue),
    baseSoft: oklch(lightness + contrast * 0.45, chroma * 0.72, hue),
    accent: oklch(lightness + contrast, chroma * 1.08, hue + offsets[0]),
    accentAlt: oklch(lightness + contrast * 0.35, chroma * 0.88, hue + offsets[1]),
    shade: oklch(lightness - contrast, chroma * 0.82, hue),
    dark: oklch(lightness - contrast - 0.07, chroma * 0.62, hue + offsets[2]),
    hue,
    chroma,
    lightness,
    harmony,
    space
  };
}

function buildHslPalette({ hue, saturation, lightness, harmony, contrast, offsets }) {
  const accentLightness = clamp(lightness + contrast, 35, 78);
  const shadeLightness = clamp(lightness - contrast, 18, 48);

  return {
    base: hsl(hue, saturation, lightness),
    baseSoft: hsl(hue, Math.max(35, saturation - 18), clamp(lightness + 8, 35, 72)),
    accent: hsl(hue + offsets[0], clamp(saturation + 4, 40, 96), accentLightness),
    accentAlt: hsl(hue + offsets[1], clamp(saturation - 6, 38, 92), clamp(lightness + 3, 30, 68)),
    shade: hsl(hue, clamp(saturation - 12, 30, 90), shadeLightness),
    dark: hsl(hue + offsets[2], clamp(saturation - 20, 28, 86), clamp(lightness - contrast - 8, 12, 38)),
    hue,
    saturation,
    lightness,
    harmony,
    space: 'hsl'
  };
}

function withFallback(value, fallback) {
  return value === undefined || value === null ? fallback() : value;
}

function getHarmonyOffsets(harmony) {
  if (harmony === 'monochrome') return [0, 0, 0];
  if (harmony === 'complementary') return [180, 150, 210];
  if (harmony === 'triad') return [120, 240, 180];
  if (harmony === 'tetradic') return [90, 180, 270];
  if (harmony === 'compound') return [30, 180, 210];
  if (harmony === 'split') return [150, 210, 180];
  return [-24, 28, 12];
}

function oklchChromaToHslSaturation(chroma) {
  return clamp(Math.round(45 + chroma * 260), 50, 92);
}

function formatNumber(value, precision) {
  return Number(value.toFixed(precision)).toString();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrapHue(value) {
  const hue = Math.round(value) % 360;
  return hue < 0 ? hue + 360 : hue;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

module.exports = {
  colorFromRng,
  buildPalette,
  clamp,
  deriveColor,
  deriveHsl,
  escapeAttr,
  hsl,
  oklch,
  mapRange,
  resolveValue
};

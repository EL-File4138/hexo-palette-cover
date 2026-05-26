'use strict';

const { escapeAttr, resolveValue, oklch, hsl, clamp } = require('../value');

function svgOpen(width, height, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeAttr(label)}">`;
}

function background(color) {
  return `<rect width="100%" height="100%" fill="${escapeAttr(color)}"/>`;
}

function pickColor(value, rng, fallback) {
  return resolveValue(value, rng) || fallback;
}

function gradientDef(id, color1, color2, angle) {
  return `<linearGradient id="${id}" gradientTransform="rotate(${angle}, 0.5, 0.5)" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stop-color="${escapeAttr(color1)}"/><stop offset="100%" stop-color="${escapeAttr(color2)}"/></linearGradient>`;
}

function strokePaint(opts) {
  return opts.mode === 'gradient' ? `url(#${opts.gradientId})` : escapeAttr(opts.color);
}

function opacityByMode(mode, index, total, baseOpacity, rng) {
  if (mode === 'fade-in') return format(baseOpacity * ((index + 1) / total), 3);
  if (mode === 'fade-out') return format(baseOpacity * (1 - index / total), 3);
  if (mode === 'random') return format(baseOpacity * rng.number(0.45, 1, 3), 3);
  return format(baseOpacity, 3);
}

function wavePath(width, y, amplitude, undulations, phase, points) {
  const step = width / points;
  let d = `M 0 ${format(y, 2)}`;
  for (let i = 1; i <= points; i += 1) {
    const x = i * step;
    const value = y + Math.sin((i / points) * Math.PI * 2 * undulations + phase) * amplitude;
    d += ` L ${format(x, 2)} ${format(value, 2)}`;
  }
  return d;
}

function regularPolygonPath(cx, cy, radius, sides, rotate) {
  const points = [];
  for (let i = 0; i < sides; i += 1) {
    const angle = rotate + (Math.PI * 2 * i) / sides;
    points.push(`${format(cx + Math.cos(angle) * radius, 2)},${format(cy + Math.sin(angle) * radius, 2)}`);
  }
  return points.join(' ');
}

function paletteColor(palette, hueOffset, lightnessOffset, chromaScale) {
  if (palette.space === 'hsl') {
    return hsl(
      palette.hue + hueOffset,
      clamp(palette.saturation * chromaScale, 30, 96),
      clamp(palette.lightness + lightnessOffset * 100, 18, 82)
    );
  }
  return oklch(
    palette.lightness + lightnessOffset,
    palette.chroma * chromaScale,
    palette.hue + hueOffset
  );
}

function format(value, precision) {
  return Number(Number(value).toFixed(precision)).toString();
}

module.exports = {
  background,
  escapeAttr,
  format,
  gradientDef,
  opacityByMode,
  paletteColor,
  pickColor,
  regularPolygonPath,
  resolveValue,
  strokePaint,
  svgOpen,
  wavePath
};

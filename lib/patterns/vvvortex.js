'use strict';

const { background, format, gradientDef, opacityByMode, pickColor, resolveValue, strokePaint, svgOpen } = require('./common');

function renderVvvortex(context) {
  const { config, rng, width, height, id, palette } = context;
  const opts = config.patterns.vvvortex;
  const mode = resolveValue(opts.fill_mode, rng) || 'gradient';
  const color = pickColor(opts.color, rng, palette.accent);
  const fill1 = pickColor(opts.fill1, rng, palette.accent);
  const fill2 = pickColor(opts.fill2, rng, palette.accentAlt);
  const opacityMode = resolveValue(opts.opacity_mode, rng) || 'fade-out';
  const linecap = resolveValue(opts.linecap, rng) || 'round';
  const frequency = resolveValue(opts.frequency, rng, { integer: true });
  const spacing = resolveValue(opts.spacing, rng, { precision: 1 });
  const strokeWidth = resolveValue(opts.stroke_width, rng, { precision: 1 });
  const opacity = resolveValue(opts.opacity, rng, { precision: 3 });
  const gradientId = `${id}-gradient`;
  const paint = strokePaint({ mode, gradientId, color });
  const cx = width / 2;
  const cy = height / 2;
  let circles = '';
  for (let i = 0; i < frequency; i += 1) {
    const radius = spacing * (i + 1);
    const dash = `${format(radius * 0.55, 1)} ${format(radius * 0.22 + 8, 1)}`;
    circles += `<circle cx="${cx}" cy="${cy}" r="${format(radius, 2)}" fill="none" stroke="${paint}" stroke-width="${strokeWidth}" stroke-linecap="${linecap}" stroke-dasharray="${dash}" transform="rotate(${format(i * 17 + rng.integer(-8, 8), 1)} ${cx} ${cy})" opacity="${opacityByMode(opacityMode, i, frequency, opacity, rng)}"/>`;
  }
  return `${svgOpen(width, height, 'Generated vortex cover')}<defs>${gradientDef(gradientId, fill1, fill2, rng.integer(0, 360))}</defs>${background(palette.dark)}${circles}</svg>`;
}

module.exports = renderVvvortex;

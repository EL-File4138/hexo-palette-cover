'use strict';

const { background, format, gradientDef, pickColor, resolveValue, strokePaint, svgOpen, wavePath } = require('./common');

function renderSssquiggly(context) {
  const { config, rng, width, height, id, palette } = context;
  const opts = config.patterns.sssquiggly;
  const mode = resolveValue(opts.stroke_mode, rng) || 'gradient';
  const color = pickColor(opts.color, rng, palette.accent);
  const fill1 = pickColor(opts.fill1, rng, palette.accent);
  const fill2 = pickColor(opts.fill2, rng, palette.accentAlt);
  const spacing = resolveValue(opts.spacing, rng, { precision: 1 });
  const frequency = resolveValue(opts.frequency, rng, { integer: true });
  const strokeWidth = resolveValue(opts.stroke_width, rng, { precision: 1 });
  const points = resolveValue(opts.points, rng, { integer: true });
  const amplitude = resolveValue(opts.amplitude, rng, { precision: 1 });
  const opacity = resolveValue(opts.opacity, rng, { precision: 3 });
  const gradientId = `${id}-gradient`;
  const paint = strokePaint({ mode, gradientId, color });
  let paths = '';
  for (let i = 0; i < frequency; i += 1) {
    const y = -spacing + i * spacing;
    paths += `<path d="${wavePath(width, y, amplitude * rng.number(0.75, 1.2, 2), rng.integer(2, 5), rng.float() * Math.PI * 2, points)}" fill="none" stroke="${paint}" stroke-width="${strokeWidth}" stroke-linecap="round" opacity="${format(opacity, 3)}"/>`;
  }
  return `${svgOpen(width, height, 'Generated squiggly line cover')}<defs>${gradientDef(gradientId, fill1, fill2, rng.integer(0, 360))}</defs>${background(palette.dark)}${paths}</svg>`;
}

module.exports = renderSssquiggly;

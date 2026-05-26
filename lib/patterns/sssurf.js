'use strict';

const { background, format, gradientDef, pickColor, resolveValue, strokePaint, svgOpen, wavePath } = require('./common');

function renderSssurf(context) {
  const { config, rng, width, height, id, palette } = context;
  const opts = config.patterns.sssurf;
  const style = resolveValue(opts.style, rng, { integer: true });
  const mode = resolveValue(opts.fill_mode, rng) || 'gradient';
  const fill1 = pickColor(opts.fill1, rng, palette.accent);
  const fill2 = pickColor(opts.fill2, rng, palette.accentAlt);
  const color = pickColor(opts.color, rng, palette.accent);
  const waves = resolveValue(opts.waves, rng, { integer: true });
  const spacing = resolveValue(opts.spacing, rng, { precision: 1 });
  const undulations = resolveValue(opts.undulations, rng, { integer: true });
  const amplitude = resolveValue(opts.amplitude, rng, { precision: 1 });
  const opacity = resolveValue(opts.opacity, rng, { precision: 3 });
  const gradientId = `${id}-gradient`;
  const paint = strokePaint({ mode, gradientId, color });
  let paths = '';
  for (let i = 0; i < waves; i += 1) {
    const y = height * 0.18 + i * spacing;
    const amp = amplitude * (style % 2 === 0 ? 1 + i * 0.04 : 1 - i * 0.025);
    paths += `<path d="${wavePath(width, y, amp, undulations + (style > 2 ? 1 : 0), rng.float() * Math.PI * 2, 36)}" fill="none" stroke="${paint}" stroke-width="${format(Math.max(2, spacing * 0.18), 2)}" stroke-linecap="round" opacity="${format(opacity * (1 - i / (waves * 1.45)), 3)}"/>`;
  }

  return `${svgOpen(width, height, 'Generated wave cover')}<defs>${gradientDef(gradientId, fill1, fill2, resolveValue(opts.angle, rng, { integer: true }) || 90)}</defs>${background(palette.dark)}${paths}</svg>`;
}

module.exports = renderSssurf;

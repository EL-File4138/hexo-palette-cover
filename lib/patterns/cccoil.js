'use strict';

const { background, format, gradientDef, opacityByMode, pickColor, resolveValue, strokePaint, svgOpen } = require('./common');

function renderCccoil(context) {
  const { config, rng, width, height, id, palette } = context;
  const opts = config.patterns.cccoil;
  const mode = resolveValue(opts.fill_mode, rng) || 'gradient';
  const color = pickColor(opts.color, rng, palette.accent);
  const fill1 = pickColor(opts.fill1, rng, palette.accent);
  const fill2 = pickColor(opts.fill2, rng, palette.accentAlt);
  const linecap = resolveValue(opts.linecap, rng) || 'round';
  const opacityMode = resolveValue(opts.opacity_mode, rng) || 'fade-out';
  const rotation = resolveValue(opts.rotation, rng, { precision: 1 });
  const direction = resolveValue(opts.direction, rng, { integer: true });
  const maxLength = resolveValue(opts.max_length, rng, { precision: 1 });
  const frequency = resolveValue(opts.frequency, rng, { integer: true });
  const spacing = resolveValue(opts.spacing, rng, { precision: 1 });
  const strokeWidth = resolveValue(opts.stroke_width, rng, { precision: 1 });
  const offset = resolveValue(opts.offset, rng, { precision: 1 });
  const opacity = resolveValue(opts.opacity, rng, { precision: 3 });
  const gradientId = `${id}-gradient`;
  const paint = strokePaint({ mode, gradientId, color });
  const cx = width / 2;
  const cy = height / 2;
  let paths = '';
  for (let i = 0; i < frequency; i += 1) {
    const radius = offset + i * spacing;
    const dash = `${format(maxLength * (1 - i / (frequency * 1.4)), 1)} ${format(spacing * 2.2, 1)}`;
    paths += `<circle cx="${cx}" cy="${cy}" r="${format(radius, 2)}" fill="none" stroke="${paint}" stroke-width="${strokeWidth}" stroke-linecap="${linecap}" stroke-dasharray="${dash}" transform="rotate(${format(rotation + direction * i * 12, 1)} ${cx} ${cy})" opacity="${opacityByMode(opacityMode, i, frequency, opacity, rng)}"/>`;
  }
  return `${svgOpen(width, height, 'Generated spiral coil cover')}<defs>${gradientDef(gradientId, fill1, fill2, rng.integer(0, 360))}</defs>${background(palette.dark)}${paths}</svg>`;
}

module.exports = renderCccoil;

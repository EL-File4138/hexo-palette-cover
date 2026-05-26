'use strict';

const { background, escapeAttr, format, gradientDef, pickColor, resolveValue, svgOpen } = require('./common');

function renderGgglitch(context) {
  const { config, rng, width, height, id, palette } = context;
  const opts = config.patterns.ggglitch;
  const mode = resolveValue(opts.fill_mode, rng) || 'gradient';
  const color = pickColor(opts.color, rng, palette.accent);
  const fill1 = pickColor(opts.fill1, rng, palette.accent);
  const fill2 = pickColor(opts.fill2, rng, palette.accentAlt);
  const style = resolveValue(opts.style, rng, { integer: true });
  const glitchOffset = resolveValue(opts.glitch_offset, rng, { precision: 1 });
  const glitchOpacity = resolveValue(opts.glitch_opacity, rng, { precision: 3 });
  const divisions = resolveValue(opts.divisions, rng, { integer: true });
  const frequency = resolveValue(opts.frequency, rng, { integer: true });
  const strokeWidth = resolveValue(opts.stroke_width, rng, { precision: 1 });
  const opacity = resolveValue(opts.opacity, rng, { precision: 3 });
  const gradientId = `${id}-gradient`;
  const fill = mode === 'gradient' ? `url(#${gradientId})` : escapeAttr(color);
  const stripeHeight = height / divisions;
  let shapes = '';
  for (let i = 0; i < divisions; i += 1) {
    if (i % Math.max(1, Math.floor(divisions / frequency)) !== 0 && rng.float() > 0.35) continue;
    const y = i * stripeHeight;
    const x = rng.number(-glitchOffset, glitchOffset, 1);
    const w = width * rng.number(0.25, 1.05, 2);
    const h = stripeHeight * rng.number(0.55, 1.8, 2);
    const transform = style === 3 ? ` transform="skewX(${rng.integer(-10, 10)})"` : '';
    shapes += `<rect x="${format(x, 1)}" y="${format(y, 1)}" width="${format(w, 1)}" height="${format(h, 1)}" fill="${fill}" opacity="${format(opacity * rng.number(0.35, 1, 2), 3)}"${transform}/><rect x="${format(x + glitchOffset, 1)}" y="${format(y + strokeWidth, 1)}" width="${format(w * 0.75, 1)}" height="${format(Math.max(1, h * 0.2), 1)}" fill="${escapeAttr(palette.accentAlt)}" opacity="${glitchOpacity}"/>`;
  }
  return `${svgOpen(width, height, 'Generated glitch cover')}<defs>${gradientDef(gradientId, fill1, fill2, rng.integer(0, 360))}</defs>${background(palette.dark)}${shapes}</svg>`;
}

module.exports = renderGgglitch;

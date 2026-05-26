'use strict';

const { background, escapeAttr, format, paletteColor, resolveValue, svgOpen } = require('./common');

function renderRrreplicate(context) {
  const { config, rng, width, height, id, palette } = context;
  const opts = config.patterns.rrreplicate;
  const active = resolveValue(opts.active_patterns, rng, { integer: true });
  const patternSize = resolveValue(opts.pattern_size, rng, { precision: 1 });
  const angle = resolveValue(opts.angle, rng, { precision: 1 });
  const scale = resolveValue(opts.scale, rng, { precision: 2 });
  const translateX = resolveValue(opts.translate_x, rng, { precision: 1 });
  const translateY = resolveValue(opts.translate_y, rng, { precision: 1 });
  const skewX = resolveValue(opts.skew_x, rng, { precision: 1 });
  const skewY = resolveValue(opts.skew_y, rng, { precision: 1 });
  const opacity = resolveValue(opts.opacity, rng, { precision: 3 });
  const patternId = `${id}-pattern`;
  let lines = '';
  for (let i = 0; i < active; i += 1) {
    const y = (patternSize / (active + 1)) * (i + 1);
    const color = paletteColor(palette, i * 42, i % 2 === 0 ? 0.08 : -0.03, 0.8 + i * 0.08);
    lines += `<line x1="0" y1="${format(y, 2)}" x2="${patternSize}" y2="${format(y, 2)}" stroke="${escapeAttr(color)}" stroke-width="${format(1.5 + i, 1)}" opacity="${opacity}" transform="rotate(${format((i * 45) % 180, 1)} ${patternSize / 2} ${patternSize / 2})"/>`;
  }
  return `${svgOpen(width, height, 'Generated repeated line cover')}<defs><pattern id="${patternId}" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse" patternTransform="translate(${translateX} ${translateY}) scale(${scale}) rotate(${angle}) skewX(${skewX}) skewY(${skewY})">${lines}</pattern></defs>${background(palette.dark)}<rect width="100%" height="100%" fill="url(#${patternId})"/></svg>`;
}

module.exports = renderRrreplicate;

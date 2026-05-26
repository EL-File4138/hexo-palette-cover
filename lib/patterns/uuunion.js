'use strict';

const { background, escapeAttr, format, gradientDef, pickColor, resolveValue, svgOpen, wavePath } = require('./common');

function renderUuunion(context) {
  const { config, rng, width, height, id, palette } = context;
  const opts = config.patterns.uuunion;
  const fill1 = pickColor(opts.fill1, rng, palette.baseSoft);
  const fill2 = pickColor(opts.fill2, rng, palette.accent);
  const fill3 = pickColor(opts.fill3, rng, palette.accentAlt);
  const blurX = resolveValue(opts.blur_x, rng, { precision: 1 });
  const blurY = resolveValue(opts.blur_y, rng, { precision: 1 });
  const angle1 = resolveValue(opts.gradient_angle_1, rng, { integer: true });
  const angle2 = resolveValue(opts.gradient_angle_2, rng, { integer: true });
  const angle3 = resolveValue(opts.gradient_angle_3, rng, { integer: true });
  const waviness = resolveValue(opts.waviness, rng, { precision: 1 });
  const shadowOpacity = resolveValue(opts.shadow_opacity, rng, { precision: 3 });
  const shadowDistance = resolveValue(opts.shadow_distance, rng, { precision: 1 });
  const g1 = `${id}-g1`;
  const g2 = `${id}-g2`;
  const g3 = `${id}-g3`;
  const filterId = `${id}-blur`;
  const top = wavePath(width, height * 0.3, waviness, 2, rng.float() * Math.PI, 18);
  const mid = wavePath(width, height * 0.58, waviness * 1.2, 3, rng.float() * Math.PI, 20);

  return `${svgOpen(width, height, 'Generated mesh gradient cover')}<defs>${gradientDef(g1, fill1, fill2, angle1)}${gradientDef(g2, fill2, fill3, angle2)}${gradientDef(g3, fill3, fill1, angle3)}<filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${blurX} ${blurY}"/></filter></defs>${background(fill1)}<path d="${top} L ${width} 0 L 0 0 Z" fill="url(#${g2})" filter="url(#${filterId})"/><path d="${mid} L ${width} ${height} L 0 ${height} Z" fill="url(#${g3})" filter="url(#${filterId})"/><ellipse cx="${format(width * 0.72, 2)}" cy="${format(height * 0.42, 2)}" rx="${format(width * 0.28, 2)}" ry="${format(height * 0.26, 2)}" fill="url(#${g1})" filter="url(#${filterId})" opacity="0.75"/><path d="${mid}" fill="none" stroke="${escapeAttr(palette.dark)}" stroke-width="${shadowDistance}" stroke-opacity="${shadowOpacity}" filter="url(#${filterId})"/></svg>`;
}

module.exports = renderUuunion;

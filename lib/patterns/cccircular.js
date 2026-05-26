'use strict';

const { background, escapeAttr, format, opacityByMode, pickColor, resolveValue, svgOpen } = require('./common');

function renderCccircular(context) {
  const { config, rng, width, height, id, palette } = context;
  const opts = config.patterns.cccircular;
  const color = pickColor(opts.color, rng, palette.accent);
  const style = resolveValue(opts.style, rng, { integer: true });
  const position = resolveValue(opts.position, rng);
  const opacityMode = resolveValue(opts.opacity_mode, rng);
  const frequency = resolveValue(opts.frequency, rng, { integer: true });
  const scale = resolveValue(opts.scale, rng, { precision: 2 });
  const center = getCenter(position, width, height);
  const maxRadius = Math.hypot(width, height) * 0.55 * scale;
  let circles = '';
  for (let i = 0; i < frequency; i += 1) {
    const radius = (maxRadius / frequency) * (i + 1);
    const dash = style % 2 === 0 ? ` stroke-dasharray="${format(radius * 0.12, 1)} ${format(radius * 0.08 + 8, 1)}"` : '';
    circles += `<circle cx="${center.x}" cy="${center.y}" r="${format(radius, 2)}" fill="none" stroke="${escapeAttr(color)}" stroke-width="${format(2 + (style % 4), 1)}"${dash} opacity="${opacityByMode(opacityMode, i, frequency, 0.75, rng)}"/>`;
  }
  return `${svgOpen(width, height, 'Generated circular pattern cover')}${background(palette.dark)}<g>${circles}</g></svg>`;
}

function getCenter(position, width, height) {
  if (position === 'top') return { x: width / 2, y: 0 };
  if (position === 'bottom') return { x: width / 2, y: height };
  if (position === 'left') return { x: 0, y: height / 2 };
  if (position === 'right') return { x: width, y: height / 2 };
  return { x: width / 2, y: height / 2 };
}

module.exports = renderCccircular;

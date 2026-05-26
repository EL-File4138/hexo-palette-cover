'use strict';

const { background, format, paletteColor, resolveValue, svgOpen } = require('./common');

function renderSsscales(context) {
  const { config, rng, width, height, palette } = context;
  const opts = config.patterns.ssscales;
  const circleSize = resolveValue(opts.circle_size, rng, { precision: 1 });
  const resolution = resolveValue(opts.resolution, rng, { integer: true });
  const increment = resolveValue(opts.noise_increment, rng, { precision: 3 });
  const hueStart = resolveValue(opts.hue_start, rng, { integer: true });
  const hueEnd = resolveValue(opts.hue_end, rng, { integer: true });
  const start = hueStart === undefined ? palette.hue - 35 : hueStart;
  const end = hueEnd === undefined ? palette.hue + 45 : hueEnd;
  const cols = Math.ceil(width / resolution);
  const rows = Math.ceil(height / resolution);
  let circles = '';
  for (let y = 0; y <= rows; y += 1) {
    for (let x = 0; x <= cols; x += 1) {
      const wave = (Math.sin(x * increment + y * increment * 1.7) + 1) / 2;
      const hue = start + (end - start) * wave;
      const color = paletteColor(palette, hue - palette.hue, wave * 0.08 - 0.04, 0.85 + wave * 0.3);
      circles += `<circle cx="${x * resolution}" cy="${y * resolution}" r="${format(circleSize * (0.35 + wave * 0.5), 2)}" fill="${color}"/>`;
    }
  }
  return `${svgOpen(width, height, 'Generated scale pattern cover')}${background(palette.dark)}${circles}</svg>`;
}

module.exports = renderSsscales;

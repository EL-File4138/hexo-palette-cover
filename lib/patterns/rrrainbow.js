'use strict';

const { background, format, paletteColor, resolveValue, svgOpen } = require('./common');

function renderRrrainbow(context) {
  const { config, rng, width, height, palette } = context;
  const opts = config.patterns.rrrainbow;
  const hueStart = resolveValue(opts.hue_start, rng, { integer: true });
  const hueEnd = resolveValue(opts.hue_end, rng, { integer: true });
  const start = hueStart === undefined ? palette.hue - 80 : hueStart;
  const end = hueEnd === undefined ? palette.hue + 100 : hueEnd;
  const opacityVariation = resolveValue(opts.opacity_variation, rng, { precision: 3 });
  const fillType = resolveValue(opts.fill_type, rng) || 'solid';
  const probability = resolveValue(opts.probability, rng, { precision: 3 });
  const evenness = resolveValue(opts.evenness, rng, { precision: 3 });
  const density = resolveValue(opts.density, rng, { integer: true });
  const cell = Math.max(width, height) / density;
  let circles = '';
  for (let y = -cell; y < height + cell; y += cell * evenness) {
    for (let x = -cell; x < width + cell; x += cell * evenness) {
      if (rng.float() > probability) continue;
      const jitterX = rng.number(-cell * 0.22, cell * 0.22, 1);
      const jitterY = rng.number(-cell * 0.22, cell * 0.22, 1);
      const t = (x + y + width + height) / (width + height + width + height);
      const hue = start + (end - start) * t;
      const radius = cell * rng.number(0.22, 0.48, 2);
      const color = paletteColor(palette, hue - palette.hue, rng.number(-0.05, 0.08, 3), rng.number(0.75, 1.25, 2));
      const opacity = format(1 - rng.number(0, opacityVariation, 3), 3);
      if (fillType === 'stroke' || (fillType === 'mixture' && rng.float() > 0.55)) {
        circles += `<circle cx="${format(x + jitterX, 1)}" cy="${format(y + jitterY, 1)}" r="${format(radius, 1)}" fill="none" stroke="${color}" stroke-width="${format(Math.max(2, radius * 0.16), 1)}" opacity="${opacity}"/>`;
      } else {
        circles += `<circle cx="${format(x + jitterX, 1)}" cy="${format(y + jitterY, 1)}" r="${format(radius, 1)}" fill="${color}" opacity="${opacity}"/>`;
      }
    }
  }
  return `${svgOpen(width, height, 'Generated packed circle cover')}${background(palette.dark)}${circles}</svg>`;
}

module.exports = renderRrrainbow;

'use strict';

const { escapeAttr, resolveValue } = require('../value');

function renderFfflux(context) {
  const { config, rng, width, height, id, palette } = context;
  const opts = config.patterns.ffflux;
  const color1 = resolveValue(opts.color1, rng) || palette.baseSoft;
  const color2 = resolveValue(opts.color2, rng) || palette.accent;
  const frequencyX = resolveValue(opts.frequency_x, rng, { precision: 4 });
  const frequencyY = resolveValue(opts.frequency_y, rng, { precision: 4 });
  const octaves = resolveValue(opts.octaves, rng, { integer: true });
  const saturate = Boolean(resolveValue(opts.saturate, rng));
  const angle = resolveValue(opts.angle, rng, { integer: true });
  const blurX = resolveValue(opts.blur_x, rng, { precision: 1 });
  const blurY = resolveValue(opts.blur_y, rng, { precision: 1 });
  const seed = resolveValue(opts.seed, rng, { integer: true }) || rng.integer(1, 9999);
  const mode = resolveValue(opts.mode, rng) || 'screen';
  const linear = Boolean(resolveValue(opts.linear, rng));
  const gradientId = `${id}-gradient`;
  const filterId = `${id}-filter`;
  const gradientDef = linear
    ? `<linearGradient gradientTransform="rotate(${angle}, 0.5, 0.5)" x1="50%" y1="0%" x2="50%" y2="100%" id="${gradientId}"><stop stop-color="${escapeAttr(color1)}" stop-opacity="1" offset="0%"/><stop stop-color="${escapeAttr(color2)}" stop-opacity="1" offset="100%"/></linearGradient>`
    : `<radialGradient id="${gradientId}"><stop offset="0%" stop-color="${escapeAttr(color1)}"/><stop offset="100%" stop-color="${escapeAttr(color2)}"/></radialGradient>`;
  const saturateFilter = saturate
    ? '<feColorMatrix type="saturate" values="3" in="blend" result="colormatrix"/>'
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Generated fluid gradient cover"><defs>${gradientDef}<filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${frequencyX} ${frequencyY}" numOctaves="${octaves}" seed="${seed}" stitchTiles="stitch" result="turbulence"/><feGaussianBlur stdDeviation="${blurX} ${blurY}" in="turbulence" edgeMode="duplicate" result="blur"/><feBlend mode="${escapeAttr(mode)}" in="SourceGraphic" in2="blur" result="blend"/>${saturateFilter}</filter></defs><rect width="100%" height="100%" fill="url(#${gradientId})" filter="url(#${filterId})"/></svg>`;
}

module.exports = renderFfflux;

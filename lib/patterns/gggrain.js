'use strict';

const { escapeAttr, mapRange, resolveValue } = require('../value');

function renderGggrain(context) {
  const { config, rng, width, height, id, palette } = context;
  const opts = config.patterns.gggrain;
  const color1 = resolveValue(opts.color1, rng) || palette.base;
  const color2 = resolveValue(opts.color2, rng) || palette.accent;
  const color3 = resolveValue(opts.color3, rng) || palette.accentAlt;
  const frequency = resolveValue(opts.frequency, rng, { precision: 3 });
  const saturate = Boolean(resolveValue(opts.saturate, rng));
  const angle = resolveValue(opts.angle, rng, { integer: true });
  const seed = resolveValue(opts.seed, rng, { integer: true }) || rng.integer(1, 9999);
  const mode = resolveValue(opts.mode, rng) || 'soft-light';
  const linear = Boolean(resolveValue(opts.linear, rng));
  const grainOpacity = resolveValue(opts.grain_opacity, rng, { precision: 2 });
  const radius = resolveValue(opts.radius, rng, { precision: 2 });
  const granularity = resolveValue(opts.granularity, rng, { precision: 2 });
  const granularity1 = Math.round(mapRange(granularity, 10, 1, 15, 25));
  const granularity2 = Math.round(mapRange(granularity, 10, 1, -7, -17));
  const gradientId = `${id}-gradient`;
  const gradient2Id = `${id}-gradient2`;
  const gradient3Id = `${id}-gradient3`;
  const filterId = `${id}-filter`;
  const saturateId = `${id}-saturate`;

  const gradientDefs = linear
    ? `<linearGradient gradientTransform="rotate(-${angle}, 0.5, 0.5)" x1="50%" y1="0%" x2="50%" y2="100%" id="${gradient2Id}"><stop stop-color="${escapeAttr(color3)}" stop-opacity="1" offset="0%"/><stop stop-color="rgba(255,255,255,0)" stop-opacity="0" offset="100%"/></linearGradient><linearGradient gradientTransform="rotate(${angle}, 0.5, 0.5)" x1="50%" y1="0%" x2="50%" y2="100%" id="${gradient3Id}"><stop stop-color="${escapeAttr(color2)}" stop-opacity="1" offset="0%"/><stop stop-color="rgba(255,255,255,0)" stop-opacity="0" offset="100%"/></linearGradient>`
    : `<radialGradient id="${gradientId}" r="${radius}"><stop offset="0%" stop-color="${escapeAttr(color1)}"/><stop offset="50%" stop-color="${escapeAttr(color2)}"/><stop offset="100%" stop-color="${escapeAttr(color3)}"/></radialGradient>`;

  const saturateDef = saturate
    ? `<filter id="${saturateId}" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="3" in="SourceGraphic" result="colormatrix"/></filter>`
    : '';

  const background = linear
    ? `<rect width="100%" height="100%" fill="${escapeAttr(color1)}"/><rect width="100%" height="100%" fill="url(#${gradient3Id})"/><rect width="100%" height="100%" fill="url(#${gradient2Id})"/>`
    : `<rect width="100%" height="100%" fill="url(#${gradientId})"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Generated grain cover"><defs>${gradientDefs}<filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="2" seed="${seed}" stitchTiles="stitch" result="turbulence"/><feColorMatrix type="saturate" values="0" in="turbulence" result="colormatrix"/><feComponentTransfer in="colormatrix" result="componentTransfer"><feFuncR type="linear" slope="3"/><feFuncG type="linear" slope="3"/><feFuncB type="linear" slope="3"/></feComponentTransfer><feColorMatrix in="componentTransfer" result="colormatrix2" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${granularity1} ${granularity2}"/></filter>${saturateDef}</defs><g${saturate ? ` filter="url(#${saturateId})"` : ''}>${background}</g><rect width="100%" height="100%" fill="transparent" filter="url(#${filterId})" opacity="${grainOpacity}" style="mix-blend-mode:${escapeAttr(mode)}"/></svg>`;
}

module.exports = renderGggrain;

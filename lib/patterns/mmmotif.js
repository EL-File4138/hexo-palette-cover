'use strict';

const { deriveColor, escapeAttr, resolveValue } = require('../value');

function renderMmmotif(context) {
  const { config, rng, width, height, id, palette } = context;
  const opts = config.patterns.mmmotif;
  const baseColor = resolveValue(opts.base_color, rng) || palette.base;
  const lightColor = deriveColor(baseColor, 18);
  const darkColor = deriveColor(baseColor, -18);
  const backgroundColor = resolveValue(opts.background_color, rng) || palette.dark;
  const angle = resolveValue(opts.angle, rng, { integer: true });
  const scale = resolveValue(opts.scale, rng, { precision: 2 });
  const shape = resolveValue(opts.shape, rng, { integer: true });
  const translateX = resolveValue(opts.translate_x, rng, { precision: 1 });
  const translateY = resolveValue(opts.translate_y, rng, { precision: 1 });
  const skewX = resolveValue(opts.skew_x, rng, { precision: 1 });
  const skewY = resolveValue(opts.skew_y, rng, { precision: 1 });
  const tileSize = resolveValue(opts.tile_size, rng, { integer: true }) || 40;
  const patternId = `${id}-pattern`;
  const shapeMarkup = getShapeMarkup(shape, baseColor, lightColor, darkColor);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Generated isometric motif cover"><rect width="100%" height="100%" fill="${escapeAttr(backgroundColor)}"/><defs><pattern id="${patternId}" width="${tileSize}" height="${tileSize}" patternUnits="userSpaceOnUse" patternTransform="translate(${translateX} ${translateY}) scale(${scale}) rotate(${angle}) skewX(${skewX}) skewY(${skewY})">${shapeMarkup}</pattern></defs><rect width="100%" height="100%" fill="url(#${patternId})"/></svg>`;
}

function getShapeMarkup(shape, baseColor, lightColor, darkColor) {
  const base = escapeAttr(baseColor);
  const light = escapeAttr(lightColor);
  const dark = escapeAttr(darkColor);
  const shapes = {
    1: `<rect width="18" height="18" transform="matrix(0.866025 0.5 -0.866025 0.5 20 2)" fill="${base}"/><rect width="18" height="18" transform="matrix(0.866025 0.5 0 1 4.41162 11)" fill="${light}"/><rect width="18" height="18" transform="matrix(0.866025 -0.5 0 1 20 20)" fill="${dark}"/>`,
    2: `<rect width="64.4123" height="124.995" transform="matrix(0.24201 0.970274 0 1 4.41162 -64.7517)" fill="${base}"/><rect width="64.4123" height="124.995" transform="matrix(0.24201 -0.970274 0 1 19.9995 -2.25317)" fill="${dark}"/>`,
    3: `<circle r="7.34831" transform="matrix(0.866044 -0.499967 0.866044 0.499967 20.0004 23.5002)" fill="${dark}"/><circle r="7.34831" transform="matrix(0.866044 -0.499967 0.866044 0.499967 20.0004 20.5002)" fill="${light}"/><circle r="7.34831" transform="matrix(0.866044 -0.499967 0.866044 0.499967 19.9999 16.4998)" fill="${base}"/>`,
    4: `<circle r="7.34831" transform="matrix(0.866044 -0.499967 0.866044 0.499967 20.0004 23.5002)" fill="${light}"/><circle r="7.34831" transform="matrix(0.866044 -0.499967 0.866044 0.499967 20.0004 20.5002)" fill="${dark}"/><circle r="7.34831" transform="matrix(0.866044 -0.499967 0.866044 0.499967 19.9999 16.4998)" fill="${base}"/>`,
    5: `<path d="M9.39371 8.87681L34.4892 12.7588L16.118 23.3644L9.39371 8.87681Z" fill="${base}"/><path d="M9.39711 18.8738L9.39697 8.87378L16.1171 23.3638V33.3638L9.39711 18.8738Z" fill="${light}"/><path d="M34.4871 22.7538L34.4872 12.7539L16.1173 23.3439L16.1172 33.3638L34.4871 22.7538Z" fill="${dark}"/>`,
    6: `<rect width="11.3638" height="11.3638" transform="matrix(0.872008 0.489492 -0.872008 0.489492 20.0005 5.4375)" fill="${base}"/><rect width="11.3638" height="18" transform="matrix(0.872008 0.489492 0 1 10.0908 11)" fill="${light}"/><rect width="11.3638" height="18" transform="matrix(0.872008 -0.489492 0 1 20 16.5625)" fill="${dark}"/>`,
    7: `<path d="M9.39371 2.87681L34.4892 6.75876L16.118 17.3644L9.39371 2.87681Z" fill="${base}"/><path d="M9.39711 22.8738L9.39697 2.87378L16.1171 17.3638V37.3638L9.39711 22.8738Z" fill="${light}"/><path d="M34.4871 16.7538L34.4872 6.75391L16.1173 17.3439L16.1172 37.3638L34.4871 16.7538Z" fill="${dark}"/>`,
    8: `<path d="M9.39371 2.87681L34.4892 6.75876L16.118 17.3644L9.39371 2.87681Z" fill="${base}"/><path d="M9.39711 22.8738L9.39697 2.87378L16.1171 17.3638V37.3638L9.39711 22.8738Z" fill="${light}"/><path d="M34.4871 26.7538L34.4872 6.75391L16.1173 17.3439L16.1172 37.3638L34.4871 26.7538Z" fill="${dark}"/>`,
    9: `<rect width="11.3638" height="11.3638" transform="matrix(0.872008 0.489492 -0.872008 0.489492 20 11.4375)" fill="${base}"/><rect width="11.3638" height="6" transform="matrix(0.872008 0.489492 0 1 10.0903 17)" fill="${light}"/><rect width="11.3638" height="6" transform="matrix(0.872008 -0.489492 0 1 19.9995 22.5625)" fill="${dark}"/>`,
    10: `<rect width="11.3638" height="11.3638" transform="matrix(0.872008 0.489492 -0.872008 0.489492 20.0005 16.4375)" fill="${base}"/><rect width="11.3638" height="6" transform="matrix(0.872008 0.489492 0 1 10.0908 22)" fill="${light}"/><rect width="11.3638" height="6" transform="matrix(0.872008 -0.489492 0 1 20 27.5625)" fill="${dark}"/><rect width="11.3638" height="11.3638" transform="matrix(0.872008 0.489492 -0.872008 0.489492 20.0005 6.4375)" fill="${base}"/><rect width="11.3638" height="6" transform="matrix(0.872008 0.489492 0 1 10.0908 12)" fill="${light}"/><rect width="11.3638" height="6" transform="matrix(0.872008 -0.489492 0 1 20 17.5625)" fill="${dark}"/>`,
    11: `<path d="M18.2565 9.41648C19.2197 8.87581 20.7813 8.87581 21.7445 9.41648L29.9098 14L20.0005 19.5625L10.0912 14L18.2565 9.41648Z" fill="${base}"/><path d="M10.0908 14L20.0001 19.5625V31.5625L11.8348 26.979C10.8716 26.4383 10.0908 25.1046 10.0908 24V14Z" fill="${light}"/><path d="M20 19.5625L29.9093 14V24C29.9093 25.1046 29.1285 26.4383 28.1653 26.979L20 31.5625V19.5625Z" fill="${dark}"/>`,
    12: `<path d="M7.92969 25.4865L7.92986 19.4866L16.7597 24.5865V30.5865L7.92969 25.4865Z" fill="${light}"/><path d="M16.76 30.5865L16.7598 24.5865L28.84 22.7278L28.8435 28.7265L16.76 30.5865Z" fill="${dark}"/><path d="M32.07 21.7465V15.7466L28.8398 22.7266L28.84 28.7266L32.07 21.7465Z" fill="${light}"/><path d="M11.1611 12.5162L23.2352 10.6485L32.074 15.7512L28.8388 22.7216L16.7647 24.5893L7.92586 19.4866L11.1611 12.5162Z" fill="${base}"/>`,
    13: `<path d="M7.92969 27.4865L7.92986 16.4866L16.7597 21.5865V32.5865L7.92969 27.4865Z" fill="${light}"/><path d="M16.76 32.5865L16.7598 21.5865L28.84 19.7278L28.8435 30.7265L16.76 32.5865Z" fill="${dark}"/><path d="M32.07 23.7465V12.7466L28.8398 19.7266L28.84 30.7266L32.07 23.7465Z" fill="${light}"/><path d="M11.1611 9.51624L23.2352 7.64853L32.074 12.7512L28.8388 19.7216L16.7647 21.5893L7.92586 16.4866L11.1611 9.51624Z" fill="${base}"/>`,
    14: `<path d="M13.6359 11.713L9.39326 14.1623L15.7572 17.8362L9.39326 21.5101L13.6359 23.9594L19.9999 20.2855L26.3638 23.9594L30.6065 21.5101L24.2425 17.8362L30.6065 14.1623L26.3638 11.713L19.9999 15.3869L13.6359 11.713Z" fill="${base}"/><path d="M9.38965 18.1608L9.38979 14.1609L15.7596 17.8408L12.2967 19.8196L9.38965 18.1608Z" fill="${light}"/><path d="M9.38965 25.5108L9.38979 21.5107L13.6396 23.9608L13.64 27.9608L9.38965 25.5108Z" fill="${light}"/><path d="M13.6401 27.9608V23.9608L20.0001 20.2808V24.2808L13.6401 27.9608Z" fill="${dark}"/><path d="M20 24.2808V20.2808L26.36 23.9608V27.9608L20 24.2808Z" fill="${light}"/><path d="M26.3599 27.9608V23.9607L30.6099 21.5107L30.61 25.507L26.3599 27.9608Z" fill="${dark}"/><path d="M30.6102 18.1634V14.1609L24.2402 17.8408L27.6992 19.8391L30.6102 18.1634Z" fill="${dark}"/>`,
    15: `<path d="M9.38965 21.1608L9.38979 12.1609L15.7596 15.8408L12.2967 22.8196L9.38965 21.1608Z" fill="${light}"/><path d="M9.38965 28.5108L9.38979 19.5107L13.6396 21.9608L13.64 30.9608L9.38965 28.5108Z" fill="${light}"/><path d="M13.6401 30.9608V21.9608L20.0001 18.2808V27.2808L13.6401 30.9608Z" fill="${dark}"/><path d="M20 27.2808V18.2808L26.36 21.9608V30.9608L20 27.2808Z" fill="${light}"/><path d="M26.3599 30.9608V21.9607L30.6099 19.5107L30.61 28.507L26.3599 30.9608Z" fill="${dark}"/><path d="M30.6102 21.1634V12.1609L24.2402 15.8408L27.6992 22.8391L30.6102 21.1634Z" fill="${dark}"/><path d="M13.6359 9.71299L9.39326 12.1623L15.7572 15.8362L9.39326 19.5101L13.6359 21.9594L19.9999 18.2855L26.3638 21.9594L30.6065 19.5101L24.2425 15.8362L30.6065 12.1623L26.3638 9.71299L19.9999 13.3869L13.6359 9.71299Z" fill="${base}"/>`
  };
  return shapes[shape] || shapes[1];
}

module.exports = renderMmmotif;

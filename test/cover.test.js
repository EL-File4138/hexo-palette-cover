'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { buildCover, shouldInject } = require('../lib/cover');
const { getConfig } = require('../lib/config');
const { renderSvg } = require('../lib/svg');
const { RENDERERS } = require('../lib/svg');
const { buildPalette } = require('../lib/value');
const { HashRng } = require('../lib/hash');

test('same slug creates same cover path', () => {
  const config = getConfig();
  const post = { slug: 'same-article' };

  assert.deepEqual(buildCover(post, config), buildCover(post, config));
});

test('different slugs create different cover paths', () => {
  const config = getConfig();

  assert.notEqual(
    buildCover({ slug: 'first-article' }, config).path,
    buildCover({ slug: 'second-article' }, config).path
  );
});

test('same slug creates same svg', () => {
  const config = getConfig();
  const cover = buildCover({ slug: 'deterministic-svg' }, config);
  const first = renderSvg({ identifier: 'deterministic-svg', hash: cover.hash, config });
  const second = renderSvg({ identifier: 'deterministic-svg', hash: cover.hash, config });

  assert.equal(first, second);
  assert.match(first, /^<svg /);
});

test('missing cover fields are eligible by default', () => {
  const config = getConfig();

  assert.equal(shouldInject({ slug: 'missing' }, config), true);
});

test('manual cover field is preserved by default', () => {
  const config = getConfig();

  assert.equal(shouldInject({ slug: 'manual', index_img: '/img/manual.png' }, config), false);
  assert.equal(shouldInject({ slug: 'manual', banner_img: '/img/manual.png' }, config), false);
});

test('override makes manual cover field eligible', () => {
  const config = getConfig({ override: true });

  assert.equal(shouldInject({ slug: 'manual', index_img: '/img/manual.png' }, config), true);
});

test('custom route is normalized', () => {
  const config = getConfig({ route: '/generated/covers/' });
  const cover = buildCover({ slug: 'custom-route' }, config);

  assert.match(cover.path, /^generated\/covers\/custom-route-/);
  assert.match(cover.url, /^\/generated\/covers\/custom-route-/);
});

test('palette accepts hue zero without fallback', () => {
  const config = getConfig({
    palette: {
      space: 'oklch',
      hue: 0,
      chroma: 0.14,
      lightness: 0.58,
      harmony: 'analogous',
      contrast: 0.12
    }
  });
  const palette = buildPalette(config, new HashRng('hue-zero'));

  assert.equal(palette.base, 'oklch(0.58 0.14 0)');
});

test('generated svg uses coherent configured oklch palette', () => {
  const config = getConfig({
    patterns: { enabled: ['gggrain'] },
    palette: {
      space: 'oklch',
      hue: 200,
      chroma: 0.14,
      lightness: 0.58,
      harmony: 'analogous',
      contrast: 0.12
    }
  });
  const svg = renderSvg({ identifier: 'palette-check', hash: 'palette-check', config });

  assert.match(svg, /oklch\(0\.58 0\.14 200\)/);
  assert.match(svg, /oklch\(0\.7 0\.151 176\)/);
  assert.match(svg, /oklch\(0\.622 0\.123 228\)/);
});

test('palette supports color theory harmony modes', () => {
  const base = {
    space: 'oklch',
    hue: 30,
    chroma: 0.12,
    lightness: 0.55,
    contrast: 0.1
  };

  assert.equal(buildPalette(getConfig({ palette: { ...base, harmony: 'complementary' } }), new HashRng('x')).accent, 'oklch(0.65 0.13 210)');
  assert.equal(buildPalette(getConfig({ palette: { ...base, harmony: 'triad' } }), new HashRng('x')).accent, 'oklch(0.65 0.13 150)');
  assert.equal(buildPalette(getConfig({ palette: { ...base, harmony: 'compound' } }), new HashRng('x')).accent, 'oklch(0.65 0.13 60)');
});

test('palette can fall back to hsl if configured', () => {
  const config = getConfig({
    palette: {
      space: 'hsl',
      hue: 200,
      chroma: 0.14,
      lightness: 0.58,
      harmony: 'analogous',
      contrast: 0.12
    }
  });

  assert.equal(buildPalette(config, new HashRng('hsl')).base, 'hsl(200, 81%, 58%)');
});

test('mmmotif renders a solid configurable background color', () => {
  const config = getConfig({
    patterns: {
      enabled: ['mmmotif'],
      mmmotif: {
        background_color: '#102030',
        base_color: '#abcdef',
        shape: 1,
        angle: 0,
        scale: 1,
        translate_x: 0,
        translate_y: 0,
        skew_x: 0,
        skew_y: 0
      }
    }
  });
  const svg = renderSvg({ identifier: 'motif-background', hash: 'motif-background', config });

  assert.match(svg, /<rect width="100%" height="100%" fill="#102030"\/>/);
});

test('every registered pattern renders deterministic svg', () => {
  Object.keys(RENDERERS).forEach((patternName) => {
    const config = getConfig({
      width: 640,
      height: 360,
      patterns: {
        enabled: [patternName]
      }
    });
    const first = renderSvg({ identifier: patternName, hash: patternName, config });
    const second = renderSvg({ identifier: patternName, hash: patternName, config });

    assert.equal(first, second, `${patternName} should be deterministic`);
    assert.match(first, /^<svg /, `${patternName} should render svg`);
    assert.match(first, /<\/svg>$/, `${patternName} should close svg`);
  });
});

test('default enabled pattern list has registered renderers', () => {
  const config = getConfig();

  config.patterns.enabled.forEach((patternName) => {
    assert.equal(typeof RENDERERS[patternName], 'function', `${patternName} is registered`);
  });
});

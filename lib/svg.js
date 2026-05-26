'use strict';

const renderGggrain = require('./patterns/gggrain');
const renderFfflux = require('./patterns/ffflux');
const renderMmmotif = require('./patterns/mmmotif');
const renderUuunion = require('./patterns/uuunion');
const renderSssurf = require('./patterns/sssurf');
const renderCccircular = require('./patterns/cccircular');
const renderSsscales = require('./patterns/ssscales');
const renderRrreplicate = require('./patterns/rrreplicate');
const renderSssquiggly = require('./patterns/sssquiggly');
const renderCccoil = require('./patterns/cccoil');
const renderVvvortex = require('./patterns/vvvortex');
const renderGgglitch = require('./patterns/ggglitch');
const renderRrrainbow = require('./patterns/rrrainbow');
const { HashRng } = require('./hash');
const { buildPalette } = require('./value');

const RENDERERS = {
  gggrain: renderGggrain,
  ffflux: renderFfflux,
  mmmotif: renderMmmotif,
  uuunion: renderUuunion,
  sssurf: renderSssurf,
  cccircular: renderCccircular,
  ssscales: renderSsscales,
  rrreplicate: renderRrreplicate,
  sssquiggly: renderSssquiggly,
  cccoil: renderCccoil,
  vvvortex: renderVvvortex,
  ggglitch: renderGgglitch,
  rrrainbow: renderRrrainbow
};

function renderSvg({ identifier, hash, config }) {
  const rng = new HashRng(hash || identifier);
  const enabled = config.patterns.enabled.filter((name) => RENDERERS[name]);
  const patternName = enabled.length > 0 ? rng.pick(enabled) : 'gggrain';
  const renderer = RENDERERS[patternName] || renderGggrain;
  const palette = buildPalette(config, rng);
  return renderer({
    config,
    rng,
    palette,
    width: config.width,
    height: config.height,
    id: `palette-cover-${patternName}`,
    patternName
  });
}

module.exports = {
  renderSvg,
  RENDERERS
};

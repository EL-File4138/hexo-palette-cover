'use strict';

const DEFAULT_CONFIG = Object.freeze({
  enable: true,
  route: 'palette-cover',
  width: 1422,
  height: 800,
  override: false,
  priority: 5,
  palette: {
    space: 'oklch',
    hue: [0, 359],
    chroma: [0.11, 0.2],
    lightness: [0.48, 0.68],
    harmony: ['analogous', 'complementary', 'triad', 'compound'],
    contrast: [0.1, 0.18]
  },
  patterns: {
    enabled: [
      'gggrain',
      'ffflux',
      'mmmotif',
      'uuunion',
      'sssurf',
      'cccircular',
      'ssscales',
      'rrreplicate',
      'sssquiggly',
      'cccoil',
      'vvvortex',
      'ggglitch',
      'rrrainbow'
    ],
    gggrain: {
      enabled: true,
      color1: null,
      color2: null,
      color3: null,
      frequency: [0.38, 0.68],
      saturate: false,
      angle: [0, 360],
      seed: null,
      mode: 'soft-light',
      linear: true,
      grain_opacity: [0.72, 0.92],
      radius: [0.45, 0.65],
      granularity: [4, 7]
    },
    ffflux: {
      enabled: true,
      color1: null,
      color2: null,
      frequency_x: [0.0035, 0.008],
      frequency_y: [0.0025, 0.0065],
      octaves: [2, 3],
      saturate: false,
      angle: [0, 360],
      blur_x: [14, 28],
      blur_y: [2, 12],
      seed: null,
      mode: 'screen',
      linear: true
    },
    mmmotif: {
      enabled: true,
      background_color: null,
      base_color: null,
      angle: [0, 360],
      scale: [0.9, 1.3],
      shape: [1, 15],
      translate_x: [0, 24],
      translate_y: [0, 24],
      skew_x: [-4, 4],
      skew_y: [-4, 4],
      tile_size: 40
    },
    uuunion: {
      enabled: true,
      fill1: null,
      fill2: null,
      fill3: null,
      blur_x: [18, 42],
      blur_y: [14, 34],
      gradient_angle_1: [0, 360],
      gradient_angle_2: [0, 360],
      gradient_angle_3: [0, 360],
      waviness: [18, 44],
      shadow_opacity: [0.08, 0.2],
      shadow_distance: [8, 28]
    },
    sssurf: {
      enabled: true,
      style: [1, 4],
      fill_mode: 'gradient',
      color: null,
      fill1: null,
      fill2: null,
      waves: [4, 7],
      spacing: [70, 130],
      undulations: [2, 5],
      amplitude: [22, 70],
      opacity: [0.45, 0.85]
    },
    cccircular: {
      enabled: true,
      style: [1, 8],
      color: null,
      position: ['center', 'top', 'bottom', 'left', 'right'],
      opacity_mode: ['fade-out', 'fade-in', 'solid'],
      frequency: [10, 22],
      scale: [0.8, 1.5]
    },
    ssscales: {
      enabled: true,
      hue_start: null,
      hue_end: null,
      saturation: null,
      lightness: null,
      circle_size: [22, 44],
      resolution: [12, 22],
      noise_increment: [0.08, 0.2]
    },
    rrreplicate: {
      enabled: true,
      active_patterns: [2, 4],
      pattern_size: [36, 72],
      angle: [0, 180],
      scale: [0.9, 1.25],
      translate_x: [0, 24],
      translate_y: [0, 24],
      skew_x: [-6, 6],
      skew_y: [-6, 6],
      opacity: [0.55, 0.85]
    },
    sssquiggly: {
      enabled: true,
      stroke_mode: 'gradient',
      color: null,
      fill1: null,
      fill2: null,
      spacing: [38, 72],
      frequency: [8, 16],
      stroke_width: [2, 6],
      points: [8, 16],
      amplitude: [12, 36],
      opacity: [0.45, 0.8]
    },
    cccoil: {
      enabled: true,
      fill_mode: 'gradient',
      color: null,
      fill1: null,
      fill2: null,
      linecap: ['round', 'square'],
      opacity_mode: ['fade-out', 'fade-in', 'solid'],
      rotation: [0, 360],
      direction: [1, -1],
      max_length: [80, 180],
      frequency: [11, 22],
      spacing: [18, 34],
      stroke_width: [2, 5],
      offset: [0, 80],
      opacity: [0.45, 0.85]
    },
    vvvortex: {
      enabled: true,
      fill_mode: 'gradient',
      color: null,
      fill1: null,
      fill2: null,
      opacity_mode: ['fade-out', 'fade-in', 'solid'],
      linecap: ['round', 'square'],
      frequency: [12, 26],
      spacing: [18, 36],
      stroke_width: [2, 6],
      opacity: [0.45, 0.85]
    },
    ggglitch: {
      enabled: true,
      fill_mode: 'gradient',
      color: null,
      fill1: null,
      fill2: null,
      style: [1, 3],
      glitch_offset: [8, 36],
      glitch_opacity: [0.18, 0.48],
      divisions: [12, 28],
      frequency: [4, 10],
      stroke_width: [1, 4],
      opacity: [0.75, 1]
    },
    rrrainbow: {
      enabled: true,
      hue_start: null,
      hue_end: null,
      saturation: null,
      lightness: null,
      opacity_variation: [0.1, 0.35],
      fill_type: ['solid', 'stroke', 'mixture'],
      probability: [0.55, 0.85],
      evenness: [0.45, 0.8],
      density: [9, 16]
    }
  }
});

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function mergeDeep(base, override) {
  if (!isPlainObject(override)) return clone(base);

  const output = clone(base);
  Object.keys(override).forEach((key) => {
    if (isPlainObject(output[key]) && isPlainObject(override[key])) {
      output[key] = mergeDeep(output[key], override[key]);
    } else {
      output[key] = clone(override[key]);
    }
  });
  return output;
}

function clone(value) {
  if (Array.isArray(value)) return value.map(clone);
  if (isPlainObject(value)) {
    return Object.keys(value).reduce((result, key) => {
      result[key] = clone(value[key]);
      return result;
    }, {});
  }
  return value;
}

function normalizeRoute(route) {
  return String(route || DEFAULT_CONFIG.route)
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

function getConfig(userConfig) {
  const config = mergeDeep(DEFAULT_CONFIG, userConfig || {});
  config.route = normalizeRoute(config.route);
  config.width = positiveInteger(config.width, DEFAULT_CONFIG.width);
  config.height = positiveInteger(config.height, DEFAULT_CONFIG.height);
  config.priority = Number.isFinite(Number(config.priority))
    ? Number(config.priority)
    : DEFAULT_CONFIG.priority;
  config.patterns.enabled = normalizeEnabledPatterns(config.patterns);
  return config;
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.round(number) : fallback;
}

function normalizeEnabledPatterns(patterns) {
  const names = Array.isArray(patterns.enabled)
    ? patterns.enabled
    : DEFAULT_CONFIG.patterns.enabled;

  return names.filter((name) => patterns[name] && patterns[name].enabled !== false);
}

module.exports = {
  DEFAULT_CONFIG,
  getConfig,
  mergeDeep
};

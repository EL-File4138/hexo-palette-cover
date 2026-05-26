# hexo-palette-cover

Deterministic generated SVG covers for Hexo blogs using `hexo-theme-fluid`.

The plugin injects a generated SVG path into both `index_img` and `banner_img` for posts that do not specify their own cover images. The generated image is derived from the post slug, so the same post gets the same cover on every regeneration.

Implementation for palette generation is inspired by [fffuel.co](https://www.fffuel.co/) by [Sentry](https://sentry.io/).

## Install

Install the package in a Hexo site configured with `hexo-theme-fluid`, and make sure it is listed in the site's `package.json` dependencies.

For local development:

```sh
npm install /path/to/hexo-palette-cover
```

## Default Behavior

- Generates only for posts where both `index_img` and `banner_img` are missing.
- Preserves manually configured cover images.
- Injects the same URL into both Fluid fields.
- Serves generated SVGs from `/palette-cover/*.svg`.

## Configuration

Add to Hexo `_config.yml`:

```yaml
palette_cover:
  enable: true
  route: palette-cover
  width: 1422
  height: 800
  override: false
  priority: 5
  palette:
    space: oklch
    hue: [0, 359]
    chroma: [0.11, 0.2]
    lightness: [0.48, 0.68]
    harmony: [analogous, complementary, triad, compound]
    contrast: [0.1, 0.18]
  patterns:
    enabled:
      - gggrain
      - ffflux
      - mmmotif
      - uuunion
      - sssurf
      - cccircular
      - ssscales
      - rrreplicate
      - sssquiggly
      - cccoil
      - vvvortex
      - ggglitch
      - rrrainbow
```

Use `override: true` to replace manually configured `index_img` and `banner_img`.

## Development

```sh
npm test
```

## License
Unlicensed.

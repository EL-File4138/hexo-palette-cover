# Pattern Settings

All settings are optional. Fixed values are used directly. Two-number arrays are treated as deterministic ranges. Other arrays are treated as deterministic choices.

Colors are derived from one deterministic base palette per post. By default the palette is emitted as modern `oklch()` colors, with harmony choices based on basic colorimetry: `analogous`, `complementary`, `split`, `triad`, `tetradic`, `compound`, and `monochrome`. Pattern color fields such as `color1`, `color2`, and `base_color` are overrides; leave them empty to keep generated covers visually coherent.

Set `palette.space: hsl` if you need older browser color syntax.

```yaml
palette_cover:
  patterns:
    gggrain:
      enabled: true
      color1:
      color2:
      color3:
      frequency: [0.38, 0.68]
      saturate: false
      angle: [0, 360]
      seed:
      mode: soft-light
      linear: true
      grain_opacity: [0.72, 0.92]
      radius: [0.45, 0.65]
      granularity: [4, 7]

    ffflux:
      enabled: true
      color1:
      color2:
      frequency_x: [0.0035, 0.008]
      frequency_y: [0.0025, 0.0065]
      octaves: [2, 3]
      saturate: false
      angle: [0, 360]
      blur_x: [14, 28]
      blur_y: [2, 12]
      seed:
      mode: screen
      linear: true

    mmmotif:
      enabled: true
      background_color:
      base_color:
      angle: [0, 360]
      scale: [0.9, 1.3]
      shape: [1, 15]
      translate_x: [0, 24]
      translate_y: [0, 24]
      skew_x: [-4, 4]
      skew_y: [-4, 4]
      tile_size: 40

    uuunion:
      enabled: true
      fill1:
      fill2:
      fill3:
      blur_x: [18, 42]
      blur_y: [14, 34]
      gradient_angle_1: [0, 360]
      gradient_angle_2: [0, 360]
      gradient_angle_3: [0, 360]
      waviness: [18, 44]
      shadow_opacity: [0.08, 0.2]
      shadow_distance: [8, 28]

    sssurf:
      enabled: true
      style: [1, 4]
      fill_mode: gradient
      color:
      fill1:
      fill2:
      waves: [4, 7]
      spacing: [70, 130]
      undulations: [2, 5]
      amplitude: [22, 70]
      opacity: [0.45, 0.85]

    cccircular:
      enabled: true
      style: [1, 8]
      color:
      position: [center, top, bottom, left, right]
      opacity_mode: [fade-out, fade-in, solid]
      frequency: [10, 22]
      scale: [0.8, 1.5]

    ssscales:
      enabled: true
      hue_start:
      hue_end:
      saturation:
      lightness:
      circle_size: [22, 44]
      resolution: [12, 22]
      noise_increment: [0.08, 0.2]

    rrreplicate:
      enabled: true
      active_patterns: [2, 4]
      pattern_size: [36, 72]
      angle: [0, 180]
      scale: [0.9, 1.25]
      translate_x: [0, 24]
      translate_y: [0, 24]
      skew_x: [-6, 6]
      skew_y: [-6, 6]
      opacity: [0.55, 0.85]

    sssquiggly:
      enabled: true
      stroke_mode: gradient
      color:
      fill1:
      fill2:
      spacing: [38, 72]
      frequency: [8, 16]
      stroke_width: [2, 6]
      points: [8, 16]
      amplitude: [12, 36]
      opacity: [0.45, 0.8]

    cccoil:
      enabled: true
      fill_mode: gradient
      color:
      fill1:
      fill2:
      linecap: [round, square]
      opacity_mode: [fade-out, fade-in, solid]
      rotation: [0, 360]
      direction: [1, -1]
      max_length: [80, 180]
      frequency: [11, 22]
      spacing: [18, 34]
      stroke_width: [2, 5]
      offset: [0, 80]
      opacity: [0.45, 0.85]

    vvvortex:
      enabled: true
      fill_mode: gradient
      color:
      fill1:
      fill2:
      opacity_mode: [fade-out, fade-in, solid]
      linecap: [round, square]
      frequency: [12, 26]
      spacing: [18, 36]
      stroke_width: [2, 6]
      opacity: [0.45, 0.85]

    ggglitch:
      enabled: true
      fill_mode: gradient
      color:
      fill1:
      fill2:
      style: [1, 3]
      glitch_offset: [8, 36]
      glitch_opacity: [0.18, 0.48]
      divisions: [12, 28]
      frequency: [4, 10]
      stroke_width: [1, 4]
      opacity: [0.75, 1]

    rrrainbow:
      enabled: true
      hue_start:
      hue_end:
      saturation:
      lightness:
      opacity_variation: [0.1, 0.35]
      fill_type: [solid, stroke, mixture]
      probability: [0.55, 0.85]
      evenness: [0.45, 0.8]
      density: [9, 16]
```

Supported pattern names: `gggrain`, `ffflux`, `mmmotif`, `uuunion`, `sssurf`, `cccircular`, `ssscales`, `rrreplicate`, `sssquiggly`, `cccoil`, `vvvortex`, `ggglitch`, and `rrrainbow`.

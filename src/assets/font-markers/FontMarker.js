const glyphs = {};

const defaults = {
  fillColor: '#000',
  fillOpacity: 1,
  rotation: 0,
  strokeColor: '#000',
  strokeOpacity: 0,
  strokeWeight: 1,
};

const GlyphLoader = (jsonRef) => {
  const { units, icons } = jsonRef;
  Object.keys(icons).forEach(iconName => {
    const icon = icons[iconName];
    glyphs[iconName] = icon;
    glyphs[iconName].units = units;
  });
};

class FontMarker {
  constructor(iconName, options) {
    const glyph = glyphs[iconName];

    this.path = glyph.path;
    this.anchor = { x: glyph.advx / 2, y: glyph.units / 2 };
    this.labelOrigin = { x: glyph.advx / 2, y: glyph.units * 1.5 };
    this.scale = 1;

    const opts = Object.assign(defaults, options);
    Object.keys(opts).forEach(key => {
      this[key] = opts[key];
    });

    this.scale = this.scale * 20 / glyph.units;
  }
}

export {
  GlyphLoader,
  FontMarker,
};

export default {
  GlyphLoader,
  FontMarker,
};

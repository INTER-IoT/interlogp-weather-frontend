const defaults = {
  fillColor: '#000',
  fillOpacity: 1,
  rotation: 0,
  strokeColor: '#000',
  strokeOpacity: 0,
  strokeWeight: 1
}

const iconMarker = (units, glyph, options) => {
  const icon = {
    path: glyph.path,
    anchor: { x: glyph.advx / 2, y: units / 2 },
    labelOrigin: { x: glyph.advx / 2, y: units * 1.5 },
    scale: 1
  };
  const markerIcon = Object.assign(defaults, icon, options);
  markerIcon.scale = markerIcon.scale * 20 / units;
  return markerIcon;
};

const FontMarkerLoader = (jsonRef) => {
  const units = jsonRef.units;
  const icons = {};
  for(const iconName in jsonRef.icons)
    icons[iconName] = (options) => iconMarker(jsonRef.units, jsonRef.icons[iconName], options);
  return icons;
};

export default FontMarkerLoader;
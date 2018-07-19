const WeatherMarkers = {};

const iconMarker = (glyph, options) => {
  options = options || {};
  return {
    path: glyph.path,
    anchor: { x: glyph.advx / 2, y: glyph.units / 2},
    labelOrigin: {x: glyph.advx / 2, y: glyph.units * 1.5},
    fillColor: options.fillColor || '#000',
    fillOpacity: options.fillOpacity || 1,
    rotation: options.rotation || 0,
    scale: options.scale * 20 / glyph.units || 20 / glyph.units,
    strokeColor: options.strokeColor || 'black',
    strokeOpacity: options.strokeOpacity || 0,
    strokeWeight: options.strokeWeight || 0
  };
};

WeatherMarkers.Cloudy =  (options) => iconMarker({
  path: 'M0 94q0 -39 26 -65q70 -29 94 -29h840q38 0 64.5 27.5t26.5 65.5q0 37 -26.5 62.5t-64.5 25.5h-840q-42 0 -81 -25.5t-39 -61.5zM149 414q0 -38 27 -63q24 -28 62 -28h1003q38 0 65 26.5t27 64.5t-27 65t-65 27h-1003q-37 0 -63 -27t-26 -65zM261 667q0 -14 18 -14h148 q19 0 23 14q41 85 116 140.5t169 66.5h58q17 0 17 20l8 60q11 114 74 207.5t163.5 146.5t215.5 53q174 0 304 -117t148 -290l8 -60q0 -20 19 -20h171q142 0 245.5 -102t103.5 -242q0 -144 -103 -246.5t-246 -102.5h-735q-18 0 -18 -20v-142q0 -19 18 -19h735q144 0 266 71 t193 193t71 266q0 116 -46 214q124 154 124 350q0 150 -75.5 279t-205 204.5t-280.5 75.5q-117 0 -223.5 -47.5t-185.5 -133.5q-132 69 -288 69q-226 0 -401 -140t-223 -358q-136 -34 -239.5 -133.5t-144.5 -235.5q-2 -2 -2 -7zM337 -246q0 -38 28 -63q25 -27 62 -27h1005 q37 0 63 26.5t26 63.5q0 40 -25.5 66.5t-63.5 26.5h-1005q-38 0 -64 -26.5t-26 -66.5zM1135 1835q0 -40 26 -64l68 -70q26 -26 64 -26q41 0 66.5 25.5t25.5 65.5q0 37 -26 63l-69 69q-27 27 -61 27q-40 0 -67 -26.5t-27 -63.5zM1707 1368q106 101 261 101 q156 0 265.5 -109.5t109.5 -265.5q0 -107 -49 -193q-151 152 -373 152h-32q-46 184 -182 315zM1878 1925q0 -38 26.5 -63t63.5 -25q40 0 64.5 24.5t24.5 63.5v218q0 39 -25 65.5t-64 26.5q-37 0 -63.5 -27t-26.5 -65v-218zM2467 1681q0 -39 27 -64q20 -26 64 -26q43 0 63 26 l156 154q26 24 26 66q0 37 -26.5 63.5t-64.5 26.5t-65 -25l-153 -158q-27 -26 -27 -63zM2552 416q0 -39 25 -64l70 -67q39 -29 65 -29t65 29q26 26 26 64q0 37 -26 65l-68 65q-30 28 -69 28q-38 0 -63 -26t-25 -65zM2706 1090q0 -39 29 -65q29 -27 64 -27h217q36 0 62.5 27 t26.5 65q0 36 -26 60.5t-63 24.5h-217q-39 0 -66 -24.5t-27 -60.5z',
  advx: 3105,
  units: 2048
}, options);


export default WeatherMarkers;
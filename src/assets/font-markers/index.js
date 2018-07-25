import FontMarkers from './FontMarkers';

import WeatherMarkersDef from './weather-markers';
import FAMarkersDef from './fa-all';

const WeatherMarkers = FontMarkers(WeatherMarkersDef);
const FAMarkers = FontMarkers(FAMarkersDef);

const all = Object.assign(WeatherMarkers, FAMarkers);

export {
  WeatherMarkers,
  FAMarkers,
};

export default all;

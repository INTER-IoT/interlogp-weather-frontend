import { FontMarker, GlyphLoader } from './FontMarker';

import WeatherMarkersDef from './weather-markers';
import FARegularMarkersDef from './fa-regular';
import FASolidMarkersDef from './fa-solid';
import FABrandsMarkersDef from './fa-brands';

GlyphLoader(WeatherMarkersDef);
GlyphLoader(FARegularMarkersDef);
GlyphLoader(FASolidMarkersDef);
GlyphLoader(FABrandsMarkersDef);

export default FontMarker;

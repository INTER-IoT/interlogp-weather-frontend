// Google Maps plugin
import * as VueGoogleMaps from 'vue2-google-maps';

const API_KEY = 'AIzaSyAeU5X3Kc5fm9_tHunKY6m0XFiiiOB-7TA';

export default {
  install: (Vue) => {
    Vue.use(VueGoogleMaps, {
      load: {
        key: API_KEY,
      },
    });
  },
};

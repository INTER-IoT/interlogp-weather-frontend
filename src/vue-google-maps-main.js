// Google Maps plugin
import * as VueGoogleMaps from 'vue2-google-maps';

const API_KEY = 'AIzaSyA4MQBSALU8G1a4nXJIJKsZHSkrhEdpfUg';

export default {
  install: (Vue) => {
    Vue.use(VueGoogleMaps, {
      load: {
        key: API_KEY,
      },
    });
  },
};

// Google Maps plugin

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCopy,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCopy);
library.add(faTrashAlt);

export default {
  install: (Vue) => {
    Vue.component('font-awesome-icon', FontAwesomeIcon);
  },
};

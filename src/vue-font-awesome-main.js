// Google Maps plugin

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCopy,
  faTrashAlt,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCopy);
library.add(faTrashAlt);
library.add(faExclamationTriangle);

export default {
  install: (Vue) => {
    Vue.component('font-awesome-icon', FontAwesomeIcon);
  },
};

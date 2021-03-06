import Vue from 'vue';
import VueRouter from 'vue-router';

// apollo graphql
import VueApollo from 'vue-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

// highlight.js
import VueHighlightJS from 'vue-highlight.js';
import json from 'highlight.js/lib/languages/json';

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main';

// Google Maps Plugin
import VueGoogleMaps from './vue-google-maps-main';

// Font Awesome Setup
import VueFontAwesome from './vue-font-awesome-main';

// router setup
import routes from './routes/routes';

// c3 styles
import 'c3/c3.min.css';

import App from './App.vue';

import conf from './config';

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: conf.graphqlUrl(),
});

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: conf.subscriptionUrl(),
  options: {
    reconnect: true,
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition'
    && operation === 'subscription';
  },
  wsLink,
  httpLink,
);


const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.use(VueRouter);
Vue.use(LightBootstrap);
Vue.use(VueApollo);
Vue.use(VueGoogleMaps);
Vue.use(VueHighlightJS, {
  languages: {
    json,
  },
});
Vue.use(VueFontAwesome);

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active',
});

Vue.prototype.$conf = conf;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  apolloProvider,
  render: h => h(App),
  router,
});

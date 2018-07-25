import Vue from 'vue';
import VueRouter from 'vue-router';

// apollo graphql
import VueApollo from 'vue-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';


// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main';

// Google Maps Plugin
import VueGoogleMaps from './vue-google-maps-main';

// router setup
import routes from './routes/routes';

// c3 styles
import 'c3/c3.min.css';

import App from './App.vue';

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:3020/graphql',
});

const apolloClient = new ApolloClient({
  link: httpLink,
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

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  provide: apolloProvider.provide(),
  render: h => h(App),
  router,
});

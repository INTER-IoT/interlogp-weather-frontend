<template>
  <div class="card">
    <div class="card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <gmap-map
    :center="center"
    :zoom="13"
    :options="options"
    map-type-id="roadmap"
    ref="mapRef"
  >
    <gmap-cluster>
      <gmap-marker :key="index" v-for="(s, index) in stations" :position="s.position" :icon="s.icon" :label="s.text">
      </gmap-marker>
    </gmap-cluster>
  </gmap-map>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>

  import Vue from 'vue';
  import * as VueGoogleMaps from 'vue2-google-maps';
  import gql from 'graphql-tag';
  import GmapCluster from 'vue2-google-maps/dist/components/cluster';
  import GrayScale from './GrayScale.json';
  import FontMarkers from './FontMarkers';
  import WeatherMarkersDef from './weather-markers.json';
  import Card from './Card.vue';
  import { API_KEY } from './API_KEY';

  const WeatherMarkers = FontMarkers(WeatherMarkersDef);
  
  Vue.use(VueGoogleMaps, {
    load: {
      key: API_KEY,
    },
  });

  Vue.component('gmap-cluster', GmapCluster);

  export default {
    name: 'map-card',
    components: {
      Card,
    },
    apollo: {
      stations: {
        query: gql`{
          lastMeasurementsByPort(portId: 1){
            averageTemperature
            date
            weatherStation{
              id
              position{
                lat
                lon
              }
            }
          }
        }`,
        update: (data) => data.lastMeasurementsByPort.map(measurement => {
          const temperature = Math.floor(measurement.averageTemperature * 10) / 10;
          const maybeUnderZero = temperature < 0 ? 0 : temperature / 40;
          const s = temperature > 40 ? 1 : maybeUnderZero;
          const color = {
            r: s < 0.5 ? 510 * s : 255,
            g: s < 0.5 ? 127 * (1 + 2 * s) : 510 * (1 - s),
            b: s < 0.5 ? 255 * (1 - 2 * s) : 0,
          };
          const toHex = (c) => (`00${Math.floor(c).toString(16)}`).slice(-2).toUpperCase();
          const colorCode = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
          const station = {};
          station.position = { lat: measurement.weatherStation.position.lat, lng: measurement.weatherStation.position.lon };
          station.icon = WeatherMarkers['wi-thermometer']({
            scale: 1.5, fillOpacity: 1, fillColor: colorCode, strokeColor: 'black', strokeOpacity: 0, strokeWeight: 1,
          });
          station.text = `${temperature}º C`;
          return station;
        }),
      },
    },
    props: {

    },
    data() {
      return {
        center: {
          lat: 39.454340,
          lng: -0.316769,
        },
        options: {
          styles: GrayScale,
        },
        weatherIcons: WeatherMarkers,
        stations: [],
      };
    },
    methods: {

    },
  };
</script>
<style scoped>
  .card-body .vue-map-container {
    min-height: calc(50vh - 123px);
  }
</style>

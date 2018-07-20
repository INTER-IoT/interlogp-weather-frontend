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
    <gmap-marker :key="index" v-for="(s, index) in stations" :position="s.position" :icon="s.icon" :label="s.text">
    </gmap-marker>
  </gmap-map>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
  import Card from './Card.vue'
  import {API_KEY} from './API_KEY'
  import Vue from 'vue'
  import * as VueGoogleMaps from 'vue2-google-maps'
  import GrayScale from './GrayScale.json'
  import FontMarkers from './FontMarkers'
  import WeatherMarkersDef from './weather-markers.json'
  const WeatherMarkers = FontMarkers(WeatherMarkersDef);
  
  Vue.use(VueGoogleMaps, {
    load: {
      key: API_KEY
    }
  })
  export default {
    name: 'map-card',
    components: {
      Card
    },
    props: {
      
    },
    data () {
      return {
        center: {
          lat: 39.454340, 
          lng: -0.316769
        },
        options: {
          styles: GrayScale
        },
        weatherIcons: WeatherMarkers,
        stations: []
      }
    },
    methods: {
      
    },
    async mounted () {
      this.stations = [
        {
          position: {lat: 39.454340, lng: -0.316769},
          icon: WeatherMarkers['wi-day-rain-mix']({scale: 1, fillOpacity: 1, fillColor: 'red', strokeColor: 'black', strokeOpacity: 0, strokeWeight: 1}),
          text: '24ºC'
        }
      ]
    }
  }
</script>
<style scoped>
  .card-body .vue-map-container {
    min-height: calc(50vh - 123px);
  }
</style>

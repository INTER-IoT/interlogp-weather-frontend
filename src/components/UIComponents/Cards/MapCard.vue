<template>
  <div class="card">
    <div class="card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <gmap-map :center="center" :zoom="zoom" :options="options" :map-type-id="mapType" ref="mapRef">
        <slot name="markers"></slot>
      </gmap-map>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
  import Card from './Card.vue';
  
  export default {
    name: 'map-card',
    components: {
      Card,
    },
    props: {
      mapType: {
        type: String,
        default: () => 'roadmap',
      },
      center: {
        type: Object,
        default: () => ({ lat: 39.454340, lng: -0.316769 }),
      },
      zoom: {
        type: Number,
        default: () => 13,
      },
      options: {
        type: Object,
        default: () => {},
      },
    },
  };
</script>
<style scoped>
  .card-body .vue-map-container {
    min-height: calc(50vh - 123px);
  }
</style>

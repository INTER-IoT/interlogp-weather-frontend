<template>
  <div class="card">
    <div class="card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="card-body" :style="{ height: height }">
      <vue-c3 :handler="handler"></vue-c3>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
  import VueC3 from 'vue-c3';
  import Vue from 'vue';
  import Card from './Card.vue';

  const exampleOptions = {
    data: {
      x: 'x',
      columns: [
        ['x', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        ['ST01', 30, 33, 32, 35, 38, 34, 32],
        ['ST02', 28, 30, 29, 31, 33, 28, 26],
        ['ST03', 20, 22, 23, 26, 21, 20, 18],
      ],
    },
    axis: {
      x: {
        type: 'category',
      },
    },
  };

  export default {
    name: 'chart-card',
    components: {
      Card,
      VueC3,
    },
    props: {
      chartOptions: {
        type: Object,
        default: () => exampleOptions,
      },
      height: {
        type: String,
        default: () => '25vh',
      },
    },
    data() {
      return {
        handler: new Vue(),
      };
    },
    async mounted() {
      this.handler.$emit('init', this.chartOptions);
      this.$watch('chartOptions.data', this.update, { deep: true });
    },
    methods: {
      update() {
        this.handler.$emit('dispatch', (chart) => {
          chart.load(this.chartOptions.data);
        });
      },
    },
  };
</script>
<style>

</style>

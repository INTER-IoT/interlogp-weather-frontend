<template>
  <div class="stats">
    <i class="fa fa-history"></i> {{text}}
  </div>
</template>
<script>
  import { tf } from 'src/utils/misc';

  export default {
    name: 'update-timer',

    data() {
      return {
        text: '',
        symbol: Symbol('updater'),
      };
    },
    methods: {
      reset() {
        tf.reset(this.symbol);
      },
    },
    mounted() {
      tf.set(this.symbol, txt => {
        this.text = txt;
      });
    },
    beforeDestroy() {
      tf.unset(this.symbol);
    },
  };
</script>
<style>
</style>

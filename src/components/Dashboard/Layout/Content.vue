<template>
  <transition name="fade" mode="out-in">
    <router-view :key="$route.fullPath" :port="port" :alerts="alerts"></router-view>
  </transition>
</template>
<script>
export default {
  props: {
    port: Object,
    alerts: Array,
  },
};
</script>
<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .1s
  }

  .fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

  {
    opacity: 0
  }
</style>

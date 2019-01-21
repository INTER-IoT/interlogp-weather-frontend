<template>
  <div class="switch-button-control">
    <div class="switch-button" :class="{ enabled: isEnabled }" @click="toggle" :style="{'--color': color}">
      <div class="button"></div>
    </div>
    <div class="switch-button-label">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'switch-button',
    model: {
      prop: 'isEnabled',
      event: 'toggle',
    },
    props: {
      isEnabled: Boolean,
      color: {
        type: String,
        required: false,
        default: '#4D4D4D',
      },
    },
    methods: {
      toggle: function() {
        this.$emit("toggle", !this.isEnabled);
      }
    },
};
</script>
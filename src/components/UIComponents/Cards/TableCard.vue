<template>
  <div class="card">
    <div class="card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="card-body" :style="{ 'overflow': 'auto', height: height }">
      <l-table class="table-hover table-stripped"
        :columns="columns"
        :data="data">
      </l-table>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
  import Card from './Card.vue';
  import LTable from 'src/components/UIComponents/Table.vue';

  export default {
    name: 'table-card',
    components: {
      Card,
      LTable,
    },
    props: {
      columns: Array,
      data: {
        type: Array,
        default: () => [],
      },
      height: {
        type: String,
        default: () => 'calc(50vh - 140px)',
      },
    }
  };
</script>
<style>

</style>

<template>
  <table class="table">
    <thead>
      <tr>
        <slot name="columns">
          <th v-for="(column, index) in columns" :key="index" >{{column}}</th>
        </slot>
      </tr>
    </thead>
    <tbody>
    <tr v-for="(item, index) in data" :key="index" @click="onClick(item)" :style="{ cursor: clickable ? 'pointer' : 'auto' }">
      <slot :row="item" v-if="renderHtml">
        <td v-for="(column, index) in columns" :key="index" v-if="hasValue(item, column)" v-html="itemValue(item, column)"></td>
      </slot>
      <slot :row="item" v-else>
        <td v-for="(column, index) in columns" :key="index" v-if="hasValue(item, column)">{{itemValue(item, column)}}</td>
      </slot>
    </tr>
    </tbody>
  </table>
</template>
<script>
  export default {
    name: 'l-table',
    props: {
      columns: Array,
      data: Array,
      onClick: Function,
      clickable: {
        type: Boolean,
        default: () => false,
      },
      renderHtml: {
        type: Boolean,
        default: () => false,
      },
    },
    methods: {
      hasValue(item, column) {
        return item[column.toLowerCase()] !== 'undefined';
      },
      itemValue(item, column) {
        return item[column.toLowerCase()];
      },
    },
  };
</script>
<style>
</style>

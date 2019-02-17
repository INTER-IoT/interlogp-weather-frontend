<template>
  <div class="card">
    <div class="card-header"  >
      <h4 class="card-title">Alerts</h4>
      <p class="card-category">Alerts of {{port.name}} port</p>
    </div>
    <div class="card-body" :style="{ height, overflow: 'auto' }">
      <table class="table table-sm table-fix-sm">
      <thead>
        <tr>
          <slot name="columns">
            <th v-for="(column, index) in columns" :key="index" >{{column}}</th>
          </slot>
          <th>Dismiss</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in alertsData" :key="index">
        <slot :row="item">
          <td v-for="(column, index) in columns" :key="index">{{item[column]}}</td>
        </slot>
        <td style="display:flex; justify-content:space-around">
          <button class="btn btn-sm btn-danger btn-fill" @click="dismiss(item)"><font-awesome-icon icon="times"></font-awesome-icon></button>
        </td>
      </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>
<script>
  /* global base64js */
  import gql from 'graphql-tag';
  import LTable from 'src/components/UIComponents/Table.vue';
  import { renderTime } from 'src/utils/misc';
  
  export default {
    name: 'alerts-card',
    components: {
      LTable,
    },
    props: {
      port: Object,
      alerts: Array,
      height: {
        type: String,
        default: () => 'calc(100vh - 250px)',
      },
    },
    data() {
      return {
        columns: ['id', 'date', 'type', 'station', 'attribute', 'reason'],
      };
    },
    computed: {
      alertsData() {
        return this.alerts ? this.alerts.map(alert => ({
          id: alert.id,
          date: renderTime(new Date(parseInt(alert.date, 10))),
          type: alert.data.type,
          station: alert.data.station,
          attribute: alert.data.attribute,
          reason: alert.data.reason,
        })) : [];
      },
    },
    methods: {
      dismiss(alert) {
        this.$apollo.mutate({
          mutation: gql`mutation{
            processAlert(alertId: ${alert.id}){
              id
            }
          }`,
        });
      }
    },
  };
</script>
<style>
  .table-fix-sm th {
    padding: 0.3rem !important;
    line-height: 1.5 !important;
  }
  .table-fix-sm td {
    padding: 0.3rem !important;
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
  }
  .table-fix-sm tbody tr:nth-of-type(odd) {
    background-color: rgba(0,0,0,.05) !important;
  }
</style>
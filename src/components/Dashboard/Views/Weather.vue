<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3">
          <div class="form-row">
            <div class="form-group">
              <label>Type</label>
              <select class="form-control form-control-sm fix-fc" v-model="selection.type" @change="triggerMyQuery">
                <option value="" selected disabled></option>
                <option v-for="(item, index) in definitions.types" :key="index" :value="item">{{item}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <stats-chart-card />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import StatsChartCard from 'src/components/UIComponents/Cards/StatsChartCard.vue';
  import gql from 'graphql-tag';

  export default {
    components: {
      StatsChartCard,
    },
    props: {
      port: Object,
    },
    data(){
      return {
        definitions: {
          types: ['averageTemperature', 'humidity', 'pressure', 'windSpeed'],
        },
        selection: {
          type: null,
        },
      };
    },
    apollo: {
      statistics: {
        query: gql`query Statistics($port: Int!){
            statistics(portId: $port){
              average
            }
        }`,
        variables() {
          return {
            port: this.port.id,
          };
        },
        update(data) {
          return data.statistics.map(s => {
            const item = JSON.parse(s.average);
            console.log(item[this.selection.type]);
            s.selectedAvg = item[this.selection.type];
            return s;
          });
        },
      },
    },
    methods: {
      triggerMyQuery () {
        this.$apollo.queries.statistics.skip = false;
        this.$apollo.queries.statistics.refetch();
      }
    },
  }
</script>
<style>
  /* For some reason form-control-sm is not working, this fixes it */
  .fix-fc {
    height: calc(1.8125rem + 2px) !important;
    padding: 0.25rem 0.5rem !important;
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
    border-radius: 0.2rem !important;
  }
</style>

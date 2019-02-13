<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3">
          <div class="form-row">
            <div class="form-group">
              <label>Type</label>
              <select class="form-control form-control-sm fix-fc" v-model="selection.type" @change="triggerQuery">
                <option v-for="(item, index) in definitions.type" :key="index" :value="item">{{item}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Period</label>
              <select class="form-control form-control-sm fix-fc" v-model="selection.period" @change="triggerQuery">
                <option v-for="(item, index) in definitions.period" :key="index" :value="item">{{item}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <stats-chart-card :period="this.selection.period" :attribute="this.selection.type" :stats="this.statistics"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import StatsChartCard from 'src/components/UIComponents/Cards/StatsChartCard.vue';
  import gql from 'graphql-tag';

  const formPeriodsMap = {
    '24 hours': null,
    'week': 'daily',
    'month': 'daily',
    'year': 'monthly',
  };

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
          type: ['averageTemperature', 'humidity', 'pressure', 'windSpeed'],
          period: Object.keys(formPeriodsMap),
        },
        selection: {
          type: null,
          period: null,
        },
      };
    },
    apollo: {
      statistics: {
        query: gql`query Statistics($port: Int!, $period: Period!){
            statistics(portId: $port, period: $period, statType: weather){
              day
              month
              year
              average
              stationId
            }
        }`,
        variables() {
          return {
            port: this.port.id,
            period: formPeriodsMap[this.selection.period],
          };
        },
        update(data) {
          return data.statistics.map(s => {
            if(typeof s.average === 'string')
              s.average = JSON.parse(s.average);
            return s;
          });
        },
        skip: true,
      },
    },
    methods: {
      triggerQuery () {
        const empty = Object.keys(this.selection).reduce((empty, key) => empty || this.selection[key] === null, false);
        if(empty) return;
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

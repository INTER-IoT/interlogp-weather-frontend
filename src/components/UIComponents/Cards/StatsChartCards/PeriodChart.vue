<template>
  <stats-chart-card :period="this.period" :attribute="attribute" :stats="this.statistics">
    <template slot="header">
        <h4 class="card-title">
            {{`${period.charAt(0).toUpperCase()}${period.slice(1)}`}} <b>{{`${attribute.charAt(0).toUpperCase()}${attribute.slice(1)}`}}</b> Progression
        </h4>
        <p class="card-category">Displaying key {{type}} stations</p>
    </template>
    <template slot="footer">
        <p></p>
        <select v-model="attribute" @change="triggerQuery">
          <option v-for="(item, index) in attributes" :key="index" :value="item">{{item}}</option>
        </select>
    </template>
  </stats-chart-card>
</template>
<script>
  import StatsChartCard from 'src/components/UIComponents/Cards/StatsChartCards/StatsChartCard.vue';
  import gql from 'graphql-tag';

  const formPeriodsMap = {
    '24 hours': null,
    'week': 'daily',
    'month': 'daily',
    'year': 'monthly',
  };

  export default {
    name: 'period-chart',
    components: {
      StatsChartCard,
    },
    props: {
      port: Object,
      period: String,
      attributes: Array,
      type: String,
    },
    data(){
      return {
        attribute: this.attributes[0],
        lastMeasurements: null,
        statistics: null,
      };
    },
    mounted(){
      this.triggerQuery();
    },
    methods: {
      triggerQuery () {
        if(this.period !== '24 hours') {
          this.$apollo.query({
            query: gql`query Statistics($port: Int!, $period: Period!){
              statistics(portId: $port, period: $period, statType: ${this.type}){
                day
                month
                year
                average
                stationId
              }
            }`,
            variables: {
              port: this.port.id,
              period: formPeriodsMap[this.period],
            },
            update(data) {
              return data.statistics.map(s => {
                if(typeof s.average === 'string')
                  s.average = JSON.parse(s.average);
                return s;
              });
            },
          }).then(result => {
            this.statistics = result.data.statistics.map(s => {
              if(typeof s.average === 'string')
                  s.average = JSON.parse(s.average);
              return s;
            });
          });
        };
        if(this.period === '24 hours') {
          this.$apollo.query({
            query: gql`query{
              ${this.type}Stations(portId: 1){
                id
              }
            }`
          }).then(result => {
            const stations = result.data[`${this.type}Stations`].map(station => station.id);
            const promises = stations.map(station => this.$apollo.query({
              query: gql`query{
                ${this.type}Measurements(${this.type}StationId: ${station}){
                  date
                  ${this.attribute}
                  ${this.type}Station{
                    id
                  }
                }
              }`
            }));
            const queryResults = [];
            promises.reduce((prev, next) => prev.then(result => {
              if(result) queryResults.push(result);
              return next;
            }), Promise.resolve()).then(result => {
              queryResults.push(result);
              this.statistics = queryResults.map(batch => {
                const data = batch.data[`${this.type}Measurements`];
                return data.map(d => ({station: d[`${this.type}Station`].id, date: new Date(parseInt(d.date, 10)), value: d[this.attribute]}));
              });
            });
          });
          return;
        }
        //this.$apollo.queries.statistics.skip = false;
        //this.$apollo.queries.statistics.refetch();
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

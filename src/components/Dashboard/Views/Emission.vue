<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <period-chart :port="port" period="24 hours" :attributes="this.attributes" type="emission"/>
        </div>
        <div class="col-md-6">
          <period-chart :port="port" period="week" :attributes="this.attributes" type="emission"/>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <period-chart :port="port" period="month" :attributes="this.attributes" type="emission"/>
        </div>
        <div class="col-md-6">
          <period-chart :port="port" period="year" :attributes="this.attributes" type="emission"/>
        </div>
      </div>
    </div>
  </div>
  
</template>
<script>
  import PeriodChart from 'src/components/UIComponents/Cards/StatsChartCards/PeriodChart.vue';
  import gql from 'graphql-tag';

  export default {
    components: {
      PeriodChart,
    },
    props: {
      port: Object,
    },
    data(){
      return {
        attributes: ['particles', 'nox', 'so2', 'no2', 'no', 'co'],
      };
    },
  }
</script>
<style>
</style>

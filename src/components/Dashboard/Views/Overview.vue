<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="wi wi-thermometer text-danger"></i>
            </div>
            <div slot="content">
              <!--<p class="card-category">Avg Temperature</p>-->
              <p class="card-category">{{ testValue }}</p>
              <h4 class="card-title">40º C</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Updated now
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-success">
              <i class="wi wi-strong-wind text-success"></i>
            </div>
            <div slot="content">
              <p class="card-category">Avg Wind Speed</p>
              <h4 class="card-title">4.3 m/s</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-calendar-o"></i>Last day
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-danger">
              <i class="wi wi-humidity text-primary"></i>
            </div>
            <div slot="content">
              <p class="card-category">Avg Humidity</p>
              <h4 class="card-title">70 %</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-clock-o"></i>Last day
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-info">
              <i class="wi wi-thermometer-exterior text-primary"></i>
            </div>
            <div slot="content">
              <p class="card-category">Avg Sea Temperature</p>
              <h4 class="card-title">28º C</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Updated now
            </div>
          </stats-card>
        </div>

      </div>
      <div class="row">
        <div class="col-md-8">
          <map-card>
            <template slot="header">
              <h4 class="card-title">Map Example</h4>
              <p class="card-category">Real Time Weather Stations</p>
            </template>
            <template slot="footer">
             <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </template>
          </map-card>
        </div>
        <div class="col-md-4">
          <chart-card :chart-options="pieChart">
            <template slot="header">
              <h4 class="card-title">Weather station status</h4>
              <p class="card-category">Real time performance</p>
            </template>
            <template slot="footer">
              <hr>
              <div class="stats">
                <i class="fa fa-clock-o"></i> Measured 1h ago
              </div>
            </template>
          </chart-card>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <chart-card :chart-options="lineChart">
            <template slot="header">
              <h4 class="card-title">Week Temperature Progression</h4>
              <p class="card-category">Displaying key weather stations</p>
            </template>
            <template slot="footer">
              <hr>
              <div class="stats">
                <i class="fa fa-history"></i> Updated yesterday
              </div>
            </template>
          </chart-card>
        </div>
        <div class="col-md-8">
          <map-card>
            <template slot="header">
              <h4 class="card-title">Map Example</h4>
              <p class="card-category">Real Time Weather Stations</p>
            </template>
            <template slot="footer">
             <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </template>
          </map-card>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <chart-card :chart-options="barChart"> <!--BAR-->
            <template slot="header">
              <h4 class="card-title">2018 Max/Min Humidity</h4>
              <p class="card-category">Measured in ST03</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Min
                <i class="fa fa-circle text-danger"></i> Max
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-check"></i> Updated last month
              </div>
            </template>
          </chart-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue';
  import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue';
  import MapCard from 'src/components/UIComponents/Cards/MapCard.vue';
  import Card from 'src/components/UIComponents/Cards/Card.vue';
  import gql from 'graphql-tag';

  export default {
    components: {
      Card,
      ChartCard,
      StatsCard,
      MapCard,
    },
    apollo: {
      testValue: {
        query: gql`{hello}`,
        update: (data) => data.hello,
      },
    },
    data() {
      return {
        pieChart: {
          data: {
            columns: [
              ['Less than 1 hour', 60],
              ['Less than 1 day', 30],
              ['More than 1 day', 10],
            ],
            type: 'pie',
          },
        },
        lineChart: {
          data: {
            x: 'x',
            columns: [
              ['x', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              ['ST01', 30, 33, 32, 35, 38, 34, 32],
              ['ST02', 28, 30, 29, 31, 33, 28, 27],
            ],
          },
          axis: {
            x: {
              type: 'category',
            },
          },
        },
        barChart: {
          data: {
            x: 'x',
            columns: [
              ['x', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              ['Min', 70, 65, 63, 63, 60, 60],
              ['Max', 85, 83, 80, 82, 78, 75],
            ],
            type: 'bar',
          },
          axis: {
            x: {
              type: 'category',
            },
          },
        },
      };
    },
  };
</script>
<style>

</style>

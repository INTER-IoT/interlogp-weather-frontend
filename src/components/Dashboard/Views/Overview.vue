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
              <p class="card-category">Avg Temperature</p>
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
          <map-card :chart-data="lineChart.data"
                      :chart-options="lineChart.options"
                      :responsive-options="lineChart.responsiveOptions">
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
          <chart-card :chart-data="pieChart.data" chart-type="Pie">
            <template slot="header">
              <h4 class="card-title">Weather station status</h4>
              <p class="card-category">Real time performance</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Updated last hour
                <i class="fa fa-circle text-warning"></i> Updated last day
                <i class="fa fa-circle text-danger"></i> No update in one day
              </div>
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
          <chart-card :chart-data="lineChart.data"
                      :chart-options="lineChart.options"
                      :responsive-options="lineChart.responsiveOptions">
            <template slot="header">
              <h4 class="card-title">Week Temperature Progression</h4>
              <p class="card-category">Displaying key weather stations</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> ST01
                <i class="fa fa-circle text-danger"></i> ST03
                <i class="fa fa-circle text-warning"></i> ST07
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-history"></i> Updated yesterday
              </div>
            </template>
          </chart-card>
        </div>
        <div class="col-md-8">
          <map-card :chart-data="lineChart.data"
                      :chart-options="lineChart.options"
                      :responsive-options="lineChart.responsiveOptions">
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
          <chart-card
            :chart-data="barChart.data"
            :chart-options="barChart.options"
            :chart-responsive-options="barChart.responsiveOptions"
            chart-type="Bar">
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
  import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue'
  import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue'
  import MapCard from 'src/components/UIComponents/Cards/MapCard.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import LTable from 'src/components/UIComponents/Table.vue'
  import Checkbox from 'src/components/UIComponents/Inputs/Checkbox.vue'

  export default {
    components: {
      Checkbox,
      Card,
      LTable,
      ChartCard,
      StatsCard,
      MapCard
    },
    data () {
      return {
        editTooltip: 'Edit Task',
        deleteTooltip: 'Remove',
        pieChart: {
          data: {
            labels: ['60%', '20%', '10%'],
            series: [60, 20, 10]
          }
        },
        lineChart: {
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            series: [
              [30, 33, 32, 35, 38, 34, 32],
              [28, 30, 29, 31, 33, 28, 26],
              [20, 22, 23, 26, 21, 20, 18]
            ]
          },
          options: {
            low: 0,
            high: 45,
            showArea: false,
            height: '245px',
            axisX: {
              showGrid: false
            },
            lineSmooth: true,
            showLine: true,
            showPoint: true,
            fullWidth: true,
            chartPadding: {
              right: 50
            }
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              axisX: {
                labelInterpolationFnc (value) {
                  return value[0]
                }
              }
            }]
          ]
        },
        barChart: {
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun'],
            series: [
              [70, 65, 63, 63, 60, 60],
              [85, 83, 80, 82, 78, 75]
            ]
          },
          options: {
            seriesBarDistance: 10,
            axisX: {
              showGrid: false
            },
            height: '245px'
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc (value) {
                  return value[0]
                }
              }
            }]
          ]
        },
        tableData: {
          data: [
            {title: 'Sign contract for "What are conference organizers afraid of?"', checked: false},
            {title: 'Lines From Great Russian Literature? Or E-mails From My Boss?', checked: true},
            {
              title: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
              checked: true
            },
            {title: 'Create 4 Invisible User Experiences you Never Knew About', checked: false},
            {title: 'Read "Following makes Medium better"', checked: false},
            {title: 'Unfollow 5 enemies from twitter', checked: false}
          ]
        }
      }
    }
  }
</script>
<style>

</style>

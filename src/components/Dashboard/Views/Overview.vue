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
          <map-card :center="mapOptions.center" :zoom="mapOptions.zoom" :options="mapOptions.options" height="50vh">
            <template slot="header">
              <h4 class="card-title">Map Example</h4>
              <p class="card-category">Real Time Weather Stations</p>
            </template>
            <template slot="markers">
              <gmap-cluster>
                <gmap-marker :key="index" v-for="(s, index) in stations" :position="s.position" :icon="s.icon" :label="s.text">
                </gmap-marker>
              </gmap-cluster>
            </template>
            <template slot="footer">
             <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </template>
          </map-card>
        </div>
        <div class="col-md-4">
          <chart-card :chart-options="pieChart" ref="pie">
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
        <div class="col-md-6">
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
        <div class="col-md-6">
          <chart-card :chart-options="barChart"> <!--BAR-->
            <template slot="header">
              <h4 class="card-title">2018 Max/Min Humidity</h4>
              <p class="card-category">Measured in ST03</p>
            </template>
            <template slot="footer">
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
  import FontMarker from 'assets/font-markers';
  import { GrayScale } from 'assets/map-styles';

  export default {
    components: {
      Card,
      ChartCard,
      StatsCard,
      MapCard,
    },
    props: {
      port: Object,
    },
    apollo: {
      stations: {
        query: gql`query LastMeasurementByPort($port: Int!){
          lastMeasurementsByPort(portId: $port){
            date
            weatherStation{
              id
              position{
                lat
                lon
              }
            }
          }
        }`,
        variables() {
          return {
            port: this.port.id,
          };
        },
        update: (data) => {
          const newest = data.lastMeasurementsByPort.map(measurement => new Date(parseInt(measurement.date, 10))).sort((a, b) => b - a)[0];
          console.log(newest);
          return data.lastMeasurementsByPort.map(measurement => {
            /*
            const temperature = Math.floor(measurement.averageTemperature * 10) / 10;
            const maybeUnderZero = temperature < 0 ? 0 : temperature / 40;
            const s = temperature > 40 ? 1 : maybeUnderZero;
            const color = {
              r: s < 0.5 ? 510 * s : 255,
              g: s < 0.5 ? 127 * (1 + 2 * s) : 510 * (1 - s),
              b: s < 0.5 ? 255 * (1 - 2 * s) : 0,
            };
            const toHex = (c) => (`00${Math.floor(c).toString(16)}`).slice(-2).toUpperCase();
            const colorCode = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
            */
            const diff = new Date(null);
            const diffSeconds = (newest - new Date(parseInt(measurement.date, 10))) / 1000;
            let color;
            if (diffSeconds <= 600) color = 'green';
            else if (diffSeconds <= 7200) color = 'blue';
            else color = 'red';
            diff.setSeconds(diffSeconds);
            const station = {};
            station.position = { lat: measurement.weatherStation.position.lat, lng: measurement.weatherStation.position.lon };
            station.icon = new FontMarker('wi-barometer', {
              scale: 1.5, fillOpacity: 1, fillColor: color, strokeColor: 'black', strokeOpacity: 0, strokeWeight: 1,
            });
            station.text = `${diff.toISOString().substr(11, 8)}`;
            station.diffSeconds = diffSeconds;
            return station;
          });
        },
      },
    },
    watch: {
      stations(stations) {
        this.pieChart.data = Object.assign(this.pieChart.data, {
          columns: [
            ['Less than 10 minutes', stations.map(station => station.diffSeconds).reduce((v, s) => v + (s <= 600 ? 1 : 0), 0)],
            ['Less than 2h', stations.map(station => station.diffSeconds).reduce((v, s) => v + ((s > 600 && s <= 7200) ? 1 : 0), 0)],
            ['More than 2h', stations.map(station => station.diffSeconds).reduce((v, s) => v + (s > 7200 ? 1 : 0), 0)],
          ],
          colors: {
            'Less than 10 minutes': 'green',
            'Less than 2h': 'blue',
            'More than 2h': 'red',
          },
        });
      },
    },
    data() {
      return {
        pieChart: {
          data: {
            columns: [
              ['Less than 10 minutes', 60],
              ['Less than 2h', 30],
              ['More than 2h', 10],
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
        mapOptions: {
          center: {
            lat: this.port.position.lat,
            lng: this.port.position.lon,
          },
          zoom: 15,
          options: {
            styles: GrayScale,
            streetViewControl: false,
          },
        },
      };
    },
  };
</script>
<style>

</style>

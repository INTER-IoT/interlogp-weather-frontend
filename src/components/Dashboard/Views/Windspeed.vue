<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8">
          <map-card :center="mapOptions.center" :zoom="mapOptions.zoom" :options="mapOptions.options" height="75vh">
            <template slot="header">
              <h4 class="card-title">Wind Speed</h4>
              <p class="card-category">Real Time Weather Stations</p>
            </template>
            <template slot="markers">
              <gmap-cluster>
                <gmap-marker :key="index" v-for="(s, index) in stations" :position="s.position" :icon="s.icon" :label="s.text" @click="markerClicked(s)">
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
          <map-card :center="mapOptions.center" :zoom="mapOptions.zoom" :options="mapOptions.options">
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
      testValue: {
        query: gql`{hello}`,
        update: (data) => data.hello,
      },
      stations: {
        query: gql`query LastMeasurementsByPort($port: Int!){
          lastMeasurementsByPort(portId: $port){
            windSpeed
            windDirection
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
        update: (data) => data.lastMeasurementsByPort.map(measurement => {
          const windSpeed = Math.round(measurement.windSpeed * 100) / 100;
          const windDirection = Math.round(measurement.windDirection);
          let color;
          if (windSpeed < 10) color = 'blue';
          else if (windSpeed < 20) color = 'orange';
          else color = 'red';
          const station = {};
          station.position = { lat: measurement.weatherStation.position.lat, lng: measurement.weatherStation.position.lon };
          station.icon = new FontMarker('fa-arrow-alt-circle-up', {
            scale: 2, fillOpacity: 1, fillColor: color, strokeColor: 'black', strokeOpacity: 0, strokeWeight: 1, rotation: windDirection,
          });
          station.weatherStationId = measurement.weatherStation.id;
          station.text = `${windSpeed} m/s`;
          return station;
        }),
        variables() {
          return {
            port: this.port.id,
          };
        },
      },
    },
    methods: {
      markerClicked: (marker) => {
        console.log(marker);
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

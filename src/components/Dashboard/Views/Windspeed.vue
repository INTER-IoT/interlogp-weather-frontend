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
                <gmap-marker :key="index" v-for="(s, index) in stations" :position="s.position" :icon="s.icon" :label="s.text" @click="mapClickedStation=s">
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
          <table-card
            :columns="measurementTableColumns"
            :data="this.weatherMeasurements"
            height="75vh">
            <template slot="header">
              <h4 class="card-title">Station Measurement Records</h4>
              <p class="card-category">Select Station in Map</p>
            </template>
            <template slot="footer">
             <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </template>
          </table-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue';
  import MapCard from 'src/components/UIComponents/Cards/MapCard.vue';
  import Card from 'src/components/UIComponents/Cards/Card.vue';
  import TableCard from 'src/components/UIComponents/Cards/TableCard.vue';
  import gql from 'graphql-tag';
  import tinytime from 'tinytime';
  import FontMarker from 'assets/font-markers';
  import { GrayScale } from 'assets/map-styles';
  import { renderTime } from 'src/utils/misc';

  export default {
    components: {
      Card,
      ChartCard,
      MapCard,
      TableCard,
    },
    props: {
      port: Object,
    },
    apollo: {
      stations: {
        query: gql`query lastWeatherMeasurementsByPort($port: Int!){
          lastWeatherMeasurementsByPort(portId: $port){
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
        update: (data) => data.lastWeatherMeasurementsByPort.map(measurement => {
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
      weatherMeasurements: {
        query() {
          return gql`query StationMeasurements($station: Int!){
            weatherMeasurements(weatherStationId: $station){
              date
              windSpeed
              windDirection
            }
          }`;
        },
        update: (data) => data.weatherMeasurements.map(measurement => {
          const date = new Date(parseInt(measurement.date, 10));
          return {
            date,
            dateString: renderTime(date),
            windSpeed: `${Math.round(100 * measurement.windSpeed) / 100} ms`,
            windDirection: `${Math.round(measurement.windDirection)}º`,
          };
        }).sort((a, b) => b.date - a.date)
          .map(measurement => ({
            date: measurement.dateString,
            speed: measurement.windSpeed,
            direction: measurement.windDirection,
          })),
        variables() {
          return {
            station: this.mapClickedStation.weatherStationId,
          };
        },
        skip() {
          return this.mapClickedStation === null;
        },
      },
    },
    data() {
      return {
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
        mapClickedStation: null,
        measurementTableColumns: ['Date', 'Direction', 'Speed'],
      };
    },
  };
</script>
<style>

</style>

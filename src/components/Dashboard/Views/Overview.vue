<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-9">
          <map-card :center="mapOptions.center" :zoom="mapOptions.zoom" :options="mapOptions.options" height="50vh">
            <template slot="header">
              <h4 class="card-title">Port Stations</h4>
              <p class="card-category">Real Time Environmental Stations</p>
            </template>
            <template slot="markers">
              <gmap-cluster>
                <gmap-marker :key="index" v-for="(s, index) in stations" :position="s.position" :icon="s.icon" :label="s.name" @click="mapClickedStation=s">
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
        <div class="col-md-3">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Station Info</h4>
            </div>
            <div class="card-body" v-if="mapClickedStation !== null">
              <div class="row mb-3 ml-1">
                <span class="mr-2" style="font-weight: bold">ID:</span>
                <span>{{mapClickedStation.id}}</span>
              </div>
              <div class="row mb-3 ml-1">
                <span class="mr-2" style="font-weight: bold">Type:</span>
                <span>{{mapClickedStation.type}}</span>
              </div>
              <div class="row mb-3 ml-1">
                <span class="mr-2" style="font-weight: bold">Name:</span>
                <span>{{mapClickedStation.name}}</span>
              </div>
              <div class="row mb-3 ml-1">
                <span class="mr-2" style="font-weight: bold">Position:</span>
                <span>{{mapClickedStation.realposition.lat}}, {{mapClickedStation.realposition.lng}}</span>
              </div>
              <div class="row mb-3 ml-1">
                <span class="mr-2" style="font-weight: bold">Status:</span>
                <span v-if="mapClickedStation.active" style="color: green;">active</span>
                <span v-else style="color: red;">inactive</span>
              </div>
              <div class="row mb-3 ml-1">
                <span class="mr-2" style="font-weight: bold">Alerts:</span>
                <span><a href="javascript:void(0)">5</a></span>
              </div>
            </div>
            <div class="card-body" v-else>
              <span style="color: #7b7b7b">Please select station in the map</span>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <intermw-messages-card :port=port>
            <template slot="header">
              <h4 class="card-title">INTERMW Message Inspector</h4>
              <p class="card-category">Real Time INTERMW messages received</p>
            </template>
            <template slot="footer">
             <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </template>
          </intermw-messages-card>
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
  import IntermwMessagesCard from 'src/components/UIComponents/Cards/IntermwMessagesCard.vue';
  import gql from 'graphql-tag';
  import FontMarker from 'assets/font-markers';
  import { GrayScale } from 'assets/map-styles';
  import { destinationPoint } from 'src/utils/misc';

  export default {
    components: {
      Card,
      ChartCard,
      StatsCard,
      MapCard,
      IntermwMessagesCard,
    },
    props: {
      port: Object,
    },
    apollo: {
      stations: {
        query: gql`query EnvironmentalStations($port: Int!){
            weatherStations(portId: $port){
              id
              name
              position{
                lat
                lon
              }
            }
            emissionStations(portId: $port){
              id
              name
              position{
                lat
                lon
              }
            }
            soundStations(portId: $port){
              id
              name
              position{
                lat
                lon
              }
            }
        }`,
        variables() {
          return {
            port: this.port.id,
          };
        },
        update: (data) => {
          const mapper = (icon, type) => (station) => ({
            id: station.id,
            active: true, // TODO: PROVISIONAL
            name: station.name,
            realposition: { lat: station.position.lat, lng: station.position.lon },
            position: { lat: station.position.lat, lng: station.position.lon },
            icon,
            type,
          });

          const weatherStations = data.weatherStations.map(mapper(
            new FontMarker('fa-tachometer-alt', {
              scale: 1, fillOpacity: 1, fillColor: '#0074D9', rotation: 180,
            }),
            'weather',
          ));

          const emissionStations = data.emissionStations.map(mapper(
            new FontMarker('fa-skull', {
              scale: 1, fillOpacity: 1, fillColor: '#FF4136', rotation: 180,
            }),
            'emission',
          ));

          const soundStations = data.soundStations.map(mapper(
            new FontMarker('fa-bullhorn', {
              scale: 1, fillOpacity: 1, fillColor: '#3D9970', rotation: 180,
            }),
            'sound',
          ));

          const stations = [...weatherStations, ...emissionStations, ...soundStations];

          const conflicting = {};
          stations.forEach(a => {
            stations.filter(b => (a.type !== b.type)).forEach(b => {
              if (a.position.lat === b.position.lat && a.position.lng === b.position.lng) {
                const key = `${a.position.lat}${a.position.lng}`;
                if (!conflicting[key]) {
                  conflicting[key] = [a, b];
                } else {
                  if (!conflicting[key].find(c => c.name === a.name)) conflicting[key].push(a);
                  if (!conflicting[key].find(c => c.name === b.name)) conflicting[key].push(b);
                }
              }
            });
          });

          Object.keys(conflicting).forEach(key => {
            const l = conflicting[key].length;
            const q = 360 / l;
            conflicting[key].sort((a, b) => a.name < b.name);
            conflicting[key].forEach((station, i) => {
              [station.position.lat, station.position.lng] = destinationPoint(station.position.lat, station.position.lng, 30 * l, i * q);
            });
          });

          return stations;
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
        mapClickedStation: null,
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

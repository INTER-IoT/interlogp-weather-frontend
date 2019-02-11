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
              <gmap-cluster :maxZoom=13>
                <gmap-marker :key="index" v-for="(s, index) in stations" :position="s.position" :icon="s.icon" :label="s.name" @click="mapStationClicked(s)">
                </gmap-marker>
              </gmap-cluster>
            </template>
            <template slot="footer">
             <update-timer ref="stationsMapTimer" />
            </template>
          </map-card>
        </div>
        <div class="col-md-3">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Station Info</h4>
            </div>
            <div class="card-body mr-3" v-if="mapClickedStation !== null">
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
                <span><a href="javascript:void(0)">0</a></span>
              </div>
              <div class="row mb-3 ml-1">
                <span class="mr-2" style="font-weight: bold">Last Measurement:</span>
                <highlight-code lang="json" v-if="mapClickedStation.lastMeasurement">{{mapClickedStation.lastMeasurement}}</highlight-code>
                <span style="color: #7b7b7b" v-else>No records found</span>
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
  import UpdateTimer from 'src/components/UIComponents/UpdateTimer.vue';

  import gql from 'graphql-tag';
  import FontMarker from 'assets/font-markers';
  import { GrayScale } from 'assets/map-styles';
  import { destinationPoint, renderTime } from 'src/utils/misc';

  export default {
    components: {
      Card,
      ChartCard,
      StatsCard,
      MapCard,
      IntermwMessagesCard,
      UpdateTimer,
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
            noatumWeatherStations(portId: $port){
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
        update(data) {
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
              scale: 1, fillOpacity: 1, fillColor: '#3D9970', rotation: 180,
            }),
            'emission',
          ));

          const soundStations = data.soundStations.map(mapper(
            new FontMarker('fa-bullhorn', {
              scale: 1, fillOpacity: 1, fillColor: '#FF851B', rotation: 180,
            }),
            'sound',
          ));

          const noatumWeatherStations = data.noatumWeatherStations.map(mapper(
            new FontMarker('fa-flag', {
              scale: 1, fillOpacity: 1, fillColor: '#e0da2f', rotation: 180,
            }),
            'noatumWeather',
          ));

          const stations = [...weatherStations, ...emissionStations, ...soundStations, ...noatumWeatherStations];

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

          if (this.$refs.stationsMapTimer) this.$refs.stationsMapTimer.reset();

          return stations;
        },
      },
      measurements: {
        query: gql`
          query LastMeasurements($port: Int!){
            lastWeatherMeasurementsByPort(portId: $port){
              date
              windSpeed
              windDirection
              precipitation
              solarRadiation
              pressure
              humidity
              seaTemperature
              averageTemperature
              weatherStation{
                id
              }
            }
            lastEmissionMeasurementsByPort(portId: $port){
              date
              particles
              nox
              so2
              no2
              no
              co
              emissionStation{
                id
              }
            }
            lastSoundMeasurementsByPort(portId: $port){
              date
              start
              end
              maxLevel
              minLevel
              avgLevel
              soundStation{
                id
              }
            }
            lastNoatumWeatherMeasurementsByPort(portId: $port){
              date
              windSpeed
              noatumWeatherStation{
                id
              }
            }
          }
        `,
        variables() {
          return {
            port: this.port.id,
          };
        },
        update(data) {
          const measurements = {};
          ['Weather', 'Emission', 'Sound', 'NoatumWeather'].forEach(type => {
            measurements[type.toLowerCase()] = data[`last${type}MeasurementsByPort`].map(measurement => {
              const copy = { measurement: Object.assign({}, measurement) };
              copy.station = measurement[`${type.charAt(0).toLowerCase()}${type.slice(1)}Station`].id;
              delete copy.measurement[`${type.charAt(0).toLowerCase()}${type.slice(1)}Station`];
              copy.measurement.date = renderTime(new Date(parseInt(copy.measurement.date, 10)));
              if (type === 'Sound') {
                copy.measurement.start = renderTime(new Date(parseInt(copy.measurement.start, 10)));
                copy.measurement.end = renderTime(new Date(parseInt(copy.measurement.end, 10)));
              }
              return copy;
            });
          });

          if (this.$refs.stationsMapTimer) this.$refs.stationsMapTimer.reset();

          return measurements;
        },
        subscribeToMore: [
          {
            document: gql`subscription NewWeatherMeasurements($port: Int!){
              newWeatherMeasurement(portId: $port){
                date
                windSpeed
                windDirection
                precipitation
                solarRadiation
                pressure
                humidity
                seaTemperature
                averageTemperature
                weatherStation{
                  id
                }
              }
            }`,
            variables() {
              return {
                port: this.port.id,
              };
            },
            updateQuery: (previousResult, { subscriptionData }) => {
              const idx = previousResult.lastWeatherMeasurementsByPort
                .findIndex(measurement => measurement.weatherStation.id === subscriptionData.data.newWeatherMeasurement.weatherStation.id);
              const copy = Object.assign({}, previousResult);
              copy.lastWeatherMeasurementsByPort = [...previousResult.lastWeatherMeasurementsByPort];
              if (idx >= 0) {
                copy.lastWeatherMeasurementsByPort[idx] = subscriptionData.data.newWeatherMeasurement;
              } else {
                copy.lastWeatherMeasurementsByPort = [...copy.lastWeatherMeasurementsByPort, subscriptionData.data.newWeatherMeasurement];
              }
              return copy;
            },
          },
          {
            document: gql`subscription NewSoundMeasurements($port: Int!){
              newSoundMeasurement(portId: $port){
                date
                start
                end
                maxLevel
                minLevel
                avgLevel
                soundStation{
                  id
                }
              }
            }`,
            variables() {
              return {
                port: this.port.id,
              };
            },
            updateQuery: (previousResult, { subscriptionData }) => {
              const idx = previousResult.lastSoundMeasurementsByPort
                .findIndex(measurement => measurement.soundStation.id === subscriptionData.data.newSoundMeasurement.soundStation.id);
              const copy = Object.assign({}, previousResult);
              copy.lastSoundMeasurementsByPort = [...previousResult.lastSoundMeasurementsByPort];
              if (idx >= 0) {
                copy.lastSoundMeasurementsByPort[idx] = subscriptionData.data.newSoundMeasurement;
              } else {
                copy.lastSoundMeasurementsByPort = [...copy.lastSoundMeasurementsByPort, subscriptionData.data.newSoundMeasurement];
              }
              return copy;
            },
          },
          {
            document: gql`subscription NewEmissionMeasurements($port: Int!){
              newEmissionMeasurement(portId: $port){
                date
                particles
                nox
                so2
                no2
                no
                co
                emissionStation{
                  id
                }
              }
            }`,
            variables() {
              return {
                port: this.port.id,
              };
            },
            updateQuery: (previousResult, { subscriptionData }) => {
              const idx = previousResult.lastEmissionMeasurementsByPort
                .findIndex(measurement => measurement.emissionStation.id === subscriptionData.data.newEmissionMeasurement.emissionStation.id);
              const copy = Object.assign({}, previousResult);
              copy.lastEmissionMeasurementsByPort = [...previousResult.lastEmissionMeasurementsByPort];
              if (idx >= 0) {
                copy.lastEmissionMeasurementsByPort[idx] = subscriptionData.data.newEmissionMeasurement;
              } else {
                copy.lastEmissionMeasurementsByPort = [...copy.lastEmissionMeasurementsByPort, subscriptionData.data.newEmissionMeasurement];
              }
              return copy;
            },
          },
          {
            document: gql`subscription NewNoatumWeatherMeasurements($port: Int!){
              newNoatumWeatherMeasurement(portId: $port){
                date
                windSpeed
                noatumWeatherStation{
                  id
                }
              }
            }`,
            variables() {
              return {
                port: this.port.id,
              };
            },
            updateQuery: (previousResult, { subscriptionData }) => {
              const idx = previousResult.lastNoatumWeatherMeasurementsByPort
                .findIndex(measurement => measurement.noatumWeatherStation.id === subscriptionData.data.newNoatumWeatherMeasurement.noatumWeatherStation.id);
              const copy = Object.assign({}, previousResult);
              copy.lastNoatumWeatherMeasurementsByPort = [...previousResult.lastNoatumWeatherMeasurementsByPort];
              if (idx >= 0) {
                copy.lastNoatumWeatherMeasurementsByPort[idx] = subscriptionData.data.newNoatumWeatherMeasurement;
              } else {
                copy.lastNoatumWeatherMeasurementsByPort = [...copy.lastNoatumWeatherMeasurementsByPort, subscriptionData.data.newNoatumWeatherMeasurement];
              }
              return copy;
            },
          },
        ],
      },
    },
    data() {
      return {
        mapClickedStation: null,
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
    watch: {
      measurements() {
        if (this.mapClickedStation) {
          const station = this.mapClickedStation;
          this.mapClickedStation = null;
          this.mapStationClicked(station);
        }
      },
    },
    methods: {
      mapStationClicked(station) {
        this.mapClickedStation = station;
        let lastMeasurement = this.measurements[station.type.toLowerCase()]
          .find(measurement => measurement.station === station.id);
        if (lastMeasurement) {
          lastMeasurement = Object.assign({}, lastMeasurement.measurement);
          delete lastMeasurement.__typename; // eslint-disable-line no-underscore-dangle
          this.mapClickedStation.lastMeasurement = JSON.stringify(lastMeasurement, null, 4);
        }
      },
    },
  };
</script>
<style>

</style>

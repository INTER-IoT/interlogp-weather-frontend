<template>
  <div class="card">
    <div class="card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <div class="row" v-if="data">
        <div class="col-md-4" :style="{ 'overflow': 'auto', height: height }">
          <l-table class="table-hover table-stripped"
            :columns="columns"
            :data="data.intermwMessages"
            :onClick="showMessage">
          </l-table>
        </div>
        <div class="col-md-8" :style="{ 'overflow': 'auto', height: height }">
          <highlight-code lang="json" v-if="message">{{message}}</highlight-code>
          <span v-else style="color: #7b7b7b">Please select message to inspect</span>
        </div>
      </div>
    </div>
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
  /* global base64js */
  import gql from 'graphql-tag';
  import LTable from 'src/components/UIComponents/Table.vue';
  import { renderTime } from 'src/utils/misc';
  import Card from './Card.vue';
  
  
  export default {
    name: 'intermw-messages-card',
    components: {
      Card,
      LTable,
    },
    props: {
      port: Object,
      height: {
        type: String,
        default: () => 'calc(50vh - 140px)',
      },
    },
    data() {
      return {
        columns: ['date', 'type', 'station'],
        message: null,
      };
    },
    methods: {
      showMessage(item) {
        const byteArrayMessage = base64js.toByteArray(item.content);
        const message = String.fromCharCode.apply(null, byteArrayMessage);
        // apply indentation
        this.message = JSON.stringify(JSON.parse(message), null, 4);
      },
    },
    apollo: {
      data: {
        query: gql`query EnvironmentalStations($port: Int!){
          intermwMessages(portId: $port){
            date
            content
            weatherStation{
              id
              port{
                id
              }
            }
            emissionStation{
              id
              port{
                id
              }
            }
            soundStation{
              id
              port{
                id
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
          const intermwMessages = data.intermwMessages.map(message => {
            const props = {
              date: renderTime(new Date(parseInt(message.date, 10))),
            };

            if (message.weatherStation) props.type = 'weather';
            if (message.soundStation) props.type = 'sound';
            if (message.emissionStation) props.type = 'emission';

            props.station = message[`${props.type}Station`].id;

            return Object.assign({}, message, props);
          });
          return { intermwMessages };
        },
      },
    },
  };
</script>

<template>
  <div class="card">
    <div class="card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="card-body" >
      <div class="row" v-if="data" :style="{ height }">
        <div class="col-md-4" style="overflow: auto">
          <l-table class="table-hover table-stripped"
            :clickable=true
            :renderHtml=true
            :columns="columns"
            :data="data.intermwMessages"
            :onClick="showMessage">
          </l-table>
        </div>
        <div class="col-md-8 pr-4">
          <div class="row" style="height: 30px;" v-if="message">
            <div class="col-md-12">
              <span style="font-weight: bold;">Date: </span>
              <span class="mr-3">{{message.item.date}}</span>
              <span style="font-weight: bold;">Type: </span>
              <span class="mr-3">{{message.item.type}}</span>
              <span style="font-weight: bold;">Station: </span>
              <span class="mr-3">{{message.item.station}}</span>
              <span style="font-weight: bold;">Sender: </span>
              <span>{{message.item.sentBy}}</span>
            </div>
          </div>
          <div class="row" :style="{ height: `calc(${height} - 30px)` }">
            <div class="col-md-12" style="overflow: auto">
              <highlight-code lang="json" v-if="message">{{message.content}}</highlight-code>
              <span v-else style="color: #7b7b7b">Please select message to inspect</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <update-timer ref="intermwTimer"/>
    </div>
  </div>
</template>
<script>
  /* global base64js */
  import gql from 'graphql-tag';
  import LTable from 'src/components/UIComponents/Table.vue';
  import UpdateTimer from 'src/components/UIComponents/UpdateTimer.vue';
  import { renderTime } from 'src/utils/misc';
  import Card from './Card.vue';
  
  
  export default {
    name: 'intermw-messages-card',
    components: {
      Card,
      LTable,
      UpdateTimer,
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
        lastTimestamp: null,
      };
    },
    methods: {
      showMessage(item) {
        if (item.isNew) item.date = item.raw.dateString;
        const byteArrayMessage = base64js.toByteArray(item.content);
        const message = String.fromCharCode.apply(null, byteArrayMessage);
        if (item.sentBy.startsWith('::ffff:')) item.sentBy = item.sentBy.substr(7);
        // apply indentation
        this.message = {
          content: JSON.stringify(JSON.parse(message), null, 4),
          item,
        };
      },
      updateLastTimestamp(timestamp) {
        this.lastTimestamp = timestamp;
        this.data.intermwMessages
          .filter(msg => msg.isNew && msg.raw.date <= timestamp)
          .forEach(msg => {
            msg.date = msg.raw.dateString;
          });
      },
    },
    apollo: {
      data: {
        query: gql`query IntermwMessages($port: Int!){
          intermwMessages(portId: $port){
            date
            sentBy
            content
            weatherStation{
              id
            }
            emissionStation{
              id
            }
            soundStation{
              id
            }
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
        update(data) {
          const intermwMessages = data.intermwMessages.map(message => {
            const props = {
              raw: {
                date: parseInt(message.date, 10),
                dateString: renderTime(new Date(parseInt(message.date, 10))),
              },
            };

            if (message.weatherStation) props.type = 'weather';
            if (message.soundStation) props.type = 'sound';
            if (message.emissionStation) props.type = 'emission';
            if (message.noatumWeatherStation) props.type = 'noatumWeather';

            props.station = message[`${props.type}Station`].id;

            if (this.lastTimestamp !== null && props.raw.date > this.lastTimestamp) {
              props.isNew = true;
              props.date = `<span class="badge badge-warning">New</span><span>${props.raw.dateString}</span>`;
              setTimeout(this.updateLastTimestamp, 20000, props.raw.date);
            } else {
              props.isNew = false;
              props.date = props.raw.dateString;
            }

            return Object.assign({}, message, props);
          });

          intermwMessages.sort((a, b) => b.raw.date - a.raw.date);

          if (this.lastTimestamp === null && intermwMessages.length > 0) {
            this.lastTimestamp = intermwMessages[0].raw.date;
          }

          if (this.$refs.intermwTimer) this.$refs.intermwTimer.reset();

          return { intermwMessages };
        },
        subscribeToMore: {
          document: gql`subscription IntermwMessages($port: Int!){
            newIntermwMessage(portId: $port){
              date
              content
              sentBy
              weatherStation{
                id
              }
              emissionStation{
                id
              }
              soundStation{
                id
              }
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
          updateQuery: (previousResult, { subscriptionData }) => ({
            intermwMessages: [...previousResult.intermwMessages, subscriptionData.data.newIntermwMessage],
          }),
        },
      },
    },
  };
</script>

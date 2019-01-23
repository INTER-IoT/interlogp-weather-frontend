<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content" :alerts="port && alerts ? alerts[port.id] : []"></mobile-menu>
      <sidebar-link v-for="port in ports" :key="port.id" :to="port.link">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>{{port.name}}</p>
        
        <div v-if="alerts && alerts[port.id]" style="display: inline-block; margin-left:20px">
          <p><font-awesome-icon icon="exclamation-triangle"></font-awesome-icon></p>
          <p>{{alerts[port.id].length}}</p>
        </div>
      </sidebar-link>
    </side-bar>
    <div class="main-panel">
      <top-navbar :alerts="port && alerts ? alerts[port.id] : []"></top-navbar>

      <dashboard-content @click="toggleSidebar" :port="port" v-if="port !== undefined">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import gql from 'graphql-tag';
  import TopNavbar from './TopNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import DashboardContent from './Content.vue';
  import MobileMenu from './MobileMenu.vue';

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu,
    },
    apollo: {
      ports: {
        query: gql`{
          ports{
            id
            name
            position{
              lat
              lon
            }
          }
        }`,
        update: (data) => {
          const ports = JSON.parse(JSON.stringify(data.ports)); // apollo does not allow to modify query results ?????????
          return ports.map(port => {
            port.link = `/ports/${port.id}`;
            return port;
          });
        },
      },
      alerts: {
        query: gql`query alerts{
          alerts(processed: false){
            date
            title
            text
            id
            port{
              id
            }
          }
        }`,
        update: (data) => {
          return data.alerts.reduce((agg, alert) => {
            if (!agg[alert.port.id]) agg[alert.port.id] = [];
            agg[alert.port.id].push(alert);
            return agg;
          }, []);
        },
        subscribeToMore: [
          {
            document: gql`subscription alerts{
              newAlert{
                date
                title
                text
                id
                port{
                  id
                }
              }
            }`,
            updateQuery: (previousResult, { subscriptionData }) => ({
              alerts: [...previousResult.alerts, subscriptionData.data.newAlert],
            }),
          },
          {
            document: gql`subscription processedalert{
              processedAlert{
                id
                port{
                  id
                }
              }
            }`,
            updateQuery: ({ alerts }, { subscriptionData: { data: { processedAlert } } }) => {
              const idx = alerts.findIndex(alert => alert.id === processedAlert.id);
              alerts.splice(idx, 1);
              return { alerts };
            }
          },
        ],
      },
    },
    methods: {
      toggleSidebar: () => {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
    },
    data() {
      return {
        ports: [],
        port: undefined,
      };
    },
    watch: {
      ports(ports) {
        const id = parseInt(this.$route.params.id, 10);
        this.port = ports.find(port => port.id === id);
      },
      '$route.params.id': function routeChanged(portId) {
        const id = parseInt(portId, 10);
        this.port = this.ports.find(port => port.id === id);
      },
    },
  };
</script>

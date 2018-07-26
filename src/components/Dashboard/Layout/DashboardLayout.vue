<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link v-for="port in ports" :key="port.id" :to="port.link">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>{{port.name}}</p>
      </sidebar-link>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

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

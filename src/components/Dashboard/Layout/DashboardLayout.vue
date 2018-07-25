<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link v-for="port in ports" :key="port.id" :to="port.overviewLink">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>{{port.name}}</p>
      </sidebar-link>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import DashboardContent from './Content.vue';
  import MobileMenu from './MobileMenu.vue';
  import gql from 'graphql-tag';

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
            port.overviewLink = `/ports/${port.id}/overview`;
            return port;
          });
        },
      }
    },
    methods: {
      toggleSidebar: () => {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
    },
  };
</script>

<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <!--<a class="navbar-brand" href="#">{{ routeName }}</a>-->
      <span class="navbar-brand">{{ routeName }}</span>
      <button type="button"
              class="navbar-toggler navbar-toggler-right"
              :class="{toggled: $sidebar.showSidebar}"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
              @click="toggleSidebar">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">
        <ul class="nav navbar-nav mr-auto">
          <drop-down title="Views">
            <a class="dropdown-item" v-for="viewLink in viewLinks" :key="viewLink.link" :href="viewLink.link">{{ viewLink.name }}</a>
            <!--<div class="divider"></div>-->
          </drop-down>
          <drop-down tag="li">
            <template slot="title">
              <i class="fa fa-exclamation-triangle" style="line-height: 1"></i>
              <b class="caret"></b>
              <span class="notification">{{alerts ? alerts.length : 0}}</span>
            </template>
            <a class="dropdown-item" href="#">Notification 1</a>
            <a class="dropdown-item" href="#">Notification 2</a>
            <a class="dropdown-item" href="#">Notification 3</a>
            <a class="dropdown-item" href="#">Notification 4</a>
            <a class="dropdown-item" href="#">Another notification</a>
          </drop-down>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link" href="#">
              Account
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              Log out
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
  import gql from 'graphql-tag';

  export default {
    computed: {
      routeName() {
        const { name } = this.$route;
        return this.capitalizeFirstLetter(name);
      },
      viewLinks() {
        const { id } = this.$route.params;
        return this.$router.options.routes
          .find(route => route.path === '/ports/:id')
          .children.map(viewRoute => ({
            name: viewRoute.name,
            link: `#/ports/${id}/${viewRoute.path}`,
          }));
      },
    },
    data() {
      return {
        activeNotifications: false,
      };
    },
    apollo: {
      alerts: {
        query: gql`query alerts($port: Int!){
          alerts(portId: $port, processed: false){
            date
            text
            id
          }
        }`,
        variables() {
          return {
            port: parseInt(this.$route.params.id, 10),
          };
        },
        subscribeToMore: {
          document: gql`subscription alerts{
            newAlert(portId: 1){
              date
              text
              id
            }
          }`,
          variables() {
            return {
              port: parseInt(this.$route.params.id, 10),
            };
          },
          updateQuery: (previousResult, { subscriptionData }) => ({
            alerts: [...previousResult.alerts, subscriptionData.data.newAlert],
          }),
        },
      },
    },
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications;
      },
      closeDropDown() {
        this.activeNotifications = false;
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
    },
  };
</script>
<style>

</style>

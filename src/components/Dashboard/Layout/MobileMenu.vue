<template>
  <ul class="nav nav-mobile-menu">
    <drop-down>
      <template slot="title">
        <i class="fa fa-globe"></i>
        <b class="caret"></b>
        <span class="notification">{{alerts ? alerts.length : 0}} Notifications</span>
      </template>
      <a v-if="alerts" v-for="alert in alerts.slice(0, maxNotifications)" :key="alert.id" class="dropdown-item" href="#">{{alert.title}}</a>
      <a v-if="alerts.length > maxNotifications" class="dropdown-item" href="#">{{alerts.length - maxNotifications}} more notification{{alerts.length - maxNotifications === 1 ? '' : 's'}}</a>
    </drop-down>
    <drop-down title="Views">
      <a class="dropdown-item" v-for="viewLink in viewLinks" :key="viewLink.link" :href="viewLink.link">{{ viewLink.name }}</a>
    </drop-down>
    <li class="nav-item">
      <a href="#" class="nav-link">
        <i class="nc-icon nc-circle-09 hidden-lg-up"></i>
        <span class="d-lg-none">Account</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#pablo">
        <span class="no-icon">Log out</span>
      </a>
    </li>
  </ul>
</template>
<script>
  import DropDown from 'src/components/UIComponents/Dropdown.vue';

  export default {
    components: {
      DropDown,
    },
    props: {
      alerts: {
        type: Array,
        default: () => ([]),
      }
    },
    data() {
      return {
        maxNotifications: 5,
      };
    },
    computed: {
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
  };
</script>
<style>
</style>

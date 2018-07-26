<template>
  <ul class="nav nav-mobile-menu">
    <drop-down>
      <template slot="title">
        <i class="fa fa-globe"></i>
        <b class="caret"></b>
        <span class="notification">5 Notifications</span>
      </template>
      <a class="dropdown-item" href="#">Notification 1</a>
      <a class="dropdown-item" href="#">Notification 2</a>
      <a class="dropdown-item" href="#">Notification 3</a>
      <a class="dropdown-item" href="#">Notification 4</a>
      <a class="dropdown-item" href="#">Another notification</a>
    </drop-down>
    <drop-down title="Views">
      <a class="dropdown-item" :href="viewLinks.overview" @click="$sidebar.displaySidebar(false)">Overview</a>
      <a class="dropdown-item" :href="viewLinks.windspeed" @click="$sidebar.displaySidebar(false)">WindSpeed</a>
      <a class="dropdown-item" href="#">Something</a>
      <a class="dropdown-item" href="#">Another action</a>
      <a class="dropdown-item" href="#">Something</a>
      <div class="divider"></div>
      <a class="dropdown-item" :href="viewLinks.rawdata" @click="$sidebar.displaySidebar(false)">Raw Data</a>
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
    computed: {
      viewLinks() {
        const { id } = this.$route.params;
        return [
          'overview',
          'windspeed',
          'rawdata',
        ].reduce((links, view) => {
          links[view] = `#/ports/${id}/${view}`;
          return links;
        }, {});
      },
    },
  };
</script>
<style>
</style>

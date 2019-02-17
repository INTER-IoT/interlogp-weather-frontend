<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <rules-card :port="port" />
        </div>
        <div class="col-md-6">
          <alerts-card :port="port" :alerts="alerts"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import RulesCard from 'src/components/UIComponents/Cards/RulesCard/Rules.vue'
  import AlertsCard from 'src/components/UIComponents/Cards/AlertsCard/AlertsCard.vue'
  export default {
    components: {
      RulesCard,
      AlertsCard,
    },
    props: {
      port: Object,
      alerts: Array,
    },
  };
</script>
<style>

</style>

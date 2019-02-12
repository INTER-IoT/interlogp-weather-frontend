<template>
  <chart-card :chart-options="lineChart" height="25vh">
    <template slot="header">
      <h4 class="card-title">Week Temperature Progression</h4>
      <p class="card-category">Displaying key weather stations</p>
    </template>
    <template slot="footer">
      <hr>
      <div class="stats">
        <i class="fa fa-history"></i> Updated yesterday
      </div>
    </template>
  </chart-card>
</template>
<script>
  import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue';

  export default {
    name: 'stats-chart-card',
    components: {
      ChartCard,
    },
    data(){
      return {
        lineChart: {
        data: {
          x: 'x',
          columns: [
            ['x', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            ['ST01', 30, 33, 32, 35, 38, 34, 32],
            ['ST02', 28, 30, 29, 31, 33, 28, 27],
          ],
        },
        axis: {
          x: {
            type: 'category',
          },
        },
      },
      }
    }
  }
</script>
<style>

</style>

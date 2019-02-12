<template>
  <chart-card :chart-options="lineChart" height="25vh" v-if="this.stats !== null && this.period !== null && this.attribute !== null">
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

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthdays = (year, month) => (new Date(year, month, 0)).getDate();
  const rangeIncl = (s, e)=>[...Array(e - s + 1).keys()].map(i => i + s);
  const randInts = (min, max, len) => {
    const arr = [];
    for(let i = 0; i < len; i++) arr[i] = Math.random() * (max - min) + min;
    return arr;
  }

  export default {
    name: 'stats-chart-card',
    components: {
      ChartCard,
    },
    props: {
      stats: {
        type: Array,
        default: () => null,
      },
      period: {
        type: String,
        default: () => null,
      },
      attribute: {
        type: String,
        default: () => null,
      },
    },
    computed: {
      lineChart(){
        const chart = {
          data: {
            x: 'x',
            columns: [],
          },
          axis: {
            x: {
              type: 'category',
            },
          },
          line: {
            connectNull: true,
          }
        };
        const today = new Date();
        switch(this.period) {
          case '24 hours': {
            chart.data.columns.push(['x', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00']);
            break;
          }
          case 'week': {
            const d = today.getDay();
            chart.data.columns.push(['x', ...days.slice(d), ...days.slice(0, d)]);
            break;
          }
          case 'month': {
            const d = today.getDate();
            let prevMonth = today.getMonth(); // month -1 + 1, 0 index
            if(prevMonth < 1) prevMonth = 12;
            let prevYear = today.getFullYear();
            if (prevMonth === 12) prevYear -= 1;
            const prevMonthDays = monthdays(prevYear, prevMonth);
            let first = d;
            if(first > prevMonthDays) first = prevMonthDays;
            const last = d - 1;
            chart.data.columns.push(['x', ...rangeIncl(first, prevMonthDays), ...rangeIncl(1, last)]);
            break;
          }
          case 'year': {
            const m = today.getMonth();
            chart.data.columns.push(['x', ...months.slice(m), ...months.slice(0, m)]);
            break;
          }
        }
        const some2null = array => {
          for(let i = 0; i < array.length; i++) {
            if(Math.random() < 0.3) {
              array[i] = null;
            }
          }
          return array;
        };
        chart.data.columns.push(['ST01', ...some2null(randInts(25, 30, chart.data.columns[0].length - 1))]);
        chart.data.columns.push(['ST02', ...some2null(randInts(25, 30, chart.data.columns[0].length - 1))]);
        return chart;
      },
    }
  }
</script>
<style>

</style>

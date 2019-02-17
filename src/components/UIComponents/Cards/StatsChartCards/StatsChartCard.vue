<template>
  <div v-if="this.stats !== null && this.period !== null && this.attribute !== null">
    <chart-card :chart-options="categoryChart" height="25vh" v-if="this.period !== '24 hours'">
      <template slot="header" v-if="$slots.header">
        <slot name="header"></slot>
      </template>
      <template slot="footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </template>
    </chart-card>
    <chart-card :chart-options="timeChart" height="25vh" v-else>
      <template slot="header" v-if="$slots.header">
        <slot name="header"></slot>
      </template>
      <template slot="footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </template>
    </chart-card>
  </div>
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
  const datediff = (first, second) => Math.round((second-first)/(1000*60*60*24));

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
    data(){
      return {
        currentChart: null,
        categoryChart: {
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
        },
        timeChart: {
          data: {
            columns: [],
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%H:%M %p',
                culling: false,
              },
            },
          },
          line: {
            connectNull: true,
          },
        },
      };
    },
    watch: {
      stats() {
        switch(this.period) {
          case '24 hours': this.get24HourChart(); break;
          case 'week': this.getWeekChart(); break;
          case 'month': this.getMonthChart(); break;
          case 'year': this.getYearChart(); break;
        };
        if(this.period === '24 hours') this.currentChart = this.timeChart;
        else this.currentChart = this.categoryChart;
        this.$forceUpdate();
      },
    },
    methods: {
      get24HourChart() {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const stations = this.stats.filter(stStats => stStats.length > 0).map(stStats => stStats[0].station);
        const axis = stations.reduce((agg, station) => {
          agg[`ST ${station}`] = `x${station}`;
          return agg;
        }, {});
        const filtered = this.stats.filter(stStats => stStats.length > 0).map(stStats => stStats.filter(stat => stat.date > yesterday && stat.date < today));
        const dates = filtered.map(stStats => [`x${stStats[0].station}`, ...stStats.map(stat => stat.date)]);
        const data = filtered.map(stStats => [`ST ${stStats[0].station}`, ...stStats.map(stat => stat.value)]);
        this.timeChart.data.xs = axis;
        this.timeChart.data.columns = [...dates, ...data];
        const ticks = [];
        const start = new Date(yesterday);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);
        for(let i = 0; i < 12; i++) {
          start.setHours(start.getHours()+2);
          ticks.push(new Date(start));
        }
        this.timeChart.axis.x.tick.values = ticks;
      },
      getWeekChart() {
        const today = new Date();
        const d = today.getDay();
        this.categoryChart.data.columns = [['x', ...days.slice(d), ...days.slice(0, d)]];
        const todayUTC00 = new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`);
        const stations = this.stats.map(s => s.stationId).filter((v, i, a) => a.indexOf(v) === i); // unique filter
        const byIndex = rangeIncl(0, 6).map(r => this.stats.filter(s => datediff(new Date(`${s.year}-${s.month}-${s.day}`), todayUTC00) === 7 - r));
        stations.forEach(stationId => {
          const byIndexAndStation = byIndex.map(stats => stats.find(s => s.stationId === stationId)).map(s => s ? s.average[this.attribute] : null);
          this.categoryChart.data.columns.push([`ST ${stationId}`, ...byIndexAndStation]);
        });
      },
      getMonthChart() {
        const today = new Date();
        const d = today.getDate();
        this.categoryChart.data.columns = [['x', ...rangeIncl(1, d - 1)]];
        const todayUTC00 = new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`);
        const stations = this.stats.map(s => s.stationId).filter((v, i, a) => a.indexOf(v) === i); // unique filter
        const byIndex = rangeIncl(1, d - 1).map(r => this.stats.filter(s => datediff(new Date(`${s.year}-${s.month}-${s.day}`), todayUTC00) === d - r));
        stations.forEach(stationId => {
          const byIndexAndStation = byIndex.map(stats => stats.find(s => s.stationId === stationId)).map(s => s ? s.average[this.attribute] : null);
          this.categoryChart.data.columns.push([`ST ${stationId}`, ...byIndexAndStation]);
        });
      },
      getYearChart() {
        const today = new Date();
        const m = today.getMonth();
        const y = today.getFullYear();
        this.categoryChart.data.columns = [['x', ...months.slice(m), ...months.slice(0, m)]];
        const filtered = this.stats.filter(s => {
          const ydiff = y - s.year;
          if (ydiff > 1) return false;
          if (ydiff === 0) return true;
          if (s.month >= m) return true;
          return false;
        });
        const stations = filtered.map(s => s.stationId).filter((v, i, a) => a.indexOf(v) === i); // unique filter
        const byIndex = rangeIncl(1, 12).map(r => {
          const month = m - 12 + r > 0 ? m - 12 + r : m + r;
          return filtered.filter(s => s.month === month);
        });
        stations.forEach(stationId => {
          const byIndexAndStation = byIndex.map(stats => stats.find(s => s.stationId === stationId)).map(s => s ? s.average[this.attribute] : null);
          this.categoryChart.data.columns.push([`ST ${stationId}`, ...byIndexAndStation]);
        });
      },
    },
  }
</script>
<style>

</style>

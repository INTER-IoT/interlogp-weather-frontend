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
    computed: {
      thing(){
        return this.get24HourChart();
      },
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
        const some2null = array => {
          for(let i = 0; i < array.length; i++) {
            if(Math.random() < 0.3) {
              array[i] = null;
            }
          }
          return array;
        };
        console.log(chart);
        switch(this.period) {
          case '24 hours': {
            delete chart.data.x;
            chart.axis.x.type = 'timeseries';
            // chart.axis.x.tick = { format: '%d %H:%M %p', values: [...rangeIncl(0, 23).map(i => `${`12 00${i}`.slice(-2)}:00:00`)], culling: false };
            chart.axis.x.tick = { format: '%H:%M %p' };
            // chart.data.xFormat = '%d %H:%M:%S';
            chart.data.xs = {
              'data1': 'x1',
              'data2': 'x2',
            };
            chart.data.columns = [
              ['x1', new Date('2019-02-12 02:24:02'), new Date('2019-02-13 08:24:13'), new Date('2019-02-13 12:24:13')],
              ['x2', new Date('2019-02-13 06:55:32'), new Date('2019-02-13 09:32:41'), new Date('2019-02-13 20:22:23')],
              ['data1', 22, 43, 19],
              ['data2', 32, 50, 26],
            ];
            break;
          }
          case 'week': {
            const d = today.getDay();
            chart.data.columns.push(['x', ...days.slice(d), ...days.slice(0, d)]);
            const todayUTC00 = new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`);
            const stations = this.stats.map(s => s.stationId).filter((v, i, a) => a.indexOf(v) === i); // unique filter
            const byIndex = rangeIncl(0, 6).map(r => this.stats.filter(s => datediff(new Date(`${s.year}-${s.month}-${s.day}`), todayUTC00) === 7 - r));
            stations.forEach(stationId => {
              const byIndexAndStation = byIndex.map(stats => stats.find(s => s.stationId === stationId)).map(s => s ? s.average[this.attribute] : null);
              chart.data.columns.push([`ST ${stationId}`, ...byIndexAndStation]);
            });
            break;
          }
          case 'month': {
            const d = today.getDate();
            chart.data.columns.push(['x', ...rangeIncl(1, d - 1)]);
            const todayUTC00 = new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`);
            const stations = this.stats.map(s => s.stationId).filter((v, i, a) => a.indexOf(v) === i); // unique filter
            const byIndex = rangeIncl(1, d - 1).map(r => this.stats.filter(s => datediff(new Date(`${s.year}-${s.month}-${s.day}`), todayUTC00) === d - r));
            stations.forEach(stationId => {
              const byIndexAndStation = byIndex.map(stats => stats.find(s => s.stationId === stationId)).map(s => s ? s.average[this.attribute] : null);
              chart.data.columns.push([`ST ${stationId}`, ...byIndexAndStation]);
            });
            break;
          }
          case 'year': {
            const m = today.getMonth();
            const y = today.getFullYear();
            chart.data.columns.push(['x', ...months.slice(m), ...months.slice(0, m)]);
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
              chart.data.columns.push([`ST ${stationId}`, ...byIndexAndStation]);
            });
            break;
          }
        }
        
        return chart;
      },
    },
    methods: {
      get24HourChart() {
        const chart = {
          data: {
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
        chart.axis.x.type = 'timeseries';
        // chart.axis.x.tick = { format: '%d %H:%M %p', values: [...rangeIncl(0, 23).map(i => `${`12 00${i}`.slice(-2)}:00:00`)], culling: false };
        chart.axis.x.tick = { format: '%H:%M %p' };
        // chart.data.xFormat = '%d %H:%M:%S';
        chart.data.xs = {
          'data1': 'x1',
          'data2': 'x2',
        };
        chart.data.columns = [
          ['x1', new Date('2019-02-12 02:24:02'), new Date('2019-02-13 08:24:13'), new Date('2019-02-13 12:24:13')],
          ['x2', new Date('2019-02-13 06:55:32'), new Date('2019-02-13 09:32:41'), new Date('2019-02-13 20:22:23')],
          ['data1', 22, 43, 19],
          ['data2', 32, 50, 26],
        ];
        return chart;
      },
    },
  }
</script>
<style>

</style>

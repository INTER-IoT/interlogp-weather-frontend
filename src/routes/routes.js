import DashboardLayout from 'src/components/Dashboard/Layout/DashboardLayout.vue';
// GeneralViews
import NotFound from 'src/components/GeneralViews/NotFoundPage.vue';

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue';
import Weather from 'src/components/Dashboard/Views/Weather.vue';
import Emission from 'src/components/Dashboard/Views/Emission.vue';
import Windspeed from 'src/components/Dashboard/Views/Windspeed.vue';
import Alerts from 'src/components/Dashboard/Views/Alerts.vue';

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/ports/1/overview',
  },
  {
    path: '/ports/:id',
    component: DashboardLayout,
    redirect: 'ports/:id/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview,
      },
      {
        path: 'windspeed',
        name: 'Windspeed',
        component: Windspeed,
      },
      {
        path: 'weather',
        name: 'Weather',
        component: Weather,
      },
      {
        path: 'emission',
        name: 'Emission',
        component: Emission,
      },
      {
        path: 'alerts',
        name: 'Alerts',
        component: Alerts,
      },
    ],
  },
  { path: '*', component: NotFound },
];

export default routes;

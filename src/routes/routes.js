import DashboardLayout from 'src/components/Dashboard/Layout/DashboardLayout.vue';
// GeneralViews
import NotFound from 'src/components/GeneralViews/NotFoundPage.vue';

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue';
import Weather from 'src/components/Dashboard/Views/Weather.vue';
import Windspeed from 'src/components/Dashboard/Views/Windspeed.vue';
import Rules from 'src/components/Dashboard/Views/Rules.vue';

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
        path: 'rules',
        name: 'Rules',
        component: Rules,
      },
    ],
  },
  { path: '*', component: NotFound },
];

export default routes;

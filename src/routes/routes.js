import DashboardLayout from 'src/components/Dashboard/Layout/DashboardLayout.vue';
// GeneralViews
import NotFound from 'src/components/GeneralViews/NotFoundPage.vue';

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue';
import Windspeed from 'src/components/Dashboard/Views/Windspeed.vue';

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
    ],
  },
  { path: '*', component: NotFound },
];

export default routes;

import Vue from 'vue';
import VueRouter from 'vue-router';

import HomeView from './../views/HomeView';
import NotFoundView from './../views/NotFoundView';

const Dummy = { template: '<div>Dummy</div>' };
const router = new VueRouter({
  mode: 'history',
  base: '/dom-wars/',
  routes: [
    { path: '/',
      component: HomeView,
      meta: {
        title: 'Home Page',
      },
    },
    { path: 'dummy', component: Dummy },
    { path: '*', component: NotFoundView },
  ],
});

Vue.use(VueRouter);
export default router;

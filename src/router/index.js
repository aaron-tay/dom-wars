import Vue from 'vue';
import VueRouter from 'vue-router';

import HomeView from './../views/HomeView';
import DomGameView from './../views/DomGameView';
import AboutView from './../views/AboutView';
import NotFoundView from './../views/NotFoundView';

const Dummy = { template: '<div>Dummy</div>' };
const router = new VueRouter({
  mode: 'hash',
  base: '/dom-wars/',
  routes: [
    { path: '/',
      component: HomeView,
      meta: {
        title: 'Home Page',
      },
    },
    { path: '/game',
      component: DomGameView,
      meta: {
        title: 'Dom Wars',
      },
    },
    { path: '/about',
      component: AboutView,
      meta: {
        title: 'About dom-wars',
      },
    },
    { path: 'dummy', component: Dummy },
    { path: '*', component: NotFoundView },
  ],
});

Vue.use(VueRouter);
export default router;

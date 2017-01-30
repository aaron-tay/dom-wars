import Vue from 'vue';

import App from './App';
import router from './router';
import store from './store';

/* eslint-disable no-unused-vars */
import * as helpers from './helpers';
/* eslint-enable */

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App),
});

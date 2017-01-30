import Vue from 'vue';

// Register a global custom directive called v-focus
Vue.directive('mdl', {
  // When the bound element is inserted into the DOM...
  inserted() {
    // https://forum.vuejs.org/topic/1957/how-to-implement-material-design-in-the-vuejs-webpack-template/2
    /* eslint-disable */
    Vue.nextTick(function mdlUpgrade() {
      componentHandler.upgradeDom();
      // this will work but doesn't look efficient...
    });
    /* eslint-enable */
  },
});

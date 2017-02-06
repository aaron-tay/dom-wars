import Vue from 'vue';
import Vuex from 'vuex';
import players from './modules/players';
import game from './modules/game';
import world from './modules/world';
// import * as actions from './actions';
// import * as getters from './getters';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  // actions,
  // getters,
  modules: {
    players,
    game,
    world,
  },
  strict: debug,
});

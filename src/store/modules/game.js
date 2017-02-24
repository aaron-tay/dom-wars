// import Vue from 'vue';
import * as MUTATIONS from './../mutation-types';
import CONSTANTS from './../../engine/constants';

const localState = {
  phase: null,                  // CONSTANTS.GAME_PHASE
  selection: {
    x: null,
    y: null,
  },
};

const getters = {
  currentGamePhase: (state => state.phase),
  hasSelection: (state) => {
    if (state.selection.x === null || state.selection.y === null) {
      return false;
    }
    return true;
  },
  selectedCoordinate: (state => ({
    x: state.selection.x,
    y: state.selection.y,
  })),
};

const GAME_PHASE_SET = 'GAME:PHASE:SET';

const actions = {
  setGamePhase({ commit }, gamePhase) {
    commit(GAME_PHASE_SET, gamePhase);
  },
};

/* eslint-disable no-param-reassign */
const mutations = {
  [GAME_PHASE_SET](state, gamePhase) {
    state.phase = gamePhase;
  },
  [MUTATIONS.GAME_OVER](state) {
    state.phase = CONSTANTS.GAME_PHASE.GAME_OVER;
  },
  [MUTATIONS.TILE_SELECT](state, { x, y }) {
    state.selection.x = x;
    state.selection.y = y;
  },
  [MUTATIONS.TILE_UNSELECT](state) {
    state.selection.x = null;
    state.selection.y = null;
  },
};
/* eslint-disable no-param-reassign */

export default {
  state: localState,
  actions,
  getters,
  mutations,
};

import lodash from 'lodash';
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
  isSetupPhase: (state, allGetters) => {
    const setupPhases = [
      CONSTANTS.GAME_PHASE.SETUP_PLAYERS,
      CONSTANTS.GAME_PHASE.SETUP_WORLD,
      CONSTANTS.GAME_PHASE.SETUP_UNITS,
      CONSTANTS.GAME_PHASE.SETUP_UNIT_PLACEMENT,
    ];
    const result = lodash.find(setupPhases, (phase => phase === allGetters.currentGamePhase));
    return result;
  },
  isPlayingPhase: (state, allGetters) => {
    const playingPhases = [
      CONSTANTS.GAME_PHASE.PLAYER_TURN_BEFORE,
      CONSTANTS.GAME_PHASE.PLAYER_TURN,
      CONSTANTS.GAME_PHASE.PLAYER_TURN_AFTER,
      CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT_BEFORE,
      CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT,
      CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT_AFTER,
    ];
    const result = lodash.find(playingPhases, (phase => phase === allGetters.currentGamePhase));
    return result;
  },
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

// import Vue from 'vue';
import lodash from 'lodash';
import * as MUTATIONS from './../mutation-types';
import CONSTANTS from './../../engine/constants';

const localState = {
  phase: null,                  // CONSTANTS.GAME_PHASE
  originalPlayerTurnOrder: [],  // [<playerId>, ...]
  playerTurnOrder: [],          // [<playerId>, ...]
  selection: {
    x: null,
    y: null,
  },
};

const getters = {
  currentGamePhase: (state => state.phase),
  currentPlayerId: (state => lodash.head(state.playerTurnOrder)),
  // order returned is based on player turn order
  remainingOpponentPlayerIds: (state) => {
    const currentPlayerId = lodash.head(state.playerTurnOrder);
    const opponentPlayerIds = lodash.reject(state.playerTurnOrder, (player =>
      player.id === currentPlayerId
    ));
    return opponentPlayerIds;
  },
  hasWinner: (state) => {
    const remainingPlayerIds = state.playerTurnOrder;
    return remainingPlayerIds.length <= 1;
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
const GAME_PLAYER_TURN_SET_ORDER = 'GAME:PLAYER_TURN:SET_ORDER';

const actions = {
  setGamePhase({ commit }, gamePhase) {
    commit(GAME_PHASE_SET, gamePhase);
  },
  setPlayerTurnOrder({ commit }, playerTurnOrder) {
    commit(GAME_PLAYER_TURN_SET_ORDER, playerTurnOrder);
  },
};

/* eslint-disable no-param-reassign */
const mutations = {
  [GAME_PHASE_SET](state, gamePhase) {
    state.phase = gamePhase;
  },
  [GAME_PLAYER_TURN_SET_ORDER](state, playerTurnOrder) {
    state.originalPlayerTurnOrder = playerTurnOrder;
    state.playerTurnOrder = lodash.clone(playerTurnOrder);
  },
  [MUTATIONS.GAME_OVER](state) {
    state.phase = CONSTANTS.GAME_PHASE.GAME_OVER;
  },
  [MUTATIONS.CURRENT_PLAYER_TURN_END](state) {
    const currentPlayerId = state.playerTurnOrder.shift();
    state.playerTurnOrder.push(currentPlayerId);
  },
  [MUTATIONS.PLAYER_GAME_END](state, { playerId }) {
    const updatedTurnOrder = lodash.reject(state.playerTurnOrder, item => (
      item === playerId
    ));
    state.playerTurnOrder = updatedTurnOrder;
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

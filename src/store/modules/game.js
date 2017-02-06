// import Vue from 'vue';
import lodash from 'lodash';
// import * as types from './../mutation-types';

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
    return remainingPlayerIds.length === 0;
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
  getAvailableActions: (state, allGetters) => {
    const maybeUnit = (allGetters.getSelectedTile || {}).unit;
    return {
      SELECT: !allGetters.hasSelection,
      UNSELECT: allGetters.hasSelection,
      MOVE: allGetters.canUnitDoMovementFn(maybeUnit),
      ACTION: {
        ATTACK: allGetters.canUnitDoActionFn(maybeUnit),
      },
      END_TURN: true,
      SURRENDER: true,
    };
  },
};

const GAME_PHASE_SET = 'GAME:PHASE:SET';
const GAME_PLAYER_TURN_SET_ORDER = 'GAME:PLAYER_TURN:SET_ORDER';
const GAME_PLAYER_TURN_END = 'GAME:PLAYER_TURN:END';
const GAME_PLAYER_TURN_REMOVE = 'GAME:PLAYER_TURN:REMOVE';
const GAME_PLAYER_TILE_SELECT = 'GAME:PLAYER:TILE:SELECT';
const GAME_PLAYER_TILE_UNSELECT = 'GAME:PLAYER:TILE:UNSELECT';

const actions = {
  setGamePhase({ commit }, gamePhase) {
    commit(GAME_PHASE_SET, gamePhase);
  },
  setPlayerTurnOrder({ commit }, playerTurnOrder) {
    commit(GAME_PLAYER_TURN_SET_ORDER, playerTurnOrder);
  },
  finishCurrentPlayerTurn({ commit }) {
    // get currentPlayer
    commit(GAME_PLAYER_TURN_END);
  },
  surrenderPlayer({ commit }, playerId) {
    commit(GAME_PLAYER_TURN_REMOVE, playerId);
    // if there is only one player remaining then we need to do something...
  },
  selectTile({ commit }, { x, y }) {
    commit(GAME_PLAYER_TILE_SELECT, { x, y });
  },
  unselectTile({ commit }) {
    commit(GAME_PLAYER_TILE_UNSELECT);
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
  [GAME_PLAYER_TURN_END](state) {
    const currentPlayerId = state.playerTurnOrder.shift();
    state.playerTurnOrder.push(currentPlayerId);
  },
  [GAME_PLAYER_TURN_REMOVE](state, playerId) {
    const updatedTurnOrder = lodash.remove(state.playerTurnOrder, item => item === playerId);
    state.playerTurnOrder = updatedTurnOrder;
  },
  [GAME_PLAYER_TILE_SELECT](state, { x, y }) {
    state.selection.x = x;
    state.selection.y = y;
  },
  [GAME_PLAYER_TILE_UNSELECT](state) {
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

import Vue from 'vue';
import lodash from 'lodash';
import * as MUTATIONS from './../mutation-types';

const localState = {
  // <playerId>: {}
  players: {},
  originalPlayerTurnOrder: [],  // [<playerId>, ...]
  playerTurnOrder: [],          // [<playerId>, ...]
};

const getters = {
  currentPlayerId: (state => lodash.head(state.playerTurnOrder)),
  getPlayerById: (state, allGetters) => (playerId =>
    allGetters.getPlayersById([playerId])[0]
  ),
  getPlayersById: (state => (playerIds) => {
    const result = lodash.map(playerIds, (playerId => state.players[playerId]));
    return result;
  }),
  allPlayers: (state => lodash.values(state.players)),
  currentPlayer: (state, allGetters) => {
    const currentPlayerId = allGetters.currentPlayerId;
    const result = allGetters.getPlayerById(currentPlayerId);
    return result;
  },
  remainingOpponents: (state, allGetters) => {
    // order returned is based on player turn order
    const currentPlayer = allGetters.currentPlayer;
    const opponentPlayerIds = lodash.reject(state.playerTurnOrder, (player =>
      player.id === currentPlayer.id
    ));
    const result = allGetters.getPlayersById(opponentPlayerIds);
    return result;
  },
  hasWinner: (state) => {
    const remainingPlayerIds = state.playerTurnOrder;
    return remainingPlayerIds.length <= 1;
  },
};

const PLAYER_ADD = 'PLAYER:ADD';
const PLAYER_REMOVE = 'PLAYER:REMOVE';
const PLAYER_CLEAR_ALL = 'PLAYER:CLEAR_ALL';
const PLAYER_TURN_SET_ORDER = 'PLAYER_TURN:SET_ORDER';

const actions = {
  addPlayer({ commit }, { playerId, name, localId }) {
    commit(PLAYER_ADD, {
      playerId,
      name,
      localId,
    });
  },
  removePlayer({ commit }, { playerId }) {
    commit(PLAYER_REMOVE, {
      playerId,
    });
  },
  clearAllPlayers({ commit }) {
    commit(PLAYER_CLEAR_ALL);
  },
  setPlayerTurnOrder({ commit }, playerTurnOrder) {
    commit(PLAYER_TURN_SET_ORDER, playerTurnOrder);
  },
};

/* eslint-disable no-param-reassign */
const mutations = {
  [PLAYER_ADD](state, { playerId, name, localId }) {
    Vue.set(state.players, playerId, {
      playerId,
      name,
      localId,
    });
  },
  [PLAYER_REMOVE](state, { playerId }) {
    Vue.delete(state.players, playerId);
  },
  [PLAYER_CLEAR_ALL](state) {
    state.players = {};
  },
  [PLAYER_TURN_SET_ORDER](state, playerTurnOrder) {
    state.originalPlayerTurnOrder = playerTurnOrder;
    state.playerTurnOrder = lodash.clone(playerTurnOrder);
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
};
/* eslint-disable no-param-reassign */

export default {
  state: localState,
  actions,
  getters,
  mutations,
};

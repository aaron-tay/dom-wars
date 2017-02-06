import Vue from 'vue';
import lodash from 'lodash';
// import * as types from './../mutation-types';

const localState = {
  /*
  <playerId>: {
    playerId: <playerId>
    name: '',
  }
  */
  players: {},
};

const getters = {
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
    const opponentPlayerIds = allGetters.remainingOpponentPlayerIds;
    const result = allGetters.getPlayersById(opponentPlayerIds);
    return result;
  },
};

const PLAYER_ADD = 'PLAYER:ADD';
const PLAYER_REMOVE = 'PLAYER:REMOVE';
const PLAYER_CLEAR_ALL = 'PLAYER:CLEAR_ALL';

const actions = {
  addPlayer({ commit }, { playerId, name }) {
    commit(PLAYER_ADD, {
      playerId,
      name,
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
};

/* eslint-disable no-param-reassign */
const mutations = {
  [PLAYER_ADD](state, { playerId, name }) {
    Vue.set(state.players, playerId, {
      playerId,
      name,
    });
  },
  [PLAYER_REMOVE](state, { playerId }) {
    Vue.delete(state.players, playerId);
  },
  [PLAYER_CLEAR_ALL](state) {
    state.players = {};
  },
};
/* eslint-disable no-param-reassign */

export default {
  state: localState,
  actions,
  getters,
  mutations,
};

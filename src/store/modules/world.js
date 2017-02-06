import Vue from 'vue';
import lodash from 'lodash';
// import * as types from './../mutation-types';

const localState = {
  /*
  x_y: {
    terrain: <terrainId>,
    unit: <unitId>,
  }
  */
  layers: {
    terrain: {},
    units: {},
  },
  definition: {
    width: 10,
    height: 8,
    tileset: '0',
  },
};

const getters = {
  isWorldReady: state => !lodash.isEmpty(state.layers.terrain),
  getWorldDefinition: state => state.definition,
  getTileFn: (state => (x, y) => {
    const key = `${x}_${y}`;
    const terrain = state.layers.terrain[key];
    const unit = state.layers.units[key];
    return {
      x,
      y,
      terrain,
      unit,
    };
  }),
  getSelectedTile: (state, allGetters) => {
    if (!allGetters.hasSelection) { return null; }
    const coord = allGetters.selectedCoordinate;
    return allGetters.getTileFn(coord.x, coord.y);
  },
  canUnitDoMovementFn: () => (unit) => {
    if (!unit || !unit.energy) { return false; }
    return unit.energy.movement;
  },
  canUnitDoActionFn: () => (unit) => {
    if (!unit || !unit.energy) { return false; }
    return unit.energy.action;
  },
};

const WORLD_LAYERS_SET = 'WORLD:LAYERS:SET';
const WORLD_UNIT_MOVE = 'WORLD:UNIT:MOVE';

const actions = {
  setWorld({ commit }, { terrain, units }) {
    commit(WORLD_LAYERS_SET, {
      terrain,
      units,
    });
  },
  moveUnit({ commit }, { source, destination }) {
    commit(WORLD_UNIT_MOVE, {
      source,
      destination,
    });
  },
  displayMovementArea({ commit }, source) {
    console.log(commit, source);
  },
};

/* eslint-disable no-param-reassign */
const mutations = {
  [WORLD_LAYERS_SET](state, { terrain, units }) {
    console.log(terrain, units);
    Vue.delete(state.layers, 'terrain');
    Vue.delete(state.layers, 'units');
    Vue.set(state.layers, 'terrain', terrain);
    Vue.set(state.layers, 'units', units);
  },
  [WORLD_UNIT_MOVE](state, { source, destination }) {
    const sourceKey = `${source.x}_${source.y}`;
    const destinationKey = `${destination.x}_${destination.y}`;
    const unit = state.layers.units[sourceKey];
    Vue.delete(state.layers.units, sourceKey);
    Vue.set(state.layers.units, destinationKey, unit);
  },
};
/* eslint-disable no-param-reassign */

export default {
  state: localState,
  actions,
  getters,
  mutations,
};

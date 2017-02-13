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
    range: {},
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
  getTileFn: (state, allGetters) => (x, y) => {
    if (x < 0 || x > state.definition.width || y < 0 || y > state.definition.height) {
      return null;
    }
    const key = `${x}_${y}`;
    const terrain = state.layers.terrain[key] || null;
    const unit = state.layers.units[key] || null;
    if (unit) {
      unit.owner = allGetters.getPlayerById(unit.ownerId);
    }
    return {
      x,
      y,
      terrain,
      unit,
    };
  },
  getSelectedTile: (state, allGetters) => {
    if (!allGetters.hasSelection) { return null; }
    const coord = allGetters.selectedCoordinate;
    return allGetters.getTileFn(coord.x, coord.y);
  },
  getSelectedUnit: (state, allGetters) => {
    const selectedTile = allGetters.getSelectedTile;
    if (!selectedTile) { return null; }
    return selectedTile.unit;
  },
  getRangeInfoFn: state => (x, y) => {
    const key = `${x}_${y}`;
    const range = state.layers.range[key] || null;
    return {
      range,
    };
  },
};

const WORLD_LAYERS_SET = 'WORLD:LAYERS:SET';
const WORLD_UNIT_MOVE = 'WORLD:UNIT:MOVE';
const WORLD_UNIT_RANGE_SET = 'WORLD:UNIT_RANGE:SET';
const WORLD_UNIT_ATTACK = 'WORLD:UNIT:ATTACK';

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
  setRangeArea({ commit }, rangeArea = {}) {
    commit(WORLD_UNIT_RANGE_SET, { rangeArea });
  },
  attackUnit({ commit }, { source, destination }) {
    commit(WORLD_UNIT_ATTACK, {
      source,
      destination,
    });
  },
};

/* eslint-disable no-param-reassign */
const mutations = {
  [WORLD_LAYERS_SET](state, { terrain, units }) {
    console.log(terrain, units);
    Vue.delete(state.layers, 'terrain');
    Vue.delete(state.layers, 'units');
    Vue.delete(state.layers, 'range');
    Vue.set(state.layers, 'terrain', terrain);
    Vue.set(state.layers, 'units', units);
    Vue.set(state.layers, 'range', {});
  },
  [WORLD_UNIT_MOVE](state, { source, destination }) {
    const sourceKey = `${source.x}_${source.y}`;
    const destinationKey = `${destination.x}_${destination.y}`;
    const unit = state.layers.units[sourceKey];
    Vue.delete(state.layers.units, sourceKey);
    Vue.set(state.layers.units, destinationKey, unit);
  },
  [WORLD_UNIT_RANGE_SET](state, { rangeArea }) {
    Vue.delete(state.layers, 'range');
    Vue.set(state.layers, 'range', rangeArea);
  },
  [WORLD_UNIT_ATTACK](state, { source, destination }) {
    const sourceKey = `${source.x}_${source.y}`;
    const destinationKey = `${destination.x}_${destination.y}`;
    const attacker = state.layers.units[sourceKey];
    const defender = state.layers.units[destinationKey];
    const damage = Math.max(attacker.attack - defender.defense, 1);
    defender.hp -= damage;
    if (defender.hp <= 0) {
      Vue.delete(state.layers.units, destinationKey);
    }
  },
};
/* eslint-disable no-param-reassign */

export default {
  state: localState,
  actions,
  getters,
  mutations,
};

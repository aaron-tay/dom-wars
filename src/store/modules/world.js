import Vue from 'vue';
import lodash from 'lodash';
import * as MUTATIONS from './../mutation-types';
import core from './../../engine/core';

const localState = {
  /*
  x_y: {
    terrain: <terrainId>,
    unit: <unitId>,
  }
  */
  layers: {
    terrain: {},
    units: {},    // <coordinate>: <unitId>
    pathing: {},
  },
  definition: {
    width: 10,
    height: 8,
    tileset: 'standard',
  },
  indexed: {
    units: {},
  },
};

const getters = {
  isWorldReady: state => !lodash.isEmpty(state.layers.terrain),
  getWorldDefinition: state => state.definition,
  getTileFn: (state, allGetters) => (x, y) => {
    if (x < 0 || x > state.definition.width || y < 0 || y > state.definition.height) {
      return null;
    }
    const key = core.coordinate(x, y);
    const terrain = state.layers.terrain[key] || null;
    const unitId = state.layers.units[key] || null;
    let unit = null;
    if (unitId) {
      unit = state.indexed.units[unitId];
      // NOTE(ajt): This modifies the original
      unit.owner = allGetters.getPlayerById(unit.playerId);
    }
    return {
      x,
      y,
      terrain,
      unit,
      tileset: state.definition.tileset,
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
  getPathingInfoFn: state => (x, y) => {
    const key = core.coordinate(x, y);
    const pathing = state.layers.pathing[key] || null;
    return {
      pathing,
    };
  },
  getUnitsOwnedByPlayerId: state => (playerId) => {
    const result = lodash.filter(state.indexed.units, item => (
      item.playerId === playerId
    ));
    return result;
  },
};

const WORLD_TILESET_SET = 'WORLD:TILESET:SET';
const WORLD_LAYERS_SET = 'WORLD:LAYERS:SET';
const WORLD_LAYER_PATHING_SET = 'WORLD:LAYER:PATHING:SET';

const actions = {
  setWorld({ commit }, { terrain, units }) {
    commit(WORLD_LAYERS_SET, {
      terrain,
      units,
    });
  },
  setPathingLayer({ commit }, pathingLayer = {}) {
    commit(WORLD_LAYER_PATHING_SET, { pathingLayer });
  },
  setTileset({ commit }, { tileset }) {
    commit(WORLD_TILESET_SET, { tileset });
  },
};

/* eslint-disable no-param-reassign */
const mutations = {
  [WORLD_TILESET_SET](state, { tileset = '0' }) {
    state.definition.tileset = tileset;
  },
  [WORLD_LAYERS_SET](state, { terrain, units }) {
    console.log('store:world', terrain, units);
    Vue.delete(state.layers, 'terrain');
    Vue.delete(state.layers, 'units');
    Vue.delete(state.layers, 'pathing');
    Vue.set(state.layers, 'terrain', terrain);
    Vue.set(state.layers, 'units', lodash.mapValues(units, 'unitId'));
    Vue.set(state.layers, 'pathing', {});

    Vue.delete(state.indexed, 'units');
    Vue.set(state.indexed, 'units', lodash.mapKeys(units, 'unitId'));
  },
  [WORLD_LAYER_PATHING_SET](state, { pathingLayer }) {
    Vue.delete(state.layers, 'pathing');
    Vue.set(state.layers, 'pathing', pathingLayer);
  },
  [MUTATIONS.TILE_REMOVE_UNIT](state, { x, y }) {
    const key = core.coordinate(x, y);
    Vue.delete(state.layers.units, key);
  },
  [MUTATIONS.TILE_PLACE_UNIT](state, { x, y, unit }) {
    const key = core.coordinate(x, y);
    Vue.set(state.layers.units, key, unit.unitId);
  },
  [MUTATIONS.UNIT_REDUCE_HP](state, { unit, amount }) {
    const unitToUpdate = state.indexed.units[unit.unitId];
    unitToUpdate.hp -= amount;
  },
  [MUTATIONS.UNIT_SET_ENERGY](state, { unit, energy }) {
    const unitToUpdate = state.indexed.units[unit.unitId];
    unitToUpdate.energy = energy;
  },
};
/* eslint-disable no-param-reassign */

export default {
  state: localState,
  actions,
  getters,
  mutations,
};

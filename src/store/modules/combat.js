import Vue from 'vue';
import lodash from 'lodash';
import * as MUTATIONS from './../mutation-types';
import CONSTANTS from './../../engine/constants';

const localState = {
  combatants: {
    attacker: {
      unitId: null,
      playerId: null,
    },
    defender: {
      unitId: null,
      playerId: null,
    },
  },
};

const localGetters = {
  attacker: (state, allGetters) => ({
    coordinate: state.combatants.attacker.coordinate,
    unit: allGetters.getUnitById(state.combatants.attacker.unitId),
    player: allGetters.getPlayerById(state.combatants.attacker.playerId),
  }),
  defender: (state, allGetters) => ({
    coordinate: state.combatants.defender.coordinate,
    unit: allGetters.getUnitById(state.combatants.defender.unitId),
    player: allGetters.getPlayerById(state.combatants.defender.playerId),
  }),
};

const COMBAT_INITIALISE = 'COMBAT:INITIALISE';
const COMBAT_CLEANUP = 'COMBAT:CLEANUP';

function remainingUnits(units) {
  const result = lodash.filter(units, (unit => (unit.hp > 0)));
  return result;
}

function combatantAtCoordinate({ x, y }, getTileFn) {
  const tile = getTileFn(x, y);
  return {
    coordinate: { x, y },
    unitId: tile.unit.unitId,
    playerId: tile.unit.playerId,
  };
}

const actions = {
  initiateCombat({ commit, dispatch, getters }, { source, destination }) {
    // Setup the :combat: state ready for use
    const attacker = combatantAtCoordinate(source, getters.getTileFn);
    const defender = combatantAtCoordinate(destination, getters.getTileFn);
    commit(COMBAT_INITIALISE, {
      attacker,
      defender,
    });
    dispatch('setGamePhase', CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT_BEFORE);
  },
  beginCombatPhase({ dispatch }) {
    // This is where to do pre-combat things (nothing yet)
    dispatch('setGamePhase', CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT);
  },
  doCombatPhase({ commit, dispatch, getters }) {
    // Pit the combatants against each other
    const attacker = getters.attacker;
    const defender = getters.defender;

    const attackingUnit = attacker.unit;
    const defendingUnit = defender.unit;
    const damage = Math.max(attackingUnit.attack - defendingUnit.defense, 1);

    commit(MUTATIONS.UNIT_REDUCE_HP, {
      unit: defendingUnit,
      amount: damage,
    });

    if (defendingUnit.hp <= 0) {
      const defendingCoordinate = defender.coordinate;
      console.log(defender);
      commit(MUTATIONS.TILE_REMOVE_UNIT, {
        x: defendingCoordinate.x,
        y: defendingCoordinate.y,
      });
    }

    // deplete the attacker of energy
    commit(MUTATIONS.UNIT_SET_ENERGY, {
      unit: attackingUnit,
      energy: {
        movement: false,
        action: false,
      },
    });
    dispatch('setGamePhase', CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT_AFTER);
  },
  finishCombatPhase({ commit, dispatch, getters }) {
    // Combat has ended, do post-combat checks, then clean-up anything
    const defendingPlayerId = getters.defender.player.playerId;
    const defendingPlayerUnits = remainingUnits(getters.getUnitsOwnedByPlayerId(defendingPlayerId));
    if (defendingPlayerUnits.length === 0) {
      dispatch('playerRelinquishGame', { playerId: defendingPlayerId });
    }

    const attackingPlayerId = getters.attacker.player.playerId;
    const attackingPlayerUnits = remainingUnits(getters.getUnitsOwnedByPlayerId(attackingPlayerId));
    if (attackingPlayerUnits.length === 0) {
      dispatch('playerRelinquishGame', { playerId: attackingPlayerId });
    }

    commit(COMBAT_CLEANUP);
    dispatch('setGamePhase', CONSTANTS.GAME_PHASE.PLAYER_TURN);
  },
};

/* eslint-disable no-param-reassign */
const mutations = {
  [COMBAT_INITIALISE](state, { attacker, defender }) {
    Vue.set(state.combatants, 'attacker', attacker);
    Vue.set(state.combatants, 'defender', defender);
  },
  [COMBAT_CLEANUP](state) {
    state.combatants.attacker = null;
    state.combatants.defender = null;
  },
};
/* eslint-disable no-param-reassign */

export default {
  state: localState,
  actions,
  getters: localGetters,
  mutations,
};

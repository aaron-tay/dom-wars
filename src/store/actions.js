import lodash from 'lodash';
import * as MUTATIONS from './mutation-types';

// Actions players can take. We have rough prefixing for now

// When the player selects a tile
export const playerSelectTile = ({ commit }, { x, y }) => {
  commit(MUTATIONS.TILE_SELECT, { x, y });
};

// When the player unselect their currently selected tile
export const playerUnselectTile = ({ commit }) => {
  commit(MUTATIONS.TILE_UNSELECT);
};

// When the player orders a unit to move to a location
export const playerOrderUnitMove = ({ commit, getters }, { source, destination }) => {
  const unit = source.unit;
  if (!unit) { throw new Error(`Expected unit in source: ${source}`); }
  // TODO(ajt): Do rigid checks to ensure conditions are valid for moving units
  // TODO(ajt): pre-movement actions

  commit(MUTATIONS.TILE_REMOVE_UNIT, {
    x: source.x,
    y: source.y,
  });

  commit(MUTATIONS.TILE_PLACE_UNIT, {
    x: destination.x,
    y: destination.y,
    unit,
  });

  // deplete the unit of movement energy
  // its destination cos the unit has moved :P
  commit(MUTATIONS.UNIT_SET_ENERGY, {
    unit,
    energy: {
      movement: false,
      action: unit.energy.action,
    },
  });

  // TODO(ajt): post-movement actions
};

function remainingUnits(units) {
  const result = lodash.filter(units, (unit => (unit.hp > 0)));
  return result;
}

// When the player orders a unit to attack a location
export const playerOrderUnitAttack = ({ commit, dispatch, getters }, { source, destination }) => {
  const attacker = source.unit;
  const defender = destination.unit;
  if (!attacker) { throw new Error(`Expected unit in source: ${source}`); }
  if (!defender) { throw new Error(`Expected unit in destination: ${destination}`); }
  const attackingPlayerId = attacker.playerId;
  const defendingPlayerId = defender.playerId;

  // TODO(ajt): pre-combat actions

  const damage = Math.max(attacker.attack - defender.defense, 1);

  // TODO(ajt): Since its a 'unit' operation, it'll be better if (x,y) info isn't required
  commit(MUTATIONS.UNIT_REDUCE_HP, {
    unit: defender,
    amount: damage,
  });

  if (defender.hp <= 0) {
    commit(MUTATIONS.TILE_REMOVE_UNIT, {
      x: destination.x,
      y: destination.y,
    });
  }

  // deplete the attacker of energy
  commit(MUTATIONS.UNIT_SET_ENERGY, {
    unit: attacker,
    energy: {
      movement: false,
      action: false,
    },
  });

  // TODO(ajt): post-combat actions
  // Check if attacking player has won
  // Check if defending player has won
  console.log('attk');
  const attackingPlayerUnits = remainingUnits(getters.getUnitsOwnedByPlayerId(attackingPlayerId));
  const defendingPlayerUnits = remainingUnits(getters.getUnitsOwnedByPlayerId(defendingPlayerId));
  console.log('attk', attackingPlayerUnits, defendingPlayerUnits);
  if (defendingPlayerUnits.length === 0) {
    // attacking might be winner
    dispatch('playerRelinquishGame', { playerId: defendingPlayerId });
  }
  if (attackingPlayerUnits.length === 0) {
    // defending might be winner
    dispatch('playerRelinquishGame', { playerId: attackingPlayerId });
  }
};

// When player wants to surrender
export const playerRelinquishGame = ({ commit, getters }, { playerId }) => {
  commit(MUTATIONS.PLAYER_GAME_END, { playerId });

  // TODO(ajt): Remove all units (particularly for multi-player game)
  // NOTE(ajt): slightly duplicated logic with playerRelinquishTurn
  const units = getters.getUnitsOwnedByPlayerId(playerId);
  lodash.forEach(units, (unit) => {
    commit(MUTATIONS.UNIT_SET_ENERGY, {
      unit,
      energy: {
        movement: false,
        action: false,
      },
    });
  });

  commit(MUTATIONS.TILE_UNSELECT);

  // TODO(ajt): This is just temporary
  if (getters.hasWinner) {
    commit(MUTATIONS.GAME_OVER);
  }
};

// When the current player wants to end their turn
export const playerRelinquishTurn = ({ commit, getters }) => {
  const currentPlayer = getters.currentPlayer;
  commit(MUTATIONS.CURRENT_PLAYER_TURN_END);

  // TODO(ajt): Maybe have a specialised mutation to achieve this 'atomically'
  // NOTE(ajt): slightly duplicated logic with playerRelinquishGame
  const units = getters.getUnitsOwnedByPlayerId(currentPlayer.playerId);
  lodash.forEach(units, (unit) => {
    commit(MUTATIONS.UNIT_SET_ENERGY, {
      unit,
      energy: {
        movement: true,
        action: true,
      },
    });
  });

  commit(MUTATIONS.TILE_UNSELECT);
};

// Signal when the specified player is ready to commence the game
export const playerReadyToCommenceGame = ({ commit }, { playerId }) => {
  console.log(commit, playerId);
  // if all players are ready then transition to the 'playing-game' state
};

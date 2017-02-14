import * as MUTATIONS from './mutation-types';

// Actions players can take. We have rough prefixing for now

export const playerSelectTile = ({ commit }, { x, y }) => {
  commit(MUTATIONS.TILE_SELECT, { x, y });
};

export const playerUnselectTile = ({ commit }) => {
  commit(MUTATIONS.TILE_UNSELECT);
};

export const playerOrderUnitMove = ({ commit, getters }, { source, destination }) => {
  const unit = source.unit;
  if (!unit) { throw new Error(`Expected unit in source: ${source}`); }

  commit(MUTATIONS.TILE_REMOVE_UNIT, {
    x: source.x,
    y: source.y,
  });

  commit(MUTATIONS.TILE_PLACE_UNIT, {
    x: destination.x,
    y: destination.y,
    unit,
  });
};

export const playerOrderUnitAttack = ({ commit }, { source, destination }) => {
  const attacker = source.unit;
  const defender = destination.unit;
  if (!attacker) { throw new Error(`Expected unit in source: ${source}`); }
  if (!defender) { throw new Error(`Expected unit in destination: ${destination}`); }

  const damage = Math.max(attacker.attack - defender.defense, 1);

  // TODO(ajt): Since its a 'unit' operation, it'll be better if (x,y) info isn't required
  commit(MUTATIONS.UNIT_REDUCE_HP, {
    x: destination.x,
    y: destination.y,
    unit: defender,
    amount: damage,
  });

  if (defender.hp <= 0) {
    commit(MUTATIONS.TILE_REMOVE_UNIT, {
      x: destination.x,
      y: destination.y,
    });
  }
};

export const playerRelinquishGame = ({ commit }, { playerId }) => {
  commit(MUTATIONS.PLAYER_GAME_END, { playerId });
};

export const playerRelinquishTurn = ({ commit }) => {
  commit(MUTATIONS.CURRENT_PLAYER_TURN_END);
};

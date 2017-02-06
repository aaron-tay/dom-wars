import lodash from 'lodash';
import CONSTANTS from './constants';

export function coord(x, y) {
  return `${x}_${y}`;
}

export function createUnit(ownerId, type) {
  return {
    ownerId,
    type,
    hp: (type + 1) * 3,
    attack: (type + 1),
    defense: (type),
    speed: type,  // how far can the unit move
    behaviour: CONSTANTS.UNIT_BEHAVIOUR.MOVE_AND_ACTION,
    energy: {
      movement: true,
      action: true,
    },
  };
}

export function unitCanDoMovement(unit) {
  if (!unit || !unit.energy) { return false; }
  return unit.energy.movement;
}

export function unitCanDoAction(unit) {
  if (!unit || !unit.energy) { return false; }
  return unit.energy.action;
}

export function createPlayer(playerId, name) {
  return {
    playerId,
    name,
  };
}

export function createTerrain(type) {
  return {
    type,
    movementPenalty: 0,
    movementBonus: 0,
  };
}

// end primitive 'classes'

export function createWorld(terrain, units) {
  return {
    terrain,
    units,
  };
}

// use this instead of interacting directly with the map
export function terrainGet(terrain, x, y) {
  return terrain[y][x];
}

export function unitGet(units, x, y) {
  return units[y][x];
}

export function worldTile(world, x, y) {
  return {
    x,
    y,
    terrain: terrainGet(world.terrain, x, y),
    unit: unitGet(world.units, x, y),
  };
}

function helperGenerateMap(width, height, contentFn) {
  const map = {};
  lodash.times(height, (y) => {
    lodash.times(width, (x) => {
      const content = contentFn(x, y);
      if (content || content === 0) {
        const key = coord(x, y);
        map[key] = content;
      }
    });
  });
  return map;
}

export function helperGenerateTerrain(width, height) {
  return helperGenerateMap(width, height, () => lodash.random(0, 3));
}

export function helperGenerateUnits(width, height) {
  return helperGenerateMap(width, height, (x, y) => {
    if (x > 1 && x < 8) { return null; }
    if ((y + x) % 2 === 0) { return null; }

    const ownerId = (x <= 3 ? 1 : 2);
    return createUnit(ownerId, lodash.random(0, 2));
  });
}

export function createGame(world, players) {
  return {
    world,
    players,
  };
}

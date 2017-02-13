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
    speed: (type + 2),  // how far can the unit move
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
  return helperGenerateMap(width, height, () => (
    lodash.random(CONSTANTS.TILE_CODES.GROUND, CONSTANTS.TILE_CODES.SAND)
  ));
}

export function helperGenerateUnits(width, height, allPlayers) {
  return helperGenerateMap(width, height, (x, y) => {
    if (x > 1 && x < 8) { return null; }
    if ((y + x) % 2 === 0) { return null; }

    const ownerId = (x <= 3 ? allPlayers[0].playerId : allPlayers[1].playerId);
    return createUnit(ownerId, lodash.random(0, 2));
  });
}

export function createGame(world, players) {
  return {
    world,
    players,
  };
}

function north(coordinate, distance = 1) {
  return { x: coordinate.x, y: coordinate.y - distance };
}
function east(coordinate, distance = 1) {
  return { x: coordinate.x + distance, y: coordinate.y };
}
function south(coordinate, distance = 1) {
  return { x: coordinate.x, y: coordinate.y + distance };
}
function west(coordinate, distance = 1) {
  return { x: coordinate.x - distance, y: coordinate.y };
}

export function generateRangeAreaForUnit(world, unit, origin, distance) {
  if (distance <= 0) { return []; }

  const key = coord(origin.x, origin.y);
  if (!world.terrain[key]) {
    return [];
  }

  const result = {};
  result[key] = {};
  const maybeUnit = world.units[key];
  let penalty = 1;
  if (maybeUnit) {
    // cannot move into this square
    penalty = 2;
    result[key] = {
      movement: false,
    };

    const isEnemyUnit = (maybeUnit.ownerId !== unit.ownerId);
    if (isEnemyUnit) {
      result[key] = {
        combat: true,
        movement: false,
      };
      return [result];
    }
  }

  const n = generateRangeAreaForUnit(world, unit, north(origin), distance - penalty);
  const e = generateRangeAreaForUnit(world, unit, east(origin), distance - penalty);
  const s = generateRangeAreaForUnit(world, unit, south(origin), distance - penalty);
  const w = generateRangeAreaForUnit(world, unit, west(origin), distance - penalty);

  return lodash.concat([], n, e, s, w);
  // const rangeInfo = this.rangeInfo(x, y);
  // if (rangeInfo && rangeInfo !== this.CONST.RANGE_CODES.EMPTY) {
  //   return;
  // }
  // let rangeCode = this.CONST.RANGE_CODES.EMPTY;
  // if (this.hasNoMovementObstacle(x, y)) {
  //   rangeCode = this.CONST.RANGE_CODES.MOVEMENT;
  // }
  // if (this.hasEnemyUnit(x, y)) {
  //   rangeCode = this.CONST.RANGE_CODES.COMBAT;
  // }
  // const coordinate = this.coord(x, y);
  // this.$set(this.range, coordinate, rangeCode);
  // const penalty = this.getMovementPenalty(x, y);
  // this.generateMovement(x + 1, y, distance - penalty);
  // this.generateMovement(x, y + 1, distance - penalty);
  // this.generateMovement(x - 1, y, distance - penalty);
  // this.generateMovement(x, y - 1, distance - penalty);
}

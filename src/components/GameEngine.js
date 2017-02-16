import lodash from 'lodash';
import CONSTANTS from './constants';
import engine from './../engine';

// TODO(ajt): DEPRECATED - use engine.core.coordinate
export function coord(x, y) {
  return `${x}_${y}`;
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

export function helperGenerateTerrain(width, height) {
  const dimensions = {
    width,
    height,
  };
  const terrainRatios = {};
  terrainRatios[CONSTANTS.TILE_CODES.GROUND] = 10;
  terrainRatios[CONSTANTS.TILE_CODES.WATER] = 10;
  terrainRatios[CONSTANTS.TILE_CODES.SAND] = 10;
  terrainRatios[CONSTANTS.TILE_CODES.GRASS] = 10;
  return engine.terrain.generateTerrainLayer({ dimensions, terrainRatios });
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

export function helperGenerateUnits(width, height, allPlayers) {
  return helperGenerateMap(width, height, (x, y) => {
    if (x > 1 && x < 8) { return null; }
    if ((y + x) % 2 === 0) { return null; }

    const ownerId = (x <= 3 ? allPlayers[0].playerId : allPlayers[1].playerId);
    const unitType = lodash.random(CONSTANTS.UNIT_CODES.PAWN, CONSTANTS.UNIT_CODES.BISHOP);
    return engine.unit.createUnit(ownerId, unitType);
  });
}

export function createGame(world, players) {
  return {
    world,
    players,
  };
}

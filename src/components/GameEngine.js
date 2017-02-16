import CONSTANTS from './constants';
import engine from './../engine';

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

export function helperGenerateUnits(width, height, allPlayers) {
  const dimensions = { width, height };
  return engine.unit.generateUnitLayerForBootstrap({ dimensions, allPlayers });
}

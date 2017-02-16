// import CONSTANTS from './constants';
import engine from './../engine';

// dimensions: { width, height }
export function helperGenerateTerrain(dimensions, terrainRatios = {}) {
  return engine.terrain.generateTerrainLayer({ dimensions, terrainRatios });
}

// dimensions: { width, height }
export function helperGenerateUnits(dimensions, allPlayers) {
  return engine.unit.generateUnitLayerForBootstrap({ dimensions, allPlayers });
}

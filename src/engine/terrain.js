import lodash from 'lodash';
import core from './core';
import layer from './layer';
import CONSTANTS from './../components/constants';

const TERRAIN = [
  { name: 'unknown', code: CONSTANTS.TILE_CODES.EMPTY },
  { name: 'ground', code: CONSTANTS.TILE_CODES.GROUND },
  { name: 'grass', code: CONSTANTS.TILE_CODES.GRASS },
  { name: 'water', code: CONSTANTS.TILE_CODES.WATER },
  { name: 'sand', code: CONSTANTS.TILE_CODES.SAND },
];
const TERRAIN_BY_CODE = lodash.keyBy(TERRAIN, 'code');

// terrainRatios is a map {<code>: chance}. e.g: {1: 10}
// terrainLayer has structure: { <coordinate>: <terrainCode>, ... }
function generateTerrainLayer({ dimensions, terrainRatios }) {
  const terrainGenerator = core.pickFromBagFunction(terrainRatios);

  const terrainLayer = layer.createLayer(dimensions, () => {
    const number = lodash.random(0, 1, true);
    const terrain = terrainGenerator(number);
    return lodash.toNumber(terrain.terrainCode);
  });

  return terrainLayer;
}

function nameFromCode(terrainCode) {
  return TERRAIN_BY_CODE[terrainCode].name;
}

export default {
  generateTerrainLayer,
  nameFromCode,
};

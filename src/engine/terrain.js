import lodash from 'lodash';
import core from './core';
import layer from './layer';

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

export default {
  generateTerrainLayer,
};

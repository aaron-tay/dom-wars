import lodash from 'lodash';
import core from './core';

// The terrain layer has this data structure
// { <coordinate>: <terrainCode>, ... }
function generateLayerWithContent(dimensions, contentFn) {
  const width = dimensions.width;
  const height = dimensions.height;
  const map = {};
  lodash.times(height, (y) => {
    lodash.times(width, (x) => {
      const content = contentFn(x, y);
      if (content || content === 0) {
        const key = core.coordinate(x, y);
        map[key] = content;
      }
    });
  });
  return map;
}

// terrainRatios is a map {<code>: chance}. e.g: {1: 10}
function generateTerrainLayer({ dimensions, terrainRatios }) {
  const terrainGenerator = core.pickFromBagFunction(terrainRatios);

  const layer = generateLayerWithContent(dimensions, () => {
    const number = lodash.random(0, 1, true);
    const terrain = terrainGenerator(number);
    return lodash.toNumber(terrain.terrainCode);
  });

  return layer;
}

export default {
  generateTerrainLayer,
};

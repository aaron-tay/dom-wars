import lodash from 'lodash';
import core from './core';

// Creates a layer of the given dimension and placing content according to the function
// Layer has the structure: { <coordinate>: <contentFn(x,y)>, ... }
function createLayer(dimensions, contentFn) {
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

export default {
  createLayer,
};

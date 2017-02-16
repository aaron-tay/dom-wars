import lodash from 'lodash';

/**
 * Returns the coordinate object composed of the (x,y) components
 * @params x,y any number
 */
function coordinate(x, y) {
  return `${x}_${y}`;
}

/**
 * Function generator which returns a function that is capable of picking random
 * elements from the provided map
 *
 * @params ratio Map of ratios: { <key>: chance }
 * @returns function that picks random elements from the original input
 */
function pickFromBagFunction(ratio) {
  // Generate probability scale based on input numbers
  const total = lodash.reduce(ratio, (sum, item) => sum + item);

  // Normalise the numbers, so we'll always work within [0.0, 1.0]
  // NOTE(ajt): JS has issues with floats but for our purposes its negligible
  const normalised = lodash.map(ratio, (item, key) => ({
    terrainCode: key,
    chance: (item / total),
  }));

  // input is [0.0, 1.0]. Other values will have unexpected behaviour
  return (input) => {
    let cumulativeProbability = 0;

    // http://stackoverflow.com/questions/9330394/how-to-pick-an-item-by-its-probability
    const terrain = lodash.find(normalised, (item) => {
      cumulativeProbability += item.chance;
      return (input <= cumulativeProbability);
    });

    return terrain;
  };
}

export default {
  coordinate,
  pickFromBagFunction,
};

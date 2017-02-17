import lodash from 'lodash';
import layer from './layer';
import CONSTANTS from './../components/constants';

function createUnit(playerId, type) {
  return {
    playerId,
    type,
    unitId: lodash.uniqueId('unit-'),
    hp: (type) * 3,
    attack: (type + 1),
    defense: (type),
    speed: (type),  // how far can the unit move
    behaviour: CONSTANTS.UNIT_BEHAVIOUR.MOVE_AND_ACTION,
    energy: {
      movement: true,
      action: true,
    },
  };
}

// This generation function is temporary
function generateUnitLayerForBootstrap({ dimensions, allPlayers }) {
  const unitLayer = layer.createLayer(dimensions, (x, y) => {
    if (x > 1 && x < 8) { return null; }
    if ((y + x) % 2 === 0) { return null; }

    const playerId = (x <= 3 ? allPlayers[0].playerId : allPlayers[1].playerId);
    const unitType = (y % 3) + 1;
    return createUnit(playerId, unitType);
  });

  return unitLayer;
}

export default {
  createUnit,
  generateUnitLayerForBootstrap,
};

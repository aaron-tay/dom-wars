// import lodash from 'lodash';
import CONSTANTS from './../components/constants';
import layer from './layer';

function createUnit(ownerId, type) {
  return {
    ownerId,
    type,
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

    const ownerId = (x <= 3 ? allPlayers[0].playerId : allPlayers[1].playerId);
    const unitType = (y % 3) + 1;
    return createUnit(ownerId, unitType);
  });

  return unitLayer;
}

export default {
  createUnit,
  generateUnitLayerForBootstrap,
};

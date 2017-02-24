import lodash from 'lodash';
import layer from './layer';
import CONSTANTS from './../engine/constants';

// NOTE(ajt): hand-coded weapons for now
function makeWeapon(type) {
  // Pawns can attack up to 2 squares distance (2 straight, 1 diagonal)
  if (type === CONSTANTS.UNIT_CODES.PAWN) {
    return {
      description: 'Flail (all directions)',
      minDistance: 1,
      maxDistance: 2,
    };
  }

  // Knights are only ranged (diagonal or one square gap)
  if (type === CONSTANTS.UNIT_CODES.KNIGHT) {
    return {
      description: 'Long Bow (ranged)',
      minDistance: 2,
      maxDistance: 2,
    };
  }

  // Bishops are only close-combat (1 straight)
  if (type === CONSTANTS.UNIT_CODES.BISHOP) {
    return {
      description: 'Wand (close-combat)',
      minDistance: 1,
      maxDistance: 1,
    };
  }

  return {
    minDistance: 1,
    maxDistance: 1,
  };
}

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
    weapon: makeWeapon(type),
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

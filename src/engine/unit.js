import CONSTANTS from './../components/constants';

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

export default {
  createUnit,
};

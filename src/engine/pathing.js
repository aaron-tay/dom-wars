import core from './core';
import layer from './layer';

function pathKey(x, y) {
  return core.coordinate(x, y);
}

function hasEnergyForMovement(unit) {
  return unit.energy.movement;
}

function hasEnergyForCombat(unit) {
  return unit.energy.action;
}

function hasOpponentUnitInTile(tile, currentUnit) {
  // definition of 'opponent' is based on the selectedUnit
  // console.log(tile.unit, this.selectedUnit);
  if (!tile.unit) { return false; }
  if (!currentUnit) { return false; }
  if (tile.unit.playerId === currentUnit.playerId) { return false; }
  if (tile.unit === currentUnit) { return false; }
  return true;
}

function tileMovementPenalty(tile, currentUnit) {
  // Cannot pass through opposing units
  if (hasOpponentUnitInTile(tile, currentUnit)) { return 999; }

  // Allowed to pass through friendly units as per usual
  return 1;
}

function canMoveIntoTile(tile, currentUnit, movementParams, distance) {
  const hasMovementObstacle = !!tile.unit;
  const hasMovementEnergy = hasEnergyForMovement(currentUnit);
  if (hasMovementObstacle || !hasMovementEnergy) {
    return false;
  }

  if (movementParams) {
    const distanceTravelled = distance; // (currentUnit.speed - distance);
    // TODO(ajt): bug here with negative distanceTravelled
    // console.log(distanceTravelled, currentUnit.speed, distance);
    const isWithinMaximumDistance = (distanceTravelled <= movementParams.maxDistance);
    return isWithinMaximumDistance;
  }

  return true;
}

function canEngageCombatInTile(tile, currentUnit, combatParams, distance) {
  const hasOpponent = hasOpponentUnitInTile(tile, currentUnit);
  const hasCombatEnergy = hasEnergyForCombat(currentUnit);
  if (!hasOpponent || !hasCombatEnergy) {
    return false;
  }

  if (combatParams) {
    // NOTE(ajt): this is hacky but tests a proof-of-concept
    const distanceTravelled = distance; // (currentUnit.speed - distance);
    const isWithinMinimumDistance = (combatParams.minDistance <= distanceTravelled);
    const isWithinMaximumDistance = (distanceTravelled <= combatParams.maxDistance);
    return (isWithinMinimumDistance && isWithinMaximumDistance);
  }

  return true;
}

function generatePathingArea(
  x, y, world, distance,
  movementParams, combatParams = {},
  iVisitedPaths = {}, parentCoordinate = null
) {
  const visitedPaths = iVisitedPaths;
  const maxDistance = Math.max(movementParams.maxDistance, combatParams.maxDistance);
  if (distance > maxDistance) { return visitedPaths; }

  const destinationTile = world.getTileFn(x, y);
  if (!destinationTile) { return visitedPaths; }

  const key = pathKey(x, y);
  const existingRangeInfo = visitedPaths[key];
  // console.log('GMA', key, existingRangeInfo, !!existingRangeInfo, destinationTile, visitedPaths);
  // Skip processing if the distance to reach this tile is greater than the best we've found.
  if (existingRangeInfo && (distance >= existingRangeInfo.distance)) {
    return visitedPaths;
  }

  const currentUnit = world.currentUnit;
  const movement = canMoveIntoTile(destinationTile, currentUnit, movementParams, distance);
  const combat = canEngageCombatInTile(destinationTile, currentUnit, combatParams, distance);
  // an enemy in any tile considered is combat-engageable

  visitedPaths[key] = {
    movement,
    combat,
    distance,
    parent: parentCoordinate,
  };

  const coordinate = { x, y };
  const penalty = tileMovementPenalty(destinationTile, currentUnit);
  const newDistance = (distance + penalty);

  // NOTE(ajt): linter disable cos its easier to follow
  /* eslint-disable max-len */
  generatePathingArea(x + 1, y, world, newDistance, movementParams, combatParams, visitedPaths, coordinate);
  generatePathingArea(x, y + 1, world, newDistance, movementParams, combatParams, visitedPaths, coordinate);
  generatePathingArea(x - 1, y, world, newDistance, movementParams, combatParams, visitedPaths, coordinate);
  generatePathingArea(x, y - 1, world, newDistance, movementParams, combatParams, visitedPaths, coordinate);
  /* eslint-enable */
  return visitedPaths;
}

function generatePathingLayerForUnit({ world }) {
  const dimensions = world.dimensions;
  const startX = world.currentTile.x;
  const startY = world.currentTile.y;
  const movementParams = {
    // concept of minimum distance doesn't make sense
    maxDistance: world.currentUnit.speed,
  };
  const combatParams = {
    minDistance: world.currentUnit.weapon.minDistance,
    maxDistance: world.currentUnit.weapon.maxDistance,
  };
  // NOTE(ajt): Since we're using the same function to generate the pathing area,
  // we need to consider enough squares for both movement and combat
  // const distance = Math.max(movementParams.maxDistance, combatParams.maxDistance);

  /* eslint-disable max-len */
  const pathingArea = generatePathingArea(startX, startY, world, 0, movementParams, combatParams);
  /* eslint-enable */

  const pathingLayer = layer.createLayer(dimensions, (x, y) => {
    const key = pathKey(x, y);
    return pathingArea[key];
  });

  return pathingLayer;
}

export default {
  generatePathingLayerForUnit,
};

import lodash from 'lodash';
import core from './core';
import layer from './layer';

function pathKey(x, y) {
  return core.coordinate(x, y);
}

// Check if the number if between the [min, max] inclusively at both bounds
function inRange(number, min, max, isMaxInclusive = true) {
  const adjustment = (isMaxInclusive ? 1 : 0);
  const result = lodash.inRange(number, min, max + adjustment);
  return result;
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

// NOTE(ajt): Same penalty is currently applied to both movement and attack
// Attacking might benefit from using a different penalty in the future
function tileMovementPenalty(tile, currentUnit) {
  // Cannot pass through opposing units
  if (hasOpponentUnitInTile(tile, currentUnit)) { return 999; }

  // Allowed to pass through friendly units as per usual
  return 1;
}

function canMoveIntoTile(tile, currentUnit, movementParams, distanceTravelled) {
  const hasMovementObstacle = !!tile.unit;
  const hasMovementEnergy = hasEnergyForMovement(currentUnit);
  if (hasMovementObstacle || !hasMovementEnergy) {
    return false;
  }

  if (movementParams) {
    const min = 0;
    const max = movementParams.maxDistance;
    const isWithinRange = inRange(distanceTravelled, min, max);
    return isWithinRange;
  }

  return true;
}

function canEngageCombatInTile(tile, currentUnit, combatParams, distanceTravelled) {
  const hasOpponent = hasOpponentUnitInTile(tile, currentUnit);
  const hasCombatEnergy = hasEnergyForCombat(currentUnit);
  if (!hasOpponent || !hasCombatEnergy) {
    return false;
  }

  if (combatParams) {
    const min = combatParams.minDistance;
    const max = combatParams.maxDistance;
    const isWithinRange = inRange(distanceTravelled, min, max);
    return isWithinRange;
  }

  return true;
}

// TODO(ajt): Make this generic so we can apply different subtle logic to it
// Having movement and combat combined is nice but there's definitely short-comings
// due to the coupled nature
function generatePathingArea(
  x, y, world,
  movementParams = {}, combatParams = {},
  distance = 0,
  iVisitedPaths = {}, parentCoordinate = null
) {
  const visitedPaths = iVisitedPaths;
  const maxDistance = Math.max(movementParams.maxDistance, combatParams.maxDistance);
  if (!inRange(distance, 0, maxDistance)) { return visitedPaths; }

  const destinationTile = world.getTile(x, y);
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
  // NOTE(ajt): This movement logic means diagonals cost '2' (i.e. manhatten distance)
  /* eslint-disable max-len */
  generatePathingArea(x + 1, y, world, movementParams, combatParams, newDistance, visitedPaths, coordinate);
  generatePathingArea(x, y + 1, world, movementParams, combatParams, newDistance, visitedPaths, coordinate);
  generatePathingArea(x - 1, y, world, movementParams, combatParams, newDistance, visitedPaths, coordinate);
  generatePathingArea(x, y - 1, world, movementParams, combatParams, newDistance, visitedPaths, coordinate);
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
  const pathingArea = generatePathingArea(startX, startY, world, movementParams, combatParams);
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

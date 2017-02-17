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

function canMoveIntoTile(tile, currentUnit) {
  const hasMovementObstacle = !!tile.unit;
  const hasMovementEnergy = hasEnergyForMovement(currentUnit);
  return !hasMovementObstacle && hasMovementEnergy;
}

function canEngageCombatInTile(tile, currentUnit) {
  const hasOpponent = hasOpponentUnitInTile(tile, currentUnit);
  const hasCombatEnergy = hasEnergyForCombat(currentUnit);
  return hasOpponent && hasCombatEnergy;
}

function generatePathingArea(x, y, distance, world, iVisitedPaths = {}, parentCoordinate = null) {
  const visitedPaths = iVisitedPaths;
  if (distance < 0) { return visitedPaths; }

  const destinationTile = world.getTileFn(x, y);
  if (!destinationTile) { return visitedPaths; }

  const key = pathKey(x, y);
  const existingRangeInfo = visitedPaths[key];
  // console.log('GMA', key, existingRangeInfo, !!existingRangeInfo, destinationTile, paths);
  // NOTE(ajt): Distance check to ensure we have the greatest area possibly covered
  if (existingRangeInfo && distance <= existingRangeInfo.distance) {
    return visitedPaths;
  }

  const currentUnit = world.currentUnit;
  const movement = canMoveIntoTile(destinationTile, currentUnit);
  const combat = canEngageCombatInTile(destinationTile, currentUnit);
  // an enemy in any tile considered is combat-engageable

  visitedPaths[key] = {
    movement,
    combat,
    distance,
    parent: parentCoordinate,
  };

  const destinationCoordinate = { x, y };
  const penalty = tileMovementPenalty(destinationTile, currentUnit);
  generatePathingArea(x + 1, y, distance - penalty, world, visitedPaths, destinationCoordinate);
  generatePathingArea(x, y + 1, distance - penalty, world, visitedPaths, destinationCoordinate);
  generatePathingArea(x - 1, y, distance - penalty, world, visitedPaths, destinationCoordinate);
  generatePathingArea(x, y - 1, distance - penalty, world, visitedPaths, destinationCoordinate);
  return visitedPaths;
}

function generatePathingLayerForUnit({ world }) {
  const dimensions = world.dimensions;
  const startX = world.currentTile.x;
  const startY = world.currentTile.y;
  const distance = world.currentUnit.speed;
  const pathingArea = generatePathingArea(startX, startY, distance, world);

  const pathingLayer = layer.createLayer(dimensions, (x, y) => {
    const key = pathKey(x, y);
    return pathingArea[key];
  });

  return pathingLayer;
}

export default {
  generatePathingLayerForUnit,
};

import core from './core';
import layer from './layer';

function pathKey(x, y) {
  return core.coordinate(x, y);
}

function hasOpponentUnitInTile(tile, currentUnit) {
  // definition of 'opponent' is based on the selectedUnit
  // console.log(tile.unit, this.selectedUnit);
  if (!tile.unit) { return false; }
  if (!currentUnit) { return false; }
  if (tile.unit.ownerId === currentUnit.ownerId) { return false; }
  if (tile.unit === currentUnit) { return false; }
  return true;
}

function tileMovementPenalty(tile, currentUnit) {
  // Cannot pass through opposing units
  if (hasOpponentUnitInTile(tile, currentUnit)) { return 999; }

  // Allowed to pass through friendly units as per usual
  return 1;
}

function canMoveIntoTile(tile) {
  const hasMovementObstacle = !!tile.unit;
  return !hasMovementObstacle;
}

function generatePathingArea(x, y, distance, world, iVisitedPaths = {}) {
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
  const movement = canMoveIntoTile(destinationTile);
  const combat = hasOpponentUnitInTile(destinationTile, currentUnit);
  // an enemy in any tile considered is combat-engageable

  visitedPaths[key] = {
    movement,
    combat,
    distance,
  };

  const penalty = tileMovementPenalty(destinationTile, currentUnit);
  generatePathingArea(x + 1, y, distance - penalty, world, visitedPaths);
  generatePathingArea(x, y + 1, distance - penalty, world, visitedPaths);
  generatePathingArea(x - 1, y, distance - penalty, world, visitedPaths);
  generatePathingArea(x, y - 1, distance - penalty, world, visitedPaths);
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

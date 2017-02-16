import core from './core';
import layer from './layer';

function rangeKey(x, y) {
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

function generatePathingArea(x, y, distance, world, iRange = {}) {
  const range = iRange;
  if (distance < 0) { return range; }

  const destinationTile = world.getTileFn(x, y);
  if (!destinationTile) { return range; }

  const key = rangeKey(x, y);
  const existingRangeInfo = range[key];
  // console.log('GMA', key, existingRangeInfo, !!existingRangeInfo, destinationTile, range);
  // NOTE(ajt): Distance check to ensure we have the greatest area possibly covered
  if (existingRangeInfo && distance <= existingRangeInfo.distance) {
    return range;
  }

  const currentUnit = world.currentUnit;
  const movement = canMoveIntoTile(destinationTile);
  const combat = hasOpponentUnitInTile(destinationTile, currentUnit);
  // an enemy in any tile considered is combat-engageable

  range[key] = {
    movement,
    combat,
    distance,
  };

  const penalty = tileMovementPenalty(destinationTile, currentUnit);
  generatePathingArea(x + 1, y, distance - penalty, world, range);
  generatePathingArea(x, y + 1, distance - penalty, world, range);
  generatePathingArea(x - 1, y, distance - penalty, world, range);
  generatePathingArea(x, y - 1, distance - penalty, world, range);
  return range;
}

function generatePathingLayerForUnit({ world }) {
  const dimensions = world.dimensions;
  const startX = world.currentTile.x;
  const startY = world.currentTile.y;
  const distance = world.currentUnit.speed;
  const range = generatePathingArea(startX, startY, distance, world);

  const pathingLayer = layer.createLayer(dimensions, (x, y) => {
    const key = rangeKey(x, y);
    return range[key];
  });

  return pathingLayer;
}

export default {
  generatePathingLayerForUnit,
};

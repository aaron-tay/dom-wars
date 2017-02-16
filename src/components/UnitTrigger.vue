<template>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import core from './../engine/core';

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters([
      'getSelectedTile',
      'getSelectedUnit',
      'getTileFn',
    ]),
    selectedUnit() {
      return this.getSelectedUnit;
    },
  },
  methods: {
    ...mapActions([
      'setRangeArea',
    ]),
    rangeKey(x, y) {
      return core.coordinate(x, y);
    },
    hasOpponentUnitInTile(tile) {
      // definition of 'opponent' is based on the selectedUnit
      // console.log(tile.unit, this.selectedUnit);
      if (!tile.unit) { return false; }
      if (!this.selectedUnit) { return false; }
      if (tile.unit.ownerId === this.selectedUnit.ownerId) { return false; }
      if (tile.unit === this.selectedUnit) { return false; }
      return true;
    },
    tileMovementPenalty(tile) {
      // Cannot pass through opposing units
      if (this.hasOpponentUnitInTile(tile)) { return 999; }

      // Allowed to pass through friendly units as per usual
      return 1;
    },
    canMoveIntoTile(tile) {
      const hasMovementObstacle = !!tile.unit;
      return !hasMovementObstacle;
    },
    generateRangeArea(x, y, distance, iRange = {}) {
      const range = iRange;
      if (distance < 0) { return range; }

      const destinationTile = this.getTileFn(x, y);
      if (!destinationTile) { return range; }

      const key = this.rangeKey(x, y);
      const existingRangeInfo = range[key];
      // console.log('GMA', key, existingRangeInfo, !!existingRangeInfo, destinationTile, range);
      // NOTE(ajt): Distance check to ensure we have the greatest area possibly covered
      if (existingRangeInfo && distance <= existingRangeInfo.distance) {
        return range;
      }

      const movement = this.canMoveIntoTile(destinationTile);
      const combat = this.hasOpponentUnitInTile(destinationTile);
      // an enemy in any tile considered is combat-engageable

      range[key] = {
        movement,
        combat,
        distance,
      };

      const penalty = this.tileMovementPenalty(destinationTile);
      this.generateRangeArea(x + 1, y, distance - penalty, range);
      this.generateRangeArea(x, y + 1, distance - penalty, range);
      this.generateRangeArea(x - 1, y, distance - penalty, range);
      this.generateRangeArea(x, y - 1, distance - penalty, range);
      return range;
    },
  },
  watch: {
    getSelectedUnit(currentUnit, previousUnit) {
      if (currentUnit === previousUnit) { return; }
      if (!currentUnit) {
        this.range = {};
        this.setRangeArea({});
        return;
      }

      const currentTile = this.getSelectedTile;
      const x = currentTile.x;
      const y = currentTile.y;
      const distance = currentTile.unit.speed;
      const range = this.generateRangeArea(x, y, distance);
      this.setRangeArea(range);
    },
  },
};
</script>

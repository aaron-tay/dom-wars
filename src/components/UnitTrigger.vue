<template>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import pathing from './../engine/pathing';

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
      'getWorldDefinition',
    ]),
    selectedUnit() {
      return this.getSelectedUnit;
    },
  },
  methods: {
    ...mapActions([
      'setPathingLayer',
    ]),
  },
  watch: {
    getSelectedUnit(currentUnit, previousUnit) {
      if (currentUnit === previousUnit) { return; }
      if (!currentUnit) {
        this.setPathingLayer({});
        return;
      }

      const world = {
        currentTile: this.getSelectedTile,
        currentUnit: this.getSelectedTile.unit,
        getTileFn: this.getTileFn,
        dimensions: this.getWorldDefinition,
      };

      const pathingLayer = pathing.generatePathingLayerForUnit({
        world,
      });

      this.setPathingLayer(pathingLayer);
    },
  },
};
</script>

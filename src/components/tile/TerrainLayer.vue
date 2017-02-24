<template>
  <div class="tile-layer layer--terrain" :class="terrainCssClass">
  </div>
</template>

<script>
export default {
  props: {
    // Legacy input
    legacyTerrain: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  computed: {
    // Internally we use this representation until we've migrated
    terrain() {
      return {
        code: this.legacyTerrain,
      };
    },
    terrainCssClass() {
      return {
        'terrain--ground': this.terrain.code === 1,
        'terrain--grass': this.terrain.code === 2,
        'terrain--water': this.terrain.code === 3,
        'terrain--sand': this.terrain.code === 4,
      };
    },
  },
};
</script>

<style lang="scss">
@import './../../assets/globals.scss';

.terrain--grass {
  background-color: $pastel-green;
}
.terrain--ground {
  background-color: $pastel-brown;
}
.terrain--water {
  background-color: $pastel-blue-darker;
}
.terrain--sand {
  background-color: $pastel-yellow;
}

</style>

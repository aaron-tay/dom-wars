<template>
  <!-- TODO(ajt): optimise to only render what is necessary -->
  <!-- NOTE(ajt): layers within tiles causes overlapping which isn't nice... -->
  <div class="tile-info" v-mdl>
    <div class="mdl-grid mdl-grid--no-spacing">
      <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col">
        <div class="mdl-card__title mdl-card--expand">
          <h2 class="mdl-card__title-text">
            <dom-game-tile :tile="tile"></dom-game-tile>
          </h2>
        </div>
        <div class="mdl-card__supporting-text" v-if="tile">
          <p>
            {{ terrainInfo }}
          </p>
          <p>
            {{ unitInfo }}
          </p>
          <p>
            {{ rangeInfo }}
          </p>
        </div>
        <div class="mdl-card__actions mdl-card--border">
          {{ tile }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DomGameTile from './DomGameTile';

export default {
  components: {
    DomGameTile,
  },
  props: {
    tile: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0,
          terrain: {},
          unit: {},
          range: {},
          isSelected: false,
        };
      },
    },
  },
  data() {
    return {
      terrain: {
        0: 'Ground',
        1: 'Grass',
        2: 'Water',
        3: 'Sand',
      },
      unit: {
        0: 'Pawn',
        1: 'Knight',
        2: 'Bishop',
      },
      range: {
        0: 'None',
        1: 'Movement',
        2: 'Combat',
      },
    };
  },
  computed: {
    isSelected() {
      return this.tile.isSelected;
    },
    terrainLayer() {
      return this.tile.terrain;
    },
    unitLayer() {
      return this.tile.unit;
    },
    rangeLayer() {
      return this.tile.range;
    },
    terrainInfo() {
      return this.terrain[this.terrainLayer] || 'unknown';
    },
    unitInfo() {
      if (!this.unitLayer) { return 'unknown'; }
      return this.unit[this.unitLayer.type] || 'unknown';
    },
    rangeInfo() {
      return this.range[this.rangeLayer] || 'unknown';
    },
  },
};
</script>

<style lang="scss">
@import './../assets/globals.scss';
</style>

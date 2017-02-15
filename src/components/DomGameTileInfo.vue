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
          <span class="tile-info__terrain-text">
            {{ terrainInfo }}
          </span>
        </div>
        <div class="mdl-card__supporting-text">
          <p>
            Contains: {{ unitInfo }} (owned by {{ unitOwner }})
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
        0: 'Unknown',
        1: 'Ground',
        2: 'Grass',
        3: 'Water',
        4: 'Sand',
      },
      unit: {
        0: 'Unknown',
        1: 'Pawn',
        2: 'Knight',
        3: 'Bishop',
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
      if (!this.unitLayer) { return 'nothing'; }
      return this.unit[this.unitLayer.type] || 'unknown';
    },
    unitOwner() {
      if (!this.unitLayer) { return 'n/a'; }
      return this.unitLayer.owner.name;
    },
    rangeInfo() {
      return this.range[this.rangeLayer] || 'unknown';
    },
  },
};
</script>

<style lang="scss">
@import './../assets/globals.scss';

.tile-info__terrain-text {
  margin-left: 16px;
  font-size: 24px;
}
</style>

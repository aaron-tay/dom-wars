<template>
  <!-- NOTE(ajt): layers within tiles means we're restricted to tile dimensions -->
  <div class="tile" :class="tileCssClass">
    <terrain-layer :terrain="terrain"></terrain-layer>

    <span class="debug">
      {{tile.x}},{{tile.y}}
    </span>

    <transition name="fade">
      <pathing-layer :pathing="tile.pathing" v-if="tile.pathing"></pathing-layer>
    </transition>

    <transition name="fade">
      <unit-layer :unit="tile.unit" v-if="tile.unit"></unit-layer>
    </transition>
  </div>
</template>

<script>
import TerrainLayer from './tile/TerrainLayer';
import PathingLayer from './tile/PathingLayer';
import UnitLayer from './tile/UnitLayer';

export default {
  components: {
    TerrainLayer,
    PathingLayer,
    UnitLayer,
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
          pathing: {},
          isSelected: false,
          tileset: 0,
        };
      },
    },
  },
  computed: {
    // TODO(ajt): Adapter over legacy terrain implementation
    terrain() {
      return {
        code: this.tile.terrain,
      };
    },
    tileCssClass() {
      return {
        'tile--selected': this.tile.isSelected,
        'tile--set-kenney': this.tile.tileset === 'kenney',
      };
    },
  },
};
</script>

<style lang="scss">
@import './../assets/globals.scss';

$fade-duration-ms: 0.75s;
$resting-z-index: 0;
$selected-z-index: ($resting-z-index + 100);

$color-selected: $color-info;

// Roughly 64px at desktop size
// $tile-size-px: 8vmin;
$tile-size-px: 64px;

.debug {
  color: transparentize(#333, 0.7);
  display: none;
}

.tile {
  width: $tile-size-px;
  height: $tile-size-px;
  border: 1px solid #efefef;
  position: relative;
  display: table-cell;
  // NOTE(ajt): not sure why I need 'table-cell'... inline-block should work...
  z-index: $resting-z-index;

  //http://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting-using-css
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.enabled .tile:hover {
  border: 1px solid $color-selected;
  z-index: $selected-z-index;
}

.tile-layer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  @include transition(background-color, $fade-duration-ms, ease-in-out);
}

.tile--selected {
  outline: 3px solid $color-selected;
  border: 1px solid $color-selected;
  z-index: $selected-z-index;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}

</style>

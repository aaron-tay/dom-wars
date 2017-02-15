<template>
  <!-- TODO(ajt): optimise to only render what is necessary -->
  <!-- NOTE(ajt): layers within tiles causes overlapping which isn't nice... -->
  <div class="tile" :class="{ 'tile--selected': tile.isSelected }">
    <div class="tile-layer" :class="terrainLayerClass">
      <span class="debug">
        {{tile.x}},{{tile.y}}
      </span>
    </div>

    <transition name="fade">
      <div class="tile-layer" v-if="tile.range">
        <div class="info-range" :class="rangeLayerClass">
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="tile-layer" v-if="tile.unit">
        <div class="content-unit" :class="unitLayerClass">
          {{ unitLayer.hp }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
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
  computed: {
    ...mapGetters([
      'getPlayerById',
    ]),
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
    terrainLayerClass() {
      return {
        'terrain--ground': this.terrainLayer === 1,
        'terrain--grass': this.terrainLayer === 2,
        'terrain--water': this.terrainLayer === 3,
        'terrain--sand': this.terrainLayer === 4,
      };
    },
    unitLayerClass() {
      if (!this.unitLayer) { return {}; }
      return {
        'content-unit--pawn': this.unitLayer.type === 1,
        'content-unit--knight': this.unitLayer.type === 2,
        'content-unit--bishop': this.unitLayer.type === 3,
        'unit-owner--player-one': this.getPlayerById(this.unitLayer.ownerId).localId === 1,
        'unit-owner--player-two': this.getPlayerById(this.unitLayer.ownerId).localId === 2,
      };
    },
    rangeLayerClass() {
      if (!this.rangeLayer) { return {}; }
      return {
        'info-range--movement': this.rangeLayer.movement,
        'info-range--combat': this.rangeLayer.combat,
      };
    },
  },
};
</script>

<style lang="scss">
@import './../assets/globals.scss';

$fade-duration-ms: 0.75s;
$resting-z-index: 0;
$range-area-z-index: ($resting-z-index + 50);
$selected-z-index: ($resting-z-index + 100);

$color-info: #2525d9;
$color-danger: #d92525;
$color-success: #25d925;
$color-selected: $color-info;
$color-range-movement: $color-info;
$color-range-combat: $color-danger;

$tile-size-px: 64px;

.debug {
  color: transparentize(#333, 0.7);
}

.tile {
  width: $tile-size-px;
  height: $tile-size-px;
  border: 1px solid #efefef;
  position: relative;
  display: table-cell;
  // NOTE(ajt): not sure why I need 'table-cell'... inline-block should work...
  z-index: $resting-z-index;
}

.tile:hover {
  border: 1px solid $color-selected;
  z-index: $selected-z-index;
}

.tile-layer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  transition: background-color $fade-duration-ms ease-in-out;
  -moz-transition: background-color $fade-duration-ms ease-in-out;
  -webkit-transition: background-color $fade-duration-ms ease-in-out;
}

.tile--selected {
  outline: 3px solid $color-selected;
  border: 1px solid $color-selected;
  z-index: $selected-z-index;
}

.tile--range-area {
  z-index: $range-area-z-index;
}

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

.content-unit {
  position: relative;
  margin: auto;
  top: 22.5%;
  width: 50%;
  height: 50%;
  text-align: center;

  transition: background-color $fade-duration-ms/2.0 ease-in-out;
  -moz-transition: background-color $fade-duration-ms/2.0 ease-in-out;
  -webkit-transition: background-color $fade-duration-ms/2.0 ease-in-out;
}
.content-unit--pawn {
  background-color: $pastel-orange;
  // background: url('~assets/domgame/noun_835647_cc.svg');
}
.content-unit--knight {
  background-color: $pastel-purple-lighter;
}
.content-unit--bishop {
  background-color: $pastel-magenta;
}

.unit-owner--player-one {
  border: 2px solid $player-one-color;
  border-radius: 4px;
}
.unit-owner--player-two {
  border: 2px solid $player-two-color;
  border-radius: 4px;
}

.info-range {
  position: relative;
  margin: auto;
  top: 10%;
  width: 80%;
  height: 80%;
  text-align: center;
  border-radius: 4px;
}
.info-range--movement {
  background-color: transparentize($color-range-movement, 0.5);
}
.info-range--combat {
  background-color: transparentize($color-range-combat, 0.5);
}
.info-range--blocked {
  background-color: transparentize($pastel-gray, 0.5);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>

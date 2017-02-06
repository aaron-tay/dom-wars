<template>
  <!-- TODO(ajt): optimise to only render what is necessary -->
  <!-- NOTE(ajt): layers within tiles causes overlapping which isn't nice... -->
  <div class="tile" :class="{ 'tile--selected': tile.isSelected }">
    <div class="tile-layer" :class="terrainLayerClass">
    </div>

    <div class="tile-layer" v-if="tile.unit">
      <div class="content-unit" :class="unitLayerClass">
        {{ unitLayer.hp }}
      </div>
    </div>

    <div class="tile-layer" v-if="tile.range">
      <div class="info-range" :class="rangeLayerClass">
      </div>
    </div>
  </div>
</template>

<script>
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
        'terrain--ground': this.terrainLayer === 0,
        'terrain--grass': this.terrainLayer === 1,
        'terrain--water': this.terrainLayer === 2,
        'terrain--sand': this.terrainLayer === 3,
      };
    },
    unitLayerClass() {
      if (!this.unitLayer) { return {}; }
      return {
        'content-unit--pawn': this.unitLayer.type === 0,
        'content-unit--knight': this.unitLayer.type === 1,
        'content-unit--bishop': this.unitLayer.type === 2,
        'unit-owner--player-one': this.unitLayer.ownerId === 1,
        'unit-owner--player-two': this.unitLayer.ownerId === 2,
      };
    },
    rangeLayerClass() {
      return {
        'info-range--movement': this.rangeLayer === 1,
        'info-range--combat': this.rangeLayer === 2,
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

.tile {
  width: 64px;
  height: 64px;
  outline: 1px solid #efefef;
  position: relative;
  display: table-cell;
  // NOTE(ajt): not sure why I need 'table-cell'... inline-block should work...
  z-index: $resting-z-index;
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
  outline: 5px solid #25d925;
  z-index: $selected-z-index;
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
  top: 25%;
  width: 50%;
  height: 50%;
  text-align: center;

  transition: background-color $fade-duration-ms ease-in-out;
  -moz-transition: background-color $fade-duration-ms ease-in-out;
  -webkit-transition: background-color $fade-duration-ms ease-in-out;
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
  outline: 2px solid $player-one-color;
}
.unit-owner--player-two {
  outline: 2px solid $player-two-color;
}

.info-range {
  position: relative;
  width: 100%;
  height: 100%;
}
.info-range--movement {
  background-color: transparentize($pastel-green-darker, 0.5);
  outline: 1px solid rgba(0, 255, 0, 1.0);
}
.info-range--combat {
  background-color: transparentize($pastel-red, 0.5);
  outline: 1px solid rgba(255, 0, 0, 1.0);
}
.info-range--blocked {
  background-color: transparentize($pastel-gray, 0.5);
}
</style>

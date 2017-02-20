<template>
  <!-- TODO(ajt): optimise to only render what is necessary -->
  <!-- NOTE(ajt): layers within tiles causes overlapping which isn't nice... -->
  <div class="tile" :class="tileClass">
    <div class="tile-layer" :class="terrainLayerClass">
      <span class="debug">
        {{tile.x}},{{tile.y}}
      </span>
    </div>

    <transition name="fade">
      <div class="tile-layer" v-if="tile.pathing">
        <div class="info-pathing" :class="pathingLayerClass">
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="tile-layer" v-if="tile.unit">
        <div class="content-unit" :class="unitLayerClass">
          <span class="unit__hp">
            {{ unitLayer.hp }}
          </span>
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
          pathing: {},
          isSelected: false,
          tileset: 0,
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
    pathingLayer() {
      return this.tile.pathing;
    },
    tileClass() {
      return {
        'tile--selected': this.isSelected,
        'tileset-kenney': this.tile.tileset === 'kenney',
      };
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
        'unit-owner--player-one': this.getPlayerById(this.unitLayer.playerId).localId === 1,
        'unit-owner--player-two': this.getPlayerById(this.unitLayer.playerId).localId === 2,
      };
    },
    pathingLayerClass() {
      if (!this.pathingLayer) { return {}; }
      return {
        'info-pathing--movement': this.pathingLayer.movement,
        'info-pathing--combat': this.pathingLayer.combat,
      };
    },
  },
};
</script>

<style lang="scss">
@import './../assets/globals.scss';

$fade-duration-ms: 0.75s;
$resting-z-index: 0;
$pathing-area-z-index: ($resting-z-index + 50);
$selected-z-index: ($resting-z-index + 100);

$color-info: #2525d9;
$color-danger: #d92525;
$color-success: #25d925;
$color-selected: $color-info;
$color-pathing-movement: $color-info;
$color-pathing-combat: $color-danger;

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

.tile--pathing-area {
  z-index: $pathing-area-z-index;
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

  @include transition(background-color, $fade-duration-ms/2.0, ease-in-out);
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
.unit__hp {
  border-radius: 999px;
  width: 20px;
  height: 20px;
  position: absolute;
  top: -10px;
  left: -10px;
}

.unit-owner--player-one .unit__hp {
  background-color: $player-one-color;
}
.unit-owner--player-two .unit__hp {
  background-color: $player-two-color;
}

.unit-owner--player-one {
  border: 2px solid $player-one-color;
  border-radius: 4px;
}
.unit-owner--player-two {
  border: 2px solid $player-two-color;
  border-radius: 4px;
}

.info-pathing {
  position: relative;
  margin: auto;
  top: 10%;
  width: 80%;
  height: 80%;
  text-align: center;
  border-radius: 4px;
}
.info-pathing--movement {
  background-color: transparentize($color-pathing-movement, 0.5);
}
.info-pathing--combat {
  background-color: transparentize($color-pathing-combat, 0.5);
}
.info-pathing--blocked {
  background-color: transparentize($pastel-gray, 0.5);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}

// NOTE(ajt): Here's some documentation for next time on sass mixins & functions
// http://thesassway.com/advanced/pure-sass-functions

$kenney-tile-size: 64px;
$kenney-tile-padding: 32px;
@function kenney-pos($input, $offset:0) {
  @return -(($kenney-tile-size * $input) + ($kenney-tile-padding * ($input + 1)) + $offset);
}
@mixin kenney-tile($x, $y, $xOffset:0, $yOffset:0) {
  background-image: url('~assets/tileset-kenney-medieval.svg');
  background-repeat: no-repeat;
  background-position: kenney-pos($x, $xOffset) kenney-pos($y, $yOffset);
  opacity: 1;
}

.tileset-kenney .tile-layer {
  @include transition(background-position, $fade-duration-ms/2.0, ease-in-out);
}

.tileset-kenney .terrain--grass {
  @include kenney-tile(0, 0);
}

.tileset-kenney .terrain--ground {
  @include kenney-tile(1, 1);
}

.tileset-kenney .terrain--water {
  @include kenney-tile(1, 2);
}

.tileset-kenney .terrain--sand {
  @include kenney-tile(2, 0);
}

.tileset-kenney .content-unit--pawn.unit-owner--player-one {
  @include kenney-tile(12, 4, 16px, 16px);
}
.tileset-kenney .content-unit--knight.unit-owner--player-one {
  @include kenney-tile(14, 4, 16px, 16px);
}
.tileset-kenney .content-unit--bishop.unit-owner--player-one {
  @include kenney-tile(13, 4, 16px, 16px);
}

.tileset-kenney .content-unit--pawn.unit-owner--player-two {
  @include kenney-tile(12, 6, 16px, 16px);
}
.tileset-kenney .content-unit--knight.unit-owner--player-two {
  @include kenney-tile(14, 6, 16px, 16px);
}
.tileset-kenney .content-unit--bishop.unit-owner--player-two {
  @include kenney-tile(13, 6, 16px, 16px);
}
</style>

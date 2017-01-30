<template>
  <!-- TODO(ajt): optimise to only render what is necessary -->
  <!-- NOTE(ajt): layers within tiles causes overlapping which isn't nice... -->
  <div class="tile">
    <div class="tile-layer" :class="terrainLayerClass">
    </div>

    <div class="tile-layer">
      <div class="content-unit" :class="unitLayerClass">
        {{ unitLayer.hp }}
      </div>
    </div>

    <div class="tile-layer">
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
// Was the first reference I found for pastel colours. Looks good enough :)
// http://colors.findthedata.com/saved_search/Pastel-Colors
$pastel-blue: rgb(174,198,207);
$pastel-blue-darker: rgb(119,158,203);
$pastel-brown: rgb(130,105,83);
$pastel-gray: rgb(207,207,196);
$pastel-green: rgb(119,190,119);
$pastel-green-darker: rgb(3,192,60);
$pastel-magenta: rgb(244,154,194);
$pastel-orange: rgb(255,179,71);
$pastel-pink: rgb(255,209,220);
$pastel-pink-darker: rgb(222,165,164);
$pastel-purple: rgb(179,158,181);
$pastel-purple-lighter: rgb(177,156,217);
$pastel-purple-darker: rgb(150,111,214);
$pastel-red: rgb(255,105,97);
$pastel-red-darker: rgb(194,59,34);
$pastel-violet: rgb(203,153,201);
$pastel-yellow: rgb(253,253,150);

$pastel-blue-hex: #AEC6CF;
$pastel-blue-darker-hex: #779ECB;
$pastel-brown-hex: #836953;
$pastel-gray-hex: #CFCFC4;
$pastel-green-hex: #77DD77;
$pastel-green-darker-hex: #03C03C;
$pastel-magenta-hex: #F49AC2;
$pastel-orange-hex: #FFB347;
$pastel-pink-hex: #FFD1DC;
$pastel-pink-darker-hex: #DEA5A4;
$pastel-purple-hex: #B39EB5;
$pastel-purple-lighter-hex: #B19CD9;
$pastel-purple-darker-hex: #966FD6;
$pastel-red-hex: #FF6961;
$pastel-red-darker-hex: #C23B22;
$pastel-violet-hex: #CB99C9;
$pastel-yellow-hex: #FDFD96;

.tile {
  width: 64px;
  height: 64px;
  // outline: 1px solid #efefef;
  position: relative;
  display: table-cell;
  // NOTE(ajt): not sure why I need 'table-cell'... inline-block should work...
}
.tile-layer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
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
}
.content-unit--pawn {
  background-color: $pastel-orange;
  // background: url('~assets/domgame/noun_835647_cc.svg');
}
.content-unit--knight {
  background-color: $pastel-purple-darker;
}
.content-unit--bishop {
  background-color: $pastel-magenta;
}

.unit-owner--player-one {
  outline: 2px solid $pastel-red-darker;
}
.unit-owner--player-two {
  outline: 2px solid $pastel-gray;
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

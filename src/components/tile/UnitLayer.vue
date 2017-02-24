<template>
  <div class="tile-layer layer--unit" :class="unitCssClass">
    <div class="unit__character">
      <span class="unit__hp">
        {{ unit.hp }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    unit: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  computed: {
    ...mapGetters([
      'getPlayerById',
    ]),
    unitCssClass() {
      if (!this.unit) { return {}; }
      return {
        'unit--pawn': this.unit.type === 1,
        'unit--knight': this.unit.type === 2,
        'unit--bishop': this.unit.type === 3,
        'unit-owner--player-one': this.unitOwner.localId === 1,
        'unit-owner--player-two': this.unitOwner.localId === 2,
        'unit-energy--no-movement': !this.unit.energy.movement,
        'unit-energy--no-action': !this.unit.energy.action,
      };
    },
    unitOwner() {
      if (!this.unit) { return null; }
      const playerId = this.unit.playerId;
      return this.getPlayerById(playerId);
    },
  },
};
</script>

<style lang="scss">
@import './../../assets/globals.scss';

$fade-duration-ms: 0.75s;

.unit__character {
  position: relative;
  margin: auto;
  top: 22.5%;
  width: 50%;
  height: 50%;
  text-align: center;

  @include transition(background-color, $fade-duration-ms/2.0, ease-in-out);
}
.unit--pawn .unit__character {
  background-color: $pastel-orange;
}
.unit--knight .unit__character {
  background-color: $pastel-purple-lighter;
}
.unit--bishop .unit__character {
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

.unit-owner--player-one .unit__character {
  border: 2px solid $player-one-color;
  border-radius: 4px;
}
.unit-owner--player-two .unit__character {
  border: 2px solid $player-two-color;
  border-radius: 4px;
}

.unit-energy--no-movement {
  opacity: 0.6;
}

.unit-energy--no-action,
.unit-energy--no-movement.unit-energy--no-action {
  opacity: 0.25;
}
</style>

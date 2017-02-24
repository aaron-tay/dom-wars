<template>
  <div class="tile-layer layer--pathing" :class="pathingCssClass">
    <div class="pathing__square"></div>
  </div>
</template>

<script>
export default {
  props: {
    pathing: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  computed: {
    pathingCssClass() {
      if (!this.pathing) { return {}; }
      return {
        'pathing--movement': this.pathing.movement,
        'pathing--combat': this.pathing.combat,
      };
    },
  },
};
</script>

<style lang="scss">
@import './../../assets/globals.scss';

$color-pathing-movement: $color-info;
$color-pathing-combat: $color-danger;

.pathing__square {
  position: relative;
  margin: auto;
  top: 10%;
  width: 80%;
  height: 80%;
  text-align: center;
  border-radius: 4px;
}

.pathing--movement .pathing__square {
  background-color: transparentize($color-pathing-movement, 0.5);
}
.pathing--combat .pathing__square {
  background-color: transparentize($color-pathing-combat, 0.5);
}
.pathing--blocked .pathing__square {
  background-color: transparentize($pastel-gray, 0.5);
}

</style>

<template>
  <div class="mdl-grid mdl-grid--no-spacing" v-mdl>
    <div class="mdl-cell mdl-cell--12-col">
      <h5>
        Welcome
      </h5>
      <p>
        An abstract turn based strategy game inspired by chess and advanced wars.
        <br />
        Build your army from a selection of different units.
        <br />
        Position your units in preparation for battle.
        <br />
        Take turns moving your units, battling to defeat all your opponents.
      </p>
      <button class="mdl-button mdl-js-button mdl-button--raised" @click="startGame">
        start game
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CONSTANTS from './../../engine/constants';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      'currentGamePhase',
    ]),
  },
  methods: {
    ...mapActions([
      'setGamePhase',
      'setWorld',
      'clearAllPlayers',
    ]),
    startGame() {
      this.setGamePhase(CONSTANTS.GAME_PHASE.SETUP_PLAYERS);
    },
  },
  mounted() {
    this.clearAllPlayers();
    this.setWorld({
      terrain: {},
      units: {},
    });
  },
};
</script>

<style lang="scss">
@import './../../assets/globals.scss';
</style>

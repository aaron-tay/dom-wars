<template>
  <div class="mdl-grid mdl-grid--no-spacing">
    <div class="mdl-cell mdl-cell--12-col">
      <template v-if="isTitlePhase">
        <gui-title></gui-title>
      </template>
      <template v-if="isSetupPhase">
        <gui-setup></gui-setup>
      </template>
      <div v-if="isPlayingPhase">
        <gui-playing></gui-playing>
      </div>
      <div v-if="isGameOverPhase">
        <h5>
          Game Over
        </h5>
        <p>
          {{ winningPlayer.name }} has won the game.
        </p>
        <button class="mdl-button mdl-js-button mdl-button--raised" @click="gameRestart">
          play again
        </button>
      </div>
      <!-- <dom-game-tile-info :tile="selectedTile" v-if="selectedTile"></dom-game-tile-info>
      {{selected}}: {{ selectedTile }} -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import lodash from 'lodash';
import CONSTANTS from './constants';
import GuiTitle from './gui/Title';
import GuiSetup from './gui/Setup';
import GuiPlaying from './gui/Playing';

export default {
  components: {
    GuiTitle,
    GuiSetup,
    GuiPlaying,
  },
  created() {
    this.setGamePhase(CONSTANTS.GAME_PHASE.TITLE);
  },
  computed: {
    ...mapGetters([
      'currentGamePhase',
    ]),
    isTitlePhase() {
      return this.currentGamePhase === CONSTANTS.GAME_PHASE.TITLE;
    },
    isSetupPhase() {
      const setupPhases = [
        CONSTANTS.GAME_PHASE.SETUP_PLAYERS,
        CONSTANTS.GAME_PHASE.SETUP_WORLD,
        CONSTANTS.GAME_PHASE.SETUP_UNITS,
        CONSTANTS.GAME_PHASE.SETUP_UNIT_PLACEMENT,
      ];
      const self = this;
      const result = lodash.find(setupPhases, (phase => phase === self.currentGamePhase));
      return result;
    },
    isPlayingPhase() {
      return this.currentGamePhase === CONSTANTS.GAME_PHASE.PLAYER_TURN;
    },
    isGameOverPhase() {
      return this.currentGamePhase === CONSTANTS.GAME_PHASE.GAME_OVER;
    },
  },
  methods: {
    ...mapGetters([]),
    ...mapActions([
      'setGamePhase',
    ]),
  },
};
</script>

<style lang="scss">
@import './../assets/globals.scss';

.player-avatar-icon {
  position: absolute;
  top: 20px;
  right: 0;
}
.player-color--one {
  color: $player-one-color;
}
.player-color--two {
  color: $player-two-color;
}
</style>

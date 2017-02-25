<template>
  <div class="mdl-grid mdl-grid--no-spacing">
    <div class="mdl-cell mdl-cell--12-col">
      <template v-if="isTitlePhase">
        <gui-title></gui-title>
      </template>
      <template v-if="isSetupPhase">
        <gui-setup></gui-setup>
      </template>
      <template v-if="isPlayingPhase">
        <gui-playing></gui-playing>
      </template>
      <template v-if="isGameOverPhase">
        <gui-game-over></gui-game-over>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import lodash from 'lodash';
import CONSTANTS from './../engine/constants';
import GuiTitle from './gui/Title';
import GuiSetup from './gui/Setup';
import GuiPlaying from './gui/Playing';
import GuiGameOver from './gui/GameOver';

export default {
  components: {
    GuiTitle,
    GuiSetup,
    GuiPlaying,
    GuiGameOver,
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
      const playingPhases = [
        CONSTANTS.GAME_PHASE.PLAYER_TURN_BEFORE,
        CONSTANTS.GAME_PHASE.PLAYER_TURN,
        CONSTANTS.GAME_PHASE.PLAYER_TURN_AFTER,
        CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT_BEFORE,
        CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT,
        CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT_AFTER,
      ];
      const self = this;
      const result = lodash.find(playingPhases, (phase => phase === self.currentGamePhase));
      return result;
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

</style>

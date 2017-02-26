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
      'isPlayingPhase',
      'isSetupPhase',
    ]),
    isTitlePhase() {
      return this.currentGamePhase === CONSTANTS.GAME_PHASE.TITLE;
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

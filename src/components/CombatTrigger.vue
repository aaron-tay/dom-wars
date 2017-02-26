<template>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CONSTANTS from './../engine/constants';

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters([
      'currentGamePhase',
      'isPlayingPhase',
    ]),
  },
  methods: {
    ...mapActions([
      'beginCombatPhase',
      'doCombatPhase',
      'finishCombatPhase',
    ]),
  },
  watch: {
    currentGamePhase(current, previous) {
      if (current === previous) { return; }
      if (!this.isPlayingPhase) { return; }

      if (current === CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT_BEFORE) {
        this.beginCombatPhase();
        return;
      } else if (current === CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT) {
        this.doCombatPhase();
        return;
      } else if (current === CONSTANTS.GAME_PHASE.PLAYER_TURN_COMBAT_AFTER) {
        this.finishCombatPhase();
        return;
      }
    },
  },
};
</script>

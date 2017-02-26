<template>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CONSTANTS from './../engine/constants';

// watches for transitions between player phases.
// currently handles end-of-turn and begin-turn events
export default {
  computed: {
    ...mapGetters([
      'currentGamePhase',
      'isPlayingPhase',
    ]),
  },
  methods: {
    ...mapActions([
      'setGamePhase',
      'gameRelinquishPlayerTurn',
    ]),
  },
  watch: {
    currentGamePhase(current, previous) {
      if (current === previous) { return; }
      if (!this.isPlayingPhase) { return; }

      // console.log(current);
      if (current === CONSTANTS.GAME_PHASE.PLAYER_TURN_BEFORE) {
        // TODO(ajt): stuff before the turn starts
        this.setGamePhase(CONSTANTS.GAME_PHASE.PLAYER_TURN);
        return;
      } else if (current === CONSTANTS.GAME_PHASE.PLAYER_TURN_AFTER) {
        // TODO(ajt): stuff when the turn has finished
        this.gameRelinquishPlayerTurn();
        this.setGamePhase(CONSTANTS.GAME_PHASE.PLAYER_TURN_BEFORE);
        return;
      }
      // PLAYER_TURN_BEFORE
      // - currentPlayer is the player whose turn it is
      // - restore units
      // - display to players its their turn
      // - immediately transition to PLAYER_TURN

      // PLAYER_TURN

      // PLAYER_TURN_AFTER
      // - switch control to next player

      // PLAYER_TURN_COMBAT_BEFORE
      // -

      // PLAYER_TURN_COMBAT
      // - attacker deal damage to defender

      // PLAYER_COMBAT_AFTER
      // - clean-up combatants
      // - check end game conditions
    },
  },
};
</script>

<style lang="scss">
</style>

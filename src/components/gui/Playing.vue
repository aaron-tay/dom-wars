<template>
  <div class="mdl-grid mdl-grid--no-spacing" v-mdl>
    <div class="mdl-cell mdl-cell--12-col">
      <h5>
        <span class="player-avatar-icon material-icons" :class="playerColorClass">person</span>
        <span>
          {{ currentPlayer.name }}'s turn
        </span>
      </h5>
      <p>
        Move your units and attack your opponent.
        <br />
        <!-- Number of enemy units remaining: {{ remainingOpponents }} -->
      </p>
      <button class="mdl-button mdl-js-button mdl-button--raised" @click="currentPlayerEndTurn">
        end turn
      </button>
      <button class="mdl-button mdl-js-button mdl-button--raised" @click="currentPlayerSurrender">
        surrender
      </button>
      <!-- <dom-game-tile-info :tile="selectedTile" v-if="selectedTile"></dom-game-tile-info>
      {{ getAvailableActions }} -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CONSTANTS from './../constants';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      'currentPlayer',
    ]),
    playerColorClass() {
      return {
        'player-color--one': this.currentPlayer.localId === 1,
        'player-color--two': this.currentPlayer.localId === 2,
      };
    },
  },
  methods: {
    ...mapActions([
      'setGamePhase',
      'playerRelinquishTurn',
      'playerRelinquishGame',
    ]),
    startGame() {
      this.setGamePhase(CONSTANTS.GAME_PHASE.SETUP_PLAYERS);
    },
    currentPlayerEndTurn() {
      this.playerRelinquishTurn();
    },
    currentPlayerSurrender() {
      this.playerRelinquishGame(this.currentPlayer.playerId);
      this.setGamePhase(CONSTANTS.GAME_PHASE.TITLE);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './../../assets/globals.scss';

.player-avatar-icon {
  top: 4px;
  position: relative;
}
</style>

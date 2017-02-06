<template>
  <div class="mdl-grid mdl-grid--no-spacing" v-mdl>
    <div class="mdl-cell mdl-cell--12-col">
      <h5>
        {{ currentPlayer.name }}'s turn
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
  },
  methods: {
    ...mapActions([
      'setGamePhase',
      'finishCurrentPlayerTurn',
      'setGamePhase',
    ]),
    startGame() {
      this.setGamePhase(CONSTANTS.GAME_PHASE.SETUP_PLAYERS);
    },
    currentPlayerEndTurn() {
      this.finishCurrentPlayerTurn();
    },
    currentPlayerSurrender() {
      this.setGamePhase(CONSTANTS.GAME_PHASE.TITLE);
    },
  },
};
</script>

<style lang="scss">
@import './../../assets/globals.scss';
</style>

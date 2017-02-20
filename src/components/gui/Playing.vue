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
    </div>
    <div class="mdl-cell mdl-cell--12-col">
      <!-- Empty spacing -->
      <br />
    </div>
    <div class="mdl-cell mdl-cell--12-col">
      <dom-game-tile-info :tile="selectedTile" v-if="selectedTile"></dom-game-tile-info>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DomGameTileInfo from './../DomGameTileInfo';

export default {
  components: {
    DomGameTileInfo,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      'currentPlayer',
      'getSelectedTile',
    ]),
    selectedTile() {
      return this.getSelectedTile;
    },
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
    currentPlayerEndTurn() {
      this.playerRelinquishTurn();
    },
    currentPlayerSurrender() {
      this.playerRelinquishGame({
        playerId: this.currentPlayer.playerId,
      });
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

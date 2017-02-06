<template>
  <div class="mdl-grid mdl-grid--no-spacing">
    <div v-if="currentGamePhase === CONSTANTS.GAME_PHASE.SETUP_PLAYERS" v-mdl>
      <h5>
        Who is playing?
      </h5>
      <p>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input class="mdl-textfield__input" type="text" id="player-one" v-model="playerNames[0]">
          <label class="mdl-textfield__label" for="player-one">Player 1</label>
          <span class="player-avatar-icon player-color--one material-icons">person</span>
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input class="mdl-textfield__input" type="text" id="player-two" v-model="playerNames[1]">
          <label class="mdl-textfield__label" for="player-two">Player 2</label>
          <span class="player-avatar-icon player-color--two material-icons">person</span>
        </div>
        <br />
      </p>
      <button class="mdl-button mdl-js-button mdl-button--raised" @click="confirmPlayers">
        next
      </button>
    </div>
    <div v-if="currentGamePhase === CONSTANTS.GAME_PHASE.SETUP_WORLD" v-mdl>
      <h5>
        Generating world
      </h5>
      <button class="mdl-button mdl-js-button mdl-button--raised" @click="generateWorld">
        regenerate
      </button>
      <button class="mdl-button mdl-js-button mdl-button--raised" @click="confirmWorld">
        next
      </button>
    </div>
    <!-- <div v-if="currentGamePhase === CONSTANTS.GAME_PHASE.SETUP_UNITS">
      <h5>
        Build your army
      </h5>
      <p>
        You have a limited number of points and each unit have different properties.
        <br />
      </p>
      <button class="mdl-button mdl-js-button mdl-button--raised">
        next
      </button>
    </div> -->
    <!-- <div v-if="currentGamePhase === CONSTANTS.GAME_PHASE.SETUP_UNIT_PLACEMENT">
      <h5>
        Position your army
      </h5>
      <p>
        You have a limited number of points and each unit have different properties.
        <br />
      </p>
      <button class="mdl-button mdl-js-button mdl-button--raised">
        next
      </button>
    </div> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import lodash from 'lodash';
import CONSTANTS from './../constants';
import * as GameEngine from './../GameEngine';

export default {
  data() {
    return {
      playerNames: [
        'player-1',
        'player-2',
      ],
    };
  },
  computed: {
    ...mapGetters([
      'currentGamePhase',
      'getWorldDefinition',
    ]),
    CONSTANTS() {
      return CONSTANTS;
    },
  },
  methods: {
    ...mapActions([
      'setGamePhase',
      'setPlayerTurnOrder',
      'addPlayer',
      'setWorld',
    ]),
    createPlayer(name) {
      return {
        playerId: lodash.uniqueId('pid_'),
        name,
      };
    },
    confirmPlayers() {
      // technically all this should occur transactionally
      const self = this;
      const players = lodash.map(this.playerNames, (name => self.createPlayer(name)));
      lodash.forEach(players, (player => self.addPlayer(player)));
      const playerTurnOrder = lodash.map(players, 'playerId');
      this.setPlayerTurnOrder(playerTurnOrder);
      this.setGamePhase(CONSTANTS.GAME_PHASE.SETUP_WORLD);
    },
    generateWorld() {
      const definition = this.getWorldDefinition;
      const terrain = GameEngine.helperGenerateTerrain(definition.width, definition.height);
      const units = GameEngine.helperGenerateUnits(definition.width, definition.height);
      this.setWorld({
        terrain,
        units,
      });
    },
    confirmWorld() {
      this.setGamePhase(CONSTANTS.GAME_PHASE.PLAYER_TURN);
    },
  },
  watch: {
    currentGamePhase(newValue, oldValue) {
      if (newValue === CONSTANTS.GAME_PHASE.SETUP_WORLD && oldValue !== newValue) {
        this.generateWorld();
      }
    },
  },
};
</script>

<style lang="scss">
@import './../../assets/globals.scss';
</style>

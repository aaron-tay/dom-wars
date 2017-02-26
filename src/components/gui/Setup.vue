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
          <span class="player-avatar-icon player-text-color--one material-icons">person</span>
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input class="mdl-textfield__input" type="text" id="player-two" v-model="playerNames[1]">
          <label class="mdl-textfield__label" for="player-two">Player 2</label>
          <span class="player-avatar-icon player-text-color--two material-icons">person</span>
        </div>
        <br />
      </p>
      <button class="mdl-button mdl-js-button mdl-button--raised" @click="confirmPlayers">
        next
      </button>
    </div>
    <div v-if="currentGamePhase === CONSTANTS.GAME_PHASE.SETUP_WORLD" v-mdl>
      <h5>
        Generate world
      </h5>
      <!-- TODO(ajt): Make this UI look nicer cos there's huge potential :) -->
      <h6>Tileset</h6>
      <div v-for="tilesetName in ['standard', 'kenney']" v-mdl>
        <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" :for="'tileset-'+tilesetName">
          <input type="radio" :id="'tileset-'+tilesetName" class="mdl-radio__button" name="tileset" :value="tilesetName" v-model="tileset">
          <span class="mdl-radio__label">{{tilesetName}}</span>
        </label>
      </div>
      <br />
      <h6>Terrain frequency</h6>
      <div v-for="index in 4" v-mdl>
        <label class="mdl-slider__label" :for="'terrain-'+terrainName(index)">
          {{ terrainName(index) }}
        </label>
        <input class="mdl-slider mdl-js-slider" :id="'terrain-'+terrainName(index)" type="range" min="0" max="100" v-model="terrainRatios[index]">
      </div>
      <br />
      <button class="mdl-button mdl-js-button mdl-button--raised" @click="confirmWorld">
        next
      </button>
      <button class="mdl-button mdl-js-button mdl-button--raised" @click="generateWorld">
        regenerate
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
import CONSTANTS from './../../engine/constants';
import engine from './../../engine';

export default {
  data() {
    return {
      playerNames: [
        'player-1',
        'player-2',
      ],
      terrainRatios: {
        1: 50,
        2: 50,
        3: 50,
        4: 50,
      },
      tileset: 'standard',
    };
  },
  computed: {
    ...mapGetters([
      'currentGamePhase',
      'getWorldDefinition',
      'allPlayers',
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
      'setTileset',
    ]),
    terrainName(terrainCode) {
      return engine.terrain.nameFromCode(terrainCode);
    },
    createPlayer(name, localId) {
      return {
        playerId: lodash.uniqueId('pid_'),
        name,
        localId,
      };
    },
    confirmPlayers() {
      // technically all this should occur transactionally
      const self = this;
      const players = lodash.map(this.playerNames, (name, index) => {
        const playerNumber = (index + 1);
        const player = self.createPlayer(name, playerNumber);
        return player;
      });
      lodash.forEach(players, (player => self.addPlayer(player)));
      const playerTurnOrder = lodash.map(players, 'playerId');
      this.setPlayerTurnOrder(playerTurnOrder);
      this.setGamePhase(CONSTANTS.GAME_PHASE.SETUP_WORLD);
    },
    helperGenerateTerrain(dimensions, terrainRatios = {}) {
      // TODO(ajt): Temporary until we have good maps
      return engine.terrain.generateTerrainLayer({ dimensions, terrainRatios });
    },
    helperGenerateUnits(dimensions, allPlayers) {
      // TODO(ajt): Temporary until we have unit placement
      return engine.unit.generateUnitLayerForBootstrap({ dimensions, allPlayers });
    },
    generateWorld() {
      const worldDef = this.getWorldDefinition;
      const allPlayers = this.allPlayers;
      const terrainRatios = lodash.mapValues(this.terrainRatios, (item => (
        lodash.toNumber(item)
      )));
      const terrain = this.helperGenerateTerrain(worldDef, terrainRatios);
      const units = this.helperGenerateUnits(worldDef, allPlayers);
      this.setWorld({
        terrain,
        units,
      });
      this.setTileset({
        tileset: this.tileset,
      });
    },
    confirmWorld() {
      this.setGamePhase(CONSTANTS.GAME_PHASE.PLAYER_TURN);
    },
  },
  watch: {
    currentGamePhase(newValue, oldValue) {
      if (newValue === CONSTANTS.GAME_PHASE.SETUP_WORLD && oldValue !== newValue) {
        // NOTE(ajt): This is just so the 'generate' phase is instantaneous
        // TODO(ajt): Later add world parameterisation for generation
        this.generateWorld();
        // this.confirmWorld();
      }
    },
    terrainRatios: {
      deep: true,
      handler() {
        this.generateWorld();
      },
    },
    tileset: {
      handler() {
        this.setTileset({
          tileset: this.tileset,
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import './../../assets/globals.scss';

.player-avatar-icon {
  position: absolute;
  top: 20px;
  right: 0;
}
</style>

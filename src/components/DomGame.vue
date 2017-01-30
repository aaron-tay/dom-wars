<template>
  <!-- MDL isn't really required but let's enable it anyway -->
  <div v-mdl>
    <div class="page-content mdl-grid">
      <div class="mdl-cell mdl-cell--8-col">
        <template v-for="(_, yKey) in CONST.MAP_DEFINITION.HEIGHT">
          <div class="horizontal">
            <template v-for="(_, xKey) in CONST.MAP_DEFINITION.WIDTH">
              <dom-game-tile :tile="tile(xKey, yKey)" @click.native="onTileClicked(xKey, yKey)"></dom-game-tile>
            </template>
          </div>
        </template>
      </div>
      <div class="mdl-cell mdl-cell--4-col">
        <template v-if="gamePhase === CONST.GAME_PHASE.TITLE">
          <h5>
            Welcome
          </h5>
          <p>
            An abstract turn based strategy game inspired by chess and advanced wars.
            <br />
            Build your army from a selection of different units.
            <br />
            Position your units in preparation for battle.
            <br />
            Take turns moving your units, battling to defeat all your opponents.
          </p>
          <button class="mdl-button mdl-js-button mdl-button--raised">
            start game
          </button>
        </template>
        <template v-if="gamePhase === CONST.GAME_PHASE.SETUP">
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
        </template>
        <template v-if="gamePhase === CONST.GAME_PHASE.PLACEMENT">
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
        </template>
        <template v-if="gamePhase === CONST.GAME_PHASE.PLAYER_TURN">
          <h5>
            {{ currentPlayer.name }}'s turn
          </h5>
          <p>
            Move your units and attack your opponent.
            <br />
            Number of enemy units remaining: {{ countEnemyUnits }}
          </p>
          <button class="mdl-button mdl-js-button mdl-button--raised" @click="passControlToNextPlayer">
            end turn
          </button>
          <button class="mdl-button mdl-js-button mdl-button--raised" @click="surrenderCurrentPlayer">
            surrender
          </button>
        </template>
        <template v-if="gamePhase === CONST.GAME_PHASE.GAME_OVER">
          <h5>
            Game Over
          </h5>
          <p>
            {{ winningPlayer.name }} has won the game.
          </p>
          <button class="mdl-button mdl-js-button mdl-button--raised" @click="restartGame">
            play again
          </button>
        </template>
        <dom-game-tile-info :tile="selectedTile" v-if="selectedTile"></dom-game-tile-info>
        {{selected}}: {{ selectedTile }}
      </div>
    </div>
  </div>
</template>

<script>
import lodash from 'lodash';
import CONSTANTS from './constants';
import DomGameTile from './DomGameTile';
import DomGameTileInfo from './DomGameTileInfo';

function generateMap(width, height, contentFn) {
  const map = {};
  lodash.times(height, (y) => {
    map[y] = {};
    lodash.times(width, (x) => {
      map[y][x] = contentFn();
    });
  });
  return map;
}

function createUnit(ownerId, type) {
  return {
    ownerId,
    type,
    hp: (type + 1) * 3,
    attack: (type + 1),
    defense: (type),
    speed: type,  // how far can the unit move
    behaviour: CONSTANTS.UNIT_BEHAVIOUR.MOVE_AND_ACTION,
    energy: { // restored each turn
      movement: true,
      action: true,
    },
  };
}

function createPlayer(playerId, name) {
  return {
    id: playerId,
    name,
    remoteId: lodash.uniqueId('p'),
  };
}

export default {
  components: {
    DomGameTile,
    DomGameTileInfo,
  },
  data() {
    return {
      // The map layers
      terrain: {},
      unit: {},
      range: {},
      selected: {
        x: -1,
        y: -1,
      },
      players: {
        1: {},
        2: {},
      },
      playerTurnOrder: [1, 2],
      winningPlayerId: null,
      gamePhase: CONSTANTS.GAME_PHASE.PLAYER_TURN,
    };
  },
  computed: {
    CONST() {
      return CONSTANTS;
    },
    selectedTile() {
      if (this.selected.x === -1 || this.selected.y === -1) {
        return null;
      }
      return this.tile(this.selected.x, this.selected.y);
    },
    isMovingUnit() {
      return (this.selectedTile.unit !== -1);
    },
    currentPlayer() {
      const currentPlayerId = lodash.head(this.playerTurnOrder);
      return this.players[currentPlayerId];
    },
    winningPlayer() {
      // If this is ever invoked, we expect the winning player to be present
      // Otherwise its an actual bug and thus we won't protect against it.
      const winningPlayerId = this.winningPlayerId;
      return this.players[winningPlayerId];
    },
    allUnits() {
      const result = [];
      const self = this;
      lodash.times(self.CONST.MAP_DEFINITION.HEIGHT, (y) => {
        lodash.times(self.CONST.MAP_DEFINITION.WIDTH, (x) => {
          const unit = self.unit[y][x];
          if (unit !== -1) {
            result.push(unit);
          }
        });
      });
      return result;
    },
    selfUnits() {
      const currentPlayerId = lodash.head(this.playerTurnOrder);
      const selfUnits = lodash.filter(this.allUnits, (unitItem =>
        unitItem.ownerId === currentPlayerId
      ));
      return selfUnits;
    },
    countSelfUnits() {
      return this.selfUnits.length;
    },
    countEnemyUnits() {
      const currentPlayerId = lodash.head(this.playerTurnOrder);
      const enemyUnits = lodash.filter(this.allUnits, (unitItem =>
        unitItem.ownerId !== currentPlayerId
      ));
      return enemyUnits.length;
    },
  },
  created() {
    this.initialiseGameWorld();
  },
  methods: {
    // TODO(ajt): Need different functions for different stages of the game
    // e.g. preturn, postturn, precombat, postcombat etc...
    // That will make it much easier to manage states
    restartGame() {
      this.initialiseGameWorld();
    },
    initialiseGameWorld() {
      // generate world
      this.terrain = this.generateWorld(() => lodash.random(0, 3));
      this.unit = this.generateWorld(() => {
        if (lodash.random(0, 10) > 9) {
          return createUnit(lodash.random(1, 2), lodash.random(0, 2));
        }
        return -1;
      });
      this.range = this.generateWorld(() => this.CONST.RANGE_CODES.EMPTY);
      this.clearSelectedTile();
      this.winningPlayerId = null;
      this.gamePhase = this.CONST.GAME_PHASE.PLAYER_TURN;
      this.playerTurnOrder = [1, 2];
      this.players['1'] = createPlayer(1, 'Player 1');
      this.players['2'] = createPlayer(2, 'Player 2');
    },
    // preturn, turn(premove, move, postmove, preaction, action, postaction), postturn
    surrenderCurrentPlayer() {
      this.playerTurnOrder.shift();
      this.checkEndGameConditions();
    },
    checkEndGameConditions() {
      // Last player alive
      if (this.playerTurnOrder.length === 1) {
        this.winningPlayerId = this.currentPlayer.id;
        this.gamePhase = this.CONST.GAME_PHASE.GAME_OVER;
        return;
      }

      // NOTE(ajt): This condition only works if defenders don't get a chance to stikeback
      // Otherwise there's a case where a defending unit could kill an attacking one
      // meaning the defender could win the game. Thus for counting, we might need
      // to do a bit more caching or calculations
      if (this.countEnemyUnits === 0) {
        this.winningPlayerId = this.currentPlayer.id;
        this.gamePhase = this.CONST.GAME_PHASE.GAME_OVER;
        return;
      }

      // this condition results in recursion but eventually there will only be one player
      if (this.countSelfUnits === 0) {
        this.surrenderCurrentPlayer();
        return;
      }
    },
    replenishUnitEnergy() {
      const units = this.selfUnits;
      lodash.forEach(units, (unitItem) => {
        const unitToReplenish = unitItem;
        unitToReplenish.energy = {
          movement: true,
          action: true,
        };
      });
    },
    passControlToNextPlayer() {
      const currentPlayerId = this.playerTurnOrder.shift();
      this.playerTurnOrder.push(currentPlayerId);

      // NOTE(ajt): From this point on, the 'currentPlayer' has changed
      this.replenishUnitEnergy();
      this.clearMovement();
      this.clearSelectedTile();
    },
    engageCombat(attackingTile, defendingTile) {
      const attackingUnit = attackingTile.unit;
      const defendingUnit = defendingTile.unit;
      const totalDamage = (attackingUnit.attack - defendingUnit.defense);
      defendingUnit.hp -= (Math.max(totalDamage, 1));
      if (defendingUnit.hp <= 0) {
        this.unit[defendingTile.y][defendingTile.x] = -1;
        this.checkEndGameConditions();
      }
      attackingUnit.energy.action = false;
    },
    generateWorld(contentFn) {
      const mapWidth = this.CONST.MAP_DEFINITION.WIDTH;
      const mapHeight = this.CONST.MAP_DEFINITION.HEIGHT;
      return generateMap(mapWidth, mapHeight, contentFn);
    },
    isTileSelected(x, y) {
      return ((this.selected.x === x) && (this.selected.y === y));
    },
    isWithinMap(x, y) {
      const xIsValid = lodash.inRange(x, 0, this.CONST.MAP_DEFINITION.WIDTH);
      const yIsValid = lodash.inRange(y, 0, this.CONST.MAP_DEFINITION.HEIGHT);
      return (xIsValid && yIsValid);
    },
    hasNoMovementObstacle(x, y) {
      const hasUnit = this.hasUnit(x, y);
      const isTileEmpty = !hasUnit;
      return isTileEmpty;
    },
    canUnitMove(unit) {
      return unit.energy.movement;
    },
    canMoveIntoTile(x, y) {
      const isTileEmpty = this.hasNoMovementObstacle(x, y);
      const isMovementWithinRange = this.range[y][x];
      return isTileEmpty && isMovementWithinRange;
    },
    hasUnit(x, y) {
      const destinationTile = this.tile(x, y);
      const hasUnit = (destinationTile.unit !== -1);
      return hasUnit;
    },
    hasEnemyUnit(x, y) {
      if (!this.hasUnit(x, y)) {
        return false;
      }
      const destinationTile = this.tile(x, y);
      const hasEnemyUnit = (destinationTile.unit.ownerId !== this.currentPlayer.id);
      return hasEnemyUnit;
    },
    tile(x, y) {
      if (!this.isWithinMap(x, y)) {
        return null;
      }
      return {
        x,
        y,
        terrain: this.terrain[y][x],
        unit: this.unit[y][x],
        range: this.range[y][x],
      };
    },
    moveUnit(sourceTile, destinationTile) {
      const sourceUnit = sourceTile.unit;
      this.unit[destinationTile.y][destinationTile.x] = sourceTile.unit;
      this.unit[sourceTile.y][sourceTile.x] = -1;
      sourceUnit.energy.movement = false;
    },
    clearSelectedTile() {
      // current definition of an 'unselected tile'
      this.selectTile(-1, -1);
    },
    selectTile(x, y) {
      this.selected.x = x;
      this.selected.y = y;
    },
    canUnitAttack(attackingTile, defendingTile) {
      const attackingUnit = attackingTile.unit;
      const defendingUnit = defendingTile.unit;

      // Cannot attack if no energy
      if (!attackingUnit.energy.action) {
        return false;
      }

      // Cannot attack own units
      if (attackingUnit.ownerId === defendingUnit.ownerId) {
        return false;
      }

      // defending unit is in range of attacking unit
      const combatRangeInfo = this.range[defendingTile.y][defendingTile.x];
      const isWithinCombatRange = (combatRangeInfo === this.CONST.RANGE_CODES.COMBAT);
      if (!isWithinCombatRange) {
        return false;
      }

      return true;
    },
    canUnitDefend() {
      // can always defend :)
      return true;
    },
    onTileClicked(x, y) {
      // selecting self deselects the tile
      if (this.isTileSelected(x, y)) {
        // deselect the tile
        this.clearSelectedTile();
        this.clearMovement();
        return;
      }

      // move to a specific tile
      const currentlySelectedTile = this.selectedTile;
      const destinationTile = this.tile(x, y);
      if (this.selectedTile && this.isMovingUnit) {
        if (currentlySelectedTile.unit.ownerId === this.currentPlayer.id) {
          if (this.canUnitMove(currentlySelectedTile.unit) && this.canMoveIntoTile(x, y)) {
            this.moveUnit(currentlySelectedTile, destinationTile);
            this.clearMovement();
            this.clearSelectedTile();
            return;
          } else if (this.hasEnemyUnit(x, y)) {
            if (this.canUnitAttack(currentlySelectedTile, destinationTile)) {
              this.engageCombat(currentlySelectedTile, destinationTile);
              this.clearMovement();
              this.clearSelectedTile();
              return;
            }
          }
        }
      }

      // NOTE(ajt): From this point on, the 'selectedTile' has changed
      this.selectTile(x, y);
      this.clearMovement();
      const newSelectedTile = this.selectedTile;
      if (this.hasUnit(x, y) && this.canUnitMove(newSelectedTile.unit)) {
        this.generateMovement(x, y, 4);
      }
    },
    clearMovement() {
      const self = this;
      lodash.times(self.CONST.MAP_DEFINITION.HEIGHT, (y) => {
        lodash.times(self.CONST.MAP_DEFINITION.WIDTH, (x) => {
          self.range[y][x] = 0;
        });
      });
    },
    getMovementPenalty(x, y) {
      const penalty = this.hasNoMovementObstacle(x, y) ? 1 : 2;
      return penalty;
    },
    generateMovement(x, y, distance) {
      if (distance <= 0) { return; }
      if (!this.isWithinMap(x, y) || this.range[y][x] !== this.CONST.RANGE_CODES.EMPTY) {
        return;
      }
      let rangeCode = this.CONST.RANGE_CODES.EMPTY;
      if (this.hasNoMovementObstacle(x, y)) {
        rangeCode = this.CONST.RANGE_CODES.MOVEMENT;
      }
      if (this.hasEnemyUnit(x, y)) {
        rangeCode = this.CONST.RANGE_CODES.COMBAT;
      }
      this.range[y][x] = rangeCode;
      const penalty = this.getMovementPenalty(x, y);
      this.generateMovement(x + 1, y, distance - penalty);
      this.generateMovement(x, y + 1, distance - penalty);
      this.generateMovement(x - 1, y, distance - penalty);
      this.generateMovement(x, y - 1, distance - penalty);
    },
    // generateAttackRange(x, y, distance) {
    //   if (distance <= 0) { return; }
    //   if (!this.isWithinMap(x, y)) {
    //     return;
    //   }
    //   const tile = this.tile(x, y);
    //   if (tile.unit.owner !== this.currentPlayer.id) {
    //
    //   }
    //   this.range[y][x] = this.hasNoMovementObstacle(x, y);
    //   const penalty = this.getMovementPenalty(x, y);
    //   this.generateAttackRange(x + 1, y, distance - penalty);
    //   this.generateAttackRange(x, y + 1, distance - penalty);
    //   this.generateAttackRange(x - 1, y, distance - penalty);
    //   this.generateAttackRange(x, y - 1, distance - penalty);
    // },
  },
};
</script>

<style lang="scss">
</style>

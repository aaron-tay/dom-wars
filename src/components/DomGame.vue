<template>
  <!-- MDL isn't really required but let's enable it anyway -->
  <div v-mdl>
    <div class="page-content mdl-grid">
      <div class="mdl-cell mdl-cell--8-col">
        <template v-for="(_, yKey) in getWorldDefinition.height">
          <div class="horizontal">
            <template v-for="(_, xKey) in getWorldDefinition.width">
              <dom-game-tile :tile="tile(xKey, yKey)" @click.native="onTileClicked(xKey, yKey)"></dom-game-tile>
            </template>
          </div>
        </template>
      </div>
      <div class="mdl-cell mdl-cell--4-col">
        <game-interface></game-interface>
      </div>
    </div>
    <unit-trigger></unit-trigger>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
// import lodash from 'lodash';
import DomGameTile from './DomGameTile';
import GameInterface from './GameInterface';
import UnitTrigger from './UnitTrigger';
import CONSTANTS from './constants';

export default {
  components: {
    DomGameTile,
    GameInterface,
    UnitTrigger,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters([
      'getWorldDefinition',
      'getSelectedTile',
      'getTileFn',
      'getRangeInfoFn',
      'currentGamePhase',
      'currentPlayer',
    ]),
    selectedTile() {
      return this.getSelectedTile;
    },
  },
  methods: {
    ...mapActions([
      'selectTile',
      'unselectTile',
      'moveUnit',
      'attackUnit',
    ]),
    tile(x, y) {
      const tile = this.getTileFn(x, y);
      tile.isSelected = this.isTileCurrentlySelected(x, y);
      tile.range = this.getRangeInfoFn(x, y).range;
      return tile;
    },
    onTileClicked(x, y) {
      if (this.currentGamePhase !== CONSTANTS.GAME_PHASE.PLAYER_TURN) {
        this.unselectTile();
        return;
      }
      if (this.isTileCurrentlySelected(x, y)) {
        this.unselectTile();
        return;
      }

      // Basic 'can move logic'
      if (this.selectedTile) {
        const source = this.selectedTile;
        const hasUnitInSource = !!source.unit;
        const destination = this.tile(x, y);
        const hasUnitInDestination = !!destination.unit;
        if (hasUnitInSource) {
          const currentPlayerOwnsSourceUnit = this.currentPlayer.playerId === source.unit.ownerId;
          if (!currentPlayerOwnsSourceUnit) {
            this.unselectTile();
          } else if (!hasUnitInDestination) {
            if (this.isWithinMovementRange(x, y)) {
              this.moveUnit({ source, destination });
            }
            this.unselectTile();
            return;
          } else if (hasUnitInDestination) {
            if (this.isWithinCombatRange(x, y)) {
              this.attackUnit({ source, destination });
            }
            this.unselectTile();
            return;
          }
        }
      }

      this.selectTile({ x, y });
    },
    isTileCurrentlySelected(x, y) {
      if (!this.selectedTile) { return false; }
      return (this.selectedTile.x === x && this.selectedTile.y === y);
    },
    isWithinMovementRange(x, y) {
      const range = this.getRangeInfoFn(x, y).range;
      if (!range) { return false; }
      return range.movement;
    },
    isWithinCombatRange(x, y) {
      const range = this.getRangeInfoFn(x, y).range;
      if (!range) { return false; }
      return range.combat;
    },
  },
};
</script>

<style lang="scss">
</style>

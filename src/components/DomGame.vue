<template>
  <!-- MDL isn't really required but let's enable it anyway -->
  <div v-mdl>
    <div class="page-content mdl-grid game-container" :class="{ 'disabled': !isGameReady }">
      <div class="mdl-cell mdl-cell--8-col game-tiles">
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
      <div class="game-overlay">
        <dom-game-overlay :current-player="currentPlayer" :current-game-phase="currentGamePhase"></dom-game-overlay>
      </div>
    </div>
    <unit-trigger></unit-trigger>
    <player-phase-trigger></player-phase-trigger>
    <combat-trigger></combat-trigger>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DomGameTile from './DomGameTile';
import GameInterface from './GameInterface';
import DomGameOverlay from './DomGameOverlay';
import UnitTrigger from './UnitTrigger';
import PlayerPhaseTrigger from './PlayerPhaseTrigger';
import CombatTrigger from './CombatTrigger';

export default {
  components: {
    DomGameTile,
    DomGameOverlay,
    GameInterface,
    UnitTrigger,
    PlayerPhaseTrigger,
    CombatTrigger,
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
      'getPathingInfoFn',
      'currentGamePhase',
      'currentPlayer',
      'isPlayingPhase',
    ]),
    selectedTile() {
      return this.getSelectedTile;
    },
    isGameReady() {
      return this.isPlayingPhase;
    },
  },
  methods: {
    ...mapActions([
      'playerSelectTile',
      'playerUnselectTile',
      'playerOrderUnitMove',
      'playerOrderUnitAttack',
    ]),
    tile(x, y) {
      const tile = this.getTileFn(x, y);
      tile.isSelected = this.isTileCurrentlySelected(x, y);
      tile.pathing = this.getPathingInfoFn(x, y).pathing;
      return tile;
    },
    onTileClicked(x, y) {
      if (!this.isGameReady) {
        this.playerUnselectTile();
        return;
      }
      if (this.isTileCurrentlySelected(x, y)) {
        this.playerUnselectTile();
        return;
      }

      // Basic 'can move logic'
      if (this.selectedTile) {
        const source = this.selectedTile;
        const hasUnitInSource = !!source.unit;
        const destination = this.tile(x, y);
        const hasUnitInDestination = !!destination.unit;
        if (hasUnitInSource) {
          const currentPlayerOwnsSourceUnit = this.currentPlayer.playerId === source.unit.playerId;
          if (!currentPlayerOwnsSourceUnit) {
            this.playerUnselectTile();
          } else if (!hasUnitInDestination) {
            if (this.isWithinMovementRange(x, y)) {
              this.playerOrderUnitMove({ source, destination });
            }
            this.playerUnselectTile();
            return;
          } else if (hasUnitInDestination) {
            if (this.isWithinCombatRange(x, y)) {
              this.playerOrderUnitAttack({ source, destination });
            }
            this.playerUnselectTile();
            return;
          }
        }
      }

      this.playerSelectTile({ x, y });
    },
    isTileCurrentlySelected(x, y) {
      if (!this.selectedTile) { return false; }
      return (this.selectedTile.x === x && this.selectedTile.y === y);
    },
    isWithinMovementRange(x, y) {
      const pathing = this.getPathingInfoFn(x, y).pathing;
      if (!pathing) { return false; }
      return pathing.movement;
    },
    isWithinCombatRange(x, y) {
      const pathing = this.getPathingInfoFn(x, y).pathing;
      if (!pathing) { return false; }
      return pathing.combat;
    },
  },
};
</script>

<style lang="scss">
@import './../assets/globals.scss';

.disabled .game-tiles {
  pointer-events: none;
}

.game-container {
  position: relative;
}

.game-overlay {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
</style>

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
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
// import lodash from 'lodash';
import DomGameTile from './DomGameTile';
import DomGameTileInfo from './DomGameTileInfo';
import GameInterface from './GameInterface';

export default {
  components: {
    DomGameTile,
    DomGameTileInfo,
    GameInterface,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters([
      'getWorldDefinition',
      'isWorldReady',
      'getSelectedTile',
      'getAvailableActions',
    ]),
    selectedTile() {
      return this.getSelectedTile;
    },
  },
  methods: {
    ...mapGetters([
      'getTileFn',
      'getSelectedTile',
    ]),
    ...mapActions([
      'selectTile',
      'unselectTile',
      'moveUnit',
    ]),
    tile(x, y) {
      const tile = this.getTileFn()(x, y);
      tile.isSelected = this.isTileCurrentlySelected(x, y);
      return tile;
    },
    onTileClicked(x, y) {
      if (this.isTileCurrentlySelected(x, y)) {
        this.unselectTile();
        return;
      }

      // Basic 'can move logic'
      if (this.getSelectedTile) {
        const source = this.getSelectedTile;
        const hasUnitInSource = !!source.unit;
        const destination = this.tile(x, y);
        const hasUnitInDestination = !!destination.unit;
        if (hasUnitInSource && !hasUnitInDestination) {
          this.moveUnit({ source, destination });
          this.unselectTile();
          return;
        }
      }

      this.selectTile({ x, y });
    },
    isTileCurrentlySelected(x, y) {
      if (!this.getSelectedTile) { return false; }
      return (this.getSelectedTile.x === x && this.getSelectedTile.y === y);
    },
  },
};
</script>

<style lang="scss">
</style>

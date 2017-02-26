<template>
  <div id="about-view" v-mdl>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--no-drawer-button">
      <compact-header></compact-header>
      <main class="mdl-layout__content">
        <div class="page-content mdl-grid">
          <div class="mdl-cell mdl-cell--12-col">
            <p>
              This is a simple experimentation project to create a small turn-based strategy game
              using just the HTML DOM (with JS and CSS).
            </p>
            <p>
              The majority of the project is developed
              <a href="https://vuejs.org/" target="_blank">VueJS</a>,
              <a href="https://getmdl.io" target="_blank">Material Design Lite (MDL)</a>,
              <a href="https://lodash.com" target="_blank">Lodash</a> and
              <a href="https://github.com/aaron-tay/dom-wars" target="_blank">GitHub for hosting</a>.
            </p>
            <p>
              Some assets retrieve via the internet. Best effort to attribute and use open assets. Please contact otherwise.
              <ul>
                <li>
                  <a href="https://www.kenney.nl" target="_blank">Kenney Medieval RPG Tileset</a>
                  - Beautiful game assets with vectors and spritesheets
                </li>
              </ul>
            </p>
            <p>
              My decision to avoid using <code>&lt;canvas&gt;</code> or existing game engines is purely
              for my own understanding and to see what can be done using minimal technologies.
            </p>
          </div>
          <div class="mdl-cell mdl-cell--12-col">
            <hr />
            <vue-markdown :source="changelog"></vue-markdown>
          </div>
        </div>
      </main>
      <compact-footer></compact-footer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VueMarkdown from 'vue-markdown';
import CompactHeader from './../components/layout/CompactHeader';
import CompactFooter from './../components/layout/CompactFooter';

export default {
  components: {
    CompactHeader,
    CompactFooter,
    VueMarkdown,
  },
  data() {
    return {
      changelog: `
# Changelog

### v0.07
Minor refactoring of state management to enable animations
Added UI to display the current player's turn when it becomes their turn
### v0.06
Units have different attack behaviours (prototyping)
- Pawns can attack up to 2 squares in straight lines or 1 square diagonally
- Knights can attack 1 square diagonally or with at least 1 space between it and opponent in straight lines
- Bishops can attack only 1 square in straight lines
### v0.05
Units have slightly more visual difference when they've moved/attacked.
Added end-game condition where players are eliminated if they've lost all their units
### v0.0.4
World tileset can be adjusted and included 'kenney' tileset
Units can only move or engage in combat once per turn.
Refactored underlying architecture relating to units from coordinate-based to id-based
### v0.0.3
Added world generation through parameterisation. Densitiy of specific terrains can be adjusted
### v0.0.2
Added concept of game phases; the basic flow of events is;
 Title -> Setup -> Playing -> GameOver -> Title
Basic combat system implemented to allow units to deal damage to each other
### v0.0.1
Added concept of 'player turns'
Players can only move units owned by them
### v0.0.0
Created map and tile UI.
Added ability to select units, display movement range and move units within those bounds
      `,
    };
  },
  computed: {
    ...mapGetters([
    ]),
  },
  methods: {
  },
};
</script>

<style scoped lang="scss">
</style>

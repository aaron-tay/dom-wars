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
              My decision to avoid using <code>&lt;canvas&gt;</code> or game engines is purely
              for my own understanding and to see how far browsers and performance have come.
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

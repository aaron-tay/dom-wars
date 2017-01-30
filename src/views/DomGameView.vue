<template>
  <div id="dom-game-view" v-mdl>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--no-drawer-button">
      <compact-header></compact-header>
      <main class="mdl-layout__content">
        <div class="page-content mdl-grid">
          <div class="mdl-cell mdl-cell--12-col">
            <dom-game></dom-game>
          </div>
        </div>
      </main>
      <compact-footer></compact-footer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CompactHeader from './../components/layout/CompactHeader';
import CompactFooter from './../components/layout/CompactFooter';
import DomGame from './../components/DomGame';

export default {
  components: {
    CompactHeader,
    CompactFooter,
    DomGame,
  },
  data() {
    return {
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

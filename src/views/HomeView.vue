<template>
  <div id="home-view" v-mdl>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--no-drawer-button">
      <compact-header></compact-header>
      <main class="mdl-layout__content">
        <div class="page-content mdl-grid">
          <div class="mdl-cell mdl-cell--12-col">
            <h3>
              This is the root page
            </h3>
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

export default {
  components: {
    CompactHeader,
    CompactFooter,
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

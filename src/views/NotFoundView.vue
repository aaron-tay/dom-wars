<template>
  <div id="not-found-view">
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--no-drawer-button">
      <compact-header :title="'Page Not Found'"></compact-header>
      <main class="mdl-layout__content">
        <div class="page-content mdl-grid">
          <div class="mdl-cell mdl-cell--12-col">
            <h3>
              Nothing here
            </h3>
            <router-link to="/">Back home</router-link>
          </div>
        </div>
      </main>
      <compact-footer></compact-footer>
    </div>
  </div>
</template>

<script>
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
  },
  methods: {
  },
};
</script>

<style scoped>
</style>

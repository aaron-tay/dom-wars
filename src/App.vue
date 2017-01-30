<template>
  <!-- This is an entry wrapper. The actual pages are displayed by the router-view -->
  <!-- It sets up most of the routing logic relating to authentication handling -->
  <div id="app" v-mdl>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
  },
  computed: {
    ...mapGetters([
    ]),
  },
  methods: {
    ...mapActions([
    ]),
  },
};
</script>

<style scoped>
</style>

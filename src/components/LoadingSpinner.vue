<template>
  <div v-mdl>
    <div class="mdl-grid mdl-grid--no-spacing">
      <div class="mdl-cell mdl-cell--12-col loading-spinner">
        <h6 class="loading-spinner__title">{{message}}</h6>
        <div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: 'Loading...',
    },
  },
};
</script>

<style scoped>
.loading-spinner {
  text-align: center;
}
.mdl-spinner {
  margin-bottom: 24px;
}
</style>

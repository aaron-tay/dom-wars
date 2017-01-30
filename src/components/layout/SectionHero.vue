<template>
  <!-- Treat this component as 'abstract'. Create concrete ones using this -->
  <div class="cha-layout-section section-hero" v-mdl>
    <div class="section-hero__bgoverlay"></div>
    <div class="section-hero__grid mdl-grid">
      <slot name="content">
        <div class="section-hero__title mdl-cell mdl-cell--12-col mdl-cell--middle">
          <p>
            this is the default section-hero content here as an example.
          </p>
          <p>
            view this source for examples on usage
          </p>
          <p>
            recommended is in the concrete implementation, <br />
            add a class (e.g. section-hero--my-class) <br />
            then override specific things <br />
            <code>
              .section-hero--my-class {
                background: '...'
              }
              <br/>
              .section-hero--my-class .section-hero__grid {
                min-height: '...'
              }
            </code>
          </p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>

export default {
  props: {
  },
  computed: {
  },
};
</script>

<style scoped>
.cha-layout-section {
}

.section-hero {
  position: relative;
}

.section-hero__grid {
  position: relative;
}

.section-hero__bgoverlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(180deg,rgba(0,0,0,0.1) 0,rgba(0,0,0,0.5))
}

.section-hero-title {
  text-align: center;
  color: #fff;
}
</style>

<template>
  <div>
    <transition name="custom-classes-transition" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutRight">
      <div class="game-overlay__message" v-if="canShowMessage" :class="playerCssClass">
        {{ currentPlayer.name }}'s turn
      </div>
    </transition>
  </div>
</template>

<script>
import CONSTANTS from './../engine/constants';

export default {
  props: {
    currentPlayer: Object,
    currentGamePhase: String,
  },
  data() {
    return {
      showTurnMessage: false,
      timer: null,
    };
  },
  computed: {
    playerCssClass() {
      if (!this.currentPlayer) { return null; }
      return {
        'player-color--one': this.currentPlayer.localId === 1,
        'player-color--two': this.currentPlayer.localId === 2,
      };
    },
    canShowMessage() {
      return this.showTurnMessage && this.currentPlayer;
    },
  },
  methods: {
    toggleMessage() {
      // NOTE(ajt): This is kinda hacky, especially if we have to use timeouts...
      // I think a better solution might be to use animations & keyframes
      // e.g.: 0%{offscreen} 50%{onscreen} 100%{offscreen}
      // Then we only need to care about transitioning into a state

      if (this.timer) {
        this.showTurnMessage = false;
        clearTimeout(this.timer);
      }

      const self = this;
      const MESSAGE_DURATION_MS = 1000;
      this.$nextTick(() => {
        self.showTurnMessage = true;
        self.timer = setTimeout(() => {
          self.showTurnMessage = false;
          self.timer = null;
        }, MESSAGE_DURATION_MS);
      });
    },
  },
  watch: {
    currentGamePhase(current, previous) {
      // We're only concerned with PLAYER_TURN_BEFORE -> PLAYER_TURN transitions
      if (previous !== CONSTANTS.GAME_PHASE.PLAYER_TURN_BEFORE) { return; }
      if (current !== CONSTANTS.GAME_PHASE.PLAYER_TURN) { return; }

      this.toggleMessage();
    },
  },
};
</script>

<style lang="scss">
@import './../assets/globals.scss';

.game-overlay__message {
  left: 0;
  right: 0;
  text-align: center;
  position: absolute;
  padding: 24px 0;
  font-size: 3em;
  background-color: #ccc;
}

// TODO(ajt): What I want with animations:
// background to fade-in-out
// text to fade-in-out left-> right

.player-color--one {
  background-color: $player-one-color;
}

.player-color--two {
  background-color: $player-two-color;
}

.animated.fadeOutRight {
  animation-delay: 0.3s;
}
</style>

<script setup lang="ts">
import { computed } from "vue";
import { NIcon, NText, NH1 } from "naive-ui";
import { ReloadCircle } from "@vicons/ionicons5";
import { useGameStore } from "../../gameLogic";

import { Vue3Lottie } from "vue3-lottie";
import CelebrateLottieJSON from "../../assets/celebrate-lottie.json";
import "vue3-lottie/dist/style.css";

const gameStore = useGameStore();

const props = defineProps<{
  show: boolean;
}>();
const show = computed(() => props.show);
const score = computed(() => gameStore.snake.length - 1);
const highScore = computed(() => gameStore.highScore);
const newHighScore = computed(() => gameStore.newHighScore);
</script>

<template>
  <Transition :css="false">
    <div
      v-if="show"
      class="wrapper canvasOverlay"
      v-motion="'gameOverOverlayWrapper'"
      :initial="{
        opacity: 0,
      }"
      :enter="{
        opacity: 1,
      }"
    >
      <Vue3Lottie
        v-if="newHighScore"
        class="fixed"
        :animationData="CelebrateLottieJSON"
        height="100vh"
        width="100vw"
      />
      <n-h1
        class="gameOverTitle"
        v-motion="'gameOverTitle'"
        :initial="{
          opacity: 0,
          scale: 0,
        }"
        :enter="{
          opacity: 1,
          scale: 1,
        }"
      >
        <n-text type="error">Game Over</n-text>
      </n-h1>

      <n-text
        type="primary"
        v-if="newHighScore"
        class="gameOverPoints bg-gradient-to-r from-transparent via-gray-800 to-transparent rounded-lg px-8 py-2 text-center text-secondary"
      >
        Congratulations though! You got a new high score. New score to beat is {{ highScore }}
      </n-text>
      <n-text
        v-if="!newHighScore"
        class="gameOverPoints bg-gradient-to-r from-transparent via-gray-800 to-transparent rounded-lg px-8 py-2 text-center"
        type="error"
      >
        Too bad... Better luck next time. You got {{ score }}, but your high score is
        {{ highScore }}
      </n-text>

      <n-text class="gameOverInfo" depth="3">Press the button below to restart the game</n-text>
      <button
        class="restartIcon ease-in transition-colors duration-75 text-gray-400 hover:bg-gray-600 text-sm hover:text-gray-200 focus:ring-1 focus:outline-none focus:ring-gray-400 rounded-full p-px text-center inline-grid place-items-center"
        @click="
          () => {
            gameStore.reset();
            gameStore.start();
          }
        "
        v-motion="'gameOverRestartIcon'"
        :initial="{
          opacity: 0,
          scale: 1,
        }"
        :enter="{
          opacity: 1,
          scale: 1,
        }"
        :leave="{
          opacity: 0,
          scale: 0,
        }"
        :hovered="{
          scale: 1.2,
        }"
        :tapped="{
          scale: 0.9,
        }"
      >
        <n-icon aria-hidden="true" :size="'4rem'">
          <reload-circle />
        </n-icon>
        <span class="sr-only">Restart Game</span>
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.wrapper {
  grid-template-rows: 1fr 5rem 5rem 1rem 6rem 1fr;
  .gameOverTitle {
    grid-row: 2;
  }
  .gameOverPoints {
    grid-row: 3;
  }
  .gameOverInfo {
    grid-row: 4;
  }
  .restartIcon {
    grid-row: 5;
  }
}
</style>

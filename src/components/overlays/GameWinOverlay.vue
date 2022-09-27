<script setup lang="ts">
import { computed } from "vue";
import { NIcon, NText, NH1 } from "naive-ui";
import { ReloadCircle } from "@vicons/ionicons5";
import { useGameStore } from "../../gameLogic";

import { Vue3Lottie } from "vue3-lottie";
import FireworksLottieJSON from "../../assets/fireworks-lottie.json";
import "vue3-lottie/dist/style.css";

const gameStore = useGameStore();

const props = defineProps<{
  show: boolean;
}>();
const show = computed(() => props.show);
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
      <Vue3Lottie class="fixed" :animationData="FireworksLottieJSON" height="100vh" width="100vw" />
      <n-h1
        class="gameWinTitle"
        v-motion="'gameWinTitle'"
        :initial="{
          opacity: 0,
          scale: 0,
        }"
        :enter="{
          opacity: 1,
          scale: 1,
        }"
      >
        <n-text class="text-center" type="success">OMG! You actually won!</n-text>
      </n-h1>

      <n-text class="gameWinInfo" depth="3">Press the button below to restart the game</n-text>
      <button
        class="restartIcon ease-in transition-colors duration-75 text-gray-400 hover:bg-gray-600 text-sm hover:text-gray-200 focus:ring-1 focus:outline-none focus:ring-gray-400 rounded-full p-px text-center inline-grid place-items-center"
        @click="
          () => {
            gameStore.reset();
            gameStore.start();
          }
        "
        v-motion
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
  grid-template-rows: 1fr 10rem 1rem 6rem 1fr;
  .gameWinTitle {
    grid-row: 2;
  }
  .gameWinInfo {
    grid-row: 3;
  }
  .restartIcon {
    grid-row: 4;
  }
}
</style>

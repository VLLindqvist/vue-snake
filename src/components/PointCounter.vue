<script setup lang="ts">
import { computed } from "vue";
import { NText } from "naive-ui";
import { Status, useGameStore } from "../gameLogic";
import { useMotions } from "@vueuse/motion";

const gameStore = useGameStore();
const score = computed(() => gameStore.snake.length - 1);
const highScore = computed(() => gameStore.highScore);
const status = computed(() => gameStore.status);
const isPlaying = computed(() => gameStore.isPlaying);

const motions = useMotions();
</script>

<template>
  <div class="wrapper">
    <Transition
      :css="false"
      @leave="(_: unknown, done: () => void) => {
        motions.scoreBottom?.leave(done);
      }"
    >
      <n-text
        v-if="isPlaying && status === Status.Ongoing"
        :class="`score transition-colors duration-150 rounded-sm ${
          score > highScore
            ? 'px-6 py-1 bg-secondary text-xl text-gray-800'
            : 'px-5 py-0.5 dark:bg-primary dark:text-lg bg-gray-200 text-black'
        }`"
        type="primary"
        v-motion="'scoreBottom'"
        :initial="{
          opacity: 0,
          scale: 0,
          y: 50,
        }"
        :enter="{
          opacity: 1,
          scale: 1,
          y: 0,
        }"
        :leave="{
          opacity: 0,
          scale: 0,
          y: 50,
        }"
      >
        Score: {{ score }}
      </n-text>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  z-index: 1000;
  position: absolute;
  bottom: -1rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  gap: 1rem;
  .score {
    grid-column: 2;
    user-select: none;
  }
}
</style>

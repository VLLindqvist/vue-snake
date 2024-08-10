<script setup lang="ts">
import { computed } from "vue";
import { useMotions } from "@vueuse/motion";
import { NIcon, NText, NH1 } from "naive-ui";
import { PlayCircle, ReloadCircle } from "@vicons/ionicons5";
import { useGameStore } from "../../gameLogic";

const gameStore = useGameStore();

const props = defineProps<{
  show: boolean;
}>();
const show = computed(() => props.show);
const score = computed(() => gameStore.snake.length - 1);
const highScore = computed(() => gameStore.highScore);

const motions = useMotions();
</script>

<template>
  <Transition
    :css="false"
    @leave="(
        (_: unknown, done: () => void) => {
            motions.pausedOverlayWrapper?.leave(done);
            motions.pausedTitle?.leave(done);
            motions.pausedStartIcon?.leave(done);
            motions.pausedRestartIcon?.leave(done);
            motions.scorePaused?.leave(done);
        }
      )"
  >
    <div
      v-if="show"
      class="wrapper canvasOverlay bg-light-transparent dark:bg-dark-transparent"
      v-motion="'pausedOverlayWrapper'"
      :initial="{
        opacity: 0,
      }"
      :enter="{
        opacity: 1,
      }"
      :leave="{
        opacity: 0,
      }"
    >
      <n-h1
        class="pausedTitle"
        v-motion="'pausedTitle'"
        :initial="{
          opacity: 0,
          scale: 0,
        }"
        :enter="{
          opacity: 1,
          scale: 1,
        }"
        :leave="{
          opacity: 0,
        }"
      >
        <n-text type="primary" class="text-dark dark:text-light">Paused</n-text>
      </n-h1>

      <n-text
        v-if="show"
        class="score rounded-sm px-5 py-1 text-md border border-gray-600 text-dark dark:text-light"
        type="primary"
        v-motion="'scorePaused'"
        :initial="{
          opacity: 0,
          scale: 0,
        }"
        :enter="{
          opacity: 1,
          scale: 1,
        }"
        :leave="{
          opacity: 0,
        }"
      >
        Current score: {{ score }}
        <span class="w-2 inline-block" />
        |
        <span class="w-2 inline-block" />
        High score: {{ highScore }}
      </n-text>

      <button
        class="startIcon ease-in text-dark dark:text-light transition-colors duration-75 hover:bg-gray-600 text-sm hover:text-gray-200 focus:ring-1 focus:outline-none focus:ring-gray-400 rounded-full p-px text-center inline-grid place-items-center"
        @click="gameStore.start"
        v-motion="'pausedStartIcon'"
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
          <play-circle />
        </n-icon>
        <span class="sr-only">Resume Game</span>
      </button>

      <button
        class="restartIcon ease-in text-dark dark:text-light transition-colors duration-75 hover:bg-gray-600 text-sm hover:text-gray-200 focus:ring-1 focus:outline-none focus:ring-gray-400 rounded-full p-px text-center inline-grid place-items-center"
        @click="
          () => {
            gameStore.reset();
            gameStore.start();
          }
        "
        v-motion="'pausedRestartIcon'"
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
  grid-template-rows: 1fr 2rem max-content 6rem 1fr;
  grid-template-columns: 1fr 6rem 6rem 1fr;
  .pausedTitle {
    grid-row: 2;
    grid-column-end: span 4;
  }
  .score {
    grid-row: 3;
    grid-column-end: span 4;
  }
  .startIcon {
    grid-row: 4;
    grid-column: 2;
  }
  .restartIcon {
    grid-row: 4;
    grid-column: 3;
  }
}
</style>

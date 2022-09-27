<script setup lang="ts">
import { computed } from "vue";
import { useMotions } from "@vueuse/motion";
import { NIcon, NText, NGradientText, NH1 } from "naive-ui";
import { PlayCircle } from "@vicons/ionicons5";
import { useGameStore } from "../../gameLogic";

const gameStore = useGameStore();

const props = defineProps<{
  show: boolean;
}>();
const show = computed(() => props.show);

const motions = useMotions();
</script>

<template>
  <Transition
    :css="false"
    @leave="(
        (_: unknown, done: () => void) => {
          motions.firstTimeOverlayWrapper.leave(done);
        }
      )"
  >
    <div
      v-if="show"
      class="wrapper canvasOverlay canvasOverlay-filled"
      v-motion="'firstTimeOverlayWrapper'"
      :initial="{
        opacity: 1,
      }"
      :enter="{
        opacity: 1,
      }"
      :leave="{
        opacity: 0,
      }"
    >
      <n-h1
        class="firstTimeTitle"
        v-motion="'firstTimeTitle'"
        :inital="{
          scale: 0,
          opacity: 0,
        }"
        :enter="{
          scale: 1,
          opacity: 1,
        }"
      >
        <n-gradient-text
          :gradient="{
            deg: 180,
            from: 'rgb(100, 174, 20)',
            to: 'rgb(0, 104, 100)',
          }"
        >
          Vue-Snake
        </n-gradient-text>
      </n-h1>
      <n-text
        v-motion="'firstTimeInfo'"
        :enter="{
          scale: 1,
          opacity: 1,
        }"
        class="firstTimeInfo"
        depth="3"
      >
        Press the button below to start the game
      </n-text>

      <button
        class="startIcon ease-in transition-colors duration-75 text-gray-400 hover:bg-gray-600 text-sm hover:text-gray-200 focus:ring-1 focus:outline-none focus:ring-gray-400 rounded-full p-px text-center inline-grid place-items-center"
        @click="gameStore.start"
        v-motion="'firstTimeStartIcon'"
        :initial="{
          opacity: 1,
          scale: 1,
        }"
        :enter="{
          opacity: 1,
          scale: 1,
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
        <span class="sr-only">Start Game</span>
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.wrapper {
  grid-template-rows: 1fr 2rem 1rem 6rem 1fr;
  .firstTimeTitle {
    grid-row: 2;
  }
  .firstTimeInfo {
    grid-row: 3;
  }
  .startIcon {
    grid-row: 4;
  }
}
</style>

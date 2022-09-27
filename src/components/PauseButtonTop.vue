<script setup lang="ts">
import { useMotions } from "@vueuse/motion";
import { computed } from "vue";
import { NIcon } from "naive-ui";
import { PauseCircle } from "@vicons/ionicons5";
import { useGameStore } from "../gameLogic";

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
          motions.pauseButton.leave(done);
        }
      )"
  >
    <div class="wrapper" v-if="show">
      <button
        class="ease-in transition-colors duration-75 text-gray-400 hover:bg-gray-600 text-sm hover:text-gray-200 focus:ring-1 focus:outline-none focus:ring-gray-400 rounded-full p-px text-center inline-grid place-items-center"
        @click="gameStore.pause"
        v-motion="'pauseButton'"
        :initial="{
          opacity: 0,
          scale: 0,
          y: -50,
        }"
        :enter="{
          opacity: 1,
          scale: 1,
          y: 0,
        }"
        :leave="{
          opacity: 0,
          scale: 0,
          y: -50,
        }"
        :tapped="{
          scale: 0.9,
        }"
      >
        <n-icon aria-hidden="true" :size="'4rem'">
          <pause-circle />
        </n-icon>
        <span class="sr-only">Pause Game</span>
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.wrapper {
  position: absolute;
  top: -3.5rem;
  width: 100%;
  display: grid;
  place-items: center;
}
</style>

<script setup lang="ts">
import { watch, onUnmounted, computed, ref } from "vue";
import { useGameStore, Status } from "../gameLogic";
import Grid from "./Grid.vue";
import Rat from "./Rat.vue";
import Snake from "./Snake.vue";
import GameOverOverlay from "./overlays/GameOverOverlay.vue";
import PausedOverlay from "./overlays/PausedOverlay.vue";
import NotStartedOverlay from "./overlays/NotStartedOverlay.vue";
import PauseButtonTop from "./PauseButtonTop.vue";
import PointCounter from "./PointCounter.vue";
import GameWinOverlay from "./overlays/GameWinOverlay.vue";

const gameStore = useGameStore();

const canvasRef = ref<HTMLDivElement>();

watch(canvasRef, async (newCanvasRef) => {
  if (!!newCanvasRef) {
    gameStore.init("canvas");
  }
});

const status = computed<Status>(() => gameStore.status);

onUnmounted(() => {});
</script>

<template>
  <div class="canvas border-2 rounded-sm border-primary" ref="canvasRef">
    <NotStartedOverlay :show="!gameStore.isPlaying && status === Status.NotStarted" />
    <PausedOverlay :show="!gameStore.isPlaying && status === Status.Ongoing" />
    <GameOverOverlay :show="status === Status.Over" />
    <GameWinOverlay :show="status === Status.Win" />

    <PauseButtonTop :show="gameStore.isPlaying" />

    <PointCounter />

    <Grid />
    <Rat :canvasRef="canvasRef" />
    <Snake :canvasRef="canvasRef" />
  </div>
</template>

<style scoped lang="scss">
.canvas {
  width: calc(100% - 1.5rem);
  max-width: 85vh;
  aspect-ratio: 1 / 1;
  position: relative;
}
</style>

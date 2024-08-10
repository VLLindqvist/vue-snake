<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import { useGameStore } from "../gameLogic";
import { useMotions } from "@vueuse/motion";

const motions = useMotions();

// import Canvas from "./components/Canvas.vue";
const gameStore = useGameStore();

const props = defineProps<{
  canvasRef: HTMLDivElement | undefined;
}>();

const snakeSegmentRefs = ref<HTMLSpanElement[]>([]);

watch(
  () => props.canvasRef,
  (canvasRef) => {
    if (!!canvasRef) {
      gameStore.init("snake");
    }
    gameStore.$subscribe((mutation, state) => {
      if (gameStore.allInitialized && canvasRef && snakeSegmentRefs.value.length) {
        for (const snakeSegmentRef of snakeSegmentRefs.value) {
          const id = Number.parseInt(snakeSegmentRef.getAttribute("id") || "");
          const pos = gameStore.snake[id];
          const oldPos = gameStore.oldSnake[id];
          if (!pos) continue;

          let width = (0.8 / gameStore.boardWidth) * canvasRef.clientWidth + "px";
          let height = (0.8 / gameStore.boardHeight) * canvasRef.clientHeight + "px";
          let left = ((pos.x + 0.1) / gameStore.boardWidth) * canvasRef.clientWidth + "px";
          let top = ((pos.y + 0.1) / gameStore.boardHeight) * canvasRef.clientHeight + "px";

          // Joined snake. Doesn't work...
          // if (id < gameStore.snake.length - 1) {
          //   // Is "middle" segment
          //   if (gameStore.snake[id].x === gameStore.snake[id + 1].x) {
          //     // Same x => vertical
          //     height = (1.2 / gameStore.boardHeight) * canvasRef.clientHeight + "px";
          //     if (gameStore.snake[id].y < gameStore.snake[id + 1].y) {
          //       // "direction" is up
          //     } else if (gameStore.snake[id].y > gameStore.snake[id + 1].y) {
          //       // "direction" is down
          //       top = ((pos.y - 0.1) / gameStore.boardHeight) * canvasRef.clientHeight + "px";
          //     }
          //   } else if (gameStore.snake[id].y === gameStore.snake[id + 1].y) {
          //     // Same y => horizontal
          //     width = (1.2 / gameStore.boardWidth) * canvasRef.clientWidth + "px";
          //     if (gameStore.snake[id].x < gameStore.snake[id + 1].x) {
          //       // "direction" is left
          //     } else if (gameStore.snake[id].x > gameStore.snake[id + 1].x) {
          //       // "direction" is right
          //       left = ((pos.x - 0.1) / gameStore.boardWidth) * canvasRef.clientWidth + "px";
          //     }
          //   }
          // }
          const transition = {
            duration: gameStore.frameTime * 0.8,
            type: "keyframes",
            ease: "easeOut",
          };
          const motionObj = motions["snake" + id];
          motionObj.stopTransitions();
          motionObj.apply({
            width,
            height,
            transition,
          });
          if (
            (oldPos?.x === gameStore.boardWidth - 1 && pos.x === 0) ||
            (oldPos?.x === 0 && pos.x === gameStore.boardWidth - 1)
          ) {
            motionObj.set({
              left,
            });
            motionObj.apply({
              top,
              transition,
            });
          } else if (
            (oldPos?.y === gameStore.boardHeight - 1 && pos.y === 0) ||
            (oldPos?.y === 0 && pos.y === gameStore.boardHeight - 1)
          ) {
            motionObj.set({
              top,
            });
            motionObj.apply({
              left,
              transition,
            });
          } else {
            motionObj.apply({
              left,
              top,
              transition,
            });
          }
        }
      }
    });
  },
);

onUnmounted(() => {});
</script>

<template>
  <span
    class="snakeSegment dark:bg-white bg-primary"
    v-for="(data, i) of gameStore.snake"
    :id="i.toString()"
    ref="snakeSegmentRefs"
    v-motion="'snake' + i"
  ></span>
</template>

<style scoped lang="scss">
.snakeSegment {
  position: absolute;
}
</style>

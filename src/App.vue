<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from "vue";
import Canvas from "./components/Canvas.vue";
import { useGameStore, Key, Status, Coord } from "./gameLogic";

const gameStore = useGameStore();
const highScore = computed(() => gameStore.highScore);

gameStore.$subscribe(() => {
  if (Number.parseInt(localStorage.getItem("highScore")!) !== gameStore.highScore) {
    // persist the high score to the local storage whenever it changes
    localStorage.setItem("highScore", gameStore.highScore.toString());
  }
  if (!gameStore.isPlaying) {
    touchPoint.value = undefined;
  }
});

function keyDown(e: KeyboardEvent) {
  if (!gameStore.allInitialized) return;
  const { dirKeyQueue, isPlaying, status } = gameStore;
  switch (e.code) {
    case "KeyW":
    case "ArrowUp": {
      if (!isPlaying) return;
      gameStore.$patch({ dirKeyQueue: [...dirKeyQueue, Key.ArrowUp] });
      break;
    }
    case "KeyA":
    case "ArrowLeft": {
      if (!isPlaying) return;
      gameStore.$patch({ dirKeyQueue: [...dirKeyQueue, Key.ArrowLeft] });
      break;
    }
    case "KeyS":
    case "ArrowDown": {
      if (!isPlaying) return;
      gameStore.$patch({ dirKeyQueue: [...dirKeyQueue, Key.ArrowDown] });
      break;
    }
    case "KeyD":
    case "ArrowRight": {
      if (!isPlaying) return;
      gameStore.$patch({ dirKeyQueue: [...dirKeyQueue, Key.ArrowRight] });
      break;
    }
    case "Escape": {
      if (isPlaying) {
        gameStore.pause();
      } else if (status === Status.Ongoing) {
        gameStore.start();
      }
      break;
    }
    default:
      break;
  }
}

function onStorageUpdate(event: StorageEvent) {
  if (event.storageArea === localStorage) {
    const highScoreFromStorage = Number.parseInt(localStorage.getItem("highScore")!);
    if (!Number.isNaN(highScoreFromStorage) && highScoreFromStorage !== gameStore.highScore) {
      gameStore.$patch({ highScore: highScoreFromStorage });
    }
  }
}

const touchPoint = ref<[Coord, number]>();

function handleTouchStart(e: TouchEvent) {
  if (!gameStore.allInitialized) return;
  if (touchPoint.value !== undefined || !e.changedTouches[0]) return;
  const { isPlaying } = gameStore;
  if (!isPlaying) return;
  const { pageX, pageY, identifier } = e.changedTouches[0];
  touchPoint.value = [{ x: pageX, y: pageY }, identifier];
}
function handleTouchEnd(e: TouchEvent) {
  // if (!gameStore.allInitialized) return;
  // if (touchPoint.value === undefined) return;
  // const { dirKeyQueue, isPlaying } = gameStore;
  // if (!isPlaying) return;
  // const { pageX: currX, pageY: currY } = e.changedTouches[0];
  // const { x: prevX, y: prevY } = touchPoint.value;
  // handleTouchDirChange(currX, currY, prevX, prevY, dirKeyQueue);
  touchPoint.value = undefined;
}
function handleTouchMove(e: TouchEvent) {
  if (!gameStore.allInitialized) return;
  if (touchPoint.value === undefined) return;
  const { dirKeyQueue, isPlaying } = gameStore;
  if (!isPlaying) return;
  const [{ x: prevX, y: prevY }, prevIdentifier] = touchPoint.value;
  let currX: number,
    currY: number,
    currIdentifier: number,
    i = 0;
  do {
    if (i > e.changedTouches.length - 1) return;
    ({ pageX: currX, pageY: currY, identifier: currIdentifier } = e.changedTouches[i]);
    ++i;
  } while (currIdentifier !== prevIdentifier);
  handleTouchDirChange(currX, currY, prevX, prevY, dirKeyQueue);
}

function handleTouchDirChange(
  currX: number,
  currY: number,
  prevX: number,
  prevY: number,
  dirKeyQueue: Key[],
) {
  if (Math.abs(currX - prevX) > 40) {
    if (touchPoint.value?.[0] !== undefined) {
      touchPoint.value[0].x = currX;
    }
    if (currX < prevX) {
      // More the the left
      gameStore.$patch({ dirKeyQueue: [...dirKeyQueue, Key.ArrowLeft] });
    } else {
      // More the the right
      gameStore.$patch({ dirKeyQueue: [...dirKeyQueue, Key.ArrowRight] });
    }
  }

  if (Math.abs(currY - prevY) > 40) {
    if (touchPoint.value?.[0] !== undefined) {
      touchPoint.value[0].y = currY;
    }
    if (currY < prevY) {
      // More to up
      gameStore.$patch({ dirKeyQueue: [...dirKeyQueue, Key.ArrowUp] });
    } else {
      // More to down
      gameStore.$patch({ dirKeyQueue: [...dirKeyQueue, Key.ArrowDown] });
    }
  }
}

onMounted(() => {
  document.body.addEventListener("touchstart", handleTouchStart);
  document.body.addEventListener("touchend", handleTouchEnd);
  document.body.addEventListener("touchcancel", handleTouchEnd);
  document.body.addEventListener("touchmove", handleTouchMove);
  document.body.addEventListener("keydown", keyDown);
  window.addEventListener("storage", onStorageUpdate, false);
});

onUnmounted(() => {
  document.body.removeEventListener("touchstart", handleTouchStart);
  document.body.removeEventListener("touchend", handleTouchEnd);
  document.body.removeEventListener("touchcancel", handleTouchEnd);
  document.body.removeEventListener("touchmove", handleTouchMove);
  document.body.removeEventListener("keydown", keyDown);
  document.body.removeEventListener("keydown", keyDown);
});
</script>

<template>
  <n-config-provider
    class="grid place-items-center w-full h-full bg-light dark:bg-dark"
    :theme-overrides="themeOverrides"
  >
    <Canvas />
  </n-config-provider>
</template>

<script lang="ts">
import { GlobalThemeOverrides, NConfigProvider } from "naive-ui";

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#F9FAFB",
  },
  Button: {
    colorHover: "white",
    textColorHover: "#EEF9F5FF",
    textColorPressed: "#F3FBF8FF",
    textColorFocus: "#D8E6E1FF",
  },
  Icon: {
    color: "#fafafa",
  },
};
</script>

<script setup lang="ts">
import { useGameStore } from "../gameLogic";
const gameStore = useGameStore();
</script>

<template>
  <div class="gridWrap">
    <div class="col" v-for="colItem of gameStore.boardHeight">
      <div class="row" v-for="rowItem of gameStore.boardWidth"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gridWrap {
  height: 100%;
  width: 100%;
  display: grid;
  flex-direction: column;
  align-items: stretch;
}

.col {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: stretch;

  &:nth-of-type(2n - 1) {
    .row {
      &:nth-of-type(2n) {
        background-color: adjust-color($color: #303030, $red: -2, $green: -2, $blue: -2);
      }
    }
  }
  &:nth-of-type(2n) {
    .row {
      &:nth-of-type(2n-1) {
        background-color: adjust-color($color: #303030, $red: -2, $green: -2, $blue: -2);
      }
    }
  }
}

.row {
  width: 100%;
}
</style>

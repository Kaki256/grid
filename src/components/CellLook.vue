<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  row: number,
  col: number,
  cellSize: number,
  frameSize: number,
  color: string
}>();

const cellSizePx = computed(() => `${props.cellSize}px`);
const frameSizePx = computed(() => `${props.frameSize}px`);

const cellWidthPx = ref(props.col%2 === 0 ? frameSizePx : cellSizePx);
const cellHeightPx = ref(props.row%2 === 0 ? frameSizePx : cellSizePx);

</script>

<template>
  <div class="cell">
    <slot></slot>
  </div>
</template>

<style>
.cell {
  width: v-bind(cellWidthPx);
  height: v-bind(cellHeightPx);
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: v-bind(color);
}
</style>

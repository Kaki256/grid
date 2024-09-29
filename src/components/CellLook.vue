<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  row?: number,
  col?: number,
  cellSize: number,
  frameSize?: number,
  color: string,
  text?: string,
}>();

const row = computed(() => props.row ?? 1);
const col = computed(() => props.col ?? 1);

const frameSize = computed(() => props.frameSize ?? 0);

const cellSizePx = computed(() => `${props.cellSize}px`);
const frameSizePx = computed(() => `${frameSize.value}px`);

const cellWidthPx = ref(col.value%2 === 0 ? frameSizePx : cellSizePx);
const cellHeightPx = ref(row.value%2 === 0 ? frameSizePx : cellSizePx);

</script>

<template>
  <div class="cell">
    <slot> {{ props.text || '' }} </slot>
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

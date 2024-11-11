<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  cellSize: number,
  color: string,
  text?: string,
}>();

const cellSizePx = computed(() => `${props.cellSize}px`);

const cellWidthPx = ref(cellSizePx);
const cellHeightPx = ref(cellSizePx);

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

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { ref, computed } from 'vue'

const H = ref(5);
const W = ref(5);

const cellSize = ref(40);
const frameSize = ref(10);

const cellSizePx = computed(() => `${cellSize.value}px`);
const frameSizePx = computed(() => `${frameSize.value}px`);

const isFrameChangable = ref(false);
const isIntersectionChangable = ref(false);

const pallet = ['white', 'red', 'lime', 'blue', 'yellow', 'magenta', '#0ff', 'black'];
const selectedColor = ref(pallet[1]);

const palletWidth = '50px';
const palletHeight = '50px';

const playareaColor = ref<Array<Array<string>>>(
  Array.from({ length: 2 * H.value + 1 }, () =>
    Array.from({ length: 2 * W.value + 1 }, () => 'white')
  )
);

// XOR
const XOR = (a: boolean, b: boolean) => (a || b) && !(a && b);

// H, W が 変更されるたびに実行される
watch([H, W, isFrameChangable, isIntersectionChangable], () => {
  let newPlayareaColor = Array.from({ length: 2 * H.value + 1 }, () =>
    Array.from({ length: 2 * W.value + 1 }, () => 'white')
  );
  for (let i = 0; i < 2 * H.value + 1; i++) {
    for (let j = 0; j < 2 * W.value + 1; j++) {
      if (!isIntersectionChangable.value && i % 2 === 0 && j % 2 === 0) {
        newPlayareaColor[i][j] = '#ccc';
      } else if (!isFrameChangable.value && XOR(i % 2 === 0, j % 2 === 0)) {
        newPlayareaColor[i][j] = '#ccc';
      } else {
        if (i < playareaColor.value.length && j < playareaColor.value[i].length) {
          newPlayareaColor[i][j] = playareaColor.value[i][j] || 'white';
        }
      }
    }
  }
  playareaColor.value = newPlayareaColor;
  sessionStorage.setItem('H', H.value.toString());
  sessionStorage.setItem('W', W.value.toString());
  sessionStorage.setItem('playareaColor', JSON.stringify(playareaColor.value));
});

watch(cellSize, (newValue) => {
  sessionStorage.setItem('cellSize', newValue.toString());
})

watch(frameSize, (newValue) => {
  sessionStorage.setItem('frameSize', newValue.toString());
})

watch(isFrameChangable, (newValue) => {
  sessionStorage.setItem('isFrameChangable', newValue.toString());
})

watch(isIntersectionChangable, (newValue) => {
  sessionStorage.setItem('isIntersectionChangable', newValue.toString());
})

watch(selectedColor, (newValue) => {
  sessionStorage.setItem('selectedColor', newValue.toString());
})

watch(playareaColor, (newValue) => {
  console.log('playareaColor changed');
  sessionStorage.setItem('playareaColor', JSON.stringify(newValue));
}, { deep: true });

const selectColor = (color: string) => {
  selectedColor.value = color;
};

const draw = (i: number, j: number) => {
  console.log(i, j);
  if (!isIntersectionChangable.value && i % 2 === 0 && j % 2 === 0) {
    return;
  }
  if (!isFrameChangable.value && XOR(i % 2 === 0, j % 2 === 0)) {
    return;
  }
  playareaColor.value[i][j] = selectedColor.value;
};

let dragging = false;

const handleMouseDown = (i: number, j: number) => {
  dragging = true;
  draw(i-1, j-1);
};

const handleMouseEnter = (i: number, j: number) => {
  if (dragging) {
    draw(i-1, j-1);
  }
};

const handleMouseUp = () => {
  dragging = false;
};

document.addEventListener('mouseup', handleMouseUp);

// isFrameChangable.value が 変更されるたびに実行される
watch(isFrameChangable, (newValue) => {
  console.log('isFrameChangable changed');
  if (newValue === false) {
    for (let i = 0; i < 2 * H.value + 1; i++) {
      for (let j = 0; j < 2 * W.value + 1; j++) {
        if (XOR(i % 2 === 0, j % 2 === 0)) {
          playareaColor.value[i][j] = '#ccc';
        }
      }
    }
  } else {
    for (let i = 0; i < 2 * H.value + 1; i++) {
      for (let j = 0; j < 2 * W.value + 1; j++) {
        if (XOR(i % 2 === 0, j % 2 === 0) && playareaColor.value[i][j] === '#ccc') {
          playareaColor.value[i][j] = 'white';
        }
      }
    }
  }
});

// isIntersectionChangable.value が 変更されるたびに実行される
watch(isIntersectionChangable, (newValue) => {
  console.log('isIntersectionChangable changed');
  if (newValue === false) {
    for (let i = 0; i < 2 * H.value + 1; i++) {
      for (let j = 0; j < 2 * W.value + 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          playareaColor.value[i][j] = '#ccc';
        }
      }
    }
  } else {
    for (let i = 0; i < 2 * H.value + 1; i++) {
      for (let j = 0; j < 2 * W.value + 1; j++) {
        if (i % 2 === 0 && j % 2 === 0 && playareaColor.value[i][j] === '#ccc') {
          playareaColor.value[i][j] = 'white';
        }
      }
    }
  }
});

onMounted(() => {
  console.log('mounted');
  console.log(sessionStorage.getItem('playareaColor'));
  if (sessionStorage.getItem('H')) {
    H.value = parseInt(sessionStorage.getItem('H') || '5');
  } else {
    sessionStorage.setItem('H', H.value.toString());
  }
  if (sessionStorage.getItem('W')) {
    W.value = parseInt(sessionStorage.getItem('W') || '5');
  } else {
    sessionStorage.setItem('W', W.value.toString());
  }
  if (sessionStorage.getItem('cellSize')) {
    cellSize.value = parseInt(sessionStorage.getItem('cellSize') || '40');
  } else {
    sessionStorage.setItem('cellSize', cellSize.value.toString());
  }
  if (sessionStorage.getItem('frameSize')) {
    frameSize.value = parseInt(sessionStorage.getItem('frameSize') || '10');
  } else {
    sessionStorage.setItem('frameSize', frameSize.value.toString());
  }
  if (sessionStorage.getItem('isFrameChangable')) {
    isFrameChangable.value = sessionStorage.getItem('isFrameChangable') === 'true';
  } else {
    sessionStorage.setItem('isFrameChangable', isFrameChangable.value.toString());
  }
  if (sessionStorage.getItem('isIntersectionChangable')) {
    isIntersectionChangable.value = sessionStorage.getItem('isIntersectionChangable') === 'true';
  } else {
    sessionStorage.setItem('isIntersectionChangable', isIntersectionChangable.value.toString());
  }
  if (sessionStorage.getItem('selectedColor')) {
    selectedColor.value = sessionStorage.getItem('selectedColor') || 'red';
  } else {
    sessionStorage.setItem('selectedColor', selectedColor.value.toString());
  }
  const initialPlayareaColor = Array.from({ length: 2 * H.value + 1 }, () =>
    Array.from({ length: 2 * W.value + 1 }, () => 'white')
  );
  if (!isFrameChangable.value) {
    for (let i = 0; i < 2 * H.value + 1; i++) {
      for (let j = 0; j < 2 * W.value + 1; j++) {
        if (XOR(i % 2 === 0, j % 2 === 0)) {
          initialPlayareaColor[i][j] = '#ccc';
        }
      }
    }
  }
  if (!isIntersectionChangable.value) {
    for (let i = 0; i < 2 * H.value + 1; i++) {
      for (let j = 0; j < 2 * W.value + 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          initialPlayareaColor[i][j] = '#ccc';
        }
      }
    }
  }
  if (sessionStorage.getItem('playareaColor')) {
    playareaColor.value = JSON.parse(sessionStorage.getItem('playareaColor') || '[]');
    if (playareaColor.value.length === 0) {
      playareaColor.value = initialPlayareaColor;
    }
  } else {
    sessionStorage.setItem('playareaColor', JSON.stringify(playareaColor.value));
    playareaColor.value = initialPlayareaColor;
  }
  console.log(playareaColor.value);
});

const reset = () => {
  H.value = 5;
  W.value = 5;
  cellSize.value = 40;
  frameSize.value = 10;
  isFrameChangable.value = false;
  isIntersectionChangable.value = false;
  selectedColor.value = pallet[1];
  playareaColor.value = [];
  for (let i = 0; i < 2 * H.value + 1; i++) {
    playareaColor.value.push([]);
    for (let j = 0; j < 2 * W.value + 1; j++) {
      i%2===1 && j%2===1 ? playareaColor.value[i].push('white') : playareaColor.value[i].push('#ccc');
    }
  }
};

</script>

<template>
  <div>
    <div class="control">
      <label for="H">H:</label>
      <input id="H" type="number" v-model="H" />
      <label for="W">W:</label>
      <input id="W" type="number" v-model="W" />
      <label for="cellSize">セルサイズ:</label>
      <input id="cellSize" type="number" v-model="cellSize" />
      <label for="frameSize">枠サイズ:</label>
      <input id="frameSize" type="number" v-model="frameSize" />
      <label for="frameColor">辺変更可能:</label>
      <input id="frameColor" type="checkbox" v-model="isFrameChangable" />
      <label for="intersectionColor">頂点変更可能:</label>
      <input id="intersectionColor" type="checkbox" v-model="isIntersectionChangable" />
    </div>
    <div class="play-area">
      <div class="field">
        <div class="row" v-for="i in 2 * H + 1" :key="i">
          <div v-for="j in 2 * W + 1" :key="i * (2 * H + 1) + j">
            <div
              v-if="i % 2 == 1 && j % 2 == 1"
              class="cell"
              @mousedown="handleMouseDown(i, j)"
              @mouseenter="handleMouseEnter(i, j)"
              :style="{
                width: frameSizePx,
                height: frameSizePx,
                backgroundColor: playareaColor[i - 1][j - 1]
              }"
            ></div>
            <div
              v-else-if="i % 2 == 0 && j % 2 == 1"
              class="cell"
              @mousedown="handleMouseDown(i, j)"
              @mouseenter="handleMouseEnter(i, j)"
              :style="{
                width: frameSizePx,
                height: cellSizePx,
                backgroundColor: playareaColor[i - 1][j - 1]
              }"
            ></div>
            <div
              v-else-if="i % 2 == 1 && j % 2 == 0"
              class="cell"
              @mousedown="handleMouseDown(i, j)"
              @mouseenter="handleMouseEnter(i, j)"
              :style="{
                width: cellSizePx,
                height: frameSizePx,
                backgroundColor: playareaColor[i - 1][j - 1]
              }"
            ></div>
            <div
              v-else
              class="cell"
              @mousedown="handleMouseDown(i, j)"
              @mouseenter="handleMouseEnter(i, j)"
              :style="{
                width: cellSizePx,
                height: cellSizePx,
                backgroundColor: playareaColor[i - 1][j - 1]
              }"
            ></div>
          </div>
        </div>
      </div>
      <div class="pallet">
        <div
          @click="selectColor(color)"
          class="cell"
          v-for="color in pallet"
          :key="color"
          :style="{ width: palletWidth, height: palletHeight, backgroundColor: color }"
        >
          <span v-if="color === selectedColor">✓</span>
        </div>
      </div>
    </div>
    <div class="debug">
      <button @click="reset()">リセット</button>
    </div>
  </div>
</template>

<style>
.play-area {
  display: flex;
  flex-direction: row;
}

.field {
  display: flex;
  flex-direction: column;
  margin: 30px;
}

.row {
  display: flex;
}

.control {
  display: flex;
  flex-direction: row;
  margin: 30px;
}

input {
  margin: 5px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 50px;
}

.cell {
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script setup lang="ts">
import CellLook from '@/components/CellLook.vue';
import { onMounted, watch } from 'vue';
import { ref } from 'vue'

const H = ref(5);
const W = ref(5);

const cellSize = ref(40);
const frameSize = ref(10);

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
  sessionStorage.setItem('Grid_H', H.value.toString());
  sessionStorage.setItem('Grid_W', W.value.toString());
  sessionStorage.setItem('Grid_playareaColor', JSON.stringify(playareaColor.value));
});

watch(cellSize, (newValue) => {
  sessionStorage.setItem('Grid_cellSize', newValue.toString());
})

watch(frameSize, (newValue) => {
  sessionStorage.setItem('Grid_frameSize', newValue.toString());
})

watch(isFrameChangable, (newValue) => {
  sessionStorage.setItem('Grid_isFrameChangable', newValue.toString());
})

watch(isIntersectionChangable, (newValue) => {
  sessionStorage.setItem('Grid_isIntersectionChangable', newValue.toString());
})

watch(selectedColor, (newValue) => {
  sessionStorage.setItem('Grid_selectedColor', newValue.toString());
})

watch(playareaColor, (newValue) => {
  console.log('playareaColor changed');
  sessionStorage.setItem('Grid_playareaColor', JSON.stringify(newValue));
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
  console.log(sessionStorage.getItem('Grid_playareaColor'));
  if (sessionStorage.getItem('Grid_H')) {
    H.value = parseInt(sessionStorage.getItem('Grid_H') || '5');
  } else {
    sessionStorage.setItem('Grid_H', H.value.toString());
  }
  if (sessionStorage.getItem('Grid_W')) {
    W.value = parseInt(sessionStorage.getItem('Grid_W') || '5');
  } else {
    sessionStorage.setItem('Grid_W', W.value.toString());
  }
  if (sessionStorage.getItem('Grid_cellSize')) {
    cellSize.value = parseInt(sessionStorage.getItem('Grid_cellSize') || '40');
  } else {
    sessionStorage.setItem('Grid_cellSize', cellSize.value.toString());
  }
  if (sessionStorage.getItem('Grid_frameSize')) {
    frameSize.value = parseInt(sessionStorage.getItem('Grid_frameSize') || '10');
  } else {
    sessionStorage.setItem('Grid_frameSize', frameSize.value.toString());
  }
  if (sessionStorage.getItem('Grid_isFrameChangable')) {
    isFrameChangable.value = sessionStorage.getItem('Grid_isFrameChangable') === 'true';
  } else {
    sessionStorage.setItem('Grid_isFrameChangable', isFrameChangable.value.toString());
  }
  if (sessionStorage.getItem('Grid_isIntersectionChangable')) {
    isIntersectionChangable.value = sessionStorage.getItem('Grid_isIntersectionChangable') === 'true';
  } else {
    sessionStorage.setItem('Grid_isIntersectionChangable', isIntersectionChangable.value.toString());
  }
  if (sessionStorage.getItem('Grid_selectedColor')) {
    selectedColor.value = sessionStorage.getItem('Grid_selectedColor') || 'red';
  } else {
    sessionStorage.setItem('Grid_selectedColor', selectedColor.value.toString());
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
  if (sessionStorage.getItem('Grid_playareaColor')) {
    playareaColor.value = JSON.parse(sessionStorage.getItem('Grid_playareaColor') || '[]');
    if (playareaColor.value.length === 0) {
      playareaColor.value = initialPlayareaColor;
    }
  } else {
    sessionStorage.setItem('Grid_playareaColor', JSON.stringify(playareaColor.value));
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
            <CellLook
              :row="i-1"
              :col="j-1"
              :cellSize="cellSize"
              :frameSize="frameSize"
              :color="playareaColor[i-1][j-1]"
              @mousedown="handleMouseDown(i, j)"
              @mouseenter="handleMouseEnter(i, j)"
            />
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

</style>

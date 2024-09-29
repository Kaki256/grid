<script setup lang="ts">
import CellLook from '@/components/CellLook.vue'
import { onMounted, watch } from 'vue'
import { ref } from 'vue'

const H = ref(5)
const W = ref(5)

const cellSize = ref(40)

const pallet = ['black', 'white']

const selectedColor = ref('black')

const playareaColor = ref<Array<Array<string>>>(
  Array.from({ length: H.value }, () => Array.from({ length: W.value }, () => 'white'))
)

// H, W が 変更されるたびに実行される
watch([H, W], () => {
  let newPlayareaColor = Array.from({ length: H.value }, () =>
    Array.from({ length: W.value }, () => 'white')
  )
  for (let i = 0; i < H.value; i++) {
    for (let j = 0; j < W.value; j++) {
      newPlayareaColor[i][j] = playareaColor.value[i][j] || 'white'
    }
  }
  playareaColor.value = newPlayareaColor
  sessionStorage.setItem('Crossword_H', H.value.toString())
  sessionStorage.setItem('Crossword_W', W.value.toString())
  sessionStorage.setItem('Crossword_playareaColor', JSON.stringify(playareaColor.value))
})

watch(cellSize, (newValue) => {
  sessionStorage.setItem('Crossword_cellSize', newValue.toString())
})

watch(selectedColor, (newValue) => {
  sessionStorage.setItem('Crossword_selectedColor', newValue.toString())
})

watch(
  playareaColor,
  (newValue) => {
    console.log('playareaColor changed')
    sessionStorage.setItem('Crossword_playareaColor', JSON.stringify(newValue))
  },
  { deep: true }
)

const draw = (i: number, j: number) => {
  console.log(i, j)
  playareaColor.value[i][j] = selectedColor.value
}

let dragging = false

const handleMouseDown = (i: number, j: number) => {
  dragging = true
  draw(i - 1, j - 1)
}

const handleMouseEnter = (i: number, j: number) => {
  if (dragging) {
    draw(i - 1, j - 1)
  }
}

const handleMouseUp = () => {
  dragging = false
}

document.addEventListener('mouseup', handleMouseUp)

onMounted(() => {
  console.log('mounted')
  console.log(sessionStorage.getItem('Crossword_playareaColor'))
  if (sessionStorage.getItem('Crossword_H')) {
    H.value = parseInt(sessionStorage.getItem('Crossword_H') || '5')
  } else {
    sessionStorage.setItem('Crossword_H', H.value.toString())
  }
  if (sessionStorage.getItem('Crossword_W')) {
    W.value = parseInt(sessionStorage.getItem('Crossword_W') || '5')
  } else {
    sessionStorage.setItem('Crossword_W', W.value.toString())
  }
  if (sessionStorage.getItem('Crossword_cellSize')) {
    cellSize.value = parseInt(sessionStorage.getItem('Crossword_cellSize') || '40')
  } else {
    sessionStorage.setItem('Crossword_cellSize', cellSize.value.toString())
  }
  if (sessionStorage.getItem('Crossword_selectedColor')) {
    selectedColor.value = sessionStorage.getItem('Crossword_selectedColor') || 'red'
  } else {
    sessionStorage.setItem('Crossword_selectedColor', selectedColor.value.toString())
  }
  const initialPlayareaColor = Array.from({ length: H.value }, () =>
    Array.from({ length: W.value }, () => 'white')
  )
  if (sessionStorage.getItem('Crossword_playareaColor')) {
    playareaColor.value = JSON.parse(sessionStorage.getItem('Crossword_playareaColor') || '[]')
    if (playareaColor.value.length === 0) {
      playareaColor.value = initialPlayareaColor
    }
  } else {
    sessionStorage.setItem('Crossword_playareaColor', JSON.stringify(playareaColor.value))
    playareaColor.value = initialPlayareaColor
  }
  console.log(playareaColor.value)
})

const reset = () => {
  H.value = 5
  W.value = 5
  cellSize.value = 40
  selectedColor.value = 'black'
  playareaColor.value = []
  for (let i = 0; i < H.value; i++) {
    playareaColor.value.push([])
    for (let j = 0; j < W.value; j++) {
      playareaColor.value[i].push('white')
    }
  }
}
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
    </div>
    <div class="play-area">
      <div class="field">
        <div class="row" v-for="i in H" :key="i">
          <div v-for="j in W" :key="i * H + j">
            <CellLook
              :row="1"
              :col="1"
              :cellSize="cellSize"
              :frameSize="0"
              :color="playareaColor[i - 1][j - 1]"
              @mousedown="handleMouseDown(i, j)"
              @mouseenter="handleMouseEnter(i, j)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="pallet">
      <div v-for="color in pallet" :key="color">
        <CellLook
          :row="1"
          :col="1"
          :cellSize="50"
          :frameSize="0"
          :color="color"
          @click="selectedColor = color"
        />
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

<script setup lang="ts">
import CellLook from '@/components/CellLook.vue'
import { onMounted, watch } from 'vue'
import { ref } from 'vue'

const H = ref(5)
const W = ref(5)

const cellSize = ref(40)

const pallet = ['black', 'white']

const selectedColor = ref('black')

// field : ＿ or ＊ or ひらがな
const field = ref<Array<Array<string>>>(
  Array.from({ length: H.value }, () => Array.from({ length: W.value }, () => 'white'))
)

const inputString = ref('')
watch(inputString, (newValue) => {
  sessionStorage.setItem('Crossword_inputString', newValue.toString())
  const newFieldStrings = newValue.split('\n').map((line) => line.split(''))
  fieldStrings.value = newFieldStrings
})

// H, W が 変更されるたびに実行される
watch([H, W], () => {
  let newField = Array.from({ length: H.value }, () => Array.from({ length: W.value }, () => '＿'))
  for (let i = 0; i < H.value; i++) {
    for (let j = 0; j < W.value; j++) {
      if (i < field.value.length && j < field.value[i].length) {
        newField[i][j] = field.value[i][j] || '＿'
      }
    }
  }
  field.value = newField

  sessionStorage.setItem('Crossword_H', H.value.toString())
  sessionStorage.setItem('Crossword_W', W.value.toString())
  sessionStorage.setItem('Crossword_field', JSON.stringify(field.value))
})

watch(cellSize, (newValue) => {
  sessionStorage.setItem('Crossword_cellSize', newValue.toString())
})

watch(selectedColor, (newValue) => {
  sessionStorage.setItem('Crossword_selectedColor', newValue.toString())
})

watch(
  field,
  (newValue) => {
    console.log('field changed')
    sessionStorage.setItem('Crossword_field', JSON.stringify(newValue))
  },
  { deep: true }
)

const draw = (i: number, j: number) => {
  console.log(i, j)
  field.value[i][j] = selectedColor.value
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
  console.log(sessionStorage.getItem('Crossword_field'))
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
  if (sessionStorage.getItem('Crossword_inputString')) {
    inputString.value = sessionStorage.getItem('Crossword_inputString') || ''
  } else {
    sessionStorage.setItem('Crossword_inputString', inputString.value.toString())
  }
  const initialPlayareaColor = Array.from({ length: H.value }, () =>
    Array.from({ length: W.value }, () => '＿')
  )
  if (sessionStorage.getItem('Crossword_field')) {
    field.value = JSON.parse(sessionStorage.getItem('Crossword_field') || '[]')
    if (field.value.length === 0) {
      field.value = initialPlayareaColor
    }
  } else {
    sessionStorage.setItem('Crossword_field', JSON.stringify(field.value))
    field.value = initialPlayareaColor
  }
  console.log(field.value)
})

const reset = () => {
  H.value = 5
  W.value = 5
  cellSize.value = 40
  selectedColor.value = 'black'
  field.value = []
  for (let i = 0; i < H.value; i++) {
    field.value.push([])
    for (let j = 0; j < W.value; j++) {
      field.value[i].push('white')
    }
  }
}

const fieldStrings = ref<Array<Array<string>>>(
  Array.from({ length: H.value }, () => Array.from({ length: W.value }, () => '＿'))
)

const stringToField = () => {
  const newField = Array.from({ length: H.value }, () =>
    Array.from({ length: W.value }, () => '＿')
  )
  for (let i = 0; i < H.value; i++) {
    for (let j = 0; j < W.value; j++) {
      if (field.value[i] && fieldStrings.value[i][j] == '＊') {
        newField[i][j] = 'black'
      } else if (field.value[i] && fieldStrings.value[i][j] == '＿') {
        newField[i][j] = 'white'
      } else {
        newField[i][j] = fieldStrings.value[i][j]
      }
    }
  }
  field.value = newField
}

const fieldToString = () => {
  inputString.value = field.value
    .join('\n')
    .replace(/,/g, '')
    .replace(/black/g, '＊')
    .replace(/white/g, '＿')
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
    <div class="stringInput">
      <label for="inputString">入力文字列：</label>
      <textarea v-model="inputString" style="width: 60%; height: 100px"></textarea>
    </div>
    <div class="convert">
      <button @click="stringToField()">変換↓</button>
      <button @click="fieldToString()">変換↑</button>
    </div>
    <div class="play-area">
      <div class="field">
        <div class="row" v-for="i in H" :key="i">
          <div v-for="j in W" :key="i * H + j">
            <CellLook
              v-if="field[i - 1][j - 1] === 'black'"
              :cellSize="cellSize"
              color="black"
              @mousedown="handleMouseDown(i, j)"
              @mouseenter="handleMouseEnter(i, j)"
            />
            <CellLook
              v-else-if="field[i - 1][j - 1] === 'white'"
              :cellSize="cellSize"
              color="white"
              @mousedown="handleMouseDown(i, j)"
              @mouseenter="handleMouseEnter(i, j)"
            />
            <CellLook
              v-else
              :cellSize="cellSize"
              color="white"
              :text="field[i - 1][j - 1]"
              @mousedown="handleMouseDown(i, j)"
              @mouseenter="handleMouseEnter(i, j)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="pallet">
      <div v-for="color in pallet" :key="color">
        <CellLook :cellSize="50" :color="color" @click="selectedColor = color" />
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

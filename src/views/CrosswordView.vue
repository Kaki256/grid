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

const isLoading = ref(false)

const dictNames = ['buta', 'eigo', 'illust1_3', 'ippan']
const selectedDict = ref(dictNames[0])
watch(selectedDict, () => {
  sessionStorage.setItem('Crossword_selectedDict', selectedDict.value)
})
const dict = ref<string[]>([])

const loadDict = async () => {
  const response = await fetch(`/src/assets/dictionaries/${selectedDict.value}.txt`)
  const text = await response.text()
  dict.value = text.split('\n')
}

interface Slot {
  x: number
  y: number
  direction: 'horizontal' | 'vertical'
  length: number
  word: string
}

const startSearch = async () => {
  isLoading.value = true
  await loadDict()
  await search()
}

const search = () => {
  // expandedField.value は field.value の周りに１マスずつ黒マス '＊' を追加したもの
  const expandedField = Array.from({ length: H.value + 2 }, () =>
    Array.from({ length: W.value + 2 }, () => '＊')
  )
  for (let i = 0; i < H.value; i++) {
    for (let j = 0; j < W.value; j++) {
      if (field.value[i][j] === 'white') {
        expandedField[i + 1][j + 1] = '＿'
      } else if (field.value[i][j] === 'black') {
        expandedField[i + 1][j + 1] = '＊'
      } else {
        expandedField[i + 1][j + 1] = field.value[i][j]
      }
    }
  }
  console.log(expandedField)

  // 単語になっている必要のあるスロットを列挙
  const slots: Slot[] = []

  for (let i = 1; i <= H.value; i++) {
    for (let j = 1; j <= W.value; j++) {
      if (expandedField[i][j] !== '＊') {
        // 横方向
        if (expandedField[i][j - 1] === '＊' && expandedField[i][j + 1] !== '＊') {
          let length = 1,
            tempWord = expandedField[i][j]
          while (expandedField[i][j + length] !== '＊') {
            tempWord += expandedField[i][j + length]
            length++
          }
          slots.push({
            x: j,
            y: i,
            direction: 'horizontal',
            length: length,
            word: tempWord
          })
        }
        // 縦方向
        if (expandedField[i - 1][j] === '＊' && expandedField[i + 1][j] !== '＊') {
          let length = 1,
            tempWord = expandedField[i][j]
          while (expandedField[i + length][j] !== '＊') {
            tempWord += expandedField[i + length][j]
            length++
          }
          slots.push({
            x: j,
            y: i,
            direction: 'vertical',
            length: length,
            word: tempWord
          })
        }
      }
    }
  }
  console.log(slots)

  const dictByLength = dict.value.reduce(
    (acc, cur) => {
      if (!acc[cur.length]) {
        acc[cur.length] = []
      }
      acc[cur.length].push(cur)
      return acc
    },
    {} as { [key: number]: string[] }
  )

  // TODO: 単語になっている必要のあるスロットに対して検索
  const queue: Queue<Slot[]> = new Queue()
  queue.enqueue(slots)

  while (!queue.isEmpty()) {
    const currentSlots = queue.dequeue() || []

    let nextSlots: Slot[] = []
    // nextSlots に currentSlots をコピー
    for (let i = 0; i < currentSlots.length; i++) {
      nextSlots.push({
        x: currentSlots[i].x,
        y: currentSlots[i].y,
        direction: currentSlots[i].direction,
        length: currentSlots[i].length,
        word: currentSlots[i].word
      })
    }
    console.log(JSON.stringify(nextSlots))
    if (!currentSlots) {
      break
    }

    let isSlotFilled = true
    for (let slotIndex = 0; slotIndex < currentSlots.length; slotIndex++) {
      const currentSlot = currentSlots[slotIndex]
      let isFilled = true
      for (let i = 0; i < currentSlot.word.length; i++) {
        if (currentSlot.word[i] === '＿') isFilled = false
      }
      if (isFilled) {
        continue
      }
      isSlotFilled = false
      // スロットに当てはまる単語を入れて、交点を他のスロットにも埋めた nextSlots を作り、queue に追加
      const words = dictByLength[currentSlot.length] || []
      // for (let i = 0; i < words.length; i++) {
      //   const word = words[i]
      //   let isCrossed = false
      //   for (let j = 0; j < currentSlots.length; j++) {
      //     if (j === slotIndex) {
      //       continue
      //     }
      //     const cross = crossPoint(currentSlot, currentSlots[j])
      //     if (cross) {
      //       isCrossed = true
      //       let isCrossFilled = true
      //       for (let k = 0; k < currentSlots[j].word.length; k++) {
      //         if (currentSlots[j].word[k] === '＿') isCrossFilled = false
      //       }
      //       if (isCrossFilled) {
      //         continue
      //       }
      //       const nextSlot = {
      //         x: currentSlots[j].x,
      //         y: currentSlots[j].y,
      //         direction: currentSlots[j].direction,
      //         length: currentSlots[j].length,
      //         word: currentSlots[j].word
      //       }
      //       nextSlot.word = nextSlot.word.substring(0, cross.x - nextSlot.x) + word + nextSlot.word.substring(cross.x - nextSlot.x + word.length)
      //       nextSlots[j] = nextSlot
      //     }
      //   }
      //   if (isCrossed) {
      //     const nextSlot = {
      //       x: currentSlot.x,
      //       y: currentSlot.y,
      //       direction: currentSlot.direction,
      //       length: currentSlot.length,
      //       word: currentSlot.word
      //     }
      //     nextSlot.word = nextSlot.word.substring(0, cross.x - nextSlot.x) + word + nextSlot.word.substring(cross.x - nextSlot.x + word.length)
      //     nextSlots[slotIndex] = nextSlot
      //     queue.enqueue(nextSlots)
      //   }
      // }
    }
    if (isSlotFilled) {
      console.log('isSlotFilled')
      console.log(JSON.stringify(currentSlots))
      break
    }
  }
  isLoading.value = false
}

const crossPoint = (slot1: Slot, slot2: Slot) => {
  if (slot1 === slot2) {
    return null
  }
  if (
    slot1.direction === 'horizontal' &&
    slot2.direction === 'vertical' &&
    slot1.x < slot2.x &&
    slot2.x < slot1.x + slot1.length &&
    slot2.y < slot1.y &&
    slot1.y < slot2.y + slot2.length
  ) {
    return {
      x: slot1.x,
      y: slot2.y
    }
  } else if (
    slot1.direction === 'vertical' &&
    slot2.direction === 'horizontal' &&
    slot2.x < slot1.x &&
    slot1.x < slot2.x + slot2.length &&
    slot1.y < slot2.y &&
    slot2.y < slot1.y + slot1.length
  ) {
    return {
      x: slot2.x,
      y: slot1.y
    }
  } else {
    return null
  }
}



class Queue<T> {
  private items: T[] = []

  enqueue(item: T): void {
    this.items.push(item)
  }

  dequeue(): T | undefined {
    return this.items.shift()
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  size(): number {
    return this.items.length
  }
}

// H, W が 変更されるたびに実行される
watch([H, W], () => {
  let newField = Array.from({ length: H.value }, () =>
    Array.from({ length: W.value }, () => 'white')
  )
  for (let i = 0; i < H.value; i++) {
    for (let j = 0; j < W.value; j++) {
      if (i < field.value.length && j < field.value[i].length) {
        newField[i][j] = field.value[i][j] || 'white'
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
    sessionStorage.setItem('Crossword_field', JSON.stringify(newValue))
    fieldToString()
  },
  { deep: true }
)

const fieldStrings = ref<Array<Array<string>>>(
  Array.from({ length: H.value }, () => Array.from({ length: W.value }, () => '＿'))
)

const draw = (i: number, j: number) => {
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
  if (sessionStorage.getItem('Crossword_selectedDict')) {
    selectedDict.value = sessionStorage.getItem('Crossword_selectedDict') || 'buta'
  } else {
    sessionStorage.setItem('Crossword_selectedDict', selectedDict.value.toString())
  }
  if (sessionStorage.getItem('Crossword_inputString')) {
    inputString.value = sessionStorage.getItem('Crossword_inputString') || ''
  } else {
    sessionStorage.setItem('Crossword_inputString', inputString.value.toString())
  }
  const initialPlayareaColor = Array.from({ length: H.value }, () =>
    Array.from({ length: W.value }, () => 'white')
  )
  if (sessionStorage.getItem('Crossword_field')) {
    field.value = JSON.parse(sessionStorage.getItem('Crossword_field') || '[]')
    if (field.value.length === 0) {
      field.value = initialPlayareaColor
    }
  } else {
    field.value = initialPlayareaColor
    sessionStorage.setItem('Crossword_field', JSON.stringify(field.value))
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

const stringToField = () => {
  const newField = Array.from({ length: H.value }, () =>
    Array.from({ length: W.value }, () => 'white')
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
    <div class="control">
      <label for="selectedDict">辞書選択</label>
      <select id="selectedDict" v-model="selectedDict">
        <option v-for="name in dictNames" :key="name" :value="name">{{ name }}</option>
      </select>
      <button @click="startSearch">検索</button>
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

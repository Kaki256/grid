<script setup lang="ts">
import SimpleCellLook from '@/components/SimpleCellLook.vue'
import { onMounted, watch, computed } from 'vue'
import { ref } from 'vue'

const field = ref('')

const templateFields = {
  gojuuon:
    'んわらやまはなたさかあ' +
    '\n' +
    '　　り　みひにちしきい' +
    '\n' +
    '　　るゆむふぬつすくう' +
    '\n' +
    '　　れ　めへねてせけえ' +
    '\n' +
    '　をろよもほのとそこお',

  eigo: 'ABCDE' + '\n' + 'FGHIJ' + '\n' + 'KLMNO' + '\n' + 'PQRST' + '\n' + 'UVWXYZ'
}

const inputLength = ref(5)

const H = ref(2*inputLength.value + 1)
const W = ref(2*inputLength.value + 1)

const cellSize = ref(40)

const playareaColor = ref<Array<Array<string>>>(
  Array.from({ length: H.value }, () => Array.from({ length: W.value }, () => 'white'))
)

// XOR
const XOR = (a: boolean, b: boolean) => (a || b) && !(a && b)

// H, W が 変更されるたびに実行される
watch([H, W], () => {
  let newPlayareaColor = Array.from({ length: H.value }, () =>
    Array.from({ length: W.value }, () => 'white')
  )
  playareaColor.value = newPlayareaColor
  sessionStorage.setItem('RookMove_H', H.value.toString())
  sessionStorage.setItem('RookMove_W', W.value.toString())
  sessionStorage.setItem('RookMove_playareaColor', JSON.stringify(playareaColor.value))
})

watch(cellSize, (newValue) => {
  sessionStorage.setItem('RookMove_cellSize', newValue.toString())
})

watch(
  playareaColor,
  (newValue) => {
    console.log('playareaColor changed')
    sessionStorage.setItem('RookMove_playareaColor', JSON.stringify(newValue))
  },
  { deep: true }
)

watch(
  field,
  (newValue) => {
    sessionStorage.setItem('RookMove_field', newValue)
  },
  { deep: true }
)

const draw = (i: number, j: number) => {
  console.log(i, j)
  if (2 * i + 1 == H.value && 2 * j + 1 == W.value) return
  playareaColor.value[i][j] = playareaColor.value[i][j] === 'white' ? 'black' : 'white'
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
  console.log(sessionStorage.getItem('RookMove_playareaColor'))
  if (sessionStorage.getItem('RookMove_H')) {
    H.value = parseInt(sessionStorage.getItem('RookMove_H') || '5')
  } else {
    sessionStorage.setItem('RookMove_H', H.value.toString())
  }
  if (sessionStorage.getItem('RookMove_W')) {
    W.value = parseInt(sessionStorage.getItem('RookMove_W') || '5')
  } else {
    sessionStorage.setItem('RookMove_W', W.value.toString())
  }
  if (sessionStorage.getItem('RookMove_cellSize')) {
    cellSize.value = parseInt(sessionStorage.getItem('RookMove_cellSize') || '40')
  } else {
    sessionStorage.setItem('RookMove_cellSize', cellSize.value.toString())
  }
  const initialPlayareaColor = Array.from({ length: H.value }, () =>
    Array.from({ length: W.value }, () => 'white')
  )
  if (sessionStorage.getItem('RookMove_playareaColor')) {
    playareaColor.value = JSON.parse(sessionStorage.getItem('RookMove_playareaColor') || '[]')
    if (H.value === 0) {
      playareaColor.value = initialPlayareaColor
    }
  } else {
    sessionStorage.setItem('RookMove_playareaColor', JSON.stringify(playareaColor.value))
    playareaColor.value = initialPlayareaColor
  }
  if (sessionStorage.getItem('RookMove_field')) {
    field.value = sessionStorage.getItem('RookMove_field') || ''
  } else {
    sessionStorage.setItem('RookMove_field', field.value)
  }
  console.log(playareaColor.value)
})

const reset = () => {
  H.value = 5
  W.value = 5
  cellSize.value = 40
  playareaColor.value = []
  for (let i = 0; i < H.value; i++) {
    playareaColor.value.push([])
    for (let j = 0; j < W.value; j++) {
      playareaColor.value[i].push('white')
    }
  }
  results.value = []
}

const isJapaneseFont = ref(false)

const toggleFont = () => {
  isJapaneseFont.value = !isJapaneseFont.value
}

const fontClass = computed(() => {
  return isJapaneseFont.value ? 'japanese-monospace' : 'english-monospace'
})

const setField = (template: 'gojuuon' | 'eigo') => {
  field.value = templateFields[template]
}

const dictNames = ['buta', 'eigo', 'illust1_3', 'ippan']

const selectedDict = ref(dictNames[0])
watch(selectedDict, (newValue) => {
  sessionStorage.setItem('RookMove_selectedDict', newValue)
})

const dict = ref<string[]>([])

const loadDict = async () => {
  const response = await fetch(`/src/assets/dictionaries/${selectedDict.value}.txt`)
  const text = await response.text()
  dict.value = text.split('\n')
}

const results = ref<string[]>([])

const search = async () => {
  await loadDict()

  results.value = []

  // 改行コードを統一
  const normalizedField = field.value.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  let fieldStrings = normalizedField.split('\n')

  // アルファベット大文字を小文字に変換
  fieldStrings = normalizedField.split('\n').map(line => line.toLowerCase())

  console.log(fieldStrings)

  let fieldStringsHeight = fieldStrings.length,
    fieldStringsWidth = 0
  for (let i = 0; i < fieldStringsHeight; i++) {
    fieldStringsWidth = Math.max(fieldStringsWidth, fieldStrings[i].length)
  }

  // まずは各文字を頂点とするグラフを作成、フィールドを参照して辺を張る
  // 具体的には、フィールドの中心をある頂点とし、黒になっているセルに対応する文字列上の文字の間に辺を張る
  const graph: { [key: string]: string[] } = {}
  for (let i = 0; i < fieldStringsHeight; i++) {
    for (let j = 0; j < fieldStringsWidth; j++) {
      if (!(fieldStrings[i][j] in [' ', '　', '_', '＿', '\n'])) {
        graph[fieldStrings[i][j]] = []
      }
    }
  }

  let dx = [],
    dy = []
  const center = { x: (H.value + 1) / 2, y: (W.value + 1) / 2 }
  for (let i = 0; i < H.value; i++) {
    for (let j = 0; j < W.value; j++) {
      if (playareaColor.value[i][j] === 'black') {
        dx.push(i + 1 - center.x)
        dy.push(j + 1 - center.y)
      }
    }
  }

  // dx, dy を console.log してみる
  console.log(dx)
  console.log(dy)

  console.log(fieldStringsHeight, fieldStringsWidth)

  for (let i = 0; i < fieldStringsHeight; i++) {
    for (let j = 0; j < fieldStringsWidth; j++) {
      if ([' ', '　', '_', '＿', '\n'].includes(fieldStrings[i][j])) {
        console.log('fieldStrings[' + i + '][' + j + '] is space')
        continue
      }
      if (fieldStrings[i][j] === undefined) {
        console.log('fieldStrings[' + i + '][' + j + '] is undefined')
        continue
      }
      for (let index = 0; index < dx.length; index++) {
        const x = j + dx[index]
        const y = i + dy[index]
        console.log(i, j, x, y)
        if (x < 0 || x >= fieldStringsWidth || y < 0 || y >= fieldStringsHeight) {
          console.log('(' + y + ',' + x + ') is out of range')
          continue
        }
        if ([' ', '　', '_', '＿', '\n'].includes(fieldStrings[y][x])) {
          console.log('fieldStrings[' + y + '][' + x + '] is space')
          continue
        }
        if (fieldStrings[y][x] === undefined) {
          console.log('fieldStrings[' + y + '][' + x + '] is undefined')
          continue
        }
        console.log(fieldStrings[i][j], fieldStrings[y][x])
        graph[fieldStrings[i][j]].push(fieldStrings[y][x])
      }
    }
  }

  console.log(graph)
  // その後、各単語に対して、その単語が作れるかどうかを判定する (つまり、各単語の各文字間に辺が張られているかどうかを確認する)

  for (let word of dict.value) {
    let ok = true
    for (let i = 0; i < word.length - 1; i++) {
      if (!(word[i] in graph)) {
        ok = false
        break
      }
      if (!graph[word[i]].includes(word[i + 1])) {
        ok = false
        break
      }
    }
    if (ok) {
      results.value.push(word)
    }
  }

  console.log(results.value)
}
</script>

<template>
  <div>
    <div class="control">
      <label for="inputLength">inputLength:</label>
      <input id="inputLength" type="number" v-model="inputLength" />
      <label for="cellSize">セルサイズ:</label>
      <input id="cellSize" type="number" v-model="cellSize" />
      <button @click="toggleFont">{{ isJapaneseFont ? '半角にする' : '全角にする' }}</button>
    </div>
    <div class="play-area">
      <div class="template-buttons">
        <button @click="setField('gojuuon')">五十音</button>
        <button @click="setField('eigo')">英語</button>
      </div>
      <div class="field">
        <div class="row" v-for="i in H" :key="i">
          <div v-for="j in W" :key="i * H + j">
            <SimpleCellLook
              v-if="2 * i - 1 === H && 2 * j - 1 === W"
              :row="i - 1"
              :col="j - 1"
              :cellSize="cellSize"
              :frameSize="1"
              :color="'red'"
              @mousedown="handleMouseDown(i, j)"
              @mouseenter="handleMouseEnter(i, j)"
            />
            <SimpleCellLook
              v-else
              :row="i - 1"
              :col="j - 1"
              :cellSize="cellSize"
              :frameSize="1"
              :color="playareaColor[i - 1][j - 1]"
              @mousedown="handleMouseDown(i, j)"
              @mouseenter="handleMouseEnter(i, j)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="input">
      <textarea
        v-model="field"
        :class="fontClass"
        class="input-field"
        rows="10"
        cols="50"
      ></textarea>
    </div>
    <p>辞書選択</p>
    <select v-model="selectedDict">
      <option v-for="name in dictNames" :key="name" :value="name">{{ name }}</option>
    </select>
    <div class="debug">
      <button @click="reset()">リセット</button>
    </div>
    <div class="search">
      <button @click="search">検索</button>
      <div v-for="result in results" :key="result">{{ result }}</div>
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

.input-field {
  margin: 5px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow-y: auto;
  width: 100%;
  height: 200px;
}

/* 英語用等幅フォント */
.english-monospace {
  font-family: 'Courier New', Courier, monospace;
}

/* 日本語用等幅フォント */
.japanese-monospace {
  font-family: 'MS Gothic', 'Osaka-Mono', monospace;
}
</style>

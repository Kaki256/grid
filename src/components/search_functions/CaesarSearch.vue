<template>
  <div>
    <h1>シーザー検索</h1>
    <div style="display: flex; flex-direction: row">
      <p>辞書選択</p>
      <select v-model="selectedDict">
        <option v-for="name in dictNames" :key="name" :value="name">{{ name }}</option>
      </select>
      <p>シフト数:</p>
      <input type="number" v-model="shift" placeholder="シフト数" />
    </div>
    <div style="display: flex; flex-direction: row">
      <p>文字数</p>
      <input type="number" v-model="wordLength" placeholder="文字数" />
      ソート:
      <select v-model="sortMode">
        <option>word</option>
        <option>result</option>
        <option>tempShiftNum</option>
      </select>
    </div>
    <div>
      <input v-model="query" placeholder="検索語を入力" />
      <button @click="search">検索</button>
      <button @click="randomOutput">ランダム出力</button>
    </div>
    <div class="results">
      <p>ヒット数: {{ results.length }}</p>
      <p v-if="isLoading">loading...</p>
      <ul v-if="!isLoading" style="max-height: 200px; overflow-y: auto; width: 60%">
        <li v-for="result in results" :key="result">{{ result }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const alphabet = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'
const hiragana =
  'あぁいぃうぅえぇおぉかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもやゃゆゅよょらりるれろわをん'

const seion =
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'
const dakuon =
  '＿＿＿＿＿がぎぐげござじずぜぞだぢづでど＿＿＿＿＿ばびぶべぼ＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿'
const handaku =
  '＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿ぱぴぷぺぽ＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿'
const youon =
  'ぁぃぅぇぉ＿＿＿＿＿＿＿＿＿＿＿＿っ＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿ゃゅょ＿＿＿＿＿＿＿＿'

const wordLength = ref(0)
watch(wordLength, (newValue) => {
  sessionStorage.setItem('wordLengthCaesarSearch', newValue.toString())
})

const query = ref('')
watch(query, (newValue) => {
  sessionStorage.setItem('queryCaesarSearch', newValue)
})
const results = ref<string[]>([])
const dictNames = ['buta', 'eigo', 'illust1_3', 'ippan']
const selectedDict = ref(dictNames[0])
watch(selectedDict, (newValue) => {
  sessionStorage.setItem('selectedDictCaesarSearch', newValue)
})
const dict = ref<string[]>([])

const shift = ref(0)
watch(shift, (newValue) => {
  sessionStorage.setItem('shiftCaesarSearch', newValue.toString())
})

const isLoading = ref(false)

const loadDict = async () => {
  const response = await fetch(`/src/assets/dictionaries/${selectedDict.value}.txt`)
  const text = await response.text()
  dict.value = text.split('\n')
}

const sortMode = ref('word')
watch(sortMode, (newValue) => {
  sessionStorage.setItem('sortModeCaesarSearch', newValue)
})

const search = async () => {
  isLoading.value = true
  await loadDict()
  if (wordLength.value !== 0)
    dict.value = dict.value.filter((word) => word.length === wordLength.value)
  let shiftMax = -1
  if (hiragana.includes(dict.value[0][0])) {
    shiftMax = seion.length
  } else if (alphabet.includes(dict.value[0][0])) {
    shiftMax = 26
  }
  if (shift.value === 0 && query.value.length !== 0) {
    // シフト数が0、クエリ未入力の場合は全てのシフト数を試す
    const tempResults = []
    const input = query.value
    for (let tempShiftNum = 0; tempShiftNum < shiftMax; tempShiftNum++) {
      let result = ''
      for (let inputLength = 0; inputLength < input.length; inputLength++) {
        if (seion.includes(input[inputLength])) {
          const index = seion.indexOf(input[inputLength])
          const newIndex = (index + tempShiftNum) % seion.length
          result += seion[newIndex]
        } else if (dakuon.includes(input[inputLength])) {
          const index = dakuon.indexOf(input[inputLength])
          const newIndex = (index + tempShiftNum) % dakuon.length
          result += dakuon[newIndex]
        } else if (handaku.includes(input[inputLength])) {
          const index = handaku.indexOf(input[inputLength])
          const newIndex = (index + tempShiftNum) % handaku.length
          result += handaku[newIndex]
        } else if (youon.includes(input[inputLength])) {
          const index = youon.indexOf(input[inputLength])
          const newIndex = (index + tempShiftNum) % youon.length
          result += youon[newIndex]
        } else if (alphabet.includes(input[inputLength])) {
          const index = alphabet.indexOf(input[inputLength])
          const newIndex = (index + 2 * tempShiftNum) % alphabet.length
          result += alphabet[newIndex]
        } else {
          result += input[inputLength]
        }
      }
      if (dict.value.includes(result)) {
        tempResults.push(result + ' (シフト数: ' + tempShiftNum + ')')
      }
    }
    results.value = tempResults
  } else if (shift.value !== 0 && query.value.length === 0) {
    // シフト数が指定され、クエリ未入力の場合は全ての単語を試す
    const tempResults = []
    for (let word of dict.value) {
      let result = ''
      for (let inputLength = 0; inputLength < word.length; inputLength++) {
        if (seion.includes(word[inputLength])) {
          const index = seion.indexOf(word[inputLength])
          const newIndex = (index + shift.value) % seion.length
          result += seion[newIndex]
        } else if (dakuon.includes(word[inputLength])) {
          const index = dakuon.indexOf(word[inputLength])
          const newIndex = (index + shift.value) % dakuon.length
          result += dakuon[newIndex]
        } else if (handaku.includes(word[inputLength])) {
          const index = handaku.indexOf(word[inputLength])
          const newIndex = (index + shift.value) % handaku.length
          result += handaku[newIndex]
        } else if (youon.includes(word[inputLength])) {
          const index = youon.indexOf(word[inputLength])
          const newIndex = (index + shift.value) % youon.length
          result += youon[newIndex]
        } else if (alphabet.includes(word[inputLength])) {
          const index = alphabet.indexOf(word[inputLength])
          const newIndex = (index + 2 * shift.value) % alphabet.length
          result += alphabet[newIndex]
        } else {
          result += word[inputLength]
        }
      }
      if (dict.value.includes(result)) {
        tempResults.push(word + ' -> ' + result)
      }
    }
    results.value = tempResults
  } else if (shift.value === 0 && query.value.length === 0) {
    // 全シフト数、全単語を試す
    const resultsInfo = []
    for (let word of dict.value) {
      // if () {
      for (let tempShiftNum = 1; tempShiftNum < shiftMax; tempShiftNum++) {
        let result = ''
        for (let inputLength = 0; inputLength < word.length; inputLength++) {
          if (seion.includes(word[inputLength])) {
            const index = seion.indexOf(word[inputLength])
            const newIndex = (index + tempShiftNum) % seion.length
            result += seion[newIndex]
          } else if (dakuon.includes(word[inputLength])) {
            const index = dakuon.indexOf(word[inputLength])
            const newIndex = (index + tempShiftNum) % dakuon.length
            result += dakuon[newIndex]
          } else if (handaku.includes(word[inputLength])) {
            const index = handaku.indexOf(word[inputLength])
            const newIndex = (index + tempShiftNum) % handaku.length
            result += handaku[newIndex]
          } else if (youon.includes(word[inputLength])) {
            const index = youon.indexOf(word[inputLength])
            const newIndex = (index + tempShiftNum) % youon.length
            result += youon[newIndex]
          } else if (alphabet.includes(word[inputLength])) {
            const index = alphabet.indexOf(word[inputLength])
            const newIndex = (index + 2 * tempShiftNum) % alphabet.length
            result += alphabet[newIndex]
          } else {
            result += word[inputLength]
          }
        }
        if (dict.value.includes(result)) {
          resultsInfo.push({ word: word, result: result, tempShiftNum: tempShiftNum })
        }
      }
      // }
    }
    // TODO: word, result, tempShiftNum のどれでもソートできるようにする
    if (sortMode.value === 'word') {
      resultsInfo.sort((a, b) => a['word'].localeCompare(b['word']))
    } else if (sortMode.value === 'result') {
      resultsInfo.sort((a, b) => a['result'].localeCompare(b['result']))
    } else if (sortMode.value === 'tempShiftNum') {
      resultsInfo.sort((a, b) => a['tempShiftNum'] - b['tempShiftNum'])
    }
    // results.value = tempResults;
    results.value = resultsInfo.map(
      (info) => info['word'] + ' -> ' + info['result'] + ' (シフト数: ' + info['tempShiftNum'] + ')'
    )
  }
  isLoading.value = false
}

const randomOutput = async () => {
  const randomIndex = Math.floor(Math.random() * results.value.length)
  const randomWord = results.value[randomIndex]
  alert(randomWord)
}

onMounted(() => {
  isLoading.value = true
  if (sessionStorage.getItem('queryCaesarSearch')) {
    query.value = sessionStorage.getItem('queryCaesarSearch')!
  }
  if (sessionStorage.getItem('selectedDictCaesarSearch')) {
    selectedDict.value = sessionStorage.getItem('selectedDictCaesarSearch')!
  }
  if (sessionStorage.getItem('shiftCaesarSearch')) {
    shift.value = parseInt(sessionStorage.getItem('shiftCaesarSearch')!)
  }
  if (sessionStorage.getItem('wordLengthCaesarSearch')) {
    wordLength.value = parseInt(sessionStorage.getItem('wordLengthCaesarSearch')!)
  }
  if (sessionStorage.getItem('sortModeCaesarSearch')) {
    sortMode.value = sessionStorage.getItem('sortModeCaesarSearch')!
  }
  loadDict()
  isLoading.value = false
})
</script>

<style scoped>
input {
  margin-bottom: 10px;
  padding: 5px;
  width: 60%;
  max-width: 300px;
  box-sizing: border-box;
}

input[type='number'] {
  margin-left: 10px;
  width: 50px;
}

.results {
  margin-top: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 5px 0;
}
</style>

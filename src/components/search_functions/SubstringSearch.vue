<template>
  <div>
    <h1>部分文字列検索</h1>
    <div style="display: flex; flex-direction: row">
      <p>辞書選択</p>
      <select v-model="selectedDict">
        <option v-for="name in dictNames" :key="name" :value="name">{{ name }}</option>
      </select>
    </div>
    <div>
      <div style="display: flex; flex-direction: row">
        <input v-model="childString" placeholder="子文字列を入力" />
        <input type="number" v-model="childLength" placeholder="子文字列の長さ" />
      </div>

      <input v-model="parentString" placeholder="親文字列を入力" />
      <input type="number" v-model="parentLength" placeholder="親文字列の長さ" />

      <button @click="search">検索</button>
      <button @click="randomOutput">ランダム出力</button>
    </div>
    <div class="results">
      <p>ヒット数: {{ results.length }}</p>
      <p v-if="isLoading">loading...</p>
      <ul style="max-height: 200px; overflow-y: auto; width: 60%">
        <li v-for="result in results" :key="result">{{ result }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const isLoading = ref(false)

const childString = ref('')
watch(childString, (newValue) => {
  sessionStorage.setItem('WordSearch_Substring_childString', newValue)
})

const childLength = ref(0)
watch(childLength, (newValue) => {
  sessionStorage.setItem('WordSearch_Substring_childLength', newValue.toString())
})

const parentString = ref('')
watch(parentString, (newValue) => {
  sessionStorage.setItem('WordSearch_Substring_parentString', newValue)
})

const parentLength = ref(0)
watch(parentLength, (newValue) => {
  sessionStorage.setItem('WordSearch_Substring_parentLength', newValue.toString())
})

const results = ref<string[]>([])
const dictNames = ['buta', 'eigo', 'illust1_3', 'ippan']
const selectedDict = ref(dictNames[0])
watch(selectedDict, () => {
  sessionStorage.setItem('WordSearch_Substring_selectedDict', selectedDict.value)
})
const dict = ref<string[]>([])

const loadDict = async () => {
  const response = await fetch(`/src/assets/dictionaries/${selectedDict.value}.txt`)
  const text = await response.text()
  dict.value = text.split('\n')
}

const search = async () => {
  isLoading.value = true
  await loadDict()
  if (
    (childString.value === '' && childLength.value === 0) ||
    (parentString.value === '' && parentLength.value === 0)
  ) {
    results.value = []
  } else if (childString.value !== '') {
    // 親文字列の検索
    let substrings: string[] = []
    for (let i = 0; i < dict.value.length; i++) {
      const word = dict.value[i]
      let nowIndex = 0
      for (let j = 0; j < word.length; j++) {
        if (word[j] === childString.value[nowIndex]) {
          nowIndex++
          if (nowIndex === childLength.value) {
            substrings.push(word)
            break
          }
        }
      }
    }
    results.value = substrings
  } else if (parentString.value !== '') {
    const word = parentString.value
    let substrings = []
    // 2**word.length 通りの部分文字列を生成し、childLength と長さが一致するものを探す
    for (let i = 0; i < 2 ** word.length; i++) {
      let substring = ''
      for (let j = 0; j < word.length; j++) {
        if ((i >> j) & 1) {
          substring += word[j]
        }
      }
      if (substring.length === childLength.value && dict.value.includes(substring)) {
        substrings.push(substring)
      }
    }
    results.value = substrings
  } else {
    // 子文字列と親文字列の検索
    let substringPairs = []
    let parentStringChoices = [],
      childStringChoices = []
    for (let word of dict.value) {
      if (word.length === parentLength.value) {
        parentStringChoices.push(word)
      }
      if (word.length === childLength.value) {
        childStringChoices.push(word)
      }
    }
    for (let parentStringChoice of parentStringChoices) {
      for (let childStringChoice of childStringChoices) {
        let nowIndex = 0
        for (let j = 0; j < parentStringChoice.length; j++) {
          if (parentStringChoice[j] === childStringChoice[nowIndex]) {
            nowIndex++
            if (nowIndex === childLength.value) {
              substringPairs.push(parentStringChoice + ' ' + childStringChoice)
              break
            }
          }
        }
      }
    }
    results.value = substringPairs
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
  if (sessionStorage.getItem('WordSearch_Substring_selectedDict')) {
    selectedDict.value = sessionStorage.getItem('WordSearch_Substring_selectedDict')!
  }
  if (sessionStorage.getItem('WordSearch_Substring_childString')) {
    childString.value = sessionStorage.getItem('WordSearch_Substring_childString')!
  }
  if (sessionStorage.getItem('WordSearch_Substring_childLength')) {
    childLength.value = parseInt(sessionStorage.getItem('WordSearch_Substring_childLength')!)
  }
  if (sessionStorage.getItem('WordSearch_Substring_parentString')) {
    parentString.value = sessionStorage.getItem('WordSearch_Substring_parentString')!
  }
  if (sessionStorage.getItem('WordSearch_Substring_parentLength')) {
    parentLength.value = parseInt(sessionStorage.getItem('WordSearch_Substring_parentLength')!)
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

<template>
  <div>
    <h1>正規表現検索</h1>
    <div style="display: flex; flex-direction: row;">
      <p>辞書選択</p>
      <select v-model="selectedDict">
        <option v-for="name in dictNames" :key="name" :value="name">{{ name }}</option>
      </select>
    </div>
    <div style="display: flex; flex-direction: row;">
      <p>文字数</p>
      <input type="number" v-model="wordLength" placeholder="文字数" />
    </div>
    <div>
      <input v-model="query" placeholder="検索語を入力"/>
      <button @click="search">検索</button>
      <button @click="randomOutput">ランダム出力</button>
    </div>
    <div class="results">
      <p>ヒット数: {{ results.length }}</p>
      <p v-if="isLoading">loading...</p>
      <ul style="max-height: 200px; overflow-y: auto; width: 60%;">
        <li v-for="result in results" :key="result">{{ result }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const isLoading = ref(false);

const wordLength = ref(0);
watch(wordLength, () => {
  sessionStorage.setItem('WordSearch_Easy_wordLength', wordLength.value.toString());
});

const query = ref('');
watch(query, (newValue) => {
  sessionStorage.setItem('WordSearch_Easy_query', newValue);
});
const results = ref<string[]>([]);
const dictNames = ['buta', 'eigo', 'illust1_3', 'ippan'];
const selectedDict = ref(dictNames[0]);
watch(selectedDict, () => {
  sessionStorage.setItem('WordSearch_Easy_selectedDict', selectedDict.value);
});
const dict = ref<string[]>([]);

const loadDict = async () => {
  const response = await fetch(`/src/assets/dictionaries/${selectedDict.value}.txt`);
  const text = await response.text();
  dict.value = text.split('\n');
};

const search = async () => {
  isLoading.value = true;
  await loadDict();
  if (wordLength.value !== 0) dict.value = dict.value.filter((word) => word.length === wordLength.value);
  const regex = new RegExp(query.value, 'i');
  results.value = dict.value.filter((word) => regex.test(word));
  isLoading.value = false;
};

const randomOutput = async () => {
  const randomIndex = Math.floor(Math.random() * results.value.length);
  const randomWord = results.value[randomIndex];
  alert(randomWord);
};

onMounted(() => {
  isLoading.value = true;
  if (sessionStorage.getItem('WordSearch_Easy_query')) {
    query.value = sessionStorage.getItem('WordSearch_Easy_query')!;
  }
  if (sessionStorage.getItem('WordSearch_Easy_selectedDict')) {
    selectedDict.value = sessionStorage.getItem('WordSearch_Easy_selectedDict')!;
  }
  if (sessionStorage.getItem('WordSearch_Easy_wordLength')) {
    wordLength.value = parseInt(sessionStorage.getItem('WordSearch_Easy_wordLength')!);
  }
  loadDict();
  isLoading.value = false;
});

</script>

<style scoped>
input {
  margin-bottom: 10px;
  padding: 5px;
  width: 60%;
  max-width: 300px;
  box-sizing: border-box;
}

input[type="number"] {
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
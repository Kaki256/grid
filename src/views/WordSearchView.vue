<script setup lang="ts">
import EasySearch from '@/components/search_functions/EasySearch.vue';
import CaesarSearch from '@/components/search_functions/CaesarSearch.vue';
import SubstringSearch from '@/components/search_functions/SubstringSearch.vue';

</script>

<template>
  <div style="margin: 20px;">
    <h1> Word Search </h1>
    <EasySearch />
    <CaesarSearch />
    <SubstringSearch />
  </div>
</template>

<style scoped>

</style>

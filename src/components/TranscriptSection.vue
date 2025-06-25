<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold mb-2">{{ section.title }}</h3>
    <div v-for="sentence in section.sentences" :key="sentence.start">
      <TranscriptSentence :sentence="sentence" />
    </div>
  </div>
</template>

<script setup>
import TranscriptSentence from "./TranscriptSentence.vue";

defineProps({ section: Object });
</script>
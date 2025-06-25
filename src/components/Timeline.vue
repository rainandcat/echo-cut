<template>
  <div class="mt-2 h-4 bg-gray-700 rounded relative">
    <div v-for="(section, i) in sections" :key="i">
      <div
        v-for="sentence in getHighlightedSentences(section)"
        :key="sentence.start"
        class="absolute h-4 bg-sky-400 rounded"
        :style="getStyle(sentence)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import transcript from "../data/mock-transcript.json";

const sections = ref(transcript.sections);
const duration = 80;

function getStyle(sentence) {
  const percentStart = (sentence.start / duration) * 100;
  const percentWidth = ((sentence.end - sentence.start) / duration) * 100;
  return {
    left: `${percentStart}%`,
    width: `${percentWidth}%`,
  };
}

function getHighlightedSentences(section) {
  return Array.isArray(section.sentences)
    ? section.sentences.filter((s) => s.highlight)
    : [];
}
</script>
<script setup>
import { ref, watch } from "vue";
import { useVideoStore } from "../stores/video";

const sections = ref([]);
const duration = 80;

const store = useVideoStore();

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

watch(
  () => store.transcript.sections,
  (val) => {
    sections.value = val;
  },
  { deep: true }
);
</script>

<template>
  <div class="h-4 bg-gray-700 rounded relative">
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
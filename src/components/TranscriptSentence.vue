<script setup>
import { ref } from "vue";
import { useVideoStore } from "../stores/video";

const props = defineProps({ sentence: Object });
const sentenceEl = ref(null);
const store = useVideoStore();

function toggleHighlight() {
  props.sentence.highlight = !props.sentence.highlight;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function handleTimestampClick(e) {
  e.stopPropagation();
  store.seekTo?.(props.sentence.start);
}

const active = ref(false);

function updateActive(currentTime) {
  const start = props.sentence.start;
  const end = props.sentence.end;
  const isActive = currentTime >= start && currentTime <= end;
  if (isActive) {
    active.value = true;
    sentenceEl.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    active.value = false;
  }
}

defineExpose({ updateActive });
</script>

<template>
  <div
    ref="sentenceEl"
    :class="[
      'px-2 py-1 rounded my-1 transition-colors duration-200',
      active
        ? 'bg-yellow-200'
        : sentence.highlight
        ? 'bg-primary text-white'
        : 'hover:bg-secondary',
    ]"
    @click="toggleHighlight"
  >
    <span
      class="text-time font-mono mr-2 underline cursor-pointer"
      @click="handleTimestampClick"
      >{{ formatTime(sentence.start) }}</span
    >
    {{ sentence.text }}
  </div>
</template>
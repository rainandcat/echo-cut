<script setup>
import { ref, computed } from "vue";
import { useVideoStore } from "../stores/video";
import { formatTime } from "../utils/time";

const props = defineProps({ sentence: Object });
const sentenceEl = ref(null);
const store = useVideoStore();

function toggleHighlight() {
  store.toggleHighlight(props.sentence);
}

function handleTimestampClick(e) {
  e.stopPropagation();
  store.seekTo?.(props.sentence.start);
}

const sentenceClass = computed(() => {
  if (active.value) return "bg-yellow-200";
  if (props.sentence.highlight) return "bg-primary text-white";
  return "hover:bg-secondary";
});

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
      sentenceClass,
    ]"
    @click="toggleHighlight"
  >
    <span
      class="text-time font-mono mr-2 underline cursor-pointer"
      @click="handleTimestampClick"
      v-if="sentence.highlight"
      >{{ formatTime(sentence.start) }}</span
    >
    <span class="text-gray-500 font-mono mr-2" v-else>{{
      formatTime(sentence.start)
    }}</span>
    {{ sentence.text }}
  </div>
</template>
<template>
  <div
    :class="[
      'cursor-pointer px-2 py-1 rounded my-1',
      sentence.highlight ? 'bg-sky-300' : 'hover:bg-gray-200',
    ]"
    @click="toggleHighlight"
  >
    <span class="text-blue-600 font-mono mr-2">{{
      formatTime(sentence.start)
    }}</span>
    {{ sentence.text }}
  </div>
</template>

<script setup>
const props = defineProps({ sentence: Object });

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
</script>
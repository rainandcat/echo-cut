<script setup>
import { ref, computed } from "vue";
import { useVideoStore } from "../stores/video";

const props = defineProps({
  duration: { type: Number, required: true },
  currentTime: { type: Number, required: true },
});

const emit = defineEmits(["seek"]);

const store = useVideoStore();

const barRef = ref(null);

function handleClick(e) {
  if (!barRef.value || props.duration <= 0) return;
  const rect = barRef.value.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = clickX / rect.width;
  const seekTime = ratio * props.duration;
  emit("seek", seekTime);
}

const highlightRanges = computed(() => {
  if (!store.transcript?.sections) return [];

  return store.transcript.sections
    .flatMap((section) => section.sentences)
    .filter((sentence) => sentence.highlight)
    .map((sentence) => ({
      start: sentence.start,
      end: sentence.end,
    }));
});
</script>

<template>
  <div
    class="relative h-4 bg-gray-600 rounded"
    @click="handleClick"
    ref="barRef"
  >
    <div
      v-for="(range, idx) in highlightRanges"
      :key="idx"
      class="absolute h-full bg-secondary rounded"
      :style="{
        left: `${(range.start / duration) * 100}%`,
        width: `${((range.end - range.start) / duration) * 100}%`,
      }"
    />

    <div
      class="absolute top-0 h-full w-[2px] bg-red-500"
      :style="{ left: `${(currentTime / duration) * 100}%` }"
    />
  </div>
</template>

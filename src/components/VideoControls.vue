
<script setup>
import { computed } from "vue";

const props = defineProps({
  isPlaying: Boolean,
  currentTime: Number,
  duration: Number,
});

const emit = defineEmits(["play", "pause", "seek"]);

function togglePlay() {
  props.isPlaying ? emit("pause") : emit("play");
}

function handleSeek(event) {
  emit("seek", Number(event.target.value));
}

const formattedCurrent = computed(() => formatTime(props.currentTime));
const formattedDuration = computed(() => formatTime(props.duration));

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

<template>
  <div
    class="flex items-center space-x-4 p-2 bg-gray-700 text-white rounded-md mt-2"
  >
    <button
      @click="togglePlay"
      class="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded"
    >
      {{ isPlaying ? "Pause" : "Play" }}
    </button>
    <input
      type="range"
      min="0"
      :max="duration"
      :value="currentTime"
      step="0.1"
      @input="handleSeek"
      class="w-full"
    />
    <span class="text-sm"
      >{{ formattedCurrent }} / {{ formattedDuration }}</span
    >
  </div>
</template>

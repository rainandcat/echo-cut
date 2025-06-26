
<script setup>
import { computed } from "vue";
import { formatTime } from "../utils/time";
import ProgressBar from "./ProgressBar.vue";

const props = defineProps({
  isPlaying: Boolean,
  currentTime: Number,
});

const emit = defineEmits(["play", "pause", "seek"]);

function togglePlay() {
  props.isPlaying ? emit("pause") : emit("play");
}

function handleSeek(event) {
  emit("seek", Number(event.target.value));
}

const formattedCurrent = computed(() => formatTime(props.currentTime));
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
    <div class="w-full">
      <ProgressBar :duration="100" :currentTime="currentTime" />
    </div>

    <span class="text-sm">{{ formattedCurrent }}</span>
  </div>
</template>

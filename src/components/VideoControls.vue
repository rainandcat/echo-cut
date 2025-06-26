
<script setup>
import { computed } from "vue";
import { formatTime } from "../utils/time";
import ProgressBar from "./ProgressBar.vue";
import { Play, Pause, SkipBack, SkipForward } from "lucide-vue-next";

const props = defineProps({
  isPlaying: Boolean,
  currentTime: Number,
});

const emit = defineEmits(["play", "pause", "seek"]);

function togglePlay() {
  props.isPlaying ? emit("pause") : emit("play");
}

function goToNext() {
  emit("goToNext");
}

function goToPrev() {
  emit("goToPrev");
}

const formattedCurrent = computed(() => formatTime(props.currentTime));
</script>

<template>
  <div class="flex flex-col p-2 bg-gray-700 text-white rounded-md mt-2">
    <div
      class="flex justify-between items-center px-2 py-2 text-white space-x-4"
    >
      <SkipBack
        class="w-6 h-6 cursor-pointer hover:text-purple-700"
        @click="goToPrev"
      />
      <component
        :is="isPlaying ? Pause : Play"
        class="w-6 h-6 cursor-pointer hover:text-purple-700"
        @click="togglePlay"
      />
      <SkipForward
        class="w-6 h-6 cursor-pointer hover:text-purple-700"
        @click="goToNext"
      />
      <span class="text-sm">{{ formattedCurrent }}</span>
    </div>
    <div class="w-full mt-2 px-2">
      <ProgressBar :duration="100" :currentTime="currentTime" />
    </div>
  </div>
</template>

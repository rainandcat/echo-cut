
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { getTranscriptData } from "../api/transcript";
import { useVideoStore } from "../stores/video";
import VideoControls from "./VideoControls.vue";

const props = defineProps({ videoUrl: String, videoName: String });

const currentSubtitle = ref("");
const video = ref(null);
const store = useVideoStore();

const highlightMode = ref(true);
const fading = ref(false);
const isPlaying = ref(false);
const currentTime = ref(0);

let transcript = [];
let highlightRanges = [];
let playingHighlights = false;
let currentIndex = 0;

function extractHighlightRanges() {
  highlightRanges = [];
  for (const section of transcript) {
    for (const sentence of section.sentences) {
      if (sentence.highlight) {
        highlightRanges.push({
          start: sentence.start,
          end: sentence.end,
          text: sentence.text,
        });
      }
    }
  }
  highlightRanges.sort((a, b) => a.start - b.start);
}

function playHighlightsSmoothly() {
  if (!highlightRanges.length || !video.value) return;

  playingHighlights = true;
  currentIndex = 0;
  video.value.pause();

  function playNext() {
    if (currentIndex >= highlightRanges.length) {
      playingHighlights = false;
      isPlaying.value = false;
      return;
    }

    const { start, end, text } = highlightRanges[currentIndex];
    currentSubtitle.value = text;
    fading.value = true;

    setTimeout(() => {
      fading.value = false;
      video.value.currentTime = start;
      video.value.play();
      isPlaying.value = true;

      const duration = (end - start) * 1000;
      setTimeout(() => {
        video.value.pause();
        isPlaying.value = false;
        currentIndex++;
        currentSubtitle.value = "";
        fading.value = true;
        setTimeout(playNext, 400);
      }, duration);
    }, 300);
  }

  playNext();
}

function handlePlay() {
  if (highlightMode.value) {
    playHighlightsSmoothly();
  } else {
    video.value?.play();
    isPlaying.value = true;
  }
}

function handlePause() {
  video.value?.pause();
  isPlaying.value = false;
}

function handleSeek(time) {
  if (video.value) {
    video.value.currentTime = time;
    currentTime.value = time;
  }
}

onMounted(async () => {
  transcript = (await getTranscriptData()).sections;
  extractHighlightRanges();

  store.seekTo = (time) => {
    if (video.value) {
      video.value.currentTime = time;
    }
  };

  video.value?.addEventListener("timeupdate", (e) => {
    const time = e.target.currentTime;
    currentTime.value = time;
    store.playbackTime = time;

    if (!highlightMode.value) {
      for (const section of transcript) {
        for (const sentence of section.sentences) {
          if (
            sentence.highlight &&
            time >= sentence.start &&
            time <= sentence.end
          ) {
            currentSubtitle.value = sentence.text;
            return;
          }
        }
      }
      currentSubtitle.value = "";
    }
  });
});

const duration = computed(() => video.value?.duration || 0);

watch(
  () => props.videoUrl,
  () => {
    if (video.value) {
      video.value.load();
      playingHighlights = false;
      currentSubtitle.value = "";
      fading.value = false;
      isPlaying.value = false;
      currentTime.value = 0;
    }
  }
);

watch(highlightMode, (enabled) => {
  if (!enabled) {
    video.value?.pause();
    currentSubtitle.value = "";
    isPlaying.value = false;
    playingHighlights = false;
  }
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <p class="text-left">Preview - {{ videoName }}</p>
      <label class="flex items-center space-x-2 text-sm text-white">
        <input type="checkbox" v-model="highlightMode" />
        <span>Highlight Mode</span>
      </label>
    </div>

    <div
      class="bg-black flex items-center justify-center h-64 relative overflow-hidden"
    >
      <video
        ref="video"
        class="w-full h-full transition-opacity duration-500"
        :class="{ 'opacity-0': fading, 'opacity-100': !fading }"
        :src="videoUrl"
      ></video>

      <div
        class="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-60 px-2 py-1 rounded transition-opacity duration-500"
        :class="{ 'opacity-0': fading, 'opacity-100': !fading }"
      >
        {{ currentSubtitle }}
      </div>
    </div>

    <VideoControls
      :is-playing="isPlaying"
      :current-time="currentTime"
      :duration="duration"
      @play="handlePlay"
      @pause="handlePause"
      @seek="handleSeek"
    />
  </div>
</template>

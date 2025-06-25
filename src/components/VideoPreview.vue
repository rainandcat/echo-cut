
<script setup>
import { ref, onMounted, watch, computed } from "vue";
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
const manuallyPaused = ref(false);
let resumeStartTime = 0;
let resumeEndTime = 0;
let resumeTimeout = null;

let transcript = [];
let highlightRanges = [];
let playingHighlights = false;
let currentIndex = 0;

function extractHighlightRanges(sections) {
  highlightRanges = [];
  transcript = sections;
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

  playNext();
}

function playNext(resume = false) {
  if (manuallyPaused.value || currentIndex >= highlightRanges.length) {
    playingHighlights = false;
    isPlaying.value = false;
    return;
  }

  const { start, end, text } = highlightRanges[currentIndex];
  currentSubtitle.value = text;
  fading.value = true;

  setTimeout(() => {
    if (manuallyPaused.value) return;

    fading.value = false;

    const startTime = resume ? resumeStartTime : start;
    const endTime = resume ? resumeEndTime : end;
    const duration = (endTime - startTime) * 1000;

    video.value.currentTime = startTime;
    video.value.play();
    isPlaying.value = true;

    resumeTimeout = setTimeout(() => {
      if (manuallyPaused.value) return;

      video.value.pause();
      isPlaying.value = false;
      currentIndex++;
      currentSubtitle.value = "";
      fading.value = true;
      setTimeout(() => playNext(false), 400);
    }, duration);
  }, 300);
}

function handlePlay() {
  if (highlightMode.value) {
    if (manuallyPaused.value) {
      manuallyPaused.value = false;
      playNext(true);
    } else {
      manuallyPaused.value = false;
      playHighlightsSmoothly();
    }
  } else {
    manuallyPaused.value = false;
    video.value?.play();
    isPlaying.value = true;
  }
}

function handlePause() {
  manuallyPaused.value = true;
  if (video.value) {
    resumeStartTime = video.value.currentTime;
    resumeEndTime = highlightRanges[currentIndex]?.end || 0;
    video.value.pause();
  }
  isPlaying.value = false;

  if (resumeTimeout) {
    clearTimeout(resumeTimeout);
    resumeTimeout = null;
  }
}

function handleSeek(time) {
  if (video.value) {
    video.value.currentTime = time;
    currentTime.value = time;
  }
}

onMounted(async () => {
  store.seekTo = (time) => {
    if (!video.value) return;

    manuallyPaused.value = true;
    video.value.pause();
    isPlaying.value = false;

    if (resumeTimeout) {
      clearTimeout(resumeTimeout);
      resumeTimeout = null;
    }

    video.value.currentTime = time;
    currentTime.value = time;

    for (let i = 0; i < highlightRanges.length; i++) {
      const h = highlightRanges[i];
      if (time >= h.start && time <= h.end) {
        currentIndex = i;
        resumeStartTime = time;
        resumeEndTime = h.end;
        break;
      }
    }

    if (highlightMode.value) {
      manuallyPaused.value = false;
      playNext(true);
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

watch(
  () => store.transcript.sections,
  (val) => {
    extractHighlightRanges(val);
  },
  { deep: true }
);
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
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-60 px-4 py-2 rounded transition-opacity duration-500 max-w-[90%] text-center"
        :class="{ 'opacity-0': fading, 'opacity-100': !fading }"
      >
        {{ currentSubtitle }}
      </div>
    </div>

    <VideoControls
      :is-playing="isPlaying"
      :current-time="currentTime"
      @play="handlePlay"
      @pause="handlePause"
      @seek="handleSeek"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useVideoPreviewController } from "../composables/useVideoPreviewController";
import { useVideoPreviewPlayer } from "../composables/useVideoPreviewPlayer";
import { useVideoStore } from "../stores/video";
import VideoControls from "./VideoControls.vue";

const props = defineProps({ videoUrl: String, videoName: String });
const store = useVideoStore();

const video = ref(null);
const currentSubtitle = ref("");
const highlightMode = ref(true);
const highlightRanges = ref([]);

const manuallyPaused = ref(true);

const { play, pause, seek, onTimeUpdate } = useVideoPreviewController(video);
const {
  isPlaying,
  playNext,
  stop,
  seekTo,
  restart,
  hasEnded,
  currentIndex,
  fading,
} = useVideoPreviewPlayer(video, highlightRanges, currentSubtitle);

function handlePlay() {
  if (highlightMode.value) {
    if (hasEnded.value) {
      manuallyPaused.value = false;
      restart();
    } else {
      manuallyPaused.value = false;
      playNext();
    }
  } else {
    manuallyPaused.value = false;
    play();
    isPlaying.value = true;
  }
}

function handlePause() {
  manuallyPaused.value = true;
  pause();
  isPlaying.value = false;
}

const goToNext = () => {
  const now = store.playbackTime;
  const next = highlightRanges.value.find((r) => r.start > now);
  if (next) {
    store.seekTo(next.start);
  }
};

const goToPrev = () => {
  const now = store.playbackTime;
  const highlights = highlightRanges.value;

  if (!highlights.length) return;

  const currentIndex = highlights.findIndex(
    (r) => now >= r.start && now <= r.end
  );

  let target;

  if (currentIndex > 0) {
    target = highlights[currentIndex - 1];
  } else if (currentIndex === -1) {
    const reversed = [...highlights].reverse();
    target = reversed.find((r) => r.start < now);
  } else {
    target = highlights[0];
  }

  if (target) {
    store.seekTo(target.start);
  }
};

watch(
  () => store.transcript.sections,
  (val) => {
    const highlights = [];
    val.forEach((section) => {
      section.sentences.forEach((s) => {
        if (s.highlight) {
          highlights.push({ start: s.start, end: s.end, text: s.text });
        }
      });
    });
    highlightRanges.value = highlights.sort((a, b) => a.start - b.start);
  },
  { deep: true }
);

watch(
  () => props.videoUrl,
  () => {
    video.value?.load();
    stop();
    currentSubtitle.value = "";
  }
);

watch(highlightMode, (enabled) => {
  if (!enabled) {
    stop();
  }
});

onMounted(() => {
  store.seekTo = (time) => {
    const shouldPlay = isPlaying.value;

    if (isPlaying.value) {
      pause();
      isPlaying.value = false;
    }

    const resumeRange = seekTo(time);

    if (highlightMode.value && resumeRange && shouldPlay) {
      manuallyPaused.value = false;
      playNext(true, resumeRange);
    } else {
      manuallyPaused.value = true;
      seek(time);
    }
  };

  onTimeUpdate((time) => {
    store.playbackTime = time;
    if (!highlightMode.value) {
      const section = store.transcript.sections.find((s) =>
        s.sentences.some((x) => x.highlight && time >= x.start && time <= x.end)
      );
      if (section) {
        const sentence = section.sentences.find(
          (x) => x.highlight && time >= x.start && time <= x.end
        );
        currentSubtitle.value = sentence?.text || "";
      } else {
        currentSubtitle.value = "";
      }
    }
  });
});

const currentTime = computed(() => store.playbackTime || 0);
const duration = computed(() => video.value?.duration || 0);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <p class="text-left">Preview - {{ videoName }}</p>
      <label class="flex items-center space-x-2 text-sm text-white">
        <div class="relative">
          <input
            id="highlightToggle"
            type="checkbox"
            class="sr-only peer"
            v-model="highlightMode"
          />
          <div
            class="w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-primary transition-colors duration-300"
          ></div>
          <div
            class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-full"
          ></div>
        </div>
        <span class="ml-3">Highlight Mode</span>
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
      :duration="duration"
      @play="handlePlay"
      @pause="handlePause"
      @goToNext="goToNext"
      @goToPrev="goToPrev"
    />
  </div>
</template>

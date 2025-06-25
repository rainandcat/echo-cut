<script setup>
import { ref, onMounted, watch } from "vue";
import { getTranscriptData } from "../api/transcript";
import { useVideoStore } from "../stores/video";

const props = defineProps({ videoUrl: String, videoName: String });

const currentSubtitle = ref("");
const video = ref(null);
const store = useVideoStore();

let transcript = [];

onMounted(async () => {
  transcript = (await getTranscriptData()).sections;

  store.seekTo = (time) => {
    if (video.value) {
      video.value.currentTime = time;
    }
  };

  video.value?.addEventListener("timeupdate", onTimeUpdate);
});

function onTimeUpdate(e) {
  const time = e.target.currentTime;
  store.playbackTime = time;
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

watch(
  () => props.videoUrl,
  () => {
    if (video.value) {
      video.value.load();
    }
  }
);
</script>

<template>
  <div>
    <p class="text-left">Preview - {{ videoName }}</p>
    <div class="bg-black flex items-center justify-center h-64 relative">
      <video ref="video" class="w-full h-full" :src="videoUrl" controls></video>
    </div>
    <div
      class="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-60 px-2 py-1 rounded"
    >
      {{ currentSubtitle }}
    </div>
  </div>
</template>
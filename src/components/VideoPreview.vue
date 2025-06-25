<script setup>
import { ref, watch, onMounted } from "vue";
import { getTranscriptData } from "../api/transcript.js";

const props = defineProps({ videoUrl: String });
const currentSubtitle = ref("");
const video = ref(null);
let transcript = [];

onMounted(async () => {
  transcript = (await getTranscriptData()).sections;
  video.value?.addEventListener("timeupdate", onTimeUpdate);
});

function onTimeUpdate(e) {
  const time = e.target.currentTime;
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
  <div class="bg-black flex items-center justify-center h-64 relative">
    <video ref="video" class="w-full h-full" :src="videoUrl" controls></video>
    <div
      class="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-60 px-2 py-1 rounded"
    >
      {{ currentSubtitle }}
    </div>
  </div>
</template>
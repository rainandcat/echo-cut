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

<script setup>
import { ref, onMounted } from "vue";
import transcript from "../data/mock-transcript.json";

const videoUrl = transcript.videoUrl;
const currentSubtitle = ref("");
const video = ref(null);

function onTimeUpdate(e) {
  const time = e.target.currentTime;
  for (const section of transcript.sections) {
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

onMounted(() => {
  video.value?.addEventListener("timeupdate", onTimeUpdate);
});
</script>
<script setup>
import { ref } from "vue";
import TranscriptPanel from "./components/TranscriptPanel.vue";
import VideoPreview from "./components/VideoPreview.vue";
import Timeline from "./components/Timeline.vue";
import VideoUpload from "./components/VideoUpload.vue";

const uploadedVideoUrl = ref("");
const uploadedVideoName = ref("");

function handleVideoUpload(file) {
  uploadedVideoUrl.value = URL.createObjectURL(file);
  uploadedVideoName.value = file.name;
}
</script>

<template>
  <div class="h-screen w-screen">
    <div
      class="flex items-center justify-center min-h-screen"
      v-if="!uploadedVideoUrl"
    >
      <VideoUpload @video-selected="handleVideoUpload" />
    </div>
    <div class="flex h-screen" v-if="uploadedVideoUrl">
      <div class="w-1/2 overflow-y-auto p-4 bg-light text-textMain">
        <TranscriptPanel />
      </div>
      <div class="w-1/2 bg-dark text-white p-4 flex flex-col">
        <VideoPreview
          :videoUrl="uploadedVideoUrl"
          :videoName="uploadedVideoName"
        />
        <Timeline />
      </div>
    </div>
  </div>
</template>
<style scoped>
body {
  margin: 0;
  font-family: sans-serif;
}
</style>

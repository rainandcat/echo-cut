<script setup>
import { ref, onMounted } from "vue";
import { useVideoStore } from "../stores/video";
import TranscriptSection from "./TranscriptSection.vue";
import { getTranscriptData } from "../api/transcript";

const transcript = ref({ sections: [] });
const loading = ref(true);
const store = useVideoStore();

onMounted(async () => {
  transcript.value = await getTranscriptData();
  store.setTranscript(transcript.value);
  loading.value = false;
});
</script>

<template>
  <div class="text-left">
    <h2 class="text-2xl font-bold mb-4">Transcript</h2>
    <div v-if="loading" class="text-gray-500 text-sm">
      Loading transcript...
    </div>
    <div v-else>
      <TranscriptSection
        v-for="section in transcript.sections"
        :key="section.title"
        :section="section"
      />
    </div>
  </div>
</template>
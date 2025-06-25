<script setup>
import { ref, onMounted } from "vue";
import TranscriptSection from "./TranscriptSection.vue";
import { getTranscriptData } from "../api/transcript.js";

const transcript = ref({ sections: [] });

onMounted(async () => {
  transcript.value = await getTranscriptData();
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Transcript</h2>
    <div v-for="section in transcript.sections" :key="section.title">
      <TranscriptSection :section="section" />
    </div>
  </div>
</template>
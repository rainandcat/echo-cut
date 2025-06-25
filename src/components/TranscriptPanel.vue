<script setup>
import TranscriptSection from "./TranscriptSection.vue";
import transcript from "../data/mock-transcript.json";
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Transcript</h2>
    <div v-for="section in transcript.sections" :key="section.title">
      <TranscriptSection :section="section" />
    </div>
  </div>
</template>
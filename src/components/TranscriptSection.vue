<script setup>
import { ref, watch } from "vue";
import { useVideoStore } from "../stores/video";
import TranscriptSentence from "./TranscriptSentence.vue";

const props = defineProps({
  section: Object,
});

const sentenceRefs = ref([]);
const store = useVideoStore();

watch(
  () => store.playbackTime,
  (time) => {
    sentenceRefs.value.forEach((ref) => ref?.updateActive(time));
  }
);

function setSentenceRef(el, index) {
  sentenceRefs.value[index] = el;
}
</script>

<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold mb-2">{{ section.title }}</h3>
    <div v-for="(sentence, index) in section.sentences" :key="sentence.start">
      <TranscriptSentence
        :sentence="sentence"
        :ref="(el) => setSentenceRef(el, index)"
      />
    </div>
  </div>
</template>
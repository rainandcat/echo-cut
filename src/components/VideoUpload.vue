<template>
  <div
    class="border-2 border-dashed border-secondary rounded-xl p-10 shadow-card"
  >
    <label class="block text-sm font-medium text-white mb-2">
      Upload Video
    </label>
    <div>
      <input
        type="file"
        accept="video/*,video/mp4"
        id="fileInput"
        class="hidden"
        @change="onFileChange"
      />
      <label
        for="fileInput"
        class="cursor-pointer bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition duration-300 inline-block text-center"
      >
        Choose File
      </label>
      <p class="text-xs text-gray-500 mt-3 text-center">
        Supported formats: All common video formats (e.g., MP4, AVI, MOV, WebM)
      </p>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["video-selected"]);

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    emit("video-selected", file);
  }
}
</script>
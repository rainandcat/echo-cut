import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVideoStore = defineStore('video', () => {
  const playbackTime = ref(0)
  const seekTo = ref(() => {}) 
  
  return { playbackTime, seekTo }
})
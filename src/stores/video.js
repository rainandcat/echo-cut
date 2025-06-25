import { defineStore } from 'pinia'

export const useVideoStore = defineStore('video', {
  state: () => ({
    playbackTime: 0,
    seekTo: () => {},
    transcript: {
      sections: []
    }
  }),
  actions: {
    setTranscript(data) {
      this.transcript = data
    },
    toggleHighlight(target) {
      for (const section of this.transcript.sections) {
        const sentence = section.sentences.find(
          (s) => s.start === target.start && s.text === target.text
        )
        if (sentence) {
          sentence.highlight = !sentence.highlight
        }
      }
    }
  }
})
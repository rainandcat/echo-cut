import { ref } from "vue";

export function useVideoPreviewPlayer(videoRef, highlights, subtitleRef) {
  const isPlaying = ref(false);
  const currentIndex = ref(0);
  const hasEnded = ref(false);
  const fading = ref(false)

  let resumeTimeout = null;

  function resetSubtitle() {
    if (subtitleRef) subtitleRef.value = "";
  }

  function playNext(resume = false, resumeRange = {}) {
    if (!videoRef.value || currentIndex.value >= highlights.value.length) {
      isPlaying.value = false;
      hasEnded.value = true;
      fading.value=true
      resetSubtitle();
      return;
    }

    hasEnded.value = false;

    const highlight = highlights.value[currentIndex.value];
    const startTime = resume ? resumeRange.start : highlight.start;
    const endTime = resume ? resumeRange.end : highlight.end;
    const duration = (endTime - startTime) * 1000;

    if (subtitleRef) subtitleRef.value = highlight.text;

    videoRef.value.currentTime = startTime;
    videoRef.value.play();
    isPlaying.value = true;
    fading.value = false;

    if (resumeTimeout) clearTimeout(resumeTimeout);

    resumeTimeout = setTimeout(() => {
      if (!isPlaying.value) return;

      videoRef.value.pause();
      isPlaying.value = false;

      fading.value = true;
      setTimeout(() => {
        currentIndex.value++;
        resetSubtitle();
        playNext();
      }, 300);
    }, duration);
  }

  function restart() {
    currentIndex.value = 0;
    hasEnded.value = false;
    playNext();
  }

  function stop() {
    if (resumeTimeout) {
      clearTimeout(resumeTimeout);
      resumeTimeout = null;
    }
    videoRef.value?.pause();
    isPlaying.value = false;
    resetSubtitle();
  }

  function seekTo(time) {
    videoRef.value.currentTime = time;
    for (let i = 0; i < highlights.value.length; i++) {
      const h = highlights.value[i];
      if (time >= h.start && time <= h.end) {
        currentIndex.value = i;
        return {
          start: time,
          end: h.end,
        };
      }
    }
    return null;
  }

  return {
    isPlaying,
    hasEnded, 
    currentIndex,
    fading,
    playNext,
    stop,
    seekTo,
    restart,
  };
}  
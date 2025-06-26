export function useVideoPreviewController(videoRef) {
  function play() {
    videoRef.value?.play();
  }

  function pause() {
    videoRef.value?.pause();
  }

  function seek(time) {
    videoRef.value.currentTime = time;
  }

  function onTimeUpdate(callback) {
    videoRef.value?.addEventListener("timeupdate", (e) => {
      callback(e.target.currentTime);
    });
  }

  function reset() {
    pause();
    seek(0);
  }

  return {
    play,
    pause,
    seek,
    reset,
    onTimeUpdate,
  };
}
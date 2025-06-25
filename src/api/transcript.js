export function getTranscriptData() {
  return new Promise(resolve => {
    setTimeout(() => {
      import('../data/mock-transcript.json').then(module => {
        resolve(module.default)
      })
    }, 200)
  })
}

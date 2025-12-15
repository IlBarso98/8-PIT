import { getStore, shouldVibrate } from '../state/store'

const getAudioContext = (scene) => {
  if (scene.sound && scene.sound.context) {
    return scene.sound.context
  }
  if (scene.game && scene.game.sound) {
    return scene.game.sound.context
  }
  return null
}

export const playTone = (scene, frequency = 320, duration = 0.15) => {
  if (getStore().muted) {
    return
  }
  const ctx = getAudioContext(scene)
  if (!ctx) {
    return
  }
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

export const vibrate = (milliseconds = 10) => {
  if (shouldVibrate() && navigator.vibrate) {
    navigator.vibrate(milliseconds)
  }
}

export const signalInteraction = (scene, frequency = 360) => {
  playTone(scene, frequency)
  vibrate()
}

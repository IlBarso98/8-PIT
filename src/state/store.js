const store = {
  muted: false,
  currentMinigame: null,
  sessionScores: {},
  registrations: [],
  allowVibration: true,
}

export const initStore = () => store

export const getStore = () => store

export const toggleMuted = () => {
  store.muted = !store.muted
  return store.muted
}

export const setCurrentMinigame = (key) => {
  store.currentMinigame = key
}

export const resetMinigameState = () => {
  store.currentMinigame = null
}

export const updateScore = (key, value) => {
  store.sessionScores[key] = value
}

export const getScore = (key) => store.sessionScores[key] ?? 0

export const addRegistration = (entry) => {
  if (entry) {
    store.registrations.push(entry)
  }
}

export const getRegistrations = () => store.registrations

export const clearRegistrations = () => {
  store.registrations.length = 0
}

export const shouldVibrate = () => store.allowVibration

export const setAllowVibration = (flag) => {
  store.allowVibration = flag
}

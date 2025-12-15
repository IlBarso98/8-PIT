import './styles.css'
import { createGame } from './game'

if (!window.__PIT_GAME__) {
  window.__PIT_GAME__ = createGame()
}

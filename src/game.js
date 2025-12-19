import Phaser from 'phaser'

import BootScene from './scenes/BootScene'
import LoadingScene from './scenes/LoadingScene'
import StartScene from './scenes/StartScene'
import MenuScene from './scenes/MenuScene'
import RulesScene from './scenes/RulesScene'
import UIScene from './scenes/UIScene'
import PitOrNonPitScene from './scenes/minigames/PitOrNonPitScene'
import LagoDiRughiScene from './scenes/minigames/LagoDiRughiScene'
import RimaniConcentratoScene from './scenes/minigames/RimaniConcentratoScene'
import ImprecazioniScene from './scenes/minigames/ImprecazioniScene'
import { resetMinigameState } from './state/store'

const scenes = [
  BootScene,
  LoadingScene,
  StartScene,
  MenuScene,
  RulesScene,
  UIScene,
  PitOrNonPitScene,
  LagoDiRughiScene,
  RimaniConcentratoScene,
  ImprecazioniScene,
]

export const createGame = () => {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'app',
    width: 640,
    height: 360,
    backgroundColor: '#050b16',
    pixelArt: true,
    roundPixels: true,
    render: {
      pixelArt: true,
      antialias: false,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 640,
      height: 360,
      parent: 'app',
      expandParent: true,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    dom: {
      createContainer: true,
    },
    scene: scenes,
  })

  game.events.on('go-home', () => {
    const mgr = game.scene
    mgr.getScenes(true).forEach((scene) => {
      const key = scene.scene.key
      if (key !== 'UIScene') {
        mgr.stop(key)
      }
    })
    resetMinigameState()
    if (mgr.isSleeping && mgr.isSleeping('StartScene')) {
      mgr.wake('StartScene')
    } else {
      mgr.start('StartScene')
    }
    mgr.bringToTop('UIScene')
  })

  game.events.on('toggle-audio', (muted) => {
    if (game.sound) {
      game.sound.mute = muted
    }
  })

  return game
}

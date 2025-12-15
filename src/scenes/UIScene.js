import Phaser from 'phaser'
import { getStore, toggleMuted } from '../state/store'
import { signalInteraction } from '../utils/audio'

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene')
  }

  create() {
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)')
    this.input.setTopOnly(false)
    this.homeContainer = this.createButton('HOME')
    this.audioContainer = this.createButton('🔊', true)
    this.layout()
    this.scale.on('resize', this.layout, this)
  }

  createButton(label, isIcon = false) {
    const container = this.add.container(0, 0)
    const bg = this.add.image(0, 0, 'btn-basic').setScale(isIcon ? 0.35 : 0.4)
    const text = this.add
      .text(0, 0, label, {
        fontSize: isIcon ? '14px' : '9px',
        color: '#f8fafc',
      })
      .setOrigin(0.5)
    container.add([bg, text])
    bg.setInteractive({ useHandCursor: true })

    if (isIcon) {
      bg.on('pointerdown', () => {
        const muted = toggleMuted()
        signalInteraction(this, muted ? 220 : 360)
        this.updateAudioLabel()
        this.game.events.emit('toggle-audio', muted)
      })
      this.audioLabel = text
    } else {
      bg.on('pointerdown', () => {
        signalInteraction(this, 280)
        this.game.events.emit('go-home')
      })
    }

    return container
  }

  updateAudioLabel() {
    if (this.audioLabel) {
      this.audioLabel.setText(getStore().muted ? '🔇' : '🔊')
    }
  }

  layout() {
    const { width } = this.scale
    const top = 32
    const spacing = 90
    const centerX = width / 2
    this.homeContainer.setPosition(centerX - spacing / 2, top)
    this.audioContainer.setPosition(centerX + spacing / 2, top)
    this.updateAudioLabel()
    this.scene.bringToTop()
  }
}

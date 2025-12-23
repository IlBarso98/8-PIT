import Phaser from 'phaser'
import { signalInteraction } from '../utils/audio'

export default class RegaloScene extends Phaser.Scene {
  constructor() {
    super('RegaloScene')
    this.stage = 'closed'
    this.bonusIndex = 0
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#0b1220')
    this.add.rectangle(width / 2, height / 2, width, height, 0x060f1e, 0.9)
    this.add
      .text(width / 2, 40, 'Regalo di Pit', { fontSize: '14px', color: '#facc15' })
      .setOrigin(0.5)

    this.prompt = this.add
      .text(width / 2, 90, 'Tocca il pacco per aprirlo', { fontSize: '12px', color: '#e2e8f0' })
      .setOrigin(0.5)

    this.giftClosed = this.add.image(width / 2, height / 2 + 20, 'gift-closed').setOrigin(0.5)
    const scale = Math.min((width * 0.4) / this.giftClosed.width, (height * 0.5) / this.giftClosed.height)
    this.giftClosed.setScale(scale)

    this.giftOpen = this.add.image(width / 2, height / 2 + 20, 'gift-open').setOrigin(0.5).setVisible(false)
    this.giftOpen.setScale(scale)

    this.boris = this.add.image(width / 2, height / 2 + 40, 'boris-1').setVisible(false).setOrigin(0.5)
    const borisScale = Math.min((width * 0.4) / this.boris.width, (height * 0.55) / this.boris.height)
    this.boris.setScale(borisScale)

    this.boris2 = this.add.image(width / 2 - 80, height / 2 - 40, 'boris-2').setVisible(false).setOrigin(0.5)
    this.boris2.setScale(borisScale * 0.6)
    this.boris3 = this.add.image(width / 2 + 80, height / 2 - 40, 'boris-3').setVisible(false).setOrigin(0.5)
    this.boris3.setScale(borisScale * 0.6)

    this.giftClosed.setInteractive({ useHandCursor: true })
    this.giftClosed.on('pointerdown', () => this.openGift())
    this.boris.setInteractive({ useHandCursor: true })
    this.boris.on('pointerdown', () => this.spawnBonus())
  }

  openGift() {
    if (this.stage !== 'closed') return
    signalInteraction(this, 420)
    this.giftClosed.setVisible(false)
    this.giftOpen.setVisible(true)
    this.boris.setVisible(true)
    this.prompt.setText('Tocca il regalo per scoprire di più')
    this.stage = 'opened'
  }

  spawnBonus() {
    if (this.stage !== 'opened') return
    signalInteraction(this, 320)
    if (this.bonusIndex === 0) {
      this.boris2.setVisible(true)
      this.bonusIndex = 1
    } else if (this.bonusIndex === 1) {
      this.boris3.setVisible(true)
      this.bonusIndex = 2
      this.prompt.setText('Regalo completato!')
    }
  }
}

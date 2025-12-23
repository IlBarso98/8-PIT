import Phaser from 'phaser'
import { signalInteraction } from '../utils/audio'

export default class RegaloScene extends Phaser.Scene {
  constructor() {
    super('RegaloScene')
    this.stage = 'closed'
    this.bonusIndex = 0
    this.giftScale = 1
    this.music = null
  }

  create() {
    const { width, height } = this.scale
    this.stage = 'closed'
    this.bonusIndex = 0
    this.cameras.main.setBackgroundColor('#ffffff')
    this.add.rectangle(width / 2, height / 2, width, height, 0xffffff, 1)
    this.add
      .text(width / 2, 90, 'Regalo di Pit', { fontSize: '14px', color: '#1f2937' })
      .setOrigin(0.5)

    this.prompt = this.add
      .text(width / 2, 130, 'Tocca il pacco per aprirlo', { fontSize: '12px', color: '#111827' })
      .setOrigin(0.5)

    this.giftClosed = this.add.image(width / 2, height / 2 + 60, 'gift-closed').setOrigin(0.5)
    this.giftScale = Math.min((width * 0.55) / this.giftClosed.width, (height * 0.55) / this.giftClosed.height)
    this.giftClosed.setScale(this.giftScale)

    this.giftOpen = this.add.image(width / 2, height / 2 + 60, 'gift-open').setOrigin(0.5).setVisible(false)
    this.giftOpen.setScale(this.giftScale)

    this.boris = this.add.image(width / 2, height / 2 + 40, 'boris-1').setVisible(false).setOrigin(0.5)
    const borisScale = Math.min((width * 0.7) / this.boris.width, (height * 0.7) / this.boris.height)
    this.boris.setScale(borisScale)

    this.boris2 = this.add.image(width / 2 - 100, height / 2 - 60, 'boris-2').setVisible(false).setOrigin(0.5)
    this.boris2.setScale(borisScale * 0.6)
    this.boris3 = this.add.image(width / 2 + 100, height / 2 - 60, 'boris-3').setVisible(false).setOrigin(0.5)
    this.boris3.setScale(borisScale * 0.6)

    this.bonusPromptBg = this.add
      .rectangle(width / 2, height - 50, width * 0.7, 36, 0x0b0b0b, 0.8)
      .setStrokeStyle(2, 0xfacc15, 0.9)
      .setVisible(false)
    this.bonusPrompt = this.add
      .text(width / 2, height - 50, 'Premi ancora per scoprire cosa contiene', {
        fontSize: '12px',
        color: '#fef3c7',
      })
      .setOrigin(0.5)
      .setVisible(false)

    this.giftClosed.setInteractive({ useHandCursor: true })
    this.giftClosed.on('pointerdown', () => this.openGift())
    this.boris.setInteractive({ useHandCursor: true })
    this.boris.on('pointerdown', () => this.spawnBonus())

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this)
  }

  openGift() {
    if (this.stage !== 'closed') return
    signalInteraction(this, 420)
    this.giftClosed.setVisible(false)
    this.giftOpen.setVisible(true)
    this.prompt.setText('Aspetta, sta arrivando il regalo...')
    this.time.delayedCall(1000, () => this.revealBoris())
  }

  revealBoris() {
    if (this.stage !== 'closed') return
    this.stage = 'opened'
    this.giftOpen.setVisible(false)
    this.boris.setVisible(true)
    this.prompt.setText('Tocca il regalo per scoprire di più')
    this.bonusPromptBg.setVisible(true)
    this.bonusPrompt.setVisible(true)
    this.playRegaloMusic()
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

  playRegaloMusic() {
    const existing = this.sound.get('music-regalo')
    if (existing) {
      this.music = existing
      this.music.stop()
      this.music.play({ loop: true, volume: 0.6 })
    } else {
      this.music = this.sound.add('music-regalo', { loop: true, volume: 0.6 })
      this.music.play()
    }
  }

  cleanup() {
    if (this.music) {
      this.music.stop()
    }
  }
}

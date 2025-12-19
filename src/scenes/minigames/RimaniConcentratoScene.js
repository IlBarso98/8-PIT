import Phaser from 'phaser'
import { signalInteraction } from '../../utils/audio'

export default class RimaniConcentratoScene extends Phaser.Scene {
  constructor() {
    super('RimaniConcentratoScene')
    this.page = 1
    this.pageCountdown = 10
    this.activeStone = null
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#040d16')
    const bg = this.add.image(width / 2, height / 2, 'library-bg').setOrigin(0.5)
    bg.setDisplaySize(width, height)
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.25)
    this.add.image(120, height - 120, 'pit-portrait').setOrigin(0.5).setScale(0.8)

    this.page = 1
    this.pageCountdown = 10
    this.isGameOver = false
    this.totalPages = 10

    const hudBg = this.add.rectangle(width / 2, 48, width * 0.92, 42, 0x000000, 0.55).setStrokeStyle(2, 0xfacc15, 0.8)
    this.pageText = this.add.text(hudBg.x - hudBg.width / 2 + 12, hudBg.y, 'Pagina 1/10', {
      fontSize: '12px',
      color: '#facc15',
    }).setOrigin(0, 0.5)
    this.timerText = this.add
      .text(hudBg.x + hudBg.width / 2 - 12, hudBg.y, 'Tempo pag.: 10', { fontSize: '12px', color: '#facc15' })
      .setOrigin(1, 0.5)

    this.statusText = this.add
      .text(width / 2, height / 2, '', {
        fontSize: '14px',
        color: '#f8fafc',
        align: 'center',
        wordWrap: { width: width - 80 },
      })
      .setOrigin(0.5)
      .setDepth(10)
      .setVisible(false)

    this.pageTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.tickPage(),
    })

    this.spawnStone()
  }

  addBackgroundSilhouettes() {}

  tickPage() {
    if (this.isGameOver) return
    this.pageCountdown -= 1
    if (this.pageCountdown <= 0) {
      if (this.page >= this.totalPages) {
        this.winGame()
        return
      }
      this.page += 1
      this.pageCountdown = 10
      this.pageText.setText(`Pagina ${this.page}/${this.totalPages}`)
    }
    this.timerText.setText(`Tempo pag.: ${this.pageCountdown}`)
  }

  getWindowDuration() {
    const base = 1200
    const reduction = (this.page - 1) * 40
    return Math.max(base - reduction, 600)
  }

  spawnStone() {
    if (this.isGameOver) return
    if (this.activeStone) {
      this.activeStone.destroy()
    }
    const position = this.getSafePosition()
    const colorIndex = Phaser.Math.Between(0, 3)
    this.activeStone = this.add
      .image(position.x, position.y, `rock-${colorIndex}`)
      .setScale(2.2)
      .setInteractive({ useHandCursor: true })
    this.activeStone.once('pointerdown', () => this.collectStone())
    this.deadline = this.time.delayedCall(this.getWindowDuration(), () => this.failGame(), null, this)
  }

  collectStone() {
    if (this.isGameOver) return
    signalInteraction(this, 520)
    if (this.deadline) {
      this.deadline.remove(false)
    }
    this.spawnStone()
  }

  failGame() {
    if (this.isGameOver) return
    this.isGameOver = true
    this.statusText.setText('Pit si è distratto e non passerà l’esame.')
    this.statusText.setVisible(true)
    this.stopAll()
  }

  winGame() {
    if (this.isGameOver) return
    this.isGameOver = true
    this.statusText.setText('Pit è rimasto concentrato!')
    this.statusText.setVisible(true)
    this.stopAll()
  }

  stopAll() {
    if (this.pageTimer) {
      this.pageTimer.remove(false)
    }
    if (this.deadline) {
      this.deadline.remove(false)
    }
    if (this.activeStone) {
      this.activeStone.disableInteractive()
    }
  }

  getSafePosition() {
    const { width, height } = this.scale
    const minX = 70
    const maxX = width - 40
    const minY = 80
    const maxY = height - 50
    const forbidden = { x: 40, y: height - 220, w: 200, h: 220 }
    const x = Phaser.Math.Between(minX, maxX)
    const y = Phaser.Math.Between(minY, maxY)
    if (x > forbidden.x && x < forbidden.x + forbidden.w && y > forbidden.y) {
      return this.getSafePosition()
    }
    return { x, y }
  }
}

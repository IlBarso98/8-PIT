import Phaser from 'phaser'
import { signalInteraction } from '../../utils/audio'

const SCORES = {
  0: 2, // blu
  1: 1, // rosa
  2: 3, // verde
}

export default class RimaniConcentratoVotoScene extends Phaser.Scene {
  constructor() {
    super('RimaniConcentratoVotoScene')
    this.page = 1
    this.pageCountdown = 10
    this.activeStone = null
    this.score = 0
    this.totalPages = 10
    this.isGameOver = false
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
    this.score = 0
    this.totalPages = 10
    this.trapActive = null

    this.pageText = null
    const timerPanel = this.add.rectangle(width - 220, 48, 220, 38, 0x000000, 0.65).setOrigin(0, 0.5).setStrokeStyle(2, 0xfacc15, 0.8)
    this.timerText = this.add
      .text(timerPanel.x + timerPanel.width - 10, timerPanel.y, 'Voto: 0/30', { fontSize: '12px', color: '#facc15' })
      .setOrigin(1, 0.5)

    this.pageTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.tickPage(),
    })

    this.spawnStone()
    this.scheduleTrap()
  }

  tickPage() {
    if (this.isGameOver) return
    this.pageCountdown -= 1
    if (this.pageCountdown <= 0) {
      if (this.page >= this.totalPages) {
        this.endWithScore()
        return
      }
      this.page += 1
      this.pageCountdown = 10
    }
    this.timerText.setText(`Voto: ${this.getVoteString()}`)
  }

  getVoteString() {
    if (this.score >= 31) return '30 e lode'
    return `${Math.min(this.score, 30)}/30`
  }

  getWindowDuration() {
    const base = 1700
    const reduction = (this.page - 1) * 40
    return Math.max(base - reduction, 600)
  }

  spawnStone() {
    if (this.isGameOver) return
    if (this.activeStone) {
      this.activeStone.destroy()
    }
    const position = this.getSafePosition()
    const colorIndex = Phaser.Math.Between(0, 2)
    this.activeStone = this.add
      .image(position.x, position.y, `rock-${colorIndex}`)
      .setDisplaySize(52, 52)
      .setInteractive({ useHandCursor: true })
    this.activeStone.once('pointerdown', () => this.collectStone(colorIndex))
    this.deadline = this.time.delayedCall(this.getWindowDuration(), () => this.failGame(), null, this)
  }

  collectStone(colorIndex) {
    if (this.isGameOver) return
    signalInteraction(this, 520)
    this.score += SCORES[colorIndex] || 0
    if (this.score >= 31) {
      this.endWithScore()
      return
    }
    this.updateVoteText()
    if (this.deadline) {
      this.deadline.remove(false)
    }
    this.spawnStone()
  }

  updateVoteText() {
    this.timerText.setText(`Voto: ${this.getVoteString()}`)
  }

  failGame() {
    if (this.isGameOver) return
    this.endWithScore()
  }

  endWithScore() {
    if (this.isGameOver) return
    this.isGameOver = true
    this.stopAll()
    if (this.score < 18) {
      this.showLossOverlay('Pit ha bocciato l’esame')
      return
    }
    const final =
      this.score >= 31 ? 'Voto: 30 e lode' : `Il voto di Pit all’esame è: ${Math.min(this.score, 30)}`
    this.showWinOverlay(final)
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
    if (this.trapTimer) {
      this.trapTimer.remove(false)
    }
    if (this.trapActive) {
      this.trapActive.destroy()
      this.trapActive = null
    }
  }

  showLossOverlay(customText) {
    const { width, height } = this.scale
    const panel = this.add.container(width / 2, height / 2).setDepth(20)
    const bg = this.add.rectangle(0, 0, width * 0.9, height * 0.9, 0x000000, 0.75).setOrigin(0.5)
    const card = this.add.rectangle(0, 0, width * 0.8, height * 0.7, 0x0a0a0a, 0.8).setStrokeStyle(3, 0xfacc15, 0.9)
    const img = this.add.image(0, -40, 'pit-deconcentrato').setOrigin(0.5)
    const scale = Math.min((width * 0.6) / img.width, (height * 0.4) / img.height)
    img.setScale(scale)
    const text = this.add.text(0, height * 0.14, customText || 'Pit ha perso la concentrazione!', {
      fontSize: '12px',
      color: '#f8fafc',
      align: 'center',
      wordWrap: { width: width * 0.7 },
    }).setOrigin(0.5)
    panel.add([bg, card, img, text])
    this.lossOverlay = panel
  }

  showWinOverlay(finalText) {
    const { width, height } = this.scale
    const panel = this.add.container(width / 2, height / 2).setDepth(20)
    const bg = this.add.rectangle(0, 0, width * 0.9, height * 0.9, 0x000000, 0.75).setOrigin(0.5)
    const card = this.add.rectangle(0, 0, width * 0.8, height * 0.7, 0x0a0a0a, 0.8).setStrokeStyle(3, 0xfacc15, 0.9)
    const img = this.add.image(0, -40, 'pit-laureato').setOrigin(0.5)
    const scale = Math.min((width * 0.6) / img.width, (height * 0.4) / img.height)
    img.setScale(scale)
    const text = this.add.text(0, height * 0.14, finalText, {
      fontSize: '12px',
      color: '#f8fafc',
      align: 'center',
      wordWrap: { width: width * 0.7 },
    }).setOrigin(0.5)
    panel.add([bg, card, img, text])
    this.winOverlay = panel
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

  scheduleTrap() {
    if (this.trapTimer) {
      this.trapTimer.remove(false)
    }
    this.trapTimer = this.time.addEvent({
      delay: Phaser.Math.Between(2500, 4500),
      loop: false,
      callback: () => this.spawnTrap(),
    })
  }

  spawnTrap() {
    if (this.isGameOver || this.activeStone) {
      this.scheduleTrap()
      return
    }
    const { x, y } = this.getSafePosition()
    const trapKeys = ['trap-sigaretta', 'trap-missbo', 'trap-milan']
    const key = Phaser.Utils.Array.GetRandom(trapKeys)
    this.trapActive = this.add.image(x, y, key).setDisplaySize(52, 52).setInteractive({ useHandCursor: true })
    this.trapActive.once('pointerdown', () => this.hitTrap())
    this.time.delayedCall(this.getWindowDuration(), () => {
      if (this.trapActive) {
        this.trapActive.destroy()
        this.trapActive = null
      }
      this.scheduleTrap()
    })
  }

  hitTrap() {
    if (!this.trapActive || this.isGameOver) return
    this.score = Math.max(0, this.score - 1)
    this.updateVoteText()
    this.trapActive.destroy()
    this.trapActive = null
    this.scheduleTrap()
  }
}

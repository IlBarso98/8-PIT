import Phaser from 'phaser'
import { addRegistration, getRegistrations } from '../../state/store'
import { signalInteraction } from '../../utils/audio'

const HINTS = ['Oh! Abbocca!', 'Silenzio…', 'Forse era un cavo?', 'Credo fosse un riflesso.']

export default class LagoDiRughiScene extends Phaser.Scene {
  constructor() {
    super('LagoDiRughiScene')
    this.timeRemaining = 60
  }

  create() {
    const { width, height } = this.scale
    this.timeRemaining = 60
    this.cameras.main.setBackgroundColor('#062942')
    const bg = this.add.image(width / 2, height / 2, 'lake-bg').setOrigin(0.5)
    bg.setDisplaySize(width, height)
    this.waterLine = Math.floor(height * 0.62)

    this.timerText = this.add
      .text(30, 60, 'Tempo: 60', { fontSize: '12px', color: '#facc15' })
      .setOrigin(0, 0.5)
    this.scoreText = this.add.text(width - 40, 60, 'Punteggio: 0', { fontSize: '12px', color: '#facc15' }).setOrigin(1, 0.5)

    this.messageText = this.add
      .text(width / 2, 110, 'Che calma irreale…', { fontSize: '10px', color: '#e0f2fe' })
      .setOrigin(0.5)

    this.createPitAndLine()
    this.createButtons()
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.tickTimer(),
    })
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this)
  }

  createPitAndLine() {
    this.rodTip = {
      x: this.scale.width * 0.5,
      y: this.waterLine + 34,
    }
    this.lineBaseLength = Math.max(100, this.scale.width * 0.25)
    this.lineState = { length: 0 }
    this.lineRetracted = true
    this.lineGraphics = this.add.graphics().setDepth(1)
    this.bobber = this.createBobber()
    this.bubbles = this.add.group()
    this.updateLineVisual()
    this.startBubbleLoop()
  }

  createButtons() {
    const { width, height } = this.scale
    this.launchBtn = this.createActionButton(width / 2 - 90, height - 40, 'LANCIA', () => this.launchLine())
    this.pullBtn = this.createActionButton(width / 2 + 90, height - 40, 'RITIRA', () => this.pullLine())
  }

  createActionButton(x, y, label, handler) {
    const btn = this.add.image(x, y, 'btn-basic').setScale(0.5)
    this.add.text(x, y, label, { fontSize: '10px', color: '#f8fafc' }).setOrigin(0.5)
    btn.setInteractive({ useHandCursor: true })
    btn.on('pointerdown', () => {
      signalInteraction(this)
      handler()
    })
    return btn
  }

  launchLine() {
    this.lineRetracted = false
    this.startLineTween(this.lineBaseLength + 120, 420, false, 0, () => {
      this.messageText.setText('Che calma irreale…')
    })
    this.messageText.setText(Phaser.Utils.Array.GetRandom(HINTS))
  }

  pullLine() {
    this.startLineTween(0, 220, false, 0, () => {
      this.lineRetracted = true
      this.lineState.length = 0
      this.updateLineVisual()
      this.messageText.setText('Solo bolle.')
    })
  }

  startLineTween(targetLength, duration, yoyo, hold, onComplete) {
    this.tweens.killTweensOf(this.lineState)
    const tween = this.tweens.add({
      targets: this.lineState,
      length: targetLength,
      duration,
      ease: 'Sine.easeInOut',
      yoyo,
      hold,
      onUpdate: () => {
        this.updateLineVisual()
      },
      onComplete: () => {
        this.lineState.length = yoyo ? this.lineBaseLength : targetLength
        this.updateLineVisual()
        onComplete?.()
      },
    })
    this.lineTween = tween
  }

  updateLineVisual() {
    if (!this.lineGraphics) return
    const length = Math.max(this.lineState.length, 0)
    this.lineGraphics.clear()
    this.lineGraphics.lineStyle(6, 0xf5deb3, 1)
    this.lineGraphics.beginPath()
    const anchorX = this.rodTip.x
    const anchorY = this.rodTip.y
    const targetX = this.lineRetracted ? anchorX : anchorX + length
    const targetY = this.lineRetracted ? anchorY : this.waterLine + 6
    this.lineGraphics.moveTo(anchorX - 4, anchorY - 6)
    this.lineGraphics.lineTo(anchorX, anchorY)
    this.lineGraphics.lineTo(targetX, targetY)
    this.lineGraphics.strokePath()
    this.lineGraphics.closePath()
    this.bobber.setPosition(targetX, targetY)
  }

  createBobber() {
    const bobber = this.add.container(0, 0).setDepth(2)
    const body = this.add.circle(0, 0, 10, 0xfff7de)
    const stripe = this.add.rectangle(0, -2, 18, 4, 0xff5c5c)
    const tip = this.add.circle(0, -10, 4, 0x2c2c6f)
    bobber.add([body, stripe, tip])
    return bobber
  }

  startBubbleLoop() {
    if (this.bubbleTimer) {
      this.bubbleTimer.remove(false)
    }
    this.bubbleTimer = this.time.addEvent({
      delay: Phaser.Math.Between(3000, 7000),
      callback: () => {
        this.spawnBubbles()
        this.startBubbleLoop()
      },
    })
  }

  spawnBubbles() {
    const baseX = this.bobber.x
    const baseY = this.bobber.y
    const createBubble = (x, y, minRadius = 2, maxRadius = 5, alpha = 0.6) => {
      const radius = Phaser.Math.Between(minRadius, maxRadius)
      const bubble = this.add.circle(x, y, radius, 0xffffff)
      bubble.setAlpha(alpha)
      this.bubbles.add(bubble)
      this.tweens.add({
        targets: bubble,
        y: bubble.y - Phaser.Math.Between(12, 26),
        alpha: 0,
        scale: 0.6,
        duration: Phaser.Math.Between(650, 950),
        onComplete: () => bubble.destroy(),
      })
    }
    const clusterCount = Phaser.Math.Between(4, 7)
    for (let i = 0; i < clusterCount; i++) {
      const offsetX = Phaser.Math.Between(-30, 30)
      const offsetY = Phaser.Math.Between(2, 18)
      createBubble(baseX + offsetX, baseY + offsetY)
    }
    const ambientCount = Phaser.Math.Between(4, 8)
    for (let i = 0; i < ambientCount; i++) {
      const x = Phaser.Math.Between(180, this.scale.width - 20)
      const y = Phaser.Math.Between(this.waterLine + 6, this.scale.height - 24)
      createBubble(x, y, 1, 3, 0.35)
    }
  }

  cleanup() {
    this.bubbleTimer?.remove(false)
    this.lineTween?.remove()
    if (this.bubbles) {
      this.bubbles.clear(true, true)
    }
    this.lineGraphics?.destroy()
    this.bobber?.destroy()
  }

  tickTimer() {
    this.timeRemaining -= 1
    if (this.timeRemaining <= 0) {
      this.timerEvent.destroy()
      this.timerText.setText('Tempo: 0')
      this.endSession()
    } else {
      this.timerText.setText(`Tempo: ${this.timeRemaining}`)
    }
  }

  endSession() {
    this.launchBtn.disableInteractive()
    this.pullBtn.disableInteractive()
    this.messageText.setText('Tempo finito. Niente pesca per oggi!')
  }

  updateRegistrationsList() {}
}

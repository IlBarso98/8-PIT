import Phaser from 'phaser'
import { signalInteraction } from '../utils/audio'

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene')
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#0b1220')
    const bg = this.add.image(width / 2, height / 2, 'library-bg').setOrigin(0.5)
    bg.setDisplaySize(width, height)
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0a, 0.35)

    const book = this.add.rectangle(width / 2 + 120, height / 2 + 90, 180, 80, 0xfed7aa).setOrigin(0.5)
    this.add
      .text(book.x, book.y, '8-PIT', { fontSize: '22px', color: '#1f2937', fontFamily: '"Press Start 2P", monospace' })
      .setOrigin(0.5)

    const bookTop = book.y - book.height / 2
    const pit = this.add.image(width / 2 + 140, bookTop - 2, 'pit-portrait').setOrigin(0.5, 1)
    const targetHeight = 140
    pit.setScale(targetHeight / pit.height)

    this.tweens.add({
      targets: [pit, book],
      y: '-=4',
      yoyo: true,
      duration: 1200,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    const caption = this.add
      .text(width / 2, height - 26, 'Tocca lo schermo per continuare', {
        fontSize: '12px',
        color: '#e0f2fe',
        align: 'center',
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: caption,
      alpha: 0.2,
      yoyo: true,
      duration: 600,
      repeat: -1,
    })

    this.input.once('pointerdown', () => {
      signalInteraction(this)
      this.scene.start('MenuScene')
    })
  }
}

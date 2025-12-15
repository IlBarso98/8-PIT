import Phaser from 'phaser'

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super('LoadingScene')
  }

  create() {
    this.cameras.main.setBackgroundColor('#ffffff')
    const logo = this.add.image(320, 120, 'logo-sprite').setScale(1.2)
    logo.setOrigin(0.5)

    this.add
      .text(320, 200, 'LA TRIBÙ 🎪', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '24px',
        color: '#0f172a',
        align: 'center',
      })
      .setOrigin(0.5)

    const barBg = this.add.rectangle(320, 240, 320, 22, 0xe2e8f0).setOrigin(0.5)
    const barFill = this.add.rectangle(barBg.x - barBg.width / 2, 240, 320, 18, 0x0f172a).setOrigin(0, 0.5)
    barFill.scaleX = 0.01

    this.time.delayedCall(2800, () => {
      this.scene.start('StartScene')
    })

    this.tweens.add({
      targets: barFill,
      scaleX: 1,
      duration: 3000,
      ease: 'Linear',
    })
  }
}

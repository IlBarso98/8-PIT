import Phaser from 'phaser'
import data from '../../data/insults.sample.json'
import { signalInteraction } from '../../utils/audio'

export default class ImprecazioniScene extends Phaser.Scene {
  constructor() {
    super('ImprecazioniScene')
    this.currentCombo = ''
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#0a0a0a')

    const bg = this.add.image(width / 2, height / 2, 'santamaria-bg').setOrigin(0.5)
    bg.setDisplaySize(width, height)

    this.add
      .rectangle(width / 2, 60, width * 0.9, 34, 0x000000, 0.55)
      .setStrokeStyle(2, 0xfacc15, 0.8)
    this.add
      .text(width / 2, 60, 'Generatore Randomico di Bestemmie', { fontSize: '12px', color: '#facc15' })
      .setOrigin(0.5)

    const panel = this.add
      .rectangle(width / 2, height / 2 - 8, width * 0.82, 80, 0x0b0b0b, 0.65)
      .setStrokeStyle(3, 0xf8fafc, 0.8)

    this.outputText = this.add
      .text(panel.x, panel.y, 'Premi GENERA', {
        fontSize: '14px',
        color: '#fef3c7',
        align: 'center',
        wordWrap: { width: panel.width - 20 },
      })
      .setOrigin(0.5)

    this.feedbackText = this.add.text(width / 2, height / 2 + 50, '', { fontSize: '10px', color: '#fef3c7' }).setOrigin(0.5)

    this.createButton(width / 2 - 90, height - 80, 'GENERA', () => this.generate())
    this.createButton(width / 2 + 90, height - 80, 'COPIA', () => this.copyToClipboard())
  }

  createButton(x, y, label, handler) {
    const btn = this.add.image(x, y, 'btn-basic').setScale(0.5)
    this.add.text(x, y, label, { fontSize: '10px', color: '#f8fafc' }).setOrigin(0.5)
    btn.setInteractive({ useHandCursor: true })
    btn.on('pointerdown', () => {
      signalInteraction(this)
      handler()
    })
  }

  generate() {
    const name = Phaser.Utils.Array.GetRandom(data.names)
    const descriptor = Phaser.Utils.Array.GetRandom(data.descriptors)
    this.currentCombo = `${name} ${descriptor}`
    this.outputText.setText(this.currentCombo)
    this.feedbackText.setText('')
  }

  async copyToClipboard() {
    if (!this.currentCombo) {
      this.feedbackText.setText('Genera prima un insulto!')
      return
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(this.currentCombo)
        this.feedbackText.setText('Copiato!')
        this.time.delayedCall(1000, () => this.feedbackText.setText(''))
      } else {
        this.feedbackText.setText('Clipboard non disponibile.')
      }
    } catch (err) {
      this.feedbackText.setText('Permesso clipboard negato.')
    }
  }
}

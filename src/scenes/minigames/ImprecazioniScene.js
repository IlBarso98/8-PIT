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
    this.cameras.main.setBackgroundColor('#1c0d1a')
    this.add.rectangle(width / 2, height / 2, width - 30, height - 40, 0x310d20)
    this.add.text(width / 2, 50, 'Generatore Randomico di Bestemmie', { fontSize: '12px', color: '#facc15' }).setOrigin(0.5)

    this.outputText = this.add
      .text(width / 2, height / 2 - 10, 'Premi GENERA', {
        fontSize: '12px',
        color: '#fef3c7',
        align: 'center',
        wordWrap: { width: width - 60 },
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

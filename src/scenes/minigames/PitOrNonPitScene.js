import Phaser from 'phaser'
import phrases from '../../data/pitOrNonPit.sample.json'
import { updateScore } from '../../state/store'
import { signalInteraction } from '../../utils/audio'

export default class PitOrNonPitScene extends Phaser.Scene {
  constructor() {
    super('PitOrNonPitScene')
    this.currentIndex = 0
    this.score = 0
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#081229')
    this.add.rectangle(width / 2, height / 2, width - 20, height - 20, 0x0f1a36)
    this.add.rectangle(width / 2, 40, width - 30, 36, 0x172554)
    this.score = 0
    updateScore('PitOrNonPitScene', 0)
    this.displayedPhrases = Phaser.Utils.Array.Shuffle(phrases.slice())
    this.currentIndex = 0
    this.lockInput = false
    this.awaitingAdvance = false

    this.scoreText = this.add
      .text(30, 60, `SCORE: ${this.score}`, { fontSize: '12px', color: '#facc15' })
      .setOrigin(0, 0.5)

    this.phraseText = this.add
      .text(width / 2, height / 2 - 20, '', {
        fontSize: '12px',
        color: '#e2e8f0',
        wordWrap: { width: width - 80 },
        align: 'center',
        lineSpacing: 6,
      })
      .setOrigin(0.5)

    this.feedbackText = this.add
      .text(width / 2, height / 2 + 70, '', {
        fontSize: '10px',
        color: '#f97316',
        align: 'center',
        wordWrap: { width: width - 80 },
        lineSpacing: 4,
      })
      .setOrigin(0.5)

    this.createButtons()
    this.showPhrase()
  }

  createButtons() {
    const { width, height } = this.scale
    this.buttons = [
      this.createChoiceButton(width / 2 - 80, height - 70, 'PIT', 'pit'),
      this.createChoiceButton(width / 2 + 80, height - 70, 'FAMOSO', 'famoso'),
    ]
    this.nextBtn = this.add.image(width / 2, height - 30, 'btn-basic').setScale(0.5)
    this.nextLabel = this.add.text(this.nextBtn.x, this.nextBtn.y, 'AVANTI', {
      fontSize: '10px',
      color: '#f8fafc',
    })
    this.nextLabel.setOrigin(0.5)
    this.nextBtn.setInteractive({ useHandCursor: true })
    this.nextBtn.on('pointerdown', () => {
      if (!this.awaitingAdvance) {
        return
      }
      signalInteraction(this)
      this.showPhrase()
    })
  }

  createChoiceButton(x, y, label, tag) {
    const btn = this.add.image(x, y, 'btn-basic').setScale(0.55)
    const txt = this.add.text(x, y, label, { fontSize: '10px', color: '#f8fafc' }).setOrigin(0.5)
    btn.setInteractive({ useHandCursor: true })
    btn.on('pointerdown', () => this.handleChoice(tag))
    return { btn, txt }
  }

  showPhrase() {
    if (this.currentIndex >= this.displayedPhrases.length) {
      this.phraseText.setText('Tutte le frasi completate! Torna a Home per ricominciare.')
      this.feedbackText.setText('')
      this.lockInput = true
      this.awaitingAdvance = false
      return
    }
    this.currentPhrase = this.displayedPhrases[this.currentIndex]
    this.phraseText.setText(`“${this.currentPhrase.text}”`)
    this.feedbackText.setText('Scegli PIT o FAMOSO')
    this.lockInput = false
    this.awaitingAdvance = false
    this.buttons.forEach(({ btn }) => btn.setTexture('btn-basic'))
  }

  handleChoice(tag) {
    if (this.lockInput || !this.currentPhrase) {
      return
    }
    this.lockInput = true
    const isCorrect = tag === this.currentPhrase.tag
    this.score += isCorrect ? 1 : -1
    updateScore('PitOrNonPitScene', this.score)
    signalInteraction(this, isCorrect ? 520 : 180)
    this.scoreText.setText(`SCORE: ${this.score}`)
    const info = [`L'ha detto: ${this.currentPhrase.author}`]
    if (this.currentPhrase.date) {
      info.push(`Data: ${this.currentPhrase.date}`)
    }
    if (this.currentPhrase.source) {
      info.push(`Fonte: ${this.currentPhrase.source}`)
    }
    const status = isCorrect ? 'CORRETTO!' : 'ERRATO!'
    this.feedbackText.setText(`${status}\n${info.join('\n')}`)
    this.currentIndex += 1
    this.awaitingAdvance = true
  }
}

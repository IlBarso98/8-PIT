import Phaser from 'phaser'
import { signalInteraction } from '../utils/audio'

const RULES_COPY = {
  PitOrNonPitScene: `Leggi la frase e decidi se è farina del sacco di Pit oppure di qualcun altro.
Tocca PIT o NON PIT, poi usa Avanti per continuare la sessione. Nessun timer, ragiona con calma.`,
  LagoDiRughiScene: `Pit lancia una lenza nello strano Lago di Rughi.
Hai 60 secondi per illuderti di pescare qualcosa. Segui il galleggiante e osserva le bolle per capire se qualcosa abbocca.`,
  RimaniConcentratoScene: `Modalità Esame: Pit deve restare vigile per 10 pagine. Tocca ogni sasso colorato appena appare (entro la finestra di tempo). Se ne manca uno, è Game Over. Resisti 10 pagine per vincere.`,
  RimaniConcentratoVotoScene: `Modalità Voto: stessi sassi e tempi ma ogni cristallo assegna un punteggio (blu=2, rosa=1, verde=3). La somma determina il voto. Sotto 18 è bocciato, sopra 30 diventa 30 e lode.`,
  ImprecazioniScene: `Genera combinazioni casuali di nomi + descrittori per nuove bestemmie.
Tocca GENERA e poi COPIA per condividerle al volo (clipboard).`,
}

export default class RulesScene extends Phaser.Scene {
  constructor() {
    super('RulesScene')
  }

  init(data) {
    this.minigameKey = data?.minigame
    this.currentLabel = data?.label || ''
  }

  create() {
    const { width, height } = this.scale
    if (!this.minigameKey) {
      this.scene.start('MenuScene')
      return
    }
    this.cameras.main.setBackgroundColor('#040d1a')
    this.add.rectangle(width / 2, height / 2, width - 30, height - 40, 0x0b1b35).setStrokeStyle(2, 0xf97316)
    this.add
      .text(width / 2, 60, this.currentLabel, { fontSize: '14px', color: '#facc15' })
      .setOrigin(0.5)

    if (this.minigameKey === 'RimaniConcentratoScene') {
      this.renderFocusModes(width, height)
    } else {
      this.add
        .text(width / 2, height / 2, RULES_COPY[this.minigameKey], {
          fontSize: '10px',
          color: '#e2e8f0',
          align: 'left',
          wordWrap: { width: width - 80 },
          lineSpacing: 8,
        })
        .setOrigin(0.5)

      const btn = this.add.image(width / 2, height - 60, 'btn-basic').setInteractive({ useHandCursor: true })
      this.add.text(btn.x, btn.y, 'INIZIA', { fontSize: '10px', color: '#f8fafc' }).setOrigin(0.5)

      btn.on('pointerdown', () => {
        signalInteraction(this, 420)
        this.scene.start(this.minigameKey)
      })
    }
  }

  renderFocusModes(width, height) {
    const left = width / 2 - 130
    const right = width / 2 + 130

    const examPanel = this.add.rectangle(left, height / 2 - 10, 240, 150, 0x000000, 0.45).setStrokeStyle(2, 0xfacc15)
    this.add
      .text(examPanel.x, examPanel.y - 50, 'Modalità Esame', { fontSize: '11px', color: '#facc15' })
      .setOrigin(0.5)
    this.add
      .text(examPanel.x, examPanel.y + 10, RULES_COPY.RimaniConcentratoScene, {
        fontSize: '10px',
        color: '#e2e8f0',
        align: 'center',
        wordWrap: { width: 210 },
      })
      .setOrigin(0.5)
    const examBtn = this.add.image(examPanel.x, height - 70, 'btn-basic').setScale(0.9).setInteractive({ useHandCursor: true })
    this.add.text(examBtn.x, examBtn.y, 'INIZIA', { fontSize: '10px', color: '#f8fafc' }).setOrigin(0.5)
    examBtn.on('pointerdown', () => {
      signalInteraction(this, 420)
      this.scene.start('RimaniConcentratoScene')
    })

    const votoPanel = this.add.rectangle(right, height / 2 - 10, 240, 150, 0x000000, 0.45).setStrokeStyle(2, 0x7dd3fc)
    this.add
      .text(votoPanel.x, votoPanel.y - 50, 'Modalità Voto', { fontSize: '11px', color: '#7dd3fc' })
      .setOrigin(0.5)
    this.add
      .text(votoPanel.x, votoPanel.y + 10, RULES_COPY.RimaniConcentratoVotoScene, {
        fontSize: '10px',
        color: '#e2e8f0',
        align: 'center',
        wordWrap: { width: 210 },
      })
      .setOrigin(0.5)
    const votoBtn = this.add.image(votoPanel.x, height - 70, 'btn-basic').setScale(0.9).setInteractive({ useHandCursor: true })
    this.add.text(votoBtn.x, votoBtn.y, 'INIZIA', { fontSize: '10px', color: '#f8fafc' }).setOrigin(0.5)
    votoBtn.on('pointerdown', () => {
      signalInteraction(this, 420)
      this.scene.start('RimaniConcentratoVotoScene')
    })
  }
}

import Phaser from 'phaser'
import { signalInteraction } from '../utils/audio'

const RULES_COPY = {
  PitOrNonPitScene: `Leggi la frase e decidi se è farina del sacco di Pit oppure di un personaggio famoso.
Tocca PIT o FAMOSO, poi usa Avanti per continuare la sessione. Nessun timer, ragiona con calma.`,
  LagoDiRughiScene: `Pit lancia una lenza nello strano Lago di Rughi.
Hai 60 secondi per illuderti di pescare qualcosa. Segui il galleggiante e osserva le bolle per capire se qualcosa abbocca.`,
  RimaniConcentratoScene: `Pit deve restare vigile per 10 pagine. Tocca ogni sasso colorato appena appare (entro la finestra di tempo). Se ne manca uno, è Game Over. Resisti 10 pagine per vincere.`,
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

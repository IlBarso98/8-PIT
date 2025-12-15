import Phaser from 'phaser'
import { setCurrentMinigame } from '../state/store'
import { signalInteraction } from '../utils/audio'

const MENU_ITEMS = [
  { label: 'PIT O NON PIT', sceneKey: 'PitOrNonPitScene' },
  { label: 'LAGO DI RUGHI', sceneKey: 'LagoDiRughiScene' },
  { label: 'RIMANI CONCENTRATO', sceneKey: 'RimaniConcentratoScene' },
  { label: 'GENERATORE RANDOMICO DI BESTEMMIE', sceneKey: 'ImprecazioniScene' },
]

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#030712')
    this.add.rectangle(width / 2, height / 2, width, height, 0x060f1e)
    this.add.rectangle(width / 2, 40, width, 60, 0x172554)
    this.add
      .image(80, 40, 'logo-sprite')
      .setOrigin(0, 0.5)
      .setScale(0.4)
    this.add
      .text(width - 40, 40, 'LA TRIBÙ 🎪', { fontSize: '12px', color: '#fcd34d' })
      .setOrigin(1, 0.5)

    const spacing = 48
    MENU_ITEMS.forEach((item, index) => {
      const entryY = 120 + index * spacing
      const entry = this.add
        .rectangle(width / 2, entryY, width - 60, 34, 0x111c3d)
        .setStrokeStyle(2, 0xfacc15)
        .setInteractive({ useHandCursor: true })

      const label = this.add
        .text(width / 2, entryY, item.label, {
          fontSize: '12px',
          color: '#e2e8f0',
          align: 'center',
          wordWrap: { width: width - 100 },
        })
        .setOrigin(0.5)

      entry.on('pointerdown', () => {
        signalInteraction(this)
        setCurrentMinigame(item.sceneKey)
        this.scene.start('RulesScene', { minigame: item.sceneKey, label: item.label })
      })

      entry.on('pointerover', () => {
        label.setColor('#f97316')
      })

      entry.on('pointerout', () => {
        label.setColor('#e2e8f0')
      })
    })
  }
}

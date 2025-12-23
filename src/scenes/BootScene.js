import Phaser from 'phaser'
import { initStore } from '../state/store'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    initStore()
    this.load.image('pit-portrait', 'assets/PIT A.PNG')
    this.load.image('pit-fish', 'assets/river.png')
    this.load.image('library-bg', 'assets/library.PNG')
    this.load.image('lake-bg', 'assets/river.png')
    this.load.image('santamaria-bg', 'assets/SantaMaria.png')
    this.load.image('pit-deconcentrato', 'assets/Pitdeconcentrato.png')
    this.load.image('pit-laureato', 'assets/PitLaureato.png')
    this.load.image('rock-0', 'assets/cristalloblu.png')
    this.load.image('rock-1', 'assets/cristallorosa.png')
    this.load.image('rock-2', 'assets/cristalloverde.png')
    this.load.image('pitnopit-bg', 'assets/PitNoPitSfondo.png')
    this.load.image('trap-sigaretta', 'assets/Sigaretta.png')
    this.load.image('trap-missbo', 'assets/Missbo.png')
    this.load.svg('trap-milan', 'assets/Milan.svg', { width: 64, height: 64 })
    this.load.audio('sfx-piteeer', 'assets/audio/PITEEEEER.mp3')
    this.load.audio('sfx-river', 'assets/audio/RiverPitaudio.mp3')
    this.load.audio('sfx-sonodebole', 'assets/audio/Sonodebole.mp3')
    this.load.audio('sfx-piter2', 'assets/audio/Piter2.mp3')
    this.load.audio('sfx-diocaaaaa', 'assets/audio/DioCaaaaa.mp3')
    this.load.audio('sfx-dioiaaa', 'assets/audio/dioiaaa.mp3')
    this.load.audio('music-home', 'assets/audio/MusicaHome.mp3')
  }

  create() {
    this.cameras.main.setBackgroundColor('#050b16')
    this.graphics = this.make.graphics({ x: 0, y: 0, add: false })
    this.createLogoTexture()
    this.createPitTexture()
    this.ensureTexture('pit-portrait', () => this.createPitPortraitDetailed())
    this.ensureTexture('pit-fish', () => this.createPitFishingDetailed())
    this.ensureTexture('library-bg', () => this.createLibraryBackgroundDetailed())
    this.ensureTexture('lake-bg', () => this.createLakeSpriteDetailed())
    this.ensureTexture('santamaria-bg', () => this.createSantaMariaFallback())
    this.ensureTexture('pit-deconcentrato', () => this.createPitDeconcentratoFallback())
    this.createRodSprite()
    this.createRockTexturesDetailed()
    this.createButtonTextures()
    this.graphics.destroy()
    this.scene.launch('UIScene')
    this.scene.bringToTop('UIScene')
    this.scene.start('LoadingScene')
  }

  createLogoTexture() {
    const g = this.graphics
    g.clear()
    g.fillStyle(0x051937, 1)
    g.fillRect(0, 0, 220, 100)
    g.fillStyle(0xf472b6, 1)
    g.fillRect(12, 12, 40, 76)
    g.fillStyle(0xffffff, 1)
    g.fillRect(60, 20, 140, 20)
    g.fillRect(60, 52, 120, 20)
    g.fillStyle(0xffc857, 1)
    g.fillRect(150, 12, 40, 20)
    g.fillRect(135, 32, 70, 40)
    g.fillStyle(0x111827, 1)
    g.fillRect(0, 0, 220, 8)
    g.fillRect(0, 92, 220, 8)
    g.generateTexture('logo-sprite', 220, 100)
  }

  createPitTexture() {
    const g = this.graphics
    g.clear()
    g.fillStyle(0x1f2937, 1)
    g.fillRect(0, 0, 48, 64)
    g.fillStyle(0xffd5a5, 1)
    g.fillRect(18, 4, 12, 12)
    g.fillStyle(0x000000, 1)
    g.fillRect(20, 8, 3, 2)
    g.fillRect(25, 8, 3, 2)
    g.fillStyle(0xf472b6, 1)
    g.fillRect(14, 16, 20, 16)
    g.fillStyle(0x93c5fd, 1)
    g.fillRect(10, 32, 28, 24)
    g.generateTexture('pit-idle', 48, 64)

    g.fillStyle(0x1f2937, 1)
    g.fillRect(0, 0, 48, 64)
    g.fillStyle(0xffd5a5, 1)
    g.fillRect(18, 6, 12, 10)
    g.fillStyle(0x000000, 1)
    g.fillRect(18, 15, 12, 2)
    g.fillStyle(0xf472b6, 1)
    g.fillRect(12, 20, 24, 14)
    g.fillStyle(0x93c5fd, 1)
    g.fillRect(10, 34, 28, 20)
    g.generateTexture('pit-study', 48, 64)
  }

  createRockTexturesDetailed() {
    const stones = [
      [0xf8d458, 0xd6b045, 0x906521],
      [0x6fb0ff, 0x4b86d9, 0x2f507f],
      [0xf47cab, 0xd1527e, 0x7f2c4f],
      [0x5fe49a, 0x35b86f, 0x1f6b3d],
    ]

    // Use provided crystal PNGs when present; otherwise generate placeholders.
    for (let index = 0; index < stones.length; index++) {
      if (!this.textures.exists(`rock-${index}`)) {
        const [light, mid, dark] = stones[index]
        const g = this.graphics
        g.clear()
        g.fillStyle(mid, 1)
        g.fillRect(0, 0, 24, 24)
        g.fillStyle(light, 1)
        g.fillRect(2, 2, 14, 14)
        g.fillRect(8, 10, 10, 10)
        g.fillStyle(dark, 1)
        g.fillRect(0, 14, 12, 6)
        g.fillRect(12, 0, 6, 12)
        g.fillRect(16, 16, 6, 8)
        g.generateTexture(`rock-${index}`, 24, 24)
      }
    }
  }

  createButtonTextures() {
    const g = this.graphics
    g.clear()
    g.fillStyle(0x0f172a, 1)
    g.fillRect(0, 0, 140, 44)
    g.lineStyle(4, 0xf97316, 1)
    g.strokeRect(0, 0, 140, 44)
    g.generateTexture('btn-basic', 140, 44)

    g.clear()
    g.fillStyle(0x7c2d12, 1)
    g.fillRect(0, 0, 140, 44)
    g.lineStyle(4, 0xfacc15, 1)
    g.strokeRect(0, 0, 140, 44)
    g.generateTexture('btn-basic-active', 140, 44)
  }

  createSantaMariaFallback() {
    const g = this.graphics
    const w = 640
    const h = 360
    g.clear()
    const palette = [0x2a1c2e, 0x3c243a, 0x53334c, 0x6b3e5a, 0x9e5f70]
    for (let y = 0; y < h; y += 24) {
      for (let x = 0; x < w; x += 24) {
        const color = palette[(x / 24 + y / 24) % palette.length]
        g.fillStyle(color, 1)
        g.fillRect(x, y, 24, 24)
      }
    }
    g.lineStyle(4, 0xfacc15, 0.6)
    g.strokeRect(12, 12, w - 24, h - 24)
    g.generateTexture('santamaria-bg', w, h)
  }

  createPitPortraitDetailed() {
    const g = this.graphics
    const px = 3
    const width = 240
    const height = 340
    const palette = {
      bg: 0xf2c57c,
      hairD: 0x3b251c,
      hairM: 0x523428,
      skin: 0xf2c6a0,
      skinD: 0xe0a57e,
      skinL: 0xf6d9b7,
      shirt: 0x4f8f6b,
      scarfA: 0x1e6f7d,
      scarfB: 0xff8b4a,
      scarfC: 0x2da86f,
      scarfD: 0x2e2c72,
      table: 0xe3a16b,
    }
    g.clear()
    g.fillStyle(palette.bg, 1)
    g.fillRect(0, 0, width, height)
    const block = (x, y, c, dx = 1, dy = 1) => {
      g.fillStyle(c, 1)
      g.fillRect(x * px, y * px, dx * px, dy * px)
    }
    // hair curly mass
    for (let y = 8; y < 32; y++) {
      for (let x = 8; x < 26; x++) {
        block(x, y, y % 3 === 0 ? palette.hairM : palette.hairD)
      }
    }
    block(6, 14, palette.hairD, 4, 10)
    block(25, 16, palette.hairD, 4, 12)
    block(12, 6, palette.hairD, 8, 6)
    // face
    for (let y = 32; y < 60; y++) {
      for (let x = 11; x < 24; x++) {
        block(x, y, y % 2 === 0 ? palette.skin : palette.skinD)
      }
    }
    block(10, 38, palette.skinD, 2, 16)
    block(23, 38, palette.skinD, 2, 16)
    block(14, 60, palette.skinD, 6, 4)
    block(15, 64, palette.skinD, 4, 3)
    block(13, 44, 0x20110d, 2, 2)
    block(19, 44, 0x20110d, 2, 2)
    block(14, 47, palette.hairM, 2, 1)
    block(19, 47, palette.hairM, 2, 1)
    block(19, 49, palette.hairD, 1, 3)
    block(17, 55, palette.hairM, 5, 1)
    block(16, 56, palette.hairM, 6, 1)
    // neck
    block(13, 68, palette.skinD, 8, 4)
    block(12, 72, palette.skinD, 10, 3)
    // scarf
    const scarf = [
      [5, 70, 20, 6, palette.scarfA],
      [7, 76, 18, 4, palette.scarfB],
      [6, 80, 20, 5, palette.scarfC],
      [8, 85, 16, 4, palette.scarfD],
      [6, 89, 20, 5, palette.scarfB],
      [5, 94, 22, 6, palette.scarfA],
      [7, 100, 18, 5, palette.scarfC],
      [9, 105, 14, 4, palette.scarfB],
      [10, 109, 12, 3, palette.scarfD],
    ]
    scarf.forEach(([x, y, dx, dy, c]) => block(x, y, c, dx, dy))
    block(11, 96, palette.scarfD, 4, 3)
    block(15, 102, palette.scarfB, 5, 2)
    // shirt
    block(6, 116, 22, 44, palette.shirt)
    block(8, 160, 18, 12, palette.shirt)
    // table
    block(0, 176, 28, 7, palette.table)
    block(2, 183, 24, 5, palette.table)
    g.generateTexture('pit-portrait', width, height)
  }

  createPitFishingDetailed() {
    const g = this.graphics
    const px = 3
    const width = 280
    const height = 340
    const pal = {
      hairD: 0x3a241c,
      hairM: 0x523428,
      skin: 0xf2c6a0,
      skinD: 0xe0a57e,
      shirt: 0x4f8f6b,
      scarfA: 0x1e6f7d,
      scarfB: 0xff8b4a,
      scarfC: 0x2da86f,
      scarfD: 0x2e2c72,
      rodDark: 0x2c2a2e,
      rodLight: 0x7a8c70,
      rodGrip: 0x3c3c44,
    }
    g.clear()
    g.fillStyle(0x000000, 0)
    g.fillRect(0, 0, width, height)
    const b = (x, y, c, dx = 1, dy = 1) => {
      g.fillStyle(c, 1)
      g.fillRect(x * px, y * px, dx * px, dy * px)
    }
    // rod horizontal
    b(36, 70, pal.rodDark, 60, 3)
    b(90, 64, pal.rodLight, 14, 3)
    b(110, 70, pal.rodDark, 8, 3)
    b(38, 73, pal.rodGrip, 4, 6)
    // hair
    for (let y = 10; y < 30; y++) {
      for (let x = 7; x < 23; x++) {
        b(x, y, y % 3 === 0 ? pal.hairM : pal.hairD)
      }
    }
    b(5, 16, pal.hairD, 4, 10)
    b(22, 18, pal.hairD, 4, 10)
    // face
    for (let y = 30; y < 52; y++) {
      for (let x = 9; x < 20; x++) {
        b(x, y, y % 2 === 0 ? pal.skin : pal.skinD)
      }
    }
    b(8, 36, pal.skinD, 2, 12)
    b(19, 38, pal.skinD, 2, 10)
    b(17, 40, pal.hairD, 1, 2)
    b(16, 42, pal.hairM, 1, 1)
    b(19, 44, pal.hairD, 1, 3)
    b(16, 49, pal.hairM, 4, 1)
    // neck
    b(11, 52, pal.skinD, 6, 4)
    b(10, 56, pal.skinD, 8, 3)
    // scarf
    const scarf = [
      [3, 52, 18, 5, pal.scarfA],
      [5, 57, 18, 4, pal.scarfB],
      [4, 61, 20, 5, pal.scarfC],
      [6, 66, 16, 4, pal.scarfD],
      [4, 70, 20, 5, pal.scarfB],
      [3, 75, 22, 6, pal.scarfA],
      [5, 81, 18, 4, pal.scarfC],
      [6, 85, 16, 3, pal.scarfB],
      [7, 88, 14, 3, pal.scarfD],
    ]
    scarf.forEach(([x, y, dx, dy, c]) => b(x, y, c, dx, dy))
    b(11, 72, pal.scarfD, 4, 3)
    // torso/arm
    b(4, 86, pal.shirt, 24, 40)
    b(6, 126, pal.shirt, 20, 12)
    b(26, 94, pal.skin, 10, 10)
    b(32, 104, pal.skin, 12, 10)
    b(38, 114, pal.skinD, 16, 8)
    g.generateTexture('pit-fish', width, height)
  }

  createLibraryBackgroundDetailed() {
    const g = this.graphics
    g.clear()
    const w = 640
    const h = 360
    const wall = 0xe3c7a1
    const shadow = 0xd4b182
    const floor = 0xb56744
    const floor2 = 0xc7744d
    g.fillStyle(wall, 1)
    g.fillRect(0, 0, w, h)
    g.fillStyle(shadow, 1)
    g.fillRect(0, 0, w, 42)
    g.fillStyle(floor, 1)
    g.fillRect(0, h - 140, w, 140)
    g.fillStyle(floor2, 1)
    for (let y = h - 140; y < h; y += 14) {
      for (let x = (y / 14) % 2 === 0 ? 0 : 10; x < w; x += 20) {
        g.fillRect(x, y, 12, 10)
      }
    }
    // shelves
    g.fillStyle(0x7a412e, 1)
    g.fillRect(w - 240, 62, 220, 200)
    g.fillStyle(0x5b2c1f, 1)
    g.fillRect(w - 240, 54, 220, 8)
    g.fillRect(w - 240, 132, 220, 8)
    g.fillRect(w - 240, 210, 220, 8)
    const bookColors = [0x1f6b8b, 0xfbbc04, 0xe85d75, 0x2f8f5b, 0x9b59b6, 0xffb4a2, 0x2f4858, 0x6b4caf]
    for (let shelf = 0; shelf < 3; shelf++) {
      for (let i = 0; i < 12; i++) {
        const color = bookColors[(i + shelf) % bookColors.length]
        const bx = w - 232 + i * 18
        const by = 74 + shelf * 70
        g.fillStyle(color, 1)
        g.fillRect(bx, by, 12, 52)
      }
    }
    // tables & legs
    g.fillStyle(0x223348, 1)
    g.fillRect(110, 214, 270, 20)
    g.fillRect(210, 246, 270, 20)
    g.fillStyle(0x0f1f30, 1)
    g.fillRect(110, 232, 270, 6)
    g.fillRect(210, 266, 270, 6)
    g.fillRect(130, 236, 12, 76)
    g.fillRect(340, 236, 12, 76)
    g.fillRect(230, 270, 12, 76)
    g.fillRect(440, 270, 12, 76)
    // windows
    g.fillStyle(0xf8e8c2, 1)
    g.fillRect(40, 62, 70, 116)
    g.fillRect(130, 62, 70, 116)
    g.fillStyle(0xeed7a8, 1)
    g.fillRect(40, 62, 70, 10)
    g.fillRect(130, 62, 70, 10)
    g.fillRect(74, 62, 6, 116)
    g.fillRect(164, 62, 6, 116)
    g.generateTexture('library-bg', w, h)
  }

  createLakeSpriteDetailed() {
    const g = this.graphics
    g.clear()
    const w = 640
    const h = 360
    const waterTop = Math.floor(h * 0.58)
    // sky
    g.fillStyle(0x86c7ed, 1)
    g.fillRect(0, 0, w, waterTop - 40)
    // distant treeline
    g.fillStyle(0x2f7a4f, 1)
    g.fillRect(0, waterTop - 40, w, 24)
    // water
    g.fillStyle(0x2a7ab4, 1)
    g.fillRect(0, waterTop, w, h - waterTop)
    g.fillStyle(0x1f669a, 1)
    for (let y = waterTop + 6; y < h - 16; y += 14) {
      for (let x = (y / 14) % 2 === 0 ? 0 : 12; x < w; x += 22) {
        g.fillRect(x, y, 18, 6)
      }
    }
    // shore
    g.fillStyle(0xd49a63, 1)
    g.fillRect(0, waterTop - 6, w, 10)
    g.fillStyle(0xc8834a, 1)
    g.fillRect(0, h - 20, w, 20)
    // pier
    g.fillStyle(0x8b5a32, 1)
    g.fillRect(20, waterTop - 8, 160, 14)
    for (let i = 0; i < 5; i++) {
      g.fillRect(30 + i * 30, waterTop - 8, 18, 14)
    }
    g.fillStyle(0x5c3b23, 1)
    for (let i = 0; i < 5; i++) {
      g.fillRect(32 + i * 30, waterTop + 6, 10, 26)
    }
    g.generateTexture('lake-bg', w, h)
  }

  createRodSprite() {
    const g = this.graphics
    g.clear()
    g.fillStyle(0x3b2f2a, 1)
    g.fillRect(0, 0, 8, 90)
    g.fillStyle(0xfbbc04, 1)
    g.fillRect(0, 0, 8, 10)
    g.fillRect(2, 10, 4, 60)
    g.generateTexture('fishing-rod', 12, 100)
  }

  createPitDeconcentratoFallback() {
    const g = this.graphics
    const w = 220
    const h = 260
    g.clear()
    g.fillStyle(0x0a0a0a, 1)
    g.fillRect(0, 0, w, h)
    g.fillStyle(0x2f1f1f, 1)
    g.fillRect(12, 12, w - 24, h - 24)
    g.fillStyle(0xffd5a5, 1)
    g.fillRect(w / 2 - 20, 40, 40, 40)
    g.fillStyle(0x3b251c, 1)
    g.fillRect(w / 2 - 24, 30, 48, 16)
    g.fillStyle(0x4f8f6b, 1)
    g.fillRect(w / 2 - 32, 100, 64, 80)
    g.fillStyle(0xd1527e, 1)
    g.fillRect(w / 2 - 30, 88, 60, 16)
    g.fillStyle(0xcfa57a, 1)
    g.fillRect(w / 2 - 28, 180, 56, 20)
    g.fillStyle(0x111827, 1)
    g.fillRect(w / 2 - 50, 12, 10, h - 24)
    g.fillRect(w / 2 + 40, 12, 10, h - 24)
    g.generateTexture('pit-deconcentrato', w, h)
  }

  ensureTexture(key, factory) {
    if (this.textures.exists(key)) return
    factory()
  }

  useLoadedOrFallback(sourceKey, targetKey, fallbackFactory) {
    if (this.textures.exists(sourceKey)) {
      this.textures.renameTexture(sourceKey, sourceKey + '-raw')
      const source = this.textures.get(sourceKey + '-raw').getSourceImage()
      this.textures.addImage(targetKey, source)
      return
    }
    fallbackFactory()
  }
}

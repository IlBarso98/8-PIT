## 8-Pit

Esperienza web mobile (landscape) sviluppata con **Vite** + **Phaser 3** per ospitare 4 minigiochi 8-bit con UI persistente.

### Avvio rapido

```bash
npm install
npm run dev
```

Apri l'URL locale (es. `http://localhost:5173`) da un browser mobile o usando strumenti di emulazione. Il gioco gira solo in memoria (nessuna persistenza).

### Struttura principali

- `src/game.js`: configurazione Phaser (canvas 640×360, scaling FIT, dom container attivo, pixelArt, smoothing off).
- `src/state/store.js`: store runtime con mute, registrazioni per Lago di Rughi, punteggi e helper.
- `src/scenes`: Boot, Loading, Start, Menu, Rules, UI e le 4 scene dei minigiochi.
- `src/data/*.sample.json`: dati mock caricati direttamente lato client. Sostituiscili con dataset reali mantenendo lo stesso schema.
- `public/assets/`: metti qui gli sprite forniti dall'art team (`PIT A.PNG`, `PIT B.PNG`, `library.PNG`, `river.png`). Puoi sostituirli con PNG personalizzati mantenendo gli stessi nomi file, il gioco farà fallback sui placeholder generati in BootScene se mancano.

### Minigiochi

1. **PIT O NON PIT** – Indovina se la frase è di Pit o di un famoso. Feedback immediato + punteggio ±1. Dati in `src/data/pitOrNonPit.sample.json`.
2. **LAGO DI RUGHI** – Esperienza "illusione" da 60s con pulsanti LANCIA/RITIRA, Pit sul molo e lenza animata con galleggiante e bolle dinamiche. Nessuna registrazione finale (sessione solo visiva).
3. **RIMANI CONCENTRATO** – 10 pagine da 10s. Tocca i sassi colorati prima che spariscano; difficoltà crescente.
4. **GENERATORE RANDOMICO DI BESTEMMIE** – Combina nome+descrittore casuali e copia su clipboard.

### Personalizzazione dati

- `pitOrNonPit.sample.json`: array di oggetti `{ id, text, tag, author, date, source? }`.
- `insults.sample.json`: `{ "names": [], "descriptors": [] }`.

Sostituisci i file con dataset reali oppure collegali a un backend e popola le scene aggiornando gli import.

### UX e note tecniche

- Orientamento landscape forzato con overlay in portrait. Meta viewport blocca pinch/zoom, CSS disabilita scroll.
- UI overlay (`UIScene`) sempre attiva: pulsante **Home** (torna al menu e resetta scene attive) e toggle audio (🔊/🔇) che controlla anche i toni sintetici WebAudio.
- Supporto pointerdown/touch in tutte le interazioni, inclusi i pulsanti retro e la DOM UI del Lago di Rughi.
- Vibrazione leggera `navigator.vibrate(10)` sugli input importanti (disattivabile facilmente tramite store se necessario).
- Tutto lo stile è placeholder pixel art generato via `Phaser.Graphics`.

### Build

```bash
npm run build
npm run preview
```

Distribuisci il contenuto di `dist/` su qualsiasi static host. Nessun asset esterno oltre al font "Press Start 2P" caricato da Google Fonts.

### Connessione MongoDB (facoltativa)

Se vuoi semplicemente verificare la connettività al cluster MongoDB indicato, usa lo script Node incluso:

1. Esporta le credenziali (usa un terminale sicuro, mai committare la password):

```bash
export MONGO_PASSWORD="la-tua-password"
# opzionali
export MONGO_USER="Gianmarco"
# oppure passa direttamente una URI completa tramite MONGO_URI
```

2. Esegui:

```bash
npm run ping:mongo
```

Lo script (`server/pingMongo.js`) usa il driver ufficiale (`mongodb`) e invia un semplice `ping` al DB `admin`. È separato dal bundle Phaser in modo che le credenziali non finiscano nel client.
# 8-PIT

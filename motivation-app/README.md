# Edge Quotidiano

App per il telefono che ti ricorda chi sei come trader e cosa vuoi dalla tua carriera. Le tue frasi diventano sfondi per il blocco schermo, così le rileggi a ogni sblocco. In più: una regola del giorno, il rituale pre-mercato con la serie di giorni di disciplina e una modalità "ho appena perso un trade" per non cadere nel revenge trading.

È una web app installabile (PWA): niente store, funziona su iPhone e Android.

Design: nero caldo, profondità data solo da stacchi di tono, un unico accento ottone riservato ai dati, Instrument Serif per le tue frasi e Instrument Sans per l'interfaccia.

## Cosa fa

| Sezione | A cosa serve |
|---|---|
| **Oggi** | "Ricordati chi sei": una tua frase d'identità al giorno, cosa vuoi dalla carriera e il tuo perché. Regola del giorno (cambia ogni giorno), stato di Borsa Italiana e New York, giorni di disciplina di fila, il tuo "perché", pulsante **Ho appena perso un trade** (respirazione guidata, pausa di 15 minuti, checklist anti-revenge). |
| **Sfondi** | Sfondi 1170×2532 in alta definizione. Motion design in WebGL con pipeline di post-produzione in stile After Effects: **Flusso di energia** (fili luminosi con impulsi), **Aurora** (veli di luce con raggi e stelle), **Tropici al tramonto** (palme in controluce con fasci di luce volumetrici che passano dietro le foglie, riflessi sull'acqua), **Spazio** e **Auto sportive** con luci in movimento. Glow multi-raggio, scia anamorfica e color correction cinematografica con colori che cambiano lentamente. Atmosfere disegnate: **Casa sotto la pioggia**, **Pioggia sul vetro**; più **Alterna** e i grafici del mestiere. Frasi tue, di **Mente calma** o di trading. 5 tavolozze (Nero e ottone, Verde bottiglia, Bordeaux, Notte, Pietra) che cambiano anche la color correction. |
| **Rituale** | Checklist pre-mercato: se la completi, la giornata conta per la serie (si contano solo i giorni feriali). Diario breve "una cosa fatta bene oggi". |
| **Chi sono** | Frasi d'identità ("Rispetto ogni stop, senza eccezioni.") e di carriera ("Voglio vivere del mio trading.") da toccare per sceglierle, o da scrivere tu; visione a 3 anni, obiettivo a 12 mesi, perché e regola d'oro. Si salva da solo. |

I dati restano sul telefono (memoria del browser).

## Installarla sul telefono

1. Pubblica la cartella `motivation-app/` con GitHub Pages (Settings → Pages → branch, cartella root; l'app si apre su `…/motivation-app/`). Qualsiasi hosting statico va bene.
2. **iPhone**: apri il link in Safari → Condividi → **Aggiungi alla schermata Home**.
3. **Android**: apri il link in Chrome → menu ⋮ → **Installa app**.

Dall'app installata, **Salva / condividi** apre il menu del telefono: scegli *Usa come sfondo* o *Salva immagine*.

## Frasi motivazionali sul blocco schermo

1. Nell'app, sezione **Chi sono**: scegli o scrivi le tue frasi.
2. Tocca **Crea i miei sfondi per il blocco schermo**, poi **Salva tutti nelle Foto**.
3. Mettili in un album (per esempio `Chi sono`) e segui i passaggi qui sotto per farli ruotare.

Nella cartella `wallpapers/` ci sono anche 24 sfondi pronti, con frasi di mente calma e di trading.

**iPhone (iOS 17 o successivo), il metodo più semplice**
1. Salva gli sfondi in un album di Foto chiamato `Chi sono`.
2. Impostazioni → Sfondo → **Aggiungi nuovo sfondo** → **Foto casuali** → *Seleziona foto manualmente* (o l'album `Chi sono`).
3. Frequenza: **Ogni giorno**, **Ogni ora** o **Al tocco**.

**iPhone con Comandi rapidi (cambia anche la schermata Home)**
1. Comandi → Automazione → **Ora del giorno** → 08:30, ogni giorno feriale → *Esegui immediatamente*.
2. Azioni: **Trova foto** (Album è `Chi sono`) → **Ottieni elemento casuale da elenco** → **Imposta foto sfondo** (disattiva *Mostra anteprima*).

**Android**
- Samsung: Impostazioni → Sfondo e stile → Schermata di blocco → **Galleria**, seleziona fino a 15 sfondi: cambiano a ogni accensione dello schermo.
- Altri telefoni: copia la cartella sul telefono e usa un'app che ruota gli sfondi da una cartella (per esempio Muzei con la sorgente "Le mie foto"), con cambio giornaliero.

## Sfondi animati sul blocco schermo

**Come è fatta l'animazione.** Le scene WebGL girano sulla scheda grafica del telefono, a 60 fps e alla risoluzione piena dello schermo, con una catena di post-produzione come in After Effects:

1. **Scena**: energia, aurora oppure foto con luce volumetrica (i fasci partono dal sole e vengono bloccati dalle sagome delle palme, quindi passano *dietro*).
2. **Glow**: estrazione delle luci sopra una soglia morbida, sfocatura gaussiana su due raggi (stretto e largo) e una scia anamorfica orizzontale.
3. **Color correction**: esposizione, compressione delle alte luci, saturazione, contrasto a curva S, split-toning (ombre e luci tinte in modo diverso, con la tinta delle luci che oscilla lentamente), vignettatura e grana fine contro le bande.

Il linguaggio di movimento è "Premium": cicli lenti da 10 secondi, curve morbide, nessun rimbalzo. Quando apri lo schermo intero o riaccendi lo schermo, l'immagine si espone dal nero mentre il glow si posa, poi entra la frase.

- **Nell'app**: "Schermo intero" mostra l'animazione dal vivo (si spegne con "Animazione a schermo intero").
- **Video pronti**: nella cartella `videos/` ci sono 11 MP4 a 60 fps (1080×2338) in loop continuo, senza stacchi: energia oro, energia blu, aurora boreale, aurora smeraldo, palme in controluce, palme al crepuscolo, palme viola, astronauta, GT-R, casa sotto la pioggia, pioggia sul vetro.
- **Il tuo video**: dall'app installata, "Registra il video animato" crea un video con le tue frasi.
- **Samsung**: Impostazioni → Sfondo e stile → Schermata di blocco → Galleria → scegli il video.
- **Altri Android**: un'app per video come sfondo animato (per esempio Video Live Wallpaper).
- **iPhone**: iOS non accetta video come sfondo. Trasformalo in Live Photo con un'app come intoLive, poi Impostazioni → Sfondo → Aggiungi nuovo sfondo → Foto: si anima quando risvegli il telefono.

Crediti delle foto in `photos/CREDITS.md`.

## Rigenerare il pacchetto di sfondi

```bash
node motivation-app/tools/genera-sfondi.js 24   # sfondi fissi e icone
node motivation-app/tools/genera-video.js       # video animati a 60 fps (serve ffmpeg)
```

Usano Playwright e lo stesso motore grafico dell'app.

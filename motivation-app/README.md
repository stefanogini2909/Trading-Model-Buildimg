# Edge Quotidiano

App per il telefono che ti ricorda chi sei come trader e cosa vuoi dalla tua carriera. Le tue frasi diventano sfondi per il blocco schermo, così le rileggi a ogni sblocco. In più: una regola del giorno, il rituale pre-mercato con la serie di giorni di disciplina e una modalità "ho appena perso un trade" per non cadere nel revenge trading.

È una web app installabile (PWA): niente store, funziona su iPhone e Android.

Design: nero caldo, profondità data solo da stacchi di tono, un unico accento ottone riservato ai dati, Instrument Serif per le tue frasi e Instrument Sans per l'interfaccia.

## Cosa fa

| Sezione | A cosa serve |
|---|---|
| **Oggi** | "Ricordati chi sei": una tua frase d'identità al giorno, cosa vuoi dalla carriera e il tuo perché. Regola del giorno (cambia ogni giorno), stato di Borsa Italiana e New York, giorni di disciplina di fila, il tuo "perché", pulsante **Ho appena perso un trade** (respirazione guidata, pausa di 15 minuti, checklist anti-revenge). |
| **Sfondi** | Genera sfondi 1170×2532 in 3 stili (Linea, Candele, Solo parole) e 5 colori (Nero e ottone, Verde bottiglia, Bordeaux, Notte, Pietra), con le tue frasi o le regole del mestiere, il tuo perché e la tua serie. **Pacchetto blocco schermo**: 10 o più sfondi con le tue frasi, da salvare tutti insieme nelle Foto. Schermo intero con cambio automatico ogni minuto, 15 minuti o ora (lo schermo resta acceso). |
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

Nella cartella `wallpapers/` ci sono anche 21 sfondi generici pronti, con le regole del mestiere.

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

## Rigenerare il pacchetto di sfondi

```bash
node motivation-app/tools/genera-sfondi.js 21
```

Usa Playwright e lo stesso motore grafico dell'app. Rigenera anche le icone PNG.

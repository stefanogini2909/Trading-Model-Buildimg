# Edge Quotidiano

App per il telefono che ti tiene sul pezzo come trader: sfondi motivazionali generati al momento, una regola del giorno, il rituale pre-mercato con la serie di giorni di disciplina e una modalità "ho appena perso un trade" per non cadere nel revenge trading.

È una web app installabile (PWA): niente store, funziona su iPhone e Android.

## Cosa fa

| Sezione | A cosa serve |
|---|---|
| **Oggi** | Regola del giorno (cambia ogni giorno), stato di Borsa Italiana e New York, giorni di disciplina di fila, il tuo "perché", pulsante **Ho appena perso un trade** (respirazione guidata, pausa di 15 minuti, checklist anti-revenge). |
| **Sfondi** | Genera sfondi 1170×2532 in 3 stili (Candele, Curva equity, Livelli) e 5 palette, con la frase, il tuo perché e la tua serie. Schermo intero con cambio automatico ogni minuto, 15 minuti o ora (lo schermo resta acceso). |
| **Rituale** | Checklist pre-mercato: se la completi, la giornata conta per la serie (si contano solo i giorni feriali). Diario breve "una cosa fatta bene oggi". |
| **Perché** | Il tuo motivo, l'obiettivo a 12 mesi e la tua regola d'oro, che entra nella rotazione delle frasi. |

I dati restano sul telefono (memoria del browser).

## Installarla sul telefono

1. Pubblica la cartella `motivation-app/` con GitHub Pages (Settings → Pages → branch, cartella root; l'app si apre su `…/motivation-app/`). Qualsiasi hosting statico va bene.
2. **iPhone**: apri il link in Safari → Condividi → **Aggiungi alla schermata Home**.
3. **Android**: apri il link in Chrome → menu ⋮ → **Installa app**.

Dall'app installata, **Salva / condividi** apre il menu del telefono: scegli *Usa come sfondo* o *Salva immagine*.

## Cambiare lo sfondo di sistema in automatico

Nella cartella `wallpapers/` ci sono 21 sfondi pronti (tre settimane di borsa). Puoi anche aggiungere quelli che crei nell'app.

**iPhone (iOS 17 o successivo), il metodo più semplice**
1. Salva gli sfondi in un album di Foto chiamato `Edge`.
2. Impostazioni → Sfondo → **Aggiungi nuovo sfondo** → **Foto casuali** → *Seleziona foto manualmente* (o l'album `Edge`).
3. Frequenza: **Ogni giorno**, **Ogni ora** o **Al tocco**.

**iPhone con Comandi rapidi (cambia anche la schermata Home)**
1. Comandi → Automazione → **Ora del giorno** → 08:30, ogni giorno feriale → *Esegui immediatamente*.
2. Azioni: **Trova foto** (Album è `Edge`) → **Ottieni elemento casuale da elenco** → **Imposta foto sfondo** (disattiva *Mostra anteprima*).

**Android**
- Samsung: Impostazioni → Sfondo e stile → Schermata di blocco → **Galleria**, seleziona fino a 15 sfondi: cambiano a ogni accensione dello schermo.
- Altri telefoni: copia la cartella sul telefono e usa un'app che ruota gli sfondi da una cartella (per esempio Muzei con la sorgente "Le mie foto"), con cambio giornaliero.

## Rigenerare il pacchetto di sfondi

```bash
node motivation-app/tools/genera-sfondi.js 21
```

Usa Playwright e lo stesso motore grafico dell'app. Rigenera anche le icone PNG.

# Workbook 📓
**Workbook** è un'applicazione web progettata per la **gestione di lavori e preventivi** dedicata agli artigiani. Il progetto si concentra sull'organizzazione efficiente delle informazioni, con un'interfaccia intuitiva e un design responsive realizzato con cura.

## Funzionalità principali ✨
* **Gestione dei lavori e preventivi**:

  * **Ogni elemento contiene**:
    * **Lista di immagini**: caricabili dall'utente e automaticamente compresse in formato .webp per ottimizzare performance e spazio di archiviazione.
    * **Cliente associato**: con dettagli completi (provincia, città, via, numero civico, piano e porta).
    * **Data** e **stato** del lavoro o preventivo.
    * **Punti di contatto**: informazioni strutturate su nome, cognome, telefono ed email.
    * **Lista di materiali** utilizzati.
    * **Note** aggiuntive.

* **Barra di ricerca avanzata** 🔍:
  * Permette di cercare tra tutti gli attributi di ogni lavoro o preventivo.
  * Implementata utilizzando **Redux** per una gestione centralizzata ed efficiente dello stato.

* **Filtri personalizzabili**:
  * Filtri dinamici basati su menu a tendina con opzioni univoche, specifici per lavori e preventivi.
  * Gestiti tramite Redux, garantendo velocità e flessibilità.

* **Design responsive** 📱:
  * L'applicazione è ottimizzata per essere utilizzata su qualsiasi dispositivo, garantendo un'esperienza utente uniforme.

## Tecnologie utilizzate 🛠️
* **React**: framework principale per lo sviluppo dell'interfaccia.
* **Redux**: gestione dello stato globale per elementi come:
  * Lista di lavori e preventivi.
  * Lista di clienti.
  * Elementi dell'interfaccia utente.
* **React Context**: gestione dell'autenticazione, implementata per estendibilità futura.
* **Figma**: strumento utilizzato per progettare il design dell'applicazione prima dello sviluppo.

## Scelte progettuali 📐

### Nessuna navigazione tra pagine
Il progetto è stato inizialmente pensato per soddisfare le esigenze di un cliente specifico, eliminando la necessità di una navigazione multi-pagina.

### Performance
Le immagini caricate vengono compresse e convertite in formato .webp, riducendo i tempi di caricamento e l'occupazione di spazio.

### Facilità di utilizzo
L'interfaccia è semplice, moderna e costruita interamente da zero, ispirandosi al design realizzato su Figma.

## Limitazioni attuali 🚧
* **Assenza di backend**:
  In questa versione, il backend non è presente. Nel progetto reale, database, storage e autenticazione sono gestiti tramite Firebase.

* **Single User**:
  L'autenticazione è presente ma in questa versione dimostrativa non richiama alcun servizio.
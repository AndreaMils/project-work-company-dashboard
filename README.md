# Dashboard Azienda Agricola

Dashboard per il monitoraggio di un'azienda agricola con React e Tailwind CSS.

## Descrizione

Simulazione di un'azienda agricola che coltiva grano, mais, pomodori e olive. Il sistema mostra dati ambientali e di produzione in tempo reale.

### Azienda "Terra Verde"
- Ubicazione: Pianura Padana, Italia
- Superficie: 65 ettari
- Colture: Grano (25 ha), Mais (20 ha), Pomodori (5 ha), Olive (15 ha)

## Funzionalità

- Dashboard interattivo con 4 viste (Panoramica, Ambientale, Produzione, Analytics)
- Dati simulati aggiornati ogni 5 secondi
- Grafici interattivi per visualizzazione dati
- Tema chiaro/scuro
- Design responsivo

## Tecnologie

- React 19.1
- Vite 7.0
- Tailwind CSS 4.1
- ShadCN UI
- Recharts per i grafici
- Date-fns per le date

## Installazione

```bash
git clone [repository-url]
cd company-dashboard
yarn install
yarn dev
```

## Comandi

- `yarn dev` - Server di sviluppo
- `yarn build` - Build di produzione
- `yarn preview` - Per eseguire in locale la build generata
- `yarn lint` - Verifica codice

## Struttura Progetto

```
src/
├── components/          # Componenti React
│   ├── ui/             # Componenti ShadCN UI
│   ├── Dashboard.jsx   # Componente principale
│   └── ...
├── services/           # Simulatore dati
├── hooks/              # Custom hooks
└── contexts/           # Context API
```

## Dati Simulati

Il sistema genera:
- Dati ambientali (temperatura, umidità, pioggia, vento, UV)
- Dati produzione per ogni coltura
- KPI aggregati (ricavi, efficienza, crescita)

I dati seguono variazioni stagionali realistiche e correlazioni tra parametri ambientali.
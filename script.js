
const urlJSON = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json';

async function elaboraDati(numeroGiorni) {

    const tabella = document.getElementById('tabella-covid');
    const sottotitolo = document.getElementById('testo-sottotitolo');

    numeroGiorni = Number(numeroGiorni);

    if (!Number.isInteger(numeroGiorni) || numeroGiorni < 1) {
        tabella.innerHTML = '<tr><td>Inserisci un numero valido di giorni.</td></tr>';
        return;
    }

    sottotitolo.innerText = `Visualizzazione degli ultimi ${numeroGiorni} giorni registrati`;

    tabella.innerHTML = '<tr><td>Caricamento dati in corso...</td></tr>';

    try {

        const risposta = await fetch(urlJSON);

        if (!risposta.ok) {
            throw new Error('Errore nel caricamento del file JSON');
        }

        const dati = await risposta.json();

        const ultimiDati = dati.slice(-numeroGiorni);

        // Recupero delle chiavi degli oggetti JSON
        const chiavi = Object.keys(dati[0]);

        let htmlTabella = '<thead><tr>';

        // Creazione delle intestazioni della tabella
        chiavi.forEach(chiave => {
            let nome = chiave.replace(/_/g, ' ');
            htmlTabella += `<th>${nome}</th>`;
        });

        htmlTabella += '</tr></thead><tbody>';

        // Inserimento dei dati nella tabella
        ultimiDati.forEach(giorno => {

            htmlTabella += '<tr>';

            chiavi.forEach(chiave => {

                let valore = giorno[chiave];

                if (chiave === 'data' && valore) {
                    valore = valore.substring(0, 10).split('-').reverse().join('/');
                }

                else if (typeof valore === 'number') {
                    valore = valore.toLocaleString('it-IT');
                }

                if (valore === null) {
                    valore = '';
                }

                htmlTabella += `<td>${valore}</td>`;

            });

            htmlTabella += '</tr>';

        });

        htmlTabella += '</tbody>';

        tabella.innerHTML = htmlTabella;

    }

    catch (errore) {

        console.error('Errore:', errore);

        tabella.innerHTML = '<tr><td>Impossibile caricare i dati.</td></tr>';

    }

}

// Caricamento iniziale degli ultimi 10 giorni
elaboraDati(10);

// Evento del pulsante Aggiorna
document.getElementById('btn-aggiorna').addEventListener('click', function() {

    const giorniScelti = document.getElementById('input-giorni').value;

    elaboraDati(giorniScelti);

});

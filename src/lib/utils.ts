import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {SquadraClassifica} from "@/features/tornei/components/RankingTable";
import {listaPartiteType} from "@/features/partite/queries";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calcolaEta(dataDiNascita: Date) {
    const oggi = new Date();
    let eta = oggi.getFullYear() - dataDiNascita.getFullYear();

    const meseCorrente = oggi.getMonth();
    const giornoCorrente = oggi.getDate();
    const meseNascita = dataDiNascita.getMonth();
    const giornoNascita = dataDiNascita.getDate();

    if (meseCorrente < meseNascita || (meseCorrente === meseNascita && giornoCorrente < giornoNascita)) {
        eta--;
    }

    return eta;
}

type statoPartita = "In arrivo" | "In corso" | "Terminata";

export function calcolaStatoPartita(
    fischioInizio: string | null,
    durataPartita: number | null
): statoPartita | null {
    if (!fischioInizio || durataPartita == null) {
        return null;
    }

    const now = new Date();
    const inizio = new Date(fischioInizio);

    const fine = new Date(
        inizio.getTime() + durataPartita * 60 * 1000
    );

    if (now < inizio) {
        return "In arrivo";
    }

    if (now >= inizio && now < fine) {
        return "In corso";
    }

    return "Terminata";
}

// Struttura dati raggruppata: Categoria -> Girone -> Array di Squadre
export interface ClassificheRaggruppate {
    [categoria: string]: {
        [girone: string]: SquadraClassifica[];
    };
}

export function calcolaClassifiche(listaPartite: listaPartiteType) {
    const mappaClassifiche: ClassificheRaggruppate = {};

    listaPartite.forEach((partita) => {
        const catNome = partita.categoria_nome ?? "???";
        const girNome = partita.girone ?? "???";

        // Consideriamo solo le partite giocate con un risultato valido
        if (partita.goal_casa === null || partita.goal_ospite === null) return;
        if (!partita.squadra_casa_id || !partita.squadra_ospite_id) return;

        if (!mappaClassifiche[catNome]) mappaClassifiche[catNome] = {};
        if (!mappaClassifiche[catNome][girNome]) mappaClassifiche[catNome][girNome] = [];

        const rigaGirone = mappaClassifiche[catNome][girNome];

        // Inizializza la squadra di casa se non esiste nel girone
        let casa = rigaGirone.find(s => s.id === partita.squadra_casa_id);
        if (!casa) {
            casa = {
                id: partita.squadra_casa_id,
                nome: partita.squadra_casa_nome ?? "Home",
                acronimo: partita.squadra_casa_acronimo ?? "HOM",
                stemma: partita.squadra_casa_stemma ?? "",
                giocate: 0, vinte: 0, pareggi: 0, perse: 0, golFatti: 0, golSubiti: 0, diffReti: 0, punti: 0
            };
            rigaGirone.push(casa);
        }

        // Inizializza la squadra ospite se non esiste nel girone
        let ospite = rigaGirone.find(s => s.id === partita.squadra_ospite_id);
        if (!ospite) {
            ospite = {
                id: partita.squadra_ospite_id,
                nome: partita.squadra_ospite_nome ?? "Away",
                acronimo: partita.squadra_ospite_acronimo ?? "AWA",
                stemma: partita.squadra_ospite_stemma ?? "",
                giocate: 0, vinte: 0, pareggi: 0, perse: 0, golFatti: 0, golSubiti: 0, diffReti: 0, punti: 0
            };
            rigaGirone.push(ospite);
        }

        // Aggiornamento statistiche gol e partite giocate
        casa.giocate += 1;
        ospite.giocate += 1;
        casa.golFatti += partita.goal_casa;
        casa.golSubiti += partita.goal_ospite;
        ospite.golFatti += partita.goal_ospite;
        ospite.golSubiti += partita.goal_casa;

        // Calcolo esito partita (Punti: 3 per vittoria, 1 per pareggio, 0 per sconfitta)
        if (partita.goal_casa > partita.goal_ospite) {
            casa.vinte += 1;
            casa.punti += 3;
            ospite.perse += 1;
        } else if (partita.goal_casa < partita.goal_ospite) {
            ospite.vinte += 1;
            ospite.punti += 3;
            casa.perse += 1;
        } else {
            casa.pareggi += 1;
            casa.punti += 1;
            ospite.pareggi += 1;
            ospite.punti += 1;
        }

        casa.diffReti = casa.golFatti - casa.golSubiti;
        ospite.diffReti = ospite.golFatti - ospite.golSubiti;
    });

    // Ordinamento delle classifiche (Punti -> Differenza Reti -> Gol Fatti)
    Object.keys(mappaClassifiche).forEach(cat => {
        Object.keys(mappaClassifiche[cat]).forEach(gir => {
            mappaClassifiche[cat][gir].sort((a, b) => {
                if (b.punti !== a.punti) return b.punti - a.punti;
                if (b.diffReti !== a.diffReti) return b.diffReti - a.diffReti;
                return b.golFatti - a.golFatti;
            });
        });
    });

    return mappaClassifiche;
}

export function string_to_snake_case(str: string | null) {
    const matches = str && str.match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    );

    return matches ? matches.map(s => s.toLowerCase()).join('_') : '';
}

export function convertiHexToHsl(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;
    if (d !== 0) {
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(max === 0 ? 0 : (d / max) * 100),
        b: Math.round(max * 100),
    };
}

export function calcolaRapportoContrasto(hex1: string, hex2: string) {
    function hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : null;
    }

    function getLuminance(rgb: { r: number; g: number; b: number; }) {
        if (!rgb) return 0;
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val =>
            val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
        );
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    if (!rgb1 || !rgb2) return 0;

    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    return Math.min(ratio / 21, 1);
}

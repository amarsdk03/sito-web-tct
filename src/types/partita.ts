import {SquadraDTO} from "@/types/squadra";

export default interface Partita {
    id: string,
    idEdizione: string,
    fase: fasePartita,
    idGirone: string,
    giornata: number,
    squadraCasa: string,
    squadraOspiti: string,
    esito: esitoPartita,
    fischioInizio: Date,
    idGiocatoreMvp?: string,
    campo: string,
}

export interface PartitaDTO {
    id: string,
    girone: string,
    giornata: number,
    squadraCasa: SquadraDTO,
    squadraOspiti: SquadraDTO,
    esito: esitoPartita,
    fischioInizio: Date,
}

interface esitoPartita {
    vittoriaTavolino?: boolean,
    goalCasa: number,
    goalOspiti: number,
    rigoriCasa?: number,
    rigoriOspiti?: number,
}

export enum fasePartita {
    C = "Campionato",
    P = "Playoff",
    G = "Gironi",
    ED = "Eliminazione Diretta",
    F = "Finale",
}
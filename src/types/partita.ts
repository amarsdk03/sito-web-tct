import {SquadraDTO} from "@/types/squadra";

export default interface Partita {
    id: string,
    idEdizione: string,
    fase: fasePartita,
    idGirone: string,
    giornata: number,
    squadraCasa: string,
    squadraOspite: string,
    fischioInizio: Date,
    idGiocatoreMvp?: string,
    campo: string,
}

export interface PartitaDTO {
    id: string,
    girone: string,
    giornata: number,
    squadraCasa: SquadraDTO,
    squadraOspite: SquadraDTO,
    esito: string,
    dataSvolgimento: Date,
}

export enum fasePartita {
    C = "Campionato",
    P = "Playoff",
    G = "Gironi",
    ED = "Eliminazione Diretta",
    F = "Finale",
}
// Dati mostrati nella pagina della squadra
import {PlayerSearchData} from "@/types/player";

export default interface TeamInfoData {
    // Info principali della squadra
    id: string,
    nome: string,
    acronimo?: string,
    linkStemma?: string,
    colore?: string,
    usernameIg?: string,

    // Dettagli aggiuntivi della squadra
    idCapitano: string,
    nomeCapitano: string,
    annoIscrizione?: Date,
    numeroPartiteGiocate?: number,
    numeroVittorie?: number,
    numeroPareggi?: number,
    numeroSconfitte?: number,

    // Dati aggregati da tabella "Azione"
    numeroGoalFatti?: number,
    numeroGoalSubiti?: number,
    numeroAssist?: number,
    numeroCartelliniGialli?: number,
    numeroCartelliniRossi?: number,

    // Formazioni storiche della squadra
    formazioni: TeamFormation[],
}

export interface SquadraDTO {
    id: string,
    nome: string,
    acronimo?: string,
    logo?: string,
    colore?: string,
}

export interface TeamFormation {
    idTorneo: string,
    nomeTorneo: string,
    formazione: PlayerSearchData[],
}
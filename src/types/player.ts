import AwardData from "@/types/award";

// Dati mostrati nella formazione delle squadre
export interface PlayerSearchData {
    // Info principali del giocatore
    id: string,
    nome: string,
    cognome: string,
    linkFoto?: string,

    // Dettagli aggiuntivi del giocatore
    ruoloPrincipale?: playerRole,
    isCapitano?: boolean,
}

// Dati mostrati nella ricerca dei giocatori
export interface PlayerSearchData {
    // Info principali del giocatore
    id: string,
    nome: string,
    cognome: string,
    linkFoto?: string,

    // Dettagli aggiuntivi del giocatore
    ruoloPrincipale?: playerRole,
    isCapitano?: boolean,
    nomeMaglia?: string,
    numeroMaglia?: number,

    // Dati aggregati da tabella "Squadra"
    idSquadra?: string,
    nomeSquadra?: string,
    linkStemmaSquadra?: string,
    coloreSquadra?: string,
}

// Dati mostrati sul profilo del giocatore
export default interface PlayerInfoData {
    // Info principali del giocatore
    id: string,
    nome: string,
    cognome: string,
    dataNascita?: Date,
    linkFoto?: string,

    // Dettagli aggiuntivi del giocatore
    ruoloPrincipale?: playerRole,
    isCapitano?: boolean,
    nomeMaglia?: string,
    numeroMaglia?: number,
    nazionalita?: string,
    piedePreferito?: preferredFoot,
    altezza?: number,
    peso?: number,
    usernameIg?: string,

    // Dati aggregati da tabella "Squadra"
    idSquadra?: string,
    nomeSquadra?: string,
    linkStemmaSquadra?: string,
    coloreSquadra?: string,

    // Dati aggregati da tabella "Azione"
    numeroPartiteGiocate?: number,
    numeroGoal?: number,
    numeroAssist?: number,
    numeroCartelliniGialli?: number,
    numeroCartelliniRossi?: number,

    // Dati aggregati da altre tabelle
    numeroMVP?: number,
    trofeiOttenuti?: AwardData[],
}

export enum playerRole {
    T = "Tecnico",
    P = "Portiere",
    D = "Difensore",
    C = "Centrocampista",
    A = "Attaccante",
    N = "Nessun ruolo",
}

export enum preferredFoot {
    DX = "Destro",
    SX = "Sinistro",
    A = "Ambipiede",
}
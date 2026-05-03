import { PartitaDTO } from "@/types/partita";
import {sampleSquadre} from "@/sampleData/squadre";


export const samplePartite: PartitaDTO[] = [
    // Partita di sample
    {
        id: "11",
        girone: "Finale",
        giornata: 11,
        squadraCasa: sampleSquadre[0],
        squadraOspiti: sampleSquadre[1],
        esito: {
            goalCasa: 3,
            goalOspiti: 2,
        },
        fischioInizio: new Date("2025-07-05T20:30:00")
    },

    // Fixtures girone tesserati
    {
        id: "1",
        girone: "Girone A",
        giornata: 1,
        squadraCasa: sampleSquadre[0],
        squadraOspiti: sampleSquadre[4],
        esito: {
            goalCasa: 5,
            goalOspiti: 12
        },
        fischioInizio: new Date("2025-06-23T19:00:00")
    },
    {
        id: "2",
        girone: "Girone A",
        giornata: 1,
        squadraCasa: sampleSquadre[1],
        squadraOspiti: sampleSquadre[3],
        esito: {
            goalCasa: 4,
            goalOspiti: 4,
            rigoriCasa: 4,
            rigoriOspiti: 2,
        },
        fischioInizio: new Date("2025-06-23T21:00:00")
    },
    {
        id: "3",
        girone: "Girone A",
        giornata: 2,
        squadraCasa: sampleSquadre[2],
        squadraOspiti: sampleSquadre[0],
        esito: {
            goalCasa: 1,
            goalOspiti: 5,
        },
        fischioInizio: new Date("2025-06-24T20:00:00")
    },
    {
        id: "4",
        girone: "Girone A",
        giornata: 3,
        squadraCasa: sampleSquadre[1],
        squadraOspiti: sampleSquadre[2],
        esito: {
            goalCasa: 5,
            goalOspiti: 4,
        },
        fischioInizio: new Date("2025-06-25T19:00:00")
    },
    {
        id: "5",
        girone: "Girone A",
        giornata: 3,
        squadraCasa: sampleSquadre[3],
        squadraOspiti: sampleSquadre[4],
        esito: {
            goalCasa: 6,
            goalOspiti: 0,
        },
        fischioInizio: new Date("2025-06-25T21:00:00")
    },
    {
        id: "6",
        girone: "Girone A",
        giornata: 4,
        squadraCasa: sampleSquadre[0],
        squadraOspiti: sampleSquadre[1],
        esito: {
            goalCasa: 3,
            goalOspiti: 1,
        },
        fischioInizio: new Date("2025-06-26T21:00:00")
    },
    {
        id: "7",
        girone: "Girone A",
        giornata: 5,
        squadraCasa: sampleSquadre[2],
        squadraOspiti: sampleSquadre[3],
        esito: {
            goalCasa: 2,
            goalOspiti: 4,
        },
        fischioInizio: new Date("2025-06-27T20:00:00")
    },
    {
        id: "8",
        girone: "Girone A",
        giornata: 6,
        squadraCasa: sampleSquadre[0],
        squadraOspiti: sampleSquadre[3],
        esito: {
            vittoriaTavolino: true,
            goalCasa: 3,
            goalOspiti: 0,
        },
        fischioInizio: new Date("2025-06-27T19:00:00")
    },
    {
        id: "9",
        girone: "Girone A",
        giornata: 6,
        squadraCasa: sampleSquadre[4],
        squadraOspiti: sampleSquadre[1],
        esito: {
            goalCasa: 1,
            goalOspiti: 1,
            rigoriCasa: 4,
            rigoriOspiti: 5,
        },
        fischioInizio: new Date("2025-06-28T20:00:00")
    },
    {
        id: "10",
        girone: "Girone A",
        giornata: 7,
        squadraCasa: sampleSquadre[2],
        squadraOspiti: sampleSquadre[4],
        esito: {
            goalCasa: 9,
            goalOspiti: 1,
        },
        fischioInizio: new Date("2025-06-29T20:00:00")
    },
]
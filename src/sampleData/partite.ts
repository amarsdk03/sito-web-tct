import { PartitaDTO } from "@/types/partita";
import {sampleSquadre} from "@/sampleData/squadre";


export const samplePartite: PartitaDTO[] = [
    {
        id: "1",
        girone: "A",
        giornata: 1,
        squadraCasa: sampleSquadre[0],
        squadraOspite: sampleSquadre[4],
        esito: "5 - 2",
        dataSvolgimento: new Date("2025-06-23T19:00:00")
    },
    {
        id: "2",
        girone: "A",
        giornata: 1,
        squadraCasa: sampleSquadre[1],
        squadraOspite: sampleSquadre[3],
        esito: "2 - 2",
        dataSvolgimento: new Date("2025-06-23T21:00:00")
    },
    {
        id: "3",
        girone: "A",
        giornata: 2,
        squadraCasa: sampleSquadre[2],
        squadraOspite: sampleSquadre[0],
        esito: "1 - 5",
        dataSvolgimento: new Date("2025-06-24T20:00:00")
    },
    {
        id: "4",
        girone: "A",
        giornata: 3,
        squadraCasa: sampleSquadre[1],
        squadraOspite: sampleSquadre[2],
        esito: "5 - 4",
        dataSvolgimento: new Date("2025-06-25T19:00:00")
    },
    {
        id: "5",
        girone: "A",
        giornata: 3,
        squadraCasa: sampleSquadre[3],
        squadraOspite: sampleSquadre[4],
        esito: "6 - 0",
        dataSvolgimento: new Date("2025-06-25T21:00:00")
    },
    {
        id: "6",
        girone: "A",
        giornata: 4,
        squadraCasa: sampleSquadre[0],
        squadraOspite: sampleSquadre[1],
        esito: "3 - 1",
        dataSvolgimento: new Date("2025-06-26T21:00:00")
    },
    {
        id: "7",
        girone: "A",
        giornata: 5,
        squadraCasa: sampleSquadre[2],
        squadraOspite: sampleSquadre[3],
        esito: "2 - 4",
        dataSvolgimento: new Date("2025-06-27T20:00:00")
    },
    {
        id: "8",
        girone: "A",
        giornata: 6,
        squadraCasa: sampleSquadre[0],
        squadraOspite: sampleSquadre[3],
        esito: "3 - 0",
        dataSvolgimento: new Date("2025-06-27T19:00:00")
    },
    {
        id: "9",
        girone: "A",
        giornata: 6,
        squadraCasa: sampleSquadre[4],
        squadraOspite: sampleSquadre[1],
        esito: "1 - 1",
        dataSvolgimento: new Date("2025-06-28T20:00:00")
    },
    {
        id: "10",
        girone: "A",
        giornata: 7,
        squadraCasa: sampleSquadre[2],
        squadraOspite: sampleSquadre[4],
        esito: "9 - 1",
        dataSvolgimento: new Date("2025-06-29T20:00:00")
    },
]
import TeamInfoData, {SquadraDTO} from "@/types/squadra";
import {playerRole} from "@/types/player";

export const teamInfoSample: TeamInfoData[] = [
    {
        id: "0",
        nome: "Pink Gorillaz",
        acronimo: "PNK",
        linkStemma: "/temp/pink_gorillaz.png",
        colore: "#FD2F70",
        usernameIg: "pink_gorillaz",

        idCapitano: "0",
        nomeCapitano: "Simone Del Dot",
        annoIscrizione: new Date("2025-05-20"),
        numeroPartiteGiocate: 28,
        numeroVittorie: 18,
        numeroPareggi: 6,
        numeroSconfitte: 4,

        numeroGoalFatti: 28,
        numeroGoalSubiti: 16,
        numeroAssist: 17,
        numeroCartelliniGialli: 5,
        numeroCartelliniRossi: 1,

        formazioni: [
            {
                idTorneo: "1",
                nomeTorneo: "Edizione 2025/2026",
                formazione: [
                    {id: "1", nome: "Luca", cognome: "Bertolini", ruoloPrincipale: playerRole.T, isCapitano: false},
                    {id: "2", nome: "Tony", cognome: "Maggiano", ruoloPrincipale: playerRole.P, isCapitano: false},
                    {id: "2", nome: "Eccel", cognome: "Bianchi", ruoloPrincipale: playerRole.D, isCapitano: false},
                    {id: "3", nome: "Lorenzo", cognome: "Menapace", ruoloPrincipale: playerRole.D, isCapitano: false},
                    {id: "4", nome: "Simone", cognome: "Del Dot", ruoloPrincipale: playerRole.D, isCapitano: true},
                    {id: "5", nome: "Riccardo", cognome: "Malpaga", ruoloPrincipale: playerRole.D, isCapitano: false},
                    {id: "6", nome: "Riccardo", cognome: "Moser", ruoloPrincipale: playerRole.C, isCapitano: false},
                    {id: "7", nome: "Andrea", cognome: "Ciola", ruoloPrincipale: playerRole.C, isCapitano: false},
                    {id: "8", nome: "Fabiano", cognome: "Rospocher", ruoloPrincipale: playerRole.C, isCapitano: false},
                    {id: "9", nome: "Simone", cognome: "Bertoluzza", ruoloPrincipale: playerRole.A, isCapitano: false},
                    {id: "10", nome: "Roberto", cognome: "Pancheri", ruoloPrincipale: playerRole.A, isCapitano: false},
                    {id: "11", nome: "Marco", cognome: "Gottardi", ruoloPrincipale: playerRole.A, isCapitano: false}
                ]
            },
            {
                idTorneo: "2",
                nomeTorneo: "Edizione 2024/2025",
                formazione: [
                    {id: "1", nome: "Eccel", cognome: "Santoro", ruoloPrincipale: playerRole.A, isCapitano: false},
                    {id: "2", nome: "Maggiano", cognome: "Bianchi", ruoloPrincipale: playerRole.C, isCapitano: true},
                    {id: "3", nome: "Menapace", cognome: "Lorenzo", ruoloPrincipale: playerRole.D, isCapitano: false},
                    {id: "4", nome: "Del Dot", cognome: "Simone", ruoloPrincipale: playerRole.D, isCapitano: false},
                    {id: "5", nome: "Malpaga", cognome: "Riccardo", ruoloPrincipale: playerRole.P, isCapitano: false},
                    {id: "6", nome: "Moser", cognome: "Riccardo", ruoloPrincipale: playerRole.C, isCapitano: false},
                    {id: "7", nome: "Ciola", cognome: "Lorenzo", ruoloPrincipale: playerRole.A, isCapitano: false},
                    {id: "9", nome: "Bertoluzza", cognome: "Giovanni", ruoloPrincipale: playerRole.C, isCapitano: false},
                    {id: "10", nome: "Pancheri", cognome: "Lucio", ruoloPrincipale: playerRole.A, isCapitano: false},
                    {id: "11", nome: "Gottardi", cognome: "Marco", ruoloPrincipale: playerRole.D, isCapitano: false}
                ]
            },
        ]
    },

    // ⚪ MINIMAL TEAMS
    {
        id: "1",
        nome: "Trenthor",
        acronimo: "THR",
        idCapitano: "0",
        nomeCapitano: "Eccel Santoro",
        formazioni: [],
    },
    {
        id: "2",
        nome: "W.C.S. Ltd",
        acronimo: "WCS",
        idCapitano: "0",
        nomeCapitano: "Giuseppe Giorgi",
        formazioni: [],
    },
    {
        id: "3",
        nome: "Prometheus",
        acronimo: "PTH",
        idCapitano: "0",
        nomeCapitano: "Eccel Santoro",
        formazioni: [],
    },
    {
        id: "4",
        nome: "Bar Italia",
        acronimo: "BAR",
        idCapitano: "0",
        nomeCapitano: "Eccel Santoro",
        formazioni: [],
    },
    {
        id: "5",
        nome: "Travel Usman",
        acronimo: "USM",
        idCapitano: "0",
        nomeCapitano: "Eccel Santoro",
        formazioni: [],
    },
    {
        id: "6",
        nome: "Extreme Solar Group",
        acronimo: "ESG",
        idCapitano: "0",
        nomeCapitano: "Eccel Santoro",
        formazioni: [],
    },
];

export const sampleSquadre: SquadraDTO[] = [
    // Players finale amatori
    { id: "0", nome: "Pink Gorillaz", acronimo: "PNK", colore: "#FD2F70", logo: "/temp/pink_gorillaz.png" },
    { id: "1", nome: "Trenthor", acronimo: "THR", colore: "#003C71", logo: "/temp/trenthor.jpg" },

    // Girone tesserati
    { id: "2", nome: "W.C.S. Ltd", acronimo: "WCS", colore: "#e8c71a" },
    { id: "3", nome: "Prometheus", acronimo: "PTH", colore: "#000000" },
    { id: "4", nome: "Bar Italia", acronimo: "BAR" },
    { id: "5", nome: "Travel Usman", acronimo: "USM" },
    { id: "6", nome: "Extreme Solar Group", acronimo: "ESG" },
]
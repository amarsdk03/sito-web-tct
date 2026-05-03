import PlayerInfoData, {playerRole, preferredFoot} from "@/types/player";
import {awardsSample} from "@/sampleData/awards";

export const playerInfoSample: PlayerInfoData[] = [
    {
        id: "0",
        nome: "Simone",
        cognome: "Del Dot",
        dataNascita: new Date("1998-01-28"),

        ruoloPrincipale: playerRole.A,
        isCapitano: true,
        nomeMaglia: "Del Dot",
        numeroMaglia: 10,
        nazionalita: "ITA",
        piedePreferito: preferredFoot.DX,
        altezza: 180,
        peso: 75,
        usernameIg: "simonedeldot",

        idSquadra: "001",
        nomeSquadra: "Pink Gorillaz",
        linkStemmaSquadra: "/temp/pink_gorillaz.png",
        coloreSquadra: "#FD2F70",

        numeroPartiteGiocate: 12,
        numeroGoal: 8,
        numeroAssist: 3,
        numeroCartelliniGialli: 2,
        numeroCartelliniRossi: 0,

        numeroMVP: 5,
        trofeiOttenuti: [
            awardsSample[0],
            awardsSample[1],
            awardsSample[2],
            awardsSample[3],
        ],
    },
    {
        id: "1",
        nome: "Alessandro",
        cognome: "Rossi De Winter",

        idSquadra: "002",
        nomeSquadra: "Trenthor",
        linkStemmaSquadra: "/temp/trenthor.jpg",
    }
]

export const giocatoriSquadraHome = [
    "Eccel Santoro",
    "Maggiano Bianchi",
    "Menapace Lorenzo",
    "Del Dot Simone",
    "Malpaga Riccardo",
    "Moser Riccardo",
    "Ciola Lorenzo",
    "Rospocher Andrea",
    "Bertoluzza Giovanni",
    "Pancheri Lucio",
    "Gottardi Marco",
]

export const giocatoriSquadraAway = [
    "Simone Rossi",
    "Marco Bianchi",
    "Nicolò Fennato",
    "Luca Verdi",
    "Giuseppe Giorgi",
    "Emanuele De Santis Junior",
    "Federico Esposito",
    "Paolo Longhi",
    "Giuseppe Bianchi",
]
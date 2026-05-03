import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calcolaEta(dataDiNascita: Date) {
    const oggi = new Date();
    let eta = oggi.getFullYear() - dataDiNascita.getFullYear();

    // Adjust age based on the month and day
    const meseCorrente = oggi.getMonth();
    const giornoCorrente = oggi.getDate();
    const meseNascita = dataDiNascita.getMonth();
    const giornoNascita = dataDiNascita.getDate();

    if (meseCorrente < meseNascita || (meseCorrente === meseNascita && giornoCorrente < giornoNascita)) {
        eta--;
    }

    return eta;
}

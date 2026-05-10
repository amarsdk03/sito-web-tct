import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

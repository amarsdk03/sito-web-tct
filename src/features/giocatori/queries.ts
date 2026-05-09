"use server"

import {createClient} from '@/lib/supabase/client';
import {QueryData} from '@supabase/supabase-js';

const supabase = createClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const listaGiocatoriQuery = supabase
    .from('ricerca_giocatori')
    .select(`*`, { count: 'exact' });

export type listaGiocatoriType = QueryData<typeof listaGiocatoriQuery>[number];

export async function getListaGiocatori(
    searchParam: string | null,
    idTorneo: number,
    currentPage: number,
    resultsPerPage: number,
) {
    let query = supabase
        .from('ricerca_giocatori')
        .select(`*`, { count: 'exact' })
        .eq('id_torneo', idTorneo);

    if (searchParam && searchParam.trim().length > 0) {
        query = query.or(`g_nome.ilike.%${searchParam}%,g_cognome.ilike.%${searchParam}%`);
    }

    query = query
        .order('s_nome', {ascending: true})
        .order('g_nome', {ascending: true})
        .order('g_cognome', {ascending: true})
        .range(resultsPerPage * (currentPage - 1), (resultsPerPage * currentPage) - 1)
        .abortSignal(AbortSignal.timeout(20000));

    const { data, count, error } = await query;
    if (error) throw error;

    const result: listaGiocatoriType[] = data;
    return { result, count };
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const profiloGiocatoreQuery = supabase
    .from('giocatore')
    .select(`*`)
    .eq('id', 0)
    .maybeSingle();

export type profiloGiocatoreType = QueryData<typeof profiloGiocatoreQuery>;

export async function getProfiloGiocatore(idGiocatore: number) {
    const query = supabase
        .from('giocatore')
        .select(`*`)
        .eq('id', idGiocatore)
        .maybeSingle();

    const { data, error } = await query;
    if (error) throw error;

    return data;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const statisticheGiocatoreQuery = supabase
    .from('azioni_giocatori')
    .select(`*`)
    .eq('g_id', 0);

export type statisticheGiocatoreType = QueryData<typeof statisticheGiocatoreQuery>;

export async function getStatisticheGiocatore(idGiocatore: number) {
    const query = supabase
        .from('azioni_giocatori')
        .select(`*`)
        .eq('g_id', idGiocatore);

    const { data, error } = await query;
    if (error) throw error;

    return data;
}

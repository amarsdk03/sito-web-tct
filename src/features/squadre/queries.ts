"use server"

import {createClient} from '@/lib/supabase/client';
import {QueryData} from '@supabase/supabase-js';

const supabase = createClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const listaSquadreQuery = supabase
    .from('ricerca_squadre')
    .select(`
            t_id,
            t_nome,
            s_id,
            s_nome,
            s_id_capitano,
            s_acronimo,
            s_link_stemma,
            s_colore_squadra
        `);

export type listaSquadreType = QueryData<typeof listaSquadreQuery>[number];

export async function getListaSquadre(
    searchParam: string | null,
    idTorneo: number,
) {
    let query = supabase
        .from('ricerca_squadre')
        .select(`
            t_id,
            t_nome,
            s_id,
            s_nome,
            s_id_capitano,
            s_acronimo,
            s_link_stemma,
            s_colore_squadra
        `)
        .eq('t_id', idTorneo);

    if (searchParam && searchParam.trim().length > 0) {
        query = query.or(`s_nome.ilike.%${searchParam}%`);
    }

    query = query
        .order('s_nome', {ascending: true})
        .order('t_id', {ascending: false})
        .abortSignal(AbortSignal.timeout(20000));

    const { data, error } = await query;
    if (error) throw error;

    const result: listaSquadreType[] = data;
    return result;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const datiSquadraQuery = supabase
    .from('squadra')
    .select(`
            *,
            giocatore:id_capitano(
                id,
                nome,
                cognome
            )
        `)
    .eq('id', 0)
    .maybeSingle();

export type datiSquadraType = QueryData<typeof datiSquadraQuery>;

export async function getDatiSquadra(idSquadra: number) {
    const query = supabase
        .from('squadra')
        .select(`
            *,
            giocatore:id_capitano(
                id,
                nome,
                cognome
            )
        `)
        .eq('id', idSquadra)
        .maybeSingle();

    const { data, error } = await query;
    if (error) throw error;

    return data;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const statisticheSquadraQuery = supabase
    .from('azioni_partite')
    .select(`*`)
    .or(`p_id_squadra_casa.eq.0,p_id_squadra_ospite.eq.0`);

export type statisticheSquadraType = QueryData<typeof statisticheSquadraQuery>;

export async function getStatisticheSquadra(idSquadra: number) {
    const query = supabase
        .from('azioni_partite')
        .select(`*`)
        .or(`p_id_squadra_casa.eq.${idSquadra},p_id_squadra_ospite.eq.${idSquadra}`);

    const { data, error } = await query;
    if (error) throw error;

    return data;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formazioneSquadraQuery = supabase
    .from('iscrizione')
    .select(`
            *,
            giocatore(
                id,
                nome,
                cognome,
                is_capitano,
                ruolo_principale,
                link_foto,
                nome_maglia,
                numero_maglia
            )
        `)
    .eq('id_torneo', 0)
    .eq('id_squadra', 0);

export type formazioneSquadraType = QueryData<typeof formazioneSquadraQuery>;

export async function getFormazioneSquadra(idSquadra: number, idTorneo: number) {
    const query = supabase
        .from('iscrizione')
        .select(`
            *,
            giocatore(
                id,
                nome,
                cognome,
                is_capitano,
                ruolo_principale,
                link_foto,
                nome_maglia,
                numero_maglia
            )
        `)
        .eq('id_torneo', idTorneo)
        .eq('id_squadra', idSquadra);

    const { data, error } = await query;
    if (error) throw error;

    return data;
}


export async function getIdSquadraGiocatore(idGiocatore: number) {
    const query = supabase
        .from('iscrizione')
        .select(`id_squadra`)
        .eq('id_giocatore', idGiocatore)
        .order('id_torneo', {ascending: false})
        .limit(1)
        .maybeSingle();

    const { data, error } = await query;
    if (error) throw error;

    return data;
}

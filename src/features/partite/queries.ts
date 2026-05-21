"use server"

import {createClient} from '@/lib/supabase/client';
import {QueryData} from '@supabase/supabase-js';

const supabase = createClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const partiteSquadraQuery = supabase
    .from('partita')
    .select(`
            *,
            squadra_casa:id_squadra_casa(
                id,
                nome
            ),
            squadra_ospite:id_squadra_ospite(
                id,
                nome
            )
        `)
    .or(`id_squadra_casa.eq.0,id_squadra_ospite.eq.0`)
    .order('fischio_inizio', {ascending: true});

export type partiteSquadraType = QueryData<typeof partiteSquadraQuery>;

export async function getPartiteSquadra(idSquadra: number) {
    const query = supabase
        .from('partita')
        .select(`
            *,
            squadra_casa:id_squadra_casa(
                id,
                nome
            ),
            squadra_ospite:id_squadra_ospite(
                id,
                nome
            )
        `)
        .or(`id_squadra_casa.eq.${idSquadra},id_squadra_ospite.eq.${idSquadra}`)
        .order('fischio_inizio', {ascending: true});

    const { data, error } = await query;
    if (error) throw error;

    return data;
}



const listaCategorieQuery = supabase
    .from('lista_categorie')
    .select(`*`)
    .order('torneo_id', { ascending: false });

export type listaCategorieType = QueryData<typeof listaCategorieQuery>;

let cacheCategorie: (listaCategorieType | null) = null;

export async function getListaCategorie() {
    if (cacheCategorie) return cacheCategorie;

    const { data, error } = await listaCategorieQuery;
    if (error) throw error;

    cacheCategorie = data;
    return (data || []) as listaCategorieType;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const listaPartiteQuery = supabase
    .from('risultati_partite')
    .select(`*`)
    .order('fischio_inizio', { ascending: false });

export type listaPartiteType = QueryData<typeof listaPartiteQuery>;

export async function getListaPartite(
    idTorneo: number | null,
    idCategoria: string | null,
    valGirone: string | null
) {
    let query = supabase
        .from('risultati_partite')
        .select(`*`);

    if (idTorneo && idTorneo > 0) {
        query = query.eq('torneo_id', idTorneo);
    }

    if (idCategoria && Number.parseInt(idCategoria) > -1) {
        query = query.eq('categoria_id', Number.parseInt(idCategoria));
    }

    if (valGirone && valGirone.trim() !== '') {
        query = query.eq('girone', valGirone);
    }

    query = query.order('fischio_inizio', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    return (data || []) as listaPartiteType;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prossimiIncontriQuery = supabase
    .from('risultati_partite')
    .select(`*`)
    .eq('torneo_id', 0)
    .gte('fischio_inizio', 0)
    .order('fischio_inizio', { ascending: true })
    .limit(6);

export type prossimiIncontriType = QueryData<typeof prossimiIncontriQuery>;

export async function getProssimiIncontri(idTorneo: number, dateFilter: Date) {
    const query = supabase
        .from('risultati_partite')
        .select(`*`)
        .eq('torneo_id', idTorneo)
        .gte('fischio_inizio', dateFilter.toISOString())
        .order('fischio_inizio', { ascending: true })
        .limit(6);

    const { data, error } = await query;
    if (error) throw error;

    return (data || []) as prossimiIncontriType;
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const datiPartitaQuery = supabase
    .from('risultati_partite')
    .select(`*`)
    .eq('id_partita', 0)
    .maybeSingle();

export type datiPartitaType = QueryData<typeof datiPartitaQuery>;

export async function getDatiPartita(idPartita: number) {
    const query = supabase
        .from('risultati_partite')
        .select(`*`)
        .eq('id_partita', idPartita)
        .maybeSingle();

    const { data, error } = await query;
    if (error) throw error;

    return (data || []) as datiPartitaType;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const azioniPartitaQuery = supabase
    .from('azioni_partite')
    .select(`*`)
    .eq('p_id', 0);

export type azioniPartitaType = QueryData<typeof azioniPartitaQuery>;

export async function getAzioniPartita(idPartita: number) {
    const query = supabase
        .from('azioni_partite')
        .select(`*`)
        .eq('p_id', idPartita);

    const { data, error } = await query;
    if (error) throw error;

    const result: azioniPartitaType = data;
    return result;
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const datiCampoQuery = supabase
    .from('campo')
    .select(`*`)
    .eq('id', 0);

export type datiCampoType = QueryData<typeof datiCampoQuery>;

export async function getDatiCampo(idCampo: number) {
    const query = supabase
        .from('campo')
        .select(`*`)
        .eq('id', idCampo);

    const { data, error } = await query;
    if (error) throw error;

    const result: datiCampoType = data;
    return result;
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const contentPartitaQuery = supabase
    .from('partita')
    .select('highlights_yt, link_post_ig')
    .eq('id', 0);

export type contentPartitaType = QueryData<typeof contentPartitaQuery>;

export async function getContentPartita(idPartita: number) {
    const query = supabase
        .from('partita')
        .select('highlights_yt, link_post_ig')
        .eq('id', idPartita);

    const { data, error } = await query;
    if (error) throw error;

    const result: contentPartitaType = data;
    return result;
}

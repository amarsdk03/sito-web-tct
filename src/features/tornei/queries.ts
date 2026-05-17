"use server"

import {createClient} from '@/lib/supabase/client';
import {QueryData} from '@supabase/supabase-js';

const supabase = createClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const listaTorneiQuery = supabase
    .from('torneo')
    .select(`
            id,
            nome,
            descrizione,
            logo_torneo,
            data_inizio,
            data_fine,
            campo(
                id,
                nome,
                indirizzo,
                dettagli,
                link_google_maps
            )
        `);

export type listaTorneiType = QueryData<typeof listaTorneiQuery>;

let cacheTornei: (listaTorneiType | null) = null;

export async function getListaTornei() {
    if (cacheTornei) return cacheTornei;

    const query = supabase
        .from('torneo')
        .select(`
            id,
            nome,
            descrizione,
            logo_torneo,
            data_inizio,
            data_fine,
            campo(
                id,
                nome,
                indirizzo,
                dettagli,
                link_google_maps
            )
        `)
        .order('id', { ascending: false })
        .abortSignal(AbortSignal.timeout(20000));

    const { data, error } = await query;
    if (error) throw error;

    const result: listaTorneiType = data;
    cacheTornei = data;
    return result;
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const categorieClassificaQuery = supabase
    .from('categoria')
    .select("num_qualificate, num_playoff, num_eliminate")
    .eq('id', 0);

export type categorieClassificaType = QueryData<typeof categorieClassificaQuery>;

export async function getCategorieClassifica(idCategoria: number | null, idTorneo?: number) {
    let query = supabase
        .from('categoria')
        .select("num_qualificate, num_playoff, num_eliminate");

    if (idCategoria) {
        query = query.eq('id', idCategoria);
    } else if (idTorneo) {
        query = query.eq('id_torneo', idTorneo);
    }

    const { data, error } = await query;
    if (error) throw error;

    const result: categorieClassificaType = data || [{
        num_qualificate: 0,
        num_playoff: 0,
        num_eliminate: 0
    }];
    return result;
}

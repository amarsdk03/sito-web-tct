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

let torneiCache: (listaTorneiType | null) = null;

export async function getListaTornei() {
    if (torneiCache) return torneiCache;

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
    torneiCache = data;
    return result;
}

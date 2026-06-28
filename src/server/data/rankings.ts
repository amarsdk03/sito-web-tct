"use server";
import {createClient} from '@/lib/supabase/server';


export async function getListaTornei() {
    const supabase = await createClient();

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

    return data;
}

export type listaTorneiType = Awaited<
    ReturnType<typeof getListaTornei>
>;



export async function getDatiTorneo(idTorneo: number) {
    const supabase = await createClient();

    const query = supabase
        .from('torneo')
        .select(`*`)
        .eq('id', idTorneo)
        .maybeSingle();

    const { data, error } = await query;
    if (error) throw error;

    return data;
}

export type datiTorneoType = Awaited<
    ReturnType<typeof getDatiTorneo>
>;



export async function getCategorieClassifica(idCategoria: number | null, idTorneo?: number) {
    const supabase = await createClient();

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

    return data || [{
        num_qualificate: 0,
        num_playoff: 0,
        num_eliminate: 0
    }];
}

export type categorieClassificaType = Awaited<
    ReturnType<typeof getCategorieClassifica>
>;

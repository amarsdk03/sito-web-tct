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


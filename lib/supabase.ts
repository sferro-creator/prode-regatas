import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export const obtenerVotosPartido = async (partidoId: string) => {
  const { data, error } = await supabase
    .from('predicciones')
    .select(`
      goles_local,
      goles_visitante,
      jugador_partido,
      usuario_email,
      perfiles ( nombre ) 
    `)
    .eq('partido_id', partidoId);

  if (error) return [];
  return data || [];
};
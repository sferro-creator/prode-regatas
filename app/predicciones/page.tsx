'use client';
import { supabase } from '../../lib/supabase';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Partido {
  id: string;
  local: string;
  visitante: string;
  bandera_local: string;
  bandera_visitante: string;
  fecha: string;
  fecha_iso: string; 
  hora: string;
  grupo?: string;
  etapa: string;
  fase_nro?: number;
  jugadores: string[];
}

export default function Predicciones() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [pronosticos, setPronosticos] = useState<any>({});
  const [etapaActiva, setEtapaActiva] = useState('grupos');
  const [faseGruposActiva, setFaseGruposActiva] = useState(1);

  const fixture: Partido[] = [
    { id: '1', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO A', local: 'MÉXICO', bandera_local: '🇲🇽', visitante: 'SUDÁFRICA', bandera_visitante: '🇿🇦', fecha: '11 de Junio', fecha_iso: '2026-06-11', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '2', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO A', local: 'COREA DEL SUR', bandera_local: '🇰🇷', visitante: 'REP. CHECA', bandera_visitante: '🇨🇿', fecha: '11 de Junio', fecha_iso: '2026-06-11', hora: '23:00', jugadores: ['Heung-min Son', 'Kim Min-jae', 'Patrik Schick'] },
    { id: '19', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO J', local: 'ARGENTINA', bandera_local: '🇦🇷', visitante: 'ARGELIA', bandera_visitante: '🇩🇿', fecha: '16 de Junio', fecha_iso: '2026-06-16', hora: '22:00', jugadores: ['Lionel Messi', 'Julián Álvarez', 'Riyad Mahrez'] },
    { id: '72', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO J', local: 'JORDANIA', bandera_local: '🇯🇴', visitante: 'ARGENTINA', bandera_visitante: '🇦🇷', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '23:00', jugadores: ['Lionel Messi', 'Julián Álvarez'] },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('prode_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleChange = (partidoId: string, campo: string, valor: any) => {
    setPronosticos({
      ...pronosticos,
      [partidoId]: { ...pronosticos[partidoId], [campo]: valor }
    });
  };

 const guardarPrediccion = async (partidoId: string) => {
  const partidoInfo = fixture.find(f => f.id === partidoId);
  
  // 1. Verificamos que el partido exista
  if (!partidoInfo) {
    console.error("Partido no encontrado");
    return;
  }

  // 2. Verificamos el tiempo (10 min antes)
  const fechaP = new Date(`${partidoInfo.fecha_iso}T${partidoInfo.hora}:00`);
  const limite = new Date(fechaP.getTime() - 10 * 60000);
  
  if (new Date() > limite) {
    alert("❌ El tiempo para este partido expiró.");
    return;
  }

  setLoading(partidoId);
  const p = pronosticos[partidoId];

  try {
    // 3. El UPSERT: La clave está en el 'onConflict'
    const { error } = await supabase
      .from('predicciones')
      .upsert({
        usuario_email: user.mail,
        partido_id: partidoId,
        goles_local: p?.goles_local || 0,
        goles_visitante: p?.goles_visitante || 0,
        jugador_partido: p?.jugador_partido || ''
      }, { 
        // ESTO es lo que le dice a Supabase: "Si coinciden mail y partido, pisalo"
        onConflict: 'usuario_email, partido_id' 
      });

    if (error) throw error;
    alert(`✅ Pronóstico guardado/actualizado correctamente.`);
  } catch (err: any) {
    alert("Error: " + err.message);
  } finally {
    setLoading(null);
  }
};

  if (!user) return <div className="p-8 text-white text-center italic">Validando credenciales...</div>;

  const partidosFiltrados = fixture.filter(p => {
    if (etapaActiva !== 'grupos') return p.etapa === etapaActiva;
    return p.etapa === 'grupos' && p.fase_nro === faseGruposActiva;
  });

  const grupos = etapaActiva === 'grupos' 
    ? Array.from(new Set(partidosFiltrados.map(p => p.grupo || ''))) 
    : ['ELIMINACIÓN DIRECTA'];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-10 bg-[#001D4A] text-white font-sans">
      <header className="w-full max-w-6xl text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black text-[#F6C83E] uppercase tracking-tighter mb-8 italic">FIXTURE MUNDIAL</h1>
        
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar w-full max-w-4xl mx-auto">
          {['grupos', '16avos', '8avos', 'cuartos', 'semis', 'final'].map((e) => (
            <button
              key={e}
              onClick={() => setEtapaActiva(e)}
              className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border ${
                etapaActiva === e 
                ? 'bg-[#F6C83E] text-[#001D4A] border-[#F6C83E] shadow-[0_0_20px_rgba(246,200,62,0.3)]' 
                : 'bg-transparent text-slate-400 border-[#003C9E] hover:border-slate-400'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        {etapaActiva === 'grupos' && (
          <div className="flex justify-center gap-2 mt-8 mb-4 bg-[#002B71]/50 p-1 rounded-2xl w-fit mx-auto border border-[#003C9E]">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setFaseGruposActiva(num)}
                className={`px-8 py-3 rounded-xl font-black text-xs transition-all ${
                  faseGruposActiva === num 
                  ? 'bg-[#F6C83E] text-[#001D4A] shadow-lg' 
                  : 'bg-transparent text-slate-400 hover:text-white'
                }`}
              >
                FASE {num}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 items-start">
        {grupos.map((grupo) => (
          <section key={grupo} className="w-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-0.5 flex-1 bg-[#F6C83E]/20"></div>
              <h2 className="text-xl font-black text-[#F6C83E] tracking-[0.3em] uppercase italic">{grupo}</h2>
              <div className="h-0.5 flex-1 bg-[#F6C83E]/20"></div>
            </div>

            <div className="space-y-8">
              {partidosFiltrados
                .filter(p => (etapaActiva === 'grupos' ? p.grupo === grupo : true))
                .map((partido) => {
                  // --- CÁLCULO DE BLOQUEO ---
                  const fechaP = new Date(`${partido.fecha_iso}T${partido.hora}:00`);
                  const bloqueado = new Date() > new Date(fechaP.getTime() - 10 * 60000);

                  return (
                    <div key={partido.id} className="bg-[#002B71] p-6 rounded-4xl border border-[#003C9E] shadow-2xl relative overflow-hidden group">
                      <div className={`absolute top-0 right-8 px-4 py-1 rounded-b-xl text-[10px] font-black tracking-tighter ${bloqueado ? 'bg-red-600 text-white' : 'bg-[#F6C83E] text-[#001D4A]'}`}>
                        {bloqueado ? "CERRADO" : partido.hora}
                      </div>

                      <p className="text-[9px] text-slate-400 font-bold mb-6 tracking-widest uppercase">{partido.fecha}</p>
                      
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex-1 text-center">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-3xl">{partido.bandera_local}</span>
                            <p className="text-base font-bold uppercase tracking-tight">{partido.local}</p>
                          </div>
                          <input 
                            type="number" 
                            placeholder="0"
                            disabled={bloqueado}
                            className="w-16 h-16 bg-[#001D4A] border border-[#003C9E] rounded-2xl text-center text-3xl font-black focus:border-[#F6C83E] outline-none text-[#F6C83E] disabled:opacity-50"
                            onChange={(e) => handleChange(partido.id, 'goles_local', parseInt(e.target.value))}
                          />
                        </div>

                        <div className="text-lg font-black text-slate-500 mt-12 px-2 italic">VS</div>

                        <div className="flex-1 text-center">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <p className="text-base font-bold uppercase tracking-tight">{partido.visitante}</p>
                            <span className="text-3xl">{partido.bandera_visitante}</span>
                          </div>
                          <input 
                            type="number" 
                            placeholder="0"
                            disabled={bloqueado}
                            className="w-16 h-16 bg-[#001D4A] border border-[#003C9E] rounded-2xl text-center text-3xl font-black focus:border-[#F6C83E] outline-none text-[#F6C83E] disabled:opacity-50"
                            onChange={(e) => handleChange(partido.id, 'goles_visitante', parseInt(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-[#003C9E]/50">
                        <label className="text-[9px] font-bold text-[#F6C83E] uppercase block mb-2 tracking-[0.2em] ml-1">🌟 MVP DEL PARTIDO</label>
                        <select 
                          disabled={bloqueado}
                          className="w-full p-4 bg-[#001D4A] border border-[#003C9E] rounded-2xl text-sm outline-none focus:border-[#F6C83E] text-white appearance-none cursor-pointer disabled:opacity-50"
                          onChange={(e) => handleChange(partido.id, 'jugador_partido', e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Seleccioná al mejor jugador...</option>
                          {partido.jugadores.map((jugador, idx) => (
                            <option key={`${partido.id}-${idx}`} value={jugador} className="bg-[#002B71]">
                              {jugador}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button 
                        onClick={() => guardarPrediccion(partido.id)}
                        disabled={loading === partido.id || bloqueado}
                        className={`w-full mt-6 py-4 font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 ${
                          bloqueado 
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50' 
                            : 'bg-[#F6C83E] text-[#001D4A] hover:brightness-110'
                        }`}
                      >
                        {bloqueado ? "PERIODO FINALIZADO" : loading === partido.id ? "ENVIANDO..." : "CONFIRMAR PRONÓSTICO"}
                      </button>
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
      </div>

      <Link href="/" className="my-20 text-slate-500 hover:text-[#F6C83E] transition-colors text-[10px] uppercase font-black tracking-widest border-b border-transparent hover:border-[#F6C83E]">
        ← Volver al Panel Principal
      </Link>
    </main>
  );
}
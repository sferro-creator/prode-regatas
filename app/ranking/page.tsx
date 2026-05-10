'use client';
import { supabase } from '../../lib/supabase';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FilaRanking {
  usuario_email: string;
  total_puntos: number;
}

export default function Ranking() {
  const [lista, setLista] = useState<FilaRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function obtenerRanking() {
      try {
        // Llamamos directamente a la VISTA que creamos en SQL
        const { data, error } = await supabase
          .from('ranking')
          .select('*');

        if (error) throw error;
        setLista(data || []);
      } catch (err) {
        console.error("Error al cargar ranking:", err);
      } finally {
        setLoading(false);
      }
    }
    obtenerRanking();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-10 bg-[#001D4A] text-white font-sans">
      <header className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-[#F6C83E] uppercase tracking-tighter mb-4 italic">
          TABLA DE POSICIONES
        </h1>
        <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">
          Club de Regatas Bella Vista • Mundial 2026
        </p>
      </header>

      <div className="w-full max-w-2xl bg-[#002B71] rounded-4xl border border-[#003C9E] shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#003C9E]/50 border-b border-[#003C9E]">
              <th className="p-6 text-[#F6C83E] font-black text-[10px] uppercase tracking-widest">Puesto</th>
              <th className="p-6 text-[#F6C83E] font-black text-[10px] uppercase tracking-widest">Jugadora</th>
              <th className="p-6 text-[#F6C83E] font-black text-[10px] uppercase tracking-widest text-right">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-10 text-center text-slate-500 italic">Calculando posiciones...</td>
              </tr>
            ) : lista.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-10 text-center text-slate-500 italic">Todavía no hay partidos procesados.</td>
              </tr>
            ) : (
              lista.map((fila, index) => (
                <tr key={fila.usuario_email} className="border-b border-[#003C9E]/30 hover:bg-[#003C9E]/20 transition-colors">
                  <td className="p-6 font-black text-xl italic text-slate-400">
                    {index + 1}°
                  </td>
                  <td className="p-6">
                    <p className="font-bold text-sm text-white lowercase">
                      {fila.usuario_email.split('@')[0]}
                    </p>
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">
                      {fila.usuario_email}
                    </p>
                  </td>
                  <td className="p-6 text-right">
                    <span className="bg-[#F6C83E] text-[#001D4A] px-4 py-2 rounded-xl font-black text-lg">
                      {fila.total_puntos}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-12 flex flex-col items-center gap-6">
        <Link 
          href="/predicciones" 
          className="bg-[#F6C83E] text-[#001D4A] px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95"
        >
          Ir a mis predicciones
        </Link>
        
        <Link href="/" className="text-slate-500 hover:text-[#F6C83E] transition-colors text-[10px] uppercase font-black tracking-widest">
          ← Volver al Inicio
        </Link>
      </div>
    </main>
  );
}
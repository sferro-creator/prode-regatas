'use client';
import { supabase } from '../lib/supabase';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Usuario {
  nombre: string;
  mail: string;
  telefono: string;
}

export default function Home() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<Usuario>({ nombre: '', mail: '', telefono: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('prode_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('prode_user');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Log para ver qué estamos intentando mandar (solo lo ves vos en F12)
    console.log("Intentando registrar:", formData);

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ 
          nombre: formData.nombre, 
          email: formData.mail, // <--- REVISÁ: ¿En tu tabla dice 'email' o 'mail'?
          telefono: formData.telefono 
        }]);

      if (error) {
        // Esto nos va a decir si es un error de permisos o de nombre de tabla
        console.error("Error técnico de Supabase:", error);
        alert(`Error de base de datos: ${error.message} (Código: ${error.code})`);
      } else {
        localStorage.setItem('prode_user', JSON.stringify(formData));
        setUser(formData);
      }
    } catch (err: any) {
      alert("Error de conexión: No se pudo alcanzar el servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#001D4A] text-white">
        <div className="w-full max-w-md p-8 bg-[#002B71] rounded-3xl border border-[#003C9E] shadow-2xl text-center">
          <div className="w-24 h-24 relative mx-auto mb-6 rounded-full border-2 border-[#F6C83E] overflow-hidden bg-white">
            <Image src="/logo-regatas.jpg" alt="Logo" fill className="object-contain" />
          </div>
          <h2 className="text-2xl font-black text-[#F6C83E] mb-6 uppercase tracking-tighter">¡Bienvenido al PRODE!</h2>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input 
              type="text" placeholder="Nombre y Apellido" required
              className="w-full p-4 bg-[#001D4A] border border-[#003C9E] rounded-xl focus:border-[#F6C83E] outline-none text-white"
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
            <input 
              type="email" placeholder="Email" required
              className="w-full p-4 bg-[#001D4A] border border-[#003C9E] rounded-xl focus:border-[#F6C83E] outline-none text-white"
              onChange={(e) => setFormData({...formData, mail: e.target.value})}
            />
            <input 
              type="tel" placeholder="WhatsApp" required
              className="w-full p-4 bg-[#001D4A] border border-[#003C9E] rounded-xl focus:border-[#F6C83E] outline-none text-white"
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            />
            <button type="submit" disabled={loading} className="w-full py-5 bg-[#F6C83E] text-[#001D4A] font-black rounded-xl uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              {loading ? "REGISTRANDO..." : "EMPEZAR A JUGAR"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-[#001D4A] text-white text-center font-sans">
      <div className="w-32 h-32 relative mt-12 mb-6 p-1 rounded-full border-4 border-[#F6C83E] overflow-hidden bg-[#001D4A] shadow-xl">
        <Image src="/logo-regatas.jpg" alt="Escudo" fill className="object-cover" />
      </div>

      {/* Título con el degradado y la letra original recuperada */}
      <h1 
        className="text-6xl font-black tracking-tighter mb-4 uppercase"
        style={{
          background: 'linear-gradient(to right, #ffffff, #F6C83E, #ffffff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        PRODE MUNDIAL 2026
      </h1>

      <div className="h-1.5 w-40 bg-[#F6C83E] rounded-full mb-8 mx-auto shadow-lg"></div>
      
      <p className="text-[#F6C83E] font-semibold text-lg bg-[#002B71] px-6 py-2 rounded-full mb-12 shadow-inner inline-block">
        ¡Hola, {user.nombre.split(' ')[0]}! — Panel Oficial Club deRegatas Bella Vista
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl text-left">
        <Link href="/predicciones" className="p-10 bg-[#002B71] rounded-3xl border border-[#003C9E] hover:border-[#F6C83E] transition-all shadow-2xl group">
          <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform">⚽️</div>
          <h2 className="text-3xl font-bold mb-3 text-white">Mis Predicciones</h2>
          <p className="text-slate-400 text-sm italic">Cargá tus resultados para el Plantel Superior de Hockey.</p>
        </Link>
        <div className="p-10 bg-[#002B71]/40 rounded-3xl border border-[#003C9E] opacity-60">
          <div className="text-6xl mb-6 text-center">🏆</div>
          <h2 className="text-3xl font-bold mb-3 text-white">Ranking General</h2>
          <p className="text-slate-400 text-sm">Próximamente disponible.</p>
        </div>
      </div>

      <div className="mt-20 p-8 w-full max-w-6xl bg-[#001D4A]/50 rounded-3xl border border-[#003C9E] flex flex-col items-center justify-center text-center gap-4">
        <p className="text-sm text-[#F6C83E] font-black tracking-[0.2em] uppercase">PROYECTO PLANTEL SUPERIOR DE HOCKEY</p>
        <p className="text-lg text-white font-medium italic">PRO CANCHA DE AGUA • CRBV</p>
      </div>
    </main>
  );
}
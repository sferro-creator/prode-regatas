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
  hora: string;
  grupo?: string; // Opcional para playoffs
  etapa: string; // 'grupos', '16avos', '8avos', 'cuartos', 'semis', 'final'
  fase_nro?: number; // Para sub-etapas de grupos (1, 2, 3)
  jugadores: string[];
}

export default function Predicciones() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [pronosticos, setPronosticos] = useState<any>({});
  const [etapaActiva, setEtapaActiva] = useState('grupos');
  
  // NUEVO: Estado para controlar la Fase 1, 2 o 3 de grupos
  const [faseGruposActiva, setFaseGruposActiva] = useState(1);

  // CONFIGURACIÓN DEL FIXTURE TOTAL
  const fixture: Partido[] = [
    // --- FASE DE GRUPOS (Fase 1) ---
    { id: '1', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO A', local: 'MÉXICO', bandera_local: '🇲🇽', visitante: 'SUDÁFRICA', bandera_visitante: '🇿🇦', fecha: '11 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '2', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO A', local: 'COREA DEL SUR', bandera_local: '🇰🇷', visitante: 'REP. CHECA', bandera_visitante: '🇨🇿', fecha: '11 de Junio', hora: '23:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '3', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO B', local: 'CANADÁ', bandera_local: '🇨🇦', visitante: 'BOSNIA Y HERZEGOVINA', bandera_visitante: '🇧🇦', fecha: '12 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '4', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO D', local: 'ESTADOS UNIDOS', bandera_local: '🇺🇸', visitante: 'PARAGUAY', bandera_visitante: '🇵🇾', fecha: '12 de Junio', hora: '19:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '5', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO B', local: 'CATAR', bandera_local: '🇶🇦', visitante: 'SUIZA', bandera_visitante: '🇨🇭', fecha: '13 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '6', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO C', local: 'BRASIL', bandera_local: '🇧🇷', visitante: 'MARRUECOS', bandera_visitante: '🇲🇦', fecha: '13 de Junio', hora: '19:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '7', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO C', local: 'HAITÍ', bandera_local: '🇭🇹', visitante: 'ESCOCIA', bandera_visitante: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', fecha: '13 de Junio', hora: '22:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '8', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO D', local: 'AUSTRALIA', bandera_local: '🇦🇺', visitante: 'TURQUÍA', bandera_visitante: '🇹🇷', fecha: '14 de Junio', hora: '1:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '9', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO E', local: 'ALEMANIA', bandera_local: '🇩🇪', visitante: 'CURAZAO', bandera_visitante: '🇨🇼', fecha: '14 de Junio', hora: '14:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '10', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO F', local: 'PAISES BAJOS', bandera_local: '🇳🇱', visitante: 'JAPÓN', bandera_visitante: '🇯🇵', fecha: '14 de Junio', hora: '17:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '11', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO E', local: 'COSTA DE MARFIL', bandera_local: '🇨🇮', visitante: 'ECUADOR', bandera_visitante: '🇪🇨', fecha: '14 de Junio', hora: '20:00 hs', jugadores: ['Lionel Messi', 'Alexis Mac Allister', 'Alexander Isak'] },
    { id: '12', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO F', local: 'SUECIA', bandera_local: '🇸🇪', visitante: 'TÚNEZ', bandera_visitante: '🇹🇳', fecha: '14 de Junio', hora: '23:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '13', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO H', local: 'ESPAÑA', bandera_local: '🇪🇸', visitante: 'CABO VERDE', bandera_visitante: '🇨🇻', fecha: '15 de Junio', hora: '13:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '14', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO G', local: 'BÉLGICA', bandera_local: '🇧🇪', visitante: 'EGIPTO', bandera_visitante: '🇪🇬', fecha: '15 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '15', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO H', local: 'ARABIA SAUDITA', bandera_local: '🇸🇦', visitante: 'URUGUAY', bandera_visitante: '🇺🇾', fecha: '15 de Junio', hora: '19:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '16', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO G', local: 'IRÁN', bandera_local: '🇮🇷', visitante: 'NUEVA ZELANDA', bandera_visitante: '🇳🇿', fecha: '15 de Junio', hora: '22:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '17', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO I', local: 'FRANCIA', bandera_local: '🇫🇷', visitante: 'SENEGAL', bandera_visitante: '🇸🇳', fecha: '16 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '18', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO I', local: 'IRAK', bandera_local: '🇮🇶', visitante: 'NORUEGA', bandera_visitante: '🇳🇴', fecha: '16 de Junio', hora: '19:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '19', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO J', local: 'ARGENTINA', bandera_local: '🇦🇷', visitante: 'ARGELIA', bandera_visitante: '🇩🇿', fecha: '16 de Junio', hora: '22:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '20', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO J', local: 'AUSTRIA', bandera_local: '🇦🇹', visitante: 'JORDANIA', bandera_visitante: '🇯🇴', fecha: '17 de Junio', hora: '1:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '21', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO K', local: 'PORTUGAL', bandera_local: '🇵🇹', visitante: 'RD CONGO', bandera_visitante: '🇨🇩', fecha: '17 de Junio', hora: '14:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '22', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO L', local: 'INGLATERRA', bandera_local: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', visitante: 'CROACIA', bandera_visitante: '🇭🇷', fecha: '17 de Junio', hora: '17:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '23', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO L', local: 'GHANA', bandera_local: '🇬🇭', visitante: 'PANAMÁ', bandera_visitante: '🇵🇦', fecha: '17 de Junio', hora: '20:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '24', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO K', local: 'UZBEKISTÁN', bandera_local: '🇺🇿', visitante: 'COLOMBIA', bandera_visitante: '🇨🇴', fecha: '17 de Junio', hora: '23:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },

       // --- FASE DE GRUPOS (Fase 2) ---
    { id: '25', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO A', local: 'REP. CHECA', bandera_local: '🇨🇿', visitante: 'SUDÁFRICA', bandera_visitante: '🇿🇦', fecha: '18 de Junio', hora: '13:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '26', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO B', local: 'SUIZA', bandera_local: '🇨🇭', visitante: 'BOSNIA Y HERZEGOVINA', bandera_visitante: '🇧🇦', fecha: '18 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '27', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO B', local: 'CANADÁ', bandera_local: '🇨🇦', visitante: 'CATAR', bandera_visitante: '🇶🇦', fecha: '18 de Junio', hora: '19:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '28', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO A', local: 'COREA DEL SUR', bandera_local: '🇰🇷', visitante: 'MÉXICO', bandera_visitante: '🇲🇽', fecha: '18 de Junio', hora: '22:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '29', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO D', local: 'ESTADOS UNIDOS', bandera_local: '🇺🇸', visitante: 'AUSTRALIA', bandera_visitante: '🇦🇺', fecha: '19 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '30', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO C', local: 'ESCOCIA', bandera_local: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', visitante: 'MARRUECOS', bandera_visitante:'🇲🇦', fecha: '19 de Junio', hora: '19:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '31', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO C', local: 'BRASIL', bandera_local: '🇧🇷', visitante: 'HAITÍ', bandera_visitante: '🇭🇹', fecha: '19 de Junio', hora: '21:30 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '32', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO D', local: 'TURQUÍA', bandera_local: '🇹🇷', visitante: 'PARAGUAY', bandera_visitante: '🇵🇾', fecha: '20 de Junio', hora: '00:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '33', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO F', local: 'PAISES BAJOS', bandera_local: '🇳🇱', visitante: 'SUECIA', bandera_visitante: '🇸🇪', fecha: '20 de Junio', hora: '14:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '34', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO E', local: 'ALEMANIA', bandera_local: '🇩🇪', visitante: 'COSTA DE MARFIL', bandera_visitante: '🇨🇮', fecha: '20 de Junio', hora: '17:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '35', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO E', local: 'ECUADOR', bandera_local: '🇪🇨', visitante: 'CURAZAO', bandera_visitante: '🇨🇼', fecha: '20 de Junio', hora: '21:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '36', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO F', local: 'TÚNEZ', bandera_local: '🇹🇳', visitante: 'JAPÓN', bandera_visitante: '🇯🇵', fecha: '21 de Junio', hora: '1:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '37', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO H', local: 'ESPAÑA', bandera_local: '🇪🇸', visitante: 'ARABIA SAUDITA', bandera_visitante: '🇸🇦', fecha: '21 de Junio', hora: '13:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '38', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO G', local: 'BÉLGICA', bandera_local: '🇧🇪', visitante: 'IRÁN', bandera_visitante: '🇮🇷', fecha: '21 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '39', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO H', local: 'URUGUAY', bandera_local: '🇨🇺', visitante: 'CABO VERDE', bandera_visitante: '🇨🇻', fecha: '21 de Junio', hora: '19:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '40', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO G', local: 'NUEVA ZELANDA', bandera_local: '🇳🇿', visitante: 'EGIPTO', bandera_visitante: '🇪🇬', fecha: '21 de Junio', hora: '22:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '41', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO J', local: 'ARGENTINA', bandera_local: '🇦🇷', visitante: 'AUSTRIA', bandera_visitante: '🇦🇹', fecha: '22 de Junio', hora: '14:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '42', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO I', local: 'FRANCIA', bandera_local: '🇫🇷', visitante: 'IRAK', bandera_visitante: '🇮🇶', fecha: '22 de Junio', hora: '18:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '43', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO I', local: 'NORUEGA', bandera_local: '🇳🇴', visitante: 'SENEGAL', bandera_visitante: '🇸🇳', fecha: '22 de Junio', hora: '21:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '44', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO J', local: 'JORDANIA', bandera_local: '🇯🇴', visitante: 'ARGELIA', bandera_visitante: '🇩🇿', fecha: '23 de Junio', hora: '00:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '45', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO K', local: 'PORTUGAL', bandera_local: '🇵🇹', visitante: 'UZBEKISTÁN', bandera_visitante: '🇺🇿', fecha: '23 de Junio', hora: '14:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '46', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO L', local: 'INGLATERRA', bandera_local: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', visitante: 'GHANA', bandera_visitante: '🇬🇭', fecha: '23 de Junio', hora: '17:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '47', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO L', local: 'PANAMÁ', bandera_local: '🇵🇦', visitante: 'CROACIA', bandera_visitante: '🇭🇷', fecha: '23 de Junio', hora: '20:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '48', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO K', local: 'COLOMBIA', bandera_local: '🇨🇴', visitante: 'RD CONGO', bandera_visitante: '🇨🇩', fecha: '23 de Junio', hora: '23:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },

           // --- FASE DE GRUPOS (Fase 3) ---
    { id: '49', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO B', local: 'SUIZA', bandera_local: '🇨🇭', visitante: 'CANADÁ', bandera_visitante: '🇨🇦', fecha: '24 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '50', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO B', local: 'BOSNIA Y HERZEGOVINA', bandera_local: '🇧🇦', visitante: 'CATAR', bandera_visitante: '🇶🇦', fecha: '24 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '51', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO C', local: 'ESCOCIA', bandera_local: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', visitante: 'BRASIL', bandera_visitante: '🇧🇷', fecha: '24 de Junio', hora: '19:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '52', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO C', local: 'MARRUECOS', bandera_local: '🇲🇦', visitante: 'HAITÍ', bandera_visitante: '🇭🇹', fecha: '24 de Junio', hora: '19:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '53', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO A', local: 'REP. CHECA', bandera_local: '🇨🇿', visitante: 'MÉXICO', bandera_visitante: '🇲🇽', fecha: '24 de Junio', hora: '22:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '54', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO A', local: 'SUDAFRICA', bandera_local: '🇿🇦', visitante: 'COREA DEL SUR', bandera_visitante:'🇰🇷', fecha: '24 de Junio', hora: '22:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '55', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO E', local: 'CURAZAO', bandera_local: '🇨🇼', visitante: 'COSTA DE MARFIL', bandera_visitante: '🇨🇷', fecha: '25 de Junio', hora: '17:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '56', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO E', local: 'ECUADOR', bandera_local: '🇪🇨', visitante: 'ALEMANIA', bandera_visitante: '🇩🇪', fecha: '25 de Junio', hora: '17:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '57', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO F', local: 'JAPÓN', bandera_local: '🇯🇵', visitante: 'SUECIA', bandera_visitante: '🇸🇪', fecha: '25 de Junio', hora: '20:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '58', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO F', local: 'TÚNEZ', bandera_local: '🇹🇳', visitante: 'PAISES BAJOS', bandera_visitante: '🇳🇱', fecha: '25 de Junio', hora: '20:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '59', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO D', local: 'TURQUIA', bandera_local: '🇹🇷', visitante: 'ESTADOS UNIDOS', bandera_visitante: '🇺🇸', fecha: '25 de Junio', hora: '23:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '60', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO D', local: 'PARAGUAY', bandera_local: '🇵🇾', visitante: 'AUSTRALIA', bandera_visitante: '🇦🇺', fecha: '25 de Junio', hora: '23:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '61', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO I', local: 'NORUEGA', bandera_local: '🇳🇴', visitante: 'FRANCIA', bandera_visitante: '🇫🇷', fecha: '26 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '62', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO I', local: 'SENEGAL', bandera_local: '🇸🇳', visitante: 'IRAK', bandera_visitante: '🇮🇶', fecha: '26 de Junio', hora: '16:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '63', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO H', local: 'CABO VERDE', bandera_local: '🇨🇮', visitante: 'ARABIA SAUDITA', bandera_visitante: '🇸🇦', fecha: '26 de Junio', hora: '21:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '64', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO H', local: 'URUGUAY', bandera_local: '🇺🇾', visitante: 'ESPAÑA', bandera_visitante: '🇪🇸', fecha: '26 de Junio', hora: '21:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '65', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO G', local: 'EGIPTO', bandera_local: '🇪🇬', visitante: 'IRÁN', bandera_visitante: '🇮🇷', fecha: '27 de Junio', hora: '0:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '66', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO G', local: 'NUEVA ZELANDA', bandera_local: '🇳🇿', visitante: 'BÉLGICA', bandera_visitante: '🇧🇪', fecha: '27 de Junio', hora: '0:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '67', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO L', local: 'PANAMÁ', bandera_local: '🇵🇦', visitante: 'INGLATERRA', bandera_visitante: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fecha: '27 de Junio', hora: '18:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '68', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO L', local: 'CROACIA', bandera_local: '🇭🇷', visitante: 'GHANA', bandera_visitante: '🇬🇭', fecha: '27 de Junio', hora: '18:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '69', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO K', local: 'COLOMBIA', bandera_local: '🇨🇴', visitante: 'PORTUGAL', bandera_visitante: '🇵🇹', fecha: '27 de Junio', hora: '20:30 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '70', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO K', local: 'RD CONGO', bandera_local: '🇨🇩', visitante: 'UZBEKISTÁN', bandera_visitante: '🇺🇿', fecha: '27 de Junio', hora: '20:30 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '71', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO J', local: 'ARGELIA', bandera_local: '🇩🇿', visitante: 'AUSTRIA', bandera_visitante: '🇦🇹', fecha: '27 de Junio', hora: '23:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '72', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO J', local: 'JORDANIA', bandera_local: '🇯🇴', visitante: 'ARGENTINA', bandera_visitante: '🇦🇷', fecha: '27 de Junio', hora: '23:00 hs', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },

    // --- 16AVOS DE FINAL ---
    { id: '1001', etapa: '16avos', local: '1° GRUPO A', bandera_local: '🏳️', visitante: '2° GRUPO B', bandera_visitante: '🏳️', fecha: '28 de Junio', hora: '13:00 hs', jugadores: ['A definir'] },
    { id: '1002', etapa: '16avos', local: '1° GRUPO C', bandera_local: '🏳️', visitante: '2° GRUPO D', bandera_visitante: '🏳️', fecha: '28 de Junio', hora: '17:00 hs', jugadores: ['A definir'] },

    // --- 8AVOS DE FINAL ---
    { id: '2001', etapa: '8avos', local: 'GANADOR 1001', bandera_local: '🏳️', visitante: 'GANADOR 1002', bandera_visitante: '🏳️', fecha: '04 de Julio', hora: '13:00 hs', jugadores: ['A definir'] },

    // --- FINAL ---
    { id: '5001', etapa: 'final', local: 'A DEFINIR', bandera_local: '🏆', visitante: 'A DEFINIR', bandera_visitante: '🏆', fecha: '19 de Julio', hora: '16:00 hs', jugadores: ['A definir'] },
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
    setLoading(partidoId);
    const p = pronosticos[partidoId];
    try {
      const { error } = await supabase
        .from('predicciones')
        .insert([{
          usuario_email: user.mail,
          partido_id: partidoId,
          goles_local: p?.goles_local || 0,
          goles_visitante: p?.goles_visitante || 0,
          jugador_partido: p?.jugador_partido || ''
        }]);
      if (error) throw error;
      alert(`¡Pronóstico guardado!`);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(null);
    }
  };

  if (!user) return <div className="p-8 text-white text-center italic">Validando credenciales de socio...</div>;

  // NUEVO: Lógica de filtrado que contempla la Fase 1, 2 o 3 si estamos en grupos
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
        
        {/* NAVEGACIÓN DE ETAPAS */}
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

        {/* NUEVO: SOLAPAS FASE 1, 2, 3 (Solo se ven si etapaActiva === 'grupos') */}
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
        {partidosFiltrados.length > 0 ? (
          grupos.map((grupo) => (
            <section key={grupo} className="w-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-0.5 flex-1 bg-[#F6C83E]/20"></div>
                <h2 className="text-xl font-black text-[#F6C83E] tracking-[0.3em] uppercase italic">{grupo}</h2>
                <div className="h-0.5 flex-1 bg-[#F6C83E]/20"></div>
              </div>

              <div className="space-y-8">
                {partidosFiltrados
                  .filter(p => (etapaActiva === 'grupos' ? p.grupo === grupo : true))
                  .map((partido) => (
                  <div key={partido.id} className="bg-[#002B71] p-6 rounded-4xl border border-[#003C9E] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-8 bg-[#F6C83E] text-[#001D4A] px-4 py-1 rounded-b-xl text-[10px] font-black tracking-tighter">
                      {partido.hora}
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
                          className="w-16 h-16 bg-[#001D4A] border border-[#003C9E] rounded-2xl text-center text-3xl font-black focus:border-[#F6C83E] outline-none text-[#F6C83E]"
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
                          className="w-16 h-16 bg-[#001D4A] border border-[#003C9E] rounded-2xl text-center text-3xl font-black focus:border-[#F6C83E] outline-none text-[#F6C83E]"
                          onChange={(e) => handleChange(partido.id, 'goles_visitante', parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#003C9E]/50">
                      <label className="text-[9px] font-bold text-[#F6C83E] uppercase block mb-2 tracking-[0.2em] ml-1">🌟 MVP DEL PARTIDO</label>
                      <select 
                        className="w-full p-4 bg-[#001D4A] border border-[#003C9E] rounded-2xl text-sm outline-none focus:border-[#F6C83E] text-white appearance-none cursor-pointer"
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
                      disabled={loading === partido.id}
                      className="w-full mt-6 py-4 bg-[#F6C83E] text-[#001D4A] font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:brightness-110 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                    >
                      {loading === partido.id ? "ENVIANDO..." : "CONFIRMAR PRONÓSTICO"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="col-span-full text-center py-20 opacity-30 border-2 border-dashed border-[#003C9E] rounded-[40px]">
             <p className="text-xl font-bold uppercase tracking-widest italic">A definir tras fase de grupos</p>
          </div>
        )}
      </div>

      <Link href="/" className="my-20 text-slate-500 hover:text-[#F6C83E] transition-colors text-[10px] uppercase font-black tracking-widest border-b border-transparent hover:border-[#F6C83E]">
        ← Volver al Panel Principal
      </Link>
    </main>
  );
}
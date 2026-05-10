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
    { id: '3', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO B', local: 'CANADÁ', bandera_local: '🇨🇦', visitante: 'BOSNIA Y HERZEGOVINA', bandera_visitante: '🇧🇦', fecha: '12 de Junio', fecha_iso: '2026-06-12', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '4', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO D', local: 'ESTADOS UNIDOS', bandera_local: '🇺🇸', visitante: 'PARAGUAY', bandera_visitante: '🇵🇾', fecha: '12 de Junio', fecha_iso: '2026-06-12', hora: '22:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '5', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO B', local: 'CATAR', bandera_local: '🇶🇦', visitante: 'SUIZA', bandera_visitante: '🇨🇭', fecha: '13 de Junio', fecha_iso: '2026-06-13', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '6', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO C', local: 'BRASIL', bandera_local: '🇧🇷', visitante: 'MARRUECOS', bandera_visitante: '🇲🇦', fecha: '13 de Junio', fecha_iso: '2026-06-13', hora: '19:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '7', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO C', local: 'HAITÍ', bandera_local: '🇭🇹', visitante: 'ESCOCIA', bandera_visitante: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', fecha: '13 de Junio', fecha_iso: '2026-06-13', hora: '22:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '8', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO D', local: 'AUSTRALIA', bandera_local: '🇦🇺', visitante: 'TURQUIA', bandera_visitante: '🇹🇷', fecha: '14 de Junio', fecha_iso: '2026-06-14', hora: '1:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '9', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO E', local: 'ALEMANIA', bandera_local: '🇩🇪', visitante: 'CURAZAO', bandera_visitante: '🇨🇼', fecha: '14 de Junio', fecha_iso: '2026-06-14', hora: '14:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '10', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO F', local: 'PAISES BAJOS', bandera_local: '🇳🇱', visitante: 'JAPÓN', bandera_visitante: '🇯🇵', fecha: '14 de Junio', fecha_iso: '2026-06-14', hora: '17:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '11', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO E', local: 'COSTA DE MARFIL', bandera_local: '🇨🇮', visitante: 'ECUADOR', bandera_visitante: '🇪🇨', fecha: '14 de Junio', fecha_iso: '2026-06-14', hora: '20:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '12', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO F', local: 'SUECIA', bandera_local: '🇸🇪', visitante: 'TÚNEZ', bandera_visitante: '🇹🇳', fecha: '14 de Junio', fecha_iso: '2026-06-14', hora: '23:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '13', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO H', local: 'ESPAÑA', bandera_local: '🇪🇸', visitante: 'CABO VERDE', bandera_visitante: '🇨🇻', fecha: '15 de Junio', fecha_iso: '2026-06-15', hora: '13:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '14', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO G', local: 'BÉLGICA', bandera_local: '🇧🇪', visitante: 'EGIPTO', bandera_visitante: '🇪🇬', fecha: '15 de Junio', fecha_iso: '2026-06-15', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '15', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO H', local: 'ARABIA SAUDITA', bandera_local: '🇸🇦', visitante: 'URUGUAY', bandera_visitante: '🇺🇾', fecha: '15 de Junio', fecha_iso: '2026-06-15', hora: '19:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '16', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO G', local: 'IRÁN', bandera_local: '🇮🇷', visitante: 'NUEVA ZELANDA', bandera_visitante: '🇳🇿', fecha: '15 de Junio', fecha_iso: '2026-06-15', hora: '22:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '17', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO I', local: 'FRANCIA', bandera_local: '🇫🇷', visitante: 'SENEGAL', bandera_visitante: '🇸🇳', fecha: '16 de Junio', fecha_iso: '2026-06-16', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '18', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO I', local: 'IRAK', bandera_local: '🇮🇶', visitante: 'NORUEGA', bandera_visitante: '🇳🇴', fecha: '16 de Junio', fecha_iso: '2026-06-16', hora: '19:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '19', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO J', local: 'ARGENTINA', bandera_local: '🇦🇷', visitante: 'ARGELIA', bandera_visitante: '🇩🇿', fecha: '16 de Junio', fecha_iso: '2026-06-16', hora: '22:00', jugadores: ['Lionel Messi', 'Julián Álvarez', 'Riyad Mahrez'] },
    { id: '20', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO J', local: 'AUSTRIA', bandera_local: '🇦🇹', visitante: 'JORDANIA', bandera_visitante: '🇯🇴', fecha: '17 de Junio', fecha_iso: '2026-06-17', hora: '1:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '21', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO K', local: 'PORTUGAL', bandera_local: '🇵🇹', visitante: 'RD CONGO', bandera_visitante: '🇨🇩', fecha: '17 de Junio', fecha_iso: '2026-06-17', hora: '14:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '22', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO L', local: 'INGLATERRA', bandera_local: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', visitante: 'CROACIA', bandera_visitante: '🇭🇷', fecha: '17 de Junio', fecha_iso: '2026-06-17', hora: '17:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '23', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO L', local: 'GHANA', bandera_local: '🇬🇭', visitante: 'PANAMÁ', bandera_visitante: '🇵🇦', fecha: '17 de Junio', fecha_iso: '2026-06-17', hora: '20:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '24', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO K', local: 'UZBEKISTÁN', bandera_local: '🇺🇿', visitante: 'COLOMBIA', bandera_visitante: '🇨🇴', fecha: '17 de Junio', fecha_iso: '2026-06-17', hora: '23:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    
    { id: '25', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO A', local: 'REP CHECA', bandera_local: '🇨🇿', visitante: 'SUDÁFRICA', bandera_visitante: '🇿🇦', fecha: '18 de Junio', fecha_iso: '2026-06-18', hora: '13:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '26', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO B', local: 'SUIZA', bandera_local: '🇨🇭', visitante: 'BOSNIA Y HERZEGOVINA', bandera_visitante: '🇧🇦', fecha: '18 de Junio', fecha_iso: '2026-06-18', hora: '16:00', jugadores: ['Heung-min Son', 'Kim Min-jae', 'Patrik Schick'] },
    { id: '27', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO B', local: 'CANADÁ', bandera_local: '🇨🇦', visitante: 'CATAR', bandera_visitante: '🇶🇦', fecha: '18 de Junio', fecha_iso: '2026-06-18', hora: '19:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '28', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO A', local: 'COREA DEL SUR', bandera_local: '🇰🇷', visitante: 'MÉXICO', bandera_visitante: '🇲🇽', fecha: '18 de Junio', fecha_iso: '2026-06-18', hora: '22:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '29', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO D', local: 'ESTADOS UNIDOS', bandera_local: '🇺🇸', visitante: 'AUSTRALIA', bandera_visitante: '🇦🇺', fecha: '19 de Junio', fecha_iso: '2026-06-19', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '30', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO C', local: 'ESCOCIA', bandera_local: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', visitante: 'MARRUECOS', bandera_visitante: '🇲🇦', fecha: '19 de Junio', fecha_iso: '2026-06-19', hora: '19:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '31', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO C', local: 'BRASIL', bandera_local: '🇧🇷', visitante: 'HAITÍ', bandera_visitante: '🇭🇹', fecha: '19 de Junio', fecha_iso: '2026-06-19', hora: '21:30', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '32', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO D', local: 'TURQUÍA', bandera_local: '🇹🇷', visitante: 'PARAGUAY', bandera_visitante: '🇵🇾', fecha: '20 de Junio', fecha_iso: '2026-06-20', hora: '0:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '33', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO F', local: 'PAISES BAJOS', bandera_local: '🇳🇱', visitante: 'SUECIA', bandera_visitante: '🇸🇪', fecha: '20 de Junio', fecha_iso: '2026-06-20', hora: '14:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '34', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO E', local: 'ALEMANIA', bandera_local: '🇩🇪', visitante: 'COSTA DE MARFIL', bandera_visitante: '🇨🇮', fecha: '20 de Junio', fecha_iso: '2026-06-20', hora: '17:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '35', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO E', local: 'ECUADOR', bandera_local: '🇪🇨', visitante: 'CURAZAO', bandera_visitante: '🇨🇼', fecha: '20 de Junio', fecha_iso: '2026-06-20', hora: '21:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '36', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO F', local: 'TÚNEZ', bandera_local: '🇹🇳', visitante: 'JAPÓN', bandera_visitante: '🇯🇵', fecha: '21 de Junio', fecha_iso: '2026-06-21', hora: '1:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '37', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO H', local: 'ESPAÑA', bandera_local: '🇪🇸', visitante: 'ARABIA SAUDITA', bandera_visitante: '🇸🇦', fecha: '21 de Junio', fecha_iso: '2026-06-21', hora: '13:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '38', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO G', local: 'BÉLGICA', bandera_local: '🇧🇪', visitante: 'IRÁN', bandera_visitante: '🇮🇷', fecha: '21 de Junio', fecha_iso: '2026-06-21', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '39', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO H', local: 'URUGUAY', bandera_local: '🇺🇾', visitante: 'CABO VERDE', bandera_visitante: '🇨🇻', fecha: '21 de Junio', fecha_iso: '2026-06-21', hora: '19:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '40', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO G', local: 'NUEVA ZELANDA', bandera_local: '🇳🇿', visitante: 'EGIPTO', bandera_visitante: '🇪🇬', fecha: '21 de Junio', fecha_iso: '2026-06-21', hora: '22:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '41', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO J', local: 'ARGENTINA', bandera_local: '🇦🇷', visitante: 'AUSTRIA', bandera_visitante: '🇦🇹', fecha: '22 de Junio', fecha_iso: '2026-06-22', hora: '14:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '42', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO I', local: 'FRANCIA', bandera_local: '🇫🇷', visitante: 'IRAK', bandera_visitante: '🇮🇶', fecha: '22 de Junio', fecha_iso: '2026-06-22', hora: '18:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '43', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO I', local: 'NORUEGA', bandera_local: '🇦🇷', visitante: 'SENEGAL', bandera_visitante: '🇸🇳', fecha: '22', fecha_iso: '2026-06-22', hora: '21:00', jugadores: ['Lionel Messi', 'Julián Álvarez', 'Riyad Mahrez'] },
    { id: '44', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO J', local: 'JORDANIA', bandera_local: '🇯🇴', visitante: 'ARGELIA', bandera_visitante: '🇩🇿', fecha: '23 de Junio', fecha_iso: '2026-06-23', hora: '0:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '45', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO K', local: 'PORTUGAL', bandera_local: '🇵🇹', visitante: 'UZBEKISTÁN', bandera_visitante: '🇺🇿', fecha: '23 de Junio', fecha_iso: '2026-06-23', hora: '14:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '46', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO L', local: 'INGLATERRA', bandera_local: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', visitante: 'GHANA', bandera_visitante: '🇬🇭', fecha: '23 de Junio', fecha_iso: '2026-06-23', hora: '17:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '47', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO L', local: 'PANAMÁ', bandera_local: '🇵🇦', visitante: 'CROACIA', bandera_visitante: '🇭🇷', fecha: '23 de Junio', fecha_iso: '2026-06-23', hora: '20:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '48', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO K', local: 'COLOMBIA', bandera_local: '🇨🇴', visitante: 'RD CONGO', bandera_visitante: '🇨🇩', fecha: '23 de Junio', fecha_iso: '2026-06-23', hora: '23:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    
    { id: '49', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO B', local: 'SUIZA', bandera_local: '🇨🇭', visitante: 'CANADÁ', bandera_visitante: '🇨🇦', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '50', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO B', local: 'BOSNIA Y HERZEGOVINA', bandera_local: '🇧🇦', visitante: 'CATAR', bandera_visitante: '🇶🇦', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '16:00', jugadores: ['Heung-min Son', 'Kim Min-jae', 'Patrik Schick'] },
    { id: '51', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO C', local: 'ESCOCIA', bandera_local: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', visitante: 'BRASIL', bandera_visitante: '🇧🇷', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '19:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '52', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO C', local: 'MARRUECOS', bandera_local: '🇲🇦', visitante: 'HAITÍ', bandera_visitante: '🇭🇹', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '19:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '53', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO A', local: 'REP. CHECA', bandera_local: '🇨🇿', visitante: 'MÉXICO', bandera_visitante: '🇲🇽', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '22:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '54', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO A', local: 'SUDAFRICA', bandera_local: '🇿🇦', visitante: 'COREA DEL SUR', bandera_visitante: '🇰🇷', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '22:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '55', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO E', local: 'CURAZAO', bandera_local: '🇨🇼', visitante: 'COSTA DE MARFIL', bandera_visitante: '🇨🇮', fecha: '25 de Junio', fecha_iso: '2026-06-25', hora: '17:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '56', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO E', local: 'ECUADOR', bandera_local: '🇪🇨', visitante: 'ALEMANIA', bandera_visitante: '🇩🇪', fecha: '25', fecha_iso: '2026-06-25', hora: '17:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '57', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO F', local: 'JAPÓN', bandera_local: '🇯🇵', visitante: 'SUECIA', bandera_visitante: '🇸🇪', fecha: '25 de Junio', fecha_iso: '2026-06-25', hora: '20:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '58', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO F', local: 'TÚNEZ', bandera_local: '🇹🇳', visitante: 'PAISES BAJOS', bandera_visitante: '🇳🇱', fecha: '25 de Junio', fecha_iso: '2026-06-25', hora: '20:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '59', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO D', local: 'TURQUIA', bandera_local: '🇹🇷', visitante: 'ESTADOS UNIDOS', bandera_visitante: '🇺🇸', fecha: '25 de Junio', fecha_iso: '2026-06-25', hora: '23:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '60', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO D', local: 'PARAGUAY', bandera_local: '🇵🇾', visitante: 'AUSTRALIA', bandera_visitante: '🇦🇺', fecha: '25 de Junio', fecha_iso: '2026-06-25', hora: '23:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '61', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO I', local: 'NORUEGA', bandera_local: '🇳🇴', visitante: 'FRANCIA', bandera_visitante: '🇫🇷', fecha: '26 de Junio', fecha_iso: '2026-06-26', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '62', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO I', local: 'SENEGAL', bandera_local: '🇸🇳', visitante: 'IRAK', bandera_visitante: '🇮🇶', fecha: '26 de Junio', fecha_iso: '2026-06-26', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '63', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO H', local: 'CABO VERDE', bandera_local: '🇨🇻', visitante: 'ARABIA SAUDITA', bandera_visitante: '🇸🇦', fecha: '26', fecha_iso: '2026-06-26', hora: '21:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '64', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO H', local: 'URUGUAY', bandera_local: '🇺🇾', visitante: 'ESPAÑA', bandera_visitante: '🇪🇸', fecha: '26 de Junio', fecha_iso: '2026-06-26', hora: '21:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '65', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO G', local: 'EGIPTO', bandera_local: '🇪🇬', visitante: 'IRÁN', bandera_visitante: '🇮🇷', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '0:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '66', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO G', local: 'NUEVA ZELANDA', bandera_local: '🇳🇿', visitante: 'BÉLGICA', bandera_visitante: '🇧🇪', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '0:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '67', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO L', local: 'PANAMÁ', bandera_local: '🇵🇦', visitante: 'INGLATERRA', bandera_visitante: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '18:00', jugadores: ['Lionel Messi', 'Julián Álvarez', 'Riyad Mahrez'] },
    { id: '68', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO L', local: 'CROACIA', bandera_local: '🇭🇷', visitante: 'GHANA', bandera_visitante: '🇬🇭', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '18:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '69', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO K', local: 'COLOMBIA', bandera_local: '🇨🇴', visitante: 'PORTUGAL', bandera_visitante: '🇵🇹', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '20:30', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '70', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO K', local: 'RD CONGO', bandera_local: '🇨🇩', visitante: 'UZBEKISTÁN', bandera_visitante: '🇺🇿', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '20:30', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '71', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO J', local: 'ARGELIA', bandera_local: '🇩🇿', visitante: 'AUSTRIA', bandera_visitante: '🇦🇹', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '23:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '72', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO J', local: 'JORDANIA', bandera_local: '🇯🇴', visitante: 'ARGENTINA', bandera_visitante: '🇦🇷', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '23:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },

    { id: '1001', etapa: '16avos', local: '2A', bandera_local: '🏳️', visitante: '2B', bandera_visitante: '🏳️', fecha: '28 de Junio', fecha_iso: '2026-06-28', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] }, 
    { id: '1002', etapa: '16avos', local: '1C', bandera_local: '🏳️', visitante: '2F', bandera_visitante: '🏳️', fecha: '29 de Junio', fecha_iso: '2026-06-29', hora: '14:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1003', etapa: '16avos', local: '1E', bandera_local: '🏳️', visitante: '3ABCDF', bandera_visitante: '🏳️', fecha: '29 de Junio', fecha_iso: '2026-06-29', hora: '17:30', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1004', etapa: '16avos', local: '1F', bandera_local: '🏳️', visitante: '2C', bandera_visitante: '🏳️', fecha: '29 de Junio', fecha_iso: '2026-06-29', hora: '22:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1005', etapa: '16avos', local: '2E', bandera_local: '🏳️', visitante: '2I', bandera_visitante: '🏳️', fecha: '30 de Junio', fecha_iso: '2026-06-30', hora: '14:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1006', etapa: '16avos', local: '1I', bandera_local: '🏳️', visitante: '3CDFGH', bandera_visitante: '🏳️', fecha: '30 de Junio', fecha_iso: '2026-06-30', hora: '18:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1007', etapa: '16avos', local: '1A', bandera_local: '🏳️', visitante: '3CEFHI', bandera_visitante: '🏳️', fecha: '30 de Junio', fecha_iso: '2026-06-30', hora: '22:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1008', etapa: '16avos', local: '1L', bandera_local: '🏳️', visitante: '3EHIJK', bandera_visitante: '🏳️', fecha: '1 de Julio', fecha_iso: '2026-07-01', hora: '13:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1009', etapa: '16avos', local: '1G', bandera_local: '🏳️', visitante: '3AEHIJ', bandera_visitante: '🏳️', fecha: '1 de Julio', fecha_iso: '2026-07-01', hora: '17:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1010', etapa: '16avos', local: '1D', bandera_local: '🏳️', visitante: '3BEFIJ', bandera_visitante: '🏳️', fecha: '1 de Julio', fecha_iso: '2026-07-01', hora: '21:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },
    { id: '1011', etapa: '16avos', local: '1H', bandera_local: '🏳️', visitante: '2J', bandera_visitante: '🏳️', fecha: '2 de Julio', fecha_iso: '2026-07-02', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1012', etapa: '16avos', local: '2K', bandera_local: '🏳️', visitante: '2L', bandera_visitante: '🏳️', fecha: '2 de Julio', fecha_iso: '2026-07-02', hora: '20:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1013', etapa: '16avos', local: '1B', bandera_local: '🏳️', visitante: '3EFGIJ', bandera_visitante: '🏳️', fecha: '3 de Julio', fecha_iso: '2026-07-03', hora: '0:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1014', etapa: '16avos', local: '2D', bandera_local: '🏳️', visitante: '2G', bandera_visitante: '🏳️', fecha: '3 de Julio', fecha_iso: '2026-07-03', hora: '15:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1015', etapa: '16avos', local: '1J', bandera_local: '🏳️', visitante: '2H', bandera_visitante: '🏳️', fecha: '3 de Julio', fecha_iso: '2026-07-03', hora: '19:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '1016', etapa: '16avos', local: '1K', bandera_local: '🏳️', visitante: '3DEIJL', bandera_visitante: '🏳️', fecha: '3 de Julio', fecha_iso: '2026-07-03', hora: '22:30', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  

    { id: '2001', etapa: '8avos', local: '1001', bandera_local: '🏳️', visitante: '1002', bandera_visitante: '🏳️', fecha: '4 de Julio', fecha_iso: '2026-07-04', hora: '18:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '2002', etapa: '8avos', local: '1003', bandera_local: '🏳️', visitante: '1004', bandera_visitante: '🏳️', fecha: '4 de Julio', fecha_iso: '2026-07-04', hora: '14:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '2003', etapa: '8avos', local: '1005', bandera_local: '🏳️', visitante: '1006', bandera_visitante: '🏳️', fecha: '5 de Julio', fecha_iso: '2026-07-05', hora: '17:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '2004', etapa: '8avos', local: '1007', bandera_local: '🏳️', visitante: '1008', bandera_visitante: '🏳️', fecha: '5 de Julio', fecha_iso: '2026-07-05', hora: '21:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '2005', etapa: '8avos', local: '1009', bandera_local: '🏳️', visitante: '1010', bandera_visitante: '🏳️', fecha: '6 de Julio', fecha_iso: '2026-07-06', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '2006', etapa: '8avos', local: '1011', bandera_local: '🏳️', visitante: '1012', bandera_visitante: '🏳️', fecha: '6 de Julio', fecha_iso: '2026-07-06', hora: '21:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '2007', etapa: '8avos', local: '1013', bandera_local: '🏳️', visitante: '1014', bandera_visitante: '🏳️', fecha: '7 de Julio', fecha_iso: '2026-07-07', hora: '13:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '2008', etapa: '8avos', local: '1015', bandera_local: '🏳️', visitante: '1016', bandera_visitante: '🏳️', fecha: '7 de Julio', fecha_iso: '2026-07-07', hora: '17:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  

    { id: '3001', etapa: '4avos', local: '2001', bandera_local: '🏳️', visitante: '2002', bandera_visitante: '🏳️', fecha: '9 de Julio', fecha_iso: '2026-07-09', hora: '17:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '3002', etapa: '4avos', local: '2003', bandera_local: '🏳️', visitante: '2004', bandera_visitante: '🏳️', fecha: '10 de Julio', fecha_iso: '2026-07-10', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '3003', etapa: '4avos', local: '2005', bandera_local: '🏳️', visitante: '2006', bandera_visitante: '🏳️', fecha: '11 de Julio', fecha_iso: '2026-07-11', hora: '18:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '3004', etapa: '4avos', local: '2007', bandera_local: '🏳️', visitante: '2008', bandera_visitante: '🏳️', fecha: '11 de Julio', fecha_iso: '2026-07-11', hora: '22:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  

    { id: '4001', etapa: 'semis', local: '3001', bandera_local: '🏳️', visitante: '3002', bandera_visitante: '🏳️', fecha: '14 de Julio', fecha_iso: '2026-07-14', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '4002', etapa: 'semis', local: '3003', bandera_local: '🏳️', visitante: '3004', bandera_visitante: '🏳️', fecha: '15 de Julio', fecha_iso: '2026-07-15', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  

    { id: '5001', etapa: 'final', local: '4001', bandera_local: '🏳️', visitante: '4002', bandera_visitante: '🏳️', fecha: '19 de Julio', fecha_iso: '2026-07-19', hora: '16:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
    { id: '5002', etapa: 'final', local: '4001', bandera_local: '🏳️', visitante: '4002', bandera_visitante: '🏳️', fecha: '18 de Julio', fecha_iso: '2026-07-18', hora: '18:00', jugadores: ['Guillermo Ochoa', 'Edson Álvarez', 'Percy Tau'] },  
  ];

  const cargarMisPredicciones = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('predicciones')
        .select('partido_id, goles_local, goles_visitante, jugador_partido')
        .eq('usuario_email', email);

      if (error) throw error;

      if (data) {
        const prediccionesGuardadas = data.reduce((acc: any, curr: any) => {
          acc[curr.partido_id] = {
            goles_local: curr.goles_local,
            goles_visitante: curr.goles_visitante,
            jugador_partido: curr.jugador_partido
          };
          return acc;
        }, {});

        setPronosticos(prediccionesGuardadas);
      }
    } catch (err) {
      console.error("Error cargando predicciones:", err);
    }
  };
    useEffect(() => {
  const savedUser = localStorage.getItem('prode_user');
  if (savedUser) {
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    // Cargamos los datos de la base de datos automáticamente
    cargarMisPredicciones(parsedUser.mail);
  }
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
   // Si estamos en la solapa 'grupos', filtramos por fase (1, 2 o 3)
  if (etapaActiva === 'grupos') {
    return p.etapa === 'grupos' && p.fase_nro === faseGruposActiva;
  }
  // Si estamos en cualquier otra (16avos, 8avos, etc.), solo filtramos por la etapa
  return p.etapa === etapaActiva;
});

  const grupos = etapaActiva === 'grupos' 
    ? Array.from(new Set(partidosFiltrados.map(p => p.grupo || ''))) 
    : ['ELIMINACIÓN DIRECTA'];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-10 bg-[#001D4A] text-white font-sans"> 
    {/* --- NUEVA UBICACIÓN DEL BOTÓN --- */}
    <div className="w-full max-w-7xl flex justify-start mb-8">
      <Link 
        href="/" 
        className="flex items-center gap-2 text-slate-400 hover:text-[#F6C83E] transition-colors text-[11px] uppercase font-black tracking-[0.2em] group"
      >
        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> 
        Volver al Inicio
      </Link>
    </div>

      <header className="w-full max-w-6xl text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black text-[#F6C83E] uppercase tracking-tighter mb-8 italic">FIXTURE MUNDIAL</h1>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
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
                      {/* CARTEL DE ESTADO Y HORA MÁS GRANDE */}
                      <div className={`absolute top-0 right-8 px-6 py-2 rounded-b-2xl text-sm font-black tracking-widest shadow-md ${
                        bloqueado ? 'bg-red-600 text-white' : 'bg-[#F6C83E] text-[#001D4A]'
                      }`}>
                        {bloqueado ? "CERRADO" : `${partido.hora} HS`}
                      </div>

                      <p className="text-sm text-slate-400 font-black mb-4 tracking-widest uppercase italic">
                        {partido.fecha} 
                      </p>
                      
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
                            value={pronosticos[partido.id]?.goles_local ?? ''}
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
                            value={pronosticos[partido.id]?.goles_visitante ?? ''}
                            className="w-16 h-16 bg-[#001D4A] border border-[#003C9E] rounded-2xl text-center text-3xl font-black focus:border-[#F6C83E] outline-none text-[#F6C83E] disabled:opacity-50"
                            onChange={(e) => handleChange(partido.id, 'goles_visitante', parseInt(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-[#003C9E]/50">
                        <label className="text-[10px] font-bold text-[#F6C83E] uppercase block mb-2 tracking-[0.2em] ml-1">🌟 MVP DEL PARTIDO</label>
                        <select 
                          disabled={bloqueado}
                          // USAMOS EL PLAN B: si no hay nada, que sea un string vacío ""
                          value={pronosticos[partido.id]?.jugador_partido ?? ""} 
                          className="..."
                          onChange={(e) => handleChange(partido.id, 'jugador_partido', e.target.value)}
                        >
                          <option value="">Seleccionar MVP</option>
                          {partido.jugadores.map(j => (
                            <option key={j} value={j}>{j}</option>
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
    </main>
  );
}
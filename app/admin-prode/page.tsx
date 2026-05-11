'use client';
import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Usamos el mismo fixture que tenés en predicciones (copia los partidos aquí)
const fixture = [
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

export default function AdminPanel() {
  const [loading, setLoading] = useState<string | null>(null);
  const [resultados, setResultados] = useState<any>({});

  const handleChange = (partidoId: string, campo: string, valor: any) => {
    setResultados({
      ...resultados,
      [partidoId]: { ...resultados[partidoId], [campo]: valor }
    });
  };

  const guardarResultadoOficial = async (partidoId: string) => {
    setLoading(partidoId);
    const res = resultados[partidoId];

    try {
      const { error } = await supabase
        .from('resultados_reales')
        .upsert({
          partido_id: partidoId,
          goles_local_real: parseInt(res.goles_local) || 0,
          goles_visitante_real: parseInt(res.goles_visitante) || 0,
          mvp_real: res.mvp || ''
        }, { onConflict: 'partido_id' });

      if (error) throw error;
      alert("✅ Resultado oficial guardado. ¡Ranking actualizado!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-[#001D4A] text-white">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-[#F6C83E] font-bold uppercase text-xs tracking-widest hover:underline">
          ← Volver al inicio
        </Link>
        
        <h1 className="text-4xl font-black my-8 text-[#F6C83E] italic uppercase">Panel de Control</h1>
        <p className="mb-12 text-slate-400 font-medium">Cargá los resultados oficiales para calcular los puntos de todas las jugadoras.</p>

        <div className="space-y-6">
          {fixture.map((p) => (
            <div key={p.id} className="bg-[#002B71] p-6 rounded-3xl border border-[#003C9E] flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 font-bold">
                <span className="text-[#F6C83E] block text-[10px] mb-1">PARTIDO #{p.id}</span>
                {p.local} vs {p.visitante}
              </div>

              <div className="flex gap-4 items-center">
                <input 
                  type="number" placeholder="L" 
                  className="w-14 h-14 bg-[#001D4A] border border-[#003C9E] rounded-xl text-center font-black text-xl text-[#F6C83E]"
                  onChange={(e) => handleChange(p.id, 'goles_local', e.target.value)}
                />
                <span className="text-slate-500">-</span>
                <input 
                  type="number" placeholder="V" 
                  className="w-14 h-14 bg-[#001D4A] border border-[#003C9E] rounded-xl text-center font-black text-xl text-[#F6C83E]"
                  onChange={(e) => handleChange(p.id, 'goles_visitante', e.target.value)}
                />
              </div>

              <select 
                className="bg-[#001D4A] border border-[#003C9E] p-3 rounded-xl text-sm font-bold flex-1"
                onChange={(e) => handleChange(p.id, 'mvp', e.target.value)}
              >
                <option value="">MVP Oficial</option>
                {p.jugadores.map(j => <option key={j} value={j}>{j}</option>)}
              </select>

              <button 
                onClick={() => guardarResultadoOficial(p.id)}
                disabled={loading === p.id}
                className="bg-[#F6C83E] text-[#001D4A] px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 disabled:opacity-50"
              >
                {loading === p.id ? "GUARDANDO..." : "CARGAR"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
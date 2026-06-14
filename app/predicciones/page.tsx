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

const ModalComparador = ({ partido, onClose }: { partido: any, onClose: () => void }) => {
  const [votos, setVotos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true); // ← agregá esta línea
  
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);

      const { data: predicciones, error } = await supabase
        .from('predicciones')
        .select('goles_local, goles_visitante, usuario_email, jugador_partido')
        .eq('partido_id', partido.id);

      if (error) { console.error(error); setCargando(false); return; }

      // Traemos los nombres de todos los emails encontrados
      const emails = predicciones?.map(p => p.usuario_email) || [];
      const { data: perfiles } = await supabase
        .from('usuarios')
        .select('email, nombre')
        .in('email', emails);

      // Combinamos
      const votosConNombre = predicciones?.map(p => ({
        ...p,
        nombre: perfiles?.find(perf => perf.email === p.usuario_email)?.nombre 
                || p.usuario_email.split('@')[0]
      })) || [];

      setVotos(votosConNombre);
      setCargando(false);
    };
    cargar();
  }, [partido.id]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      {/* AGREGADO: max-h-[90vh] y flex flex-col para controlar la altura en el celu */}
      <div className="bg-[#002B71] p-6 rounded-3xl w-full max-w-md border border-[#F6C83E] flex flex-col max-h-[90vh]">
        <div className="flex justify-between mb-4 shrink-0">
          <h3 className="font-black text-[#F6C83E] uppercase italic">¿Qué votaron las demás?</h3>
          <button onClick={onClose} className="text-white">✕</button>
        </div>
        
        {/* AGREGADO: overflow-y-auto y pr-1 para que scrollée acá adentro de manera prolija */}
        <div className="space-y-4 mt-4 overflow-y-auto pr-1 flex-1">
            {votos.length > 0 ? (
              votos.map((v, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between bg-[#001D4A] p-4 rounded-2xl border border-[#003C9E]/50 shadow-inner"
                >
                  {/* Lado Izquierdo: Nombre del jugador */}
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#F6C83E] font-black uppercase tracking-widest mb-0.5">
                      JUGADOR
                    </span>
                    <span className="font-bold text-white text-sm uppercase tracking-tight">
                      {v.nombre}
                    </span>
                      {v.jugador_partido && <span className="text-[9px] text-slate-400 mt-1 italic">🌟 {v.jugador_partido}</span>}
                  </div>

                  {/* Lado Derecho: Resultado destacado */}
                  <div className="flex items-center gap-3 bg-[#002B71] px-4 py-2 rounded-xl border border-[#003C9E]">
                    <span className="text-xl font-black text-[#F6C83E]">{v.goles_local}</span>
                    <span className="text-[10px] font-black text-slate-500 italic">VS</span>
                    <span className="text-xl font-black text-[#F6C83E]">{v.goles_visitante}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-10 italic text-sm">
                Aún no hay predicciones para este partido.
              </p>
            )}
          </div>
        </div>
      </div>
  );
};

export default function Predicciones() {
  const [partidoParaComparar, setPartidoParaComparar] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [pronosticos, setPronosticos] = useState<any>({});
  const [etapaActiva, setEtapaActiva] = useState('grupos');
  const [faseGruposActiva, setFaseGruposActiva] = useState(1);

  const fixture: Partido[] = [
    { id: '1', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO A', local: 'MÉXICO', bandera_local: '🇲🇽', visitante: 'SUDÁFRICA', bandera_visitante: '🇿🇦', fecha: '11 de Junio', fecha_iso: '2026-06-11', hora: '16:00', jugadores: ['Raúl Rangel', 'Carlos Acevedo', 'Guillermo Ochoa', 'César Montes', 'Johan Vásquez', 'Mateo Chávez', 'Jesús Gallardo', 'Israel Reyes', 'Jorge Sánchez', 'Erik Lira', 'Luis Romo', 'Obed Vargas', 'Brian Gutiérrez', 'Oberlín Pineda', 'Edson Álvarez', 'Gilberto Mora', 'César Huerta', 'Álvaro Fidalgo', 'Luis Chávez', 'Roberto Alvarado', 'Alexis Vega', 'Julián Quiñones', 'Santiago Gimenez', 'Guillermo Martínez', 'Armando González', 'Raúl Jiménez',
         'Ronwen Williams', 'Ricardo Goss', 'Sipho Chaine', 'Khuliso Mudau', 'Olwethu Makhanya', 'Bradley Cross', 'Aubrey Modiba', 'Thabang Matuludi', 'Nkosinathi Sibisi', 'Ime Okon', 'Samukele Kabini', 'Mbekezeli Mbokazi', 'Kamolego Sebelebele', 'Khulumani Ndamane', 'Teboho Mokoena', 'Thalente Mbatha', 'Jayden Adams', 'Shephelo Sithole', 'Oswin Appollis', 'Tshepang Moremi', 'Evidence Makgopa', 'Lyle Foster', 'Ioraam Rayners', 'Relebohile Mofokeng', 'Themba Zawne', 'Thapelo Maseko'] },
    { id: '2', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO A', local: 'COREA DEL SUR', bandera_local: '🇰🇷', visitante: 'REP. CHECA', bandera_visitante: '🇨🇿', fecha: '11 de Junio', fecha_iso: '2026-06-11', hora: '23:00', jugadores: ['Son Heung-Min', 'Kim Min-jae', 'Cho Gue-sung', 'Hwang In-beom', 'Jo Hyeon-woo', 'Lee Jae-sung', 'Paik Seung-ho', 'Oh Hyeon-gyu', 'Seol Young-woo', 'Kim Seung-Gyu', 'Song Bum-keun', 'Kim Moon-hwan', 'Kim Tae-hyeon', 'Park Jin-seop', 'Jens Castrop', 'Lee Ki-hyuk', 'Lee Tae-seok', 'Lee Han-beom', 'Cho Yu-min', 'Kim Jin-gyu', 'Jun-Ho Bae', 'Yang Hyun-jun', 'Eom Ji-sung', 'Lee Kang-in', 'Lee Dong-gyeong', 'Hwang Hee-chan',
         'Jindřich Staněk', 'Matěj Kovář', 'Lukáš Horníček', 'Vladimír Coufal', 'Tomáš Holeš', 'David Jurásek', 'Jaroslav Zelený', 'Ladislav Krejčí', 'Štěpán Chaloupek', 'Robin Hranáč', 'David Douděra', 'David Zima', 'Tomáš Souček', 'Lukáš Provod', 'Michal Sadílek', 'Pavel Šulc', 'Vladimír Darida', 'Alexandr Sojka', 'Lukáš Červ', 'Tomáš Ladra', 'Hugo Sochurek', 'Pavel Bucha', 'Denis Višinský', 'Tomáš Chorý', 'Patrik Schick', 'Mojmír Chytil', 'Jan Kuchta', 'Christophe Kabongo', 'Adam Hložek'] },
    { id: '3', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO B', local: 'CANADÁ', bandera_local: '🇨🇦', visitante: 'BOSNIA Y HERZEGOVINA', bandera_visitante: '🇧🇦', fecha: '12 de Junio', fecha_iso: '2026-06-12', hora: '16:00', jugadores: ['Maxime Crépeau', 'Owen Goodman', 'Dayne St. Claire', 'Moïse Bombito', 'Derek Cornelius', 'Alphonso Davies', 'Luc de Fougerolles', 'Alistair Johnston', 'Alfie Jones', 'Richie Laryea', 'Niko Sigur', 'Joel Waterman', 'Ali Ahmed', 'Tajon Buchanan', 'Mathieu Choinière', 'Stephen Eustáquio', 'Marcelo Flores', 'Ismaël Koné', 'Liam Millar', 'Jonathan Osorio', 'Nathan Saliba', 'Jacob Shaffelburg', 'Jonathan David', 'Promise David', 'Cyle Larin', 'Tani Oluwaseyi',
         'Edin Džeko', 'Sead Kolašinac', 'Ermedin Demirovic', 'Amar Dedić', 'Benjamin Tahirović', 'Nikola Vasilj', 'Martin Zlomislić', 'Osman Hadžikić', 'Nihad Mujakić', 'Nikola Katić', 'Tarik Muharemović', 'Stjepan Radeljić', 'Dennis Hadžikadunić', 'Nidal Čelik', 'Amir Hadžiahmetović', 'Ivan Šunjić', 'Ivan Bašić', 'Dženis Burnić', 'Ermin Mahmić', 'Amar Memić', 'Armin Gigović', 'Kerim Alajbegović', 'Esmir Bajraktarević', 'Jovo Lukić', 'Samed Baždar', 'Haris Tabaković'] },
    { id: '4', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO D', local: 'ESTADOS UNIDOS', bandera_local: '🇺🇸', visitante: 'PARAGUAY', bandera_visitante: '🇵🇾', fecha: '12 de Junio', fecha_iso: '2026-06-12', hora: '22:00', jugadores: ['Matt Freese', 'Matt Turner', 'Chris Brady', 'Max Arfsten', 'Sergiño Dest', 'Alex Freeman', 'Mark McKenzie', 'Tim Ream', 'Chris Richards', 'Antonee Robinson', 'Miles Robinson', 'Joe Scally', 'Auston Trusty', 'Tyler Adams', 'Sebastian Berhalter', 'Weston McKennie', 'Cristian Roldán', 'Brenden Aaronson', 'Christian Pulisic', 'Gio Reyna', 'Malik Tillman', 'Tim Weah', 'Alejandro Zendejas', 'Folarin Balogun', 'Ricardo Pepi', 'Haji Wright',
      'Orlando Gill', 'Roberto Jr. Fernández', 'Gastón Olveira', 'Juan José Cáceres', 'José Canale', 'Fabián Balbuena', 'Omar Alderete', 'Gustavo Gómez', 'Alexandro Maidana', 'Junior Alonso', 'Gustavo Velázquez', 'Braian Ojeda', 'Damián Bobadilla', 'Andrés Cubas', 'Diego Gómez Gómez', 'Alejandro Romero Gamarra', 'Mauricio Prado', 'Matías Galarza', 'Ramón Sosa', 'Gustavo Caballero', 'Miguel Almirón', 'Gabriel Ávalos', 'Isidro Pitta', 'Álex Arce', 'Julio Enciso', 'Antonio Sanabria'] },
    { id: '5', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO B', local: 'CATAR', bandera_local: '🇶🇦', visitante: 'SUIZA', bandera_visitante: '🇨🇭', fecha: '13 de Junio', fecha_iso: '2026-06-13', hora: '16:00', jugadores: ['Mahmoud Abunada', 'Meshaal Barsham', 'Salah Zakaria', 'Lucas Mendes', 'Issa Laye', 'Pedro Miguel', 'Al-Hashmi Al-Hussain', 'Boualem Khoukhi', 'Homam Ahmed Al-Amin', 'Sultan Al-Brake', 'Ayoub Al-Oui', 'Jassem Gaber', 'Mohamed Al-Mannai', 'Assim Madibo', 'Ahmed Fathi', 'Karim Bouadiaf', 'Abdulaziz Hatem', 'Hassan Al-Haydos', 'Akram Afif', 'Edmílson Júnior', 'Yusuf Abdurisag', 'Tahsin Jamshid', 'Ahmed Al-Ganehi', 'Almoez Ali', 'Ahmed Alaa’eldin', 'Mohammed Muntari',
         'Granit Xhaka', 'Manuel Akanji', 'Breel Embolo', 'Gregor Kobel', 'Remo Freuler', 'Ruben Vargas', 'Dan Ndoye', 'Zeki Amdouni', 'Michel Aebischer', 'Denis Zakaria', 'Silvan Widmer', 'Ricardo Rodríguez', 'Noah Okafor', 'Marvin Keller', 'Yvon Mvogo', 'Aurele Amenda', 'Eray Comert', 'Nico Elvedi', 'Luca Jaquez', 'Miro Muheim', 'Christian Fassnacht', 'Johan Manzambi', 'Djibril Sow', 'Cedric Itten', 'Fabian Rieder', 'Ardon Jashari'] },
    { id: '6', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO C', local: 'BRASIL', bandera_local: '🇧🇷', visitante: 'MARRUECOS', bandera_visitante: '🇲🇦', fecha: '13 de Junio', fecha_iso: '2026-06-13', hora: '19:00', jugadores: ['Vinícius Júnior', 'Endrick Felipe', 'Neymar Júnior', 'Raphinha Dias', 'Gabriel Martinelli', 'Lucas Paquetá', 'Bruno Guimarães', 'Marquinhos', 'Gabriel Magalhães', 'Danilo da Silva', 'Alisson Becker', 'Ederson Moraes', 'Weverton', 'Alex Sandro', 'Gleison Bremer', 'Douglas Santos', 'Roger Ibáñez da Silva', 'Léo Pereira', 'Wesley Ribeiro Silva', 'Casemiro', 'Danilo dos Santos', 'Fabinho Tavares', 'Igor Thiago', 'Luiz Henrique', 'Matheus Cunha', 'Rayan', 
         'Yassine Bounou', 'Munir Mohand Mohamedi', 'Ahmed Reda Tagnaouti', 'Achraf Hakimi', 'Noussair Mazraoui', 'Anass Salah-Eddine', 'Youssef Belammari', 'Issa Diop', 'Chadi Riad', 'Zakaria El Ouahdi', 'Redouane Halhal', 'Nayef Aguerd', 'Neil El Aynaoui', 'Bilal El Khannouss', 'Azzedine Ounahi', 'Ayyoub Bouaddi', 'Ismael Saibari', 'Sofyan Amrabat', 'Samir El Mourabet', 'Brahim Díaz', 'Abde Ezzalzouli', 'Ayoube Amaimouni', 'Soufiane Rahimi', 'Chemsdine Talbi', 'Gessime Yassine', 'Ayoub El Kaabi'] },
    { id: '7', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO C', local: 'HAITÍ', bandera_local: '🇭🇹', visitante: 'ESCOCIA', bandera_visitante: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', fecha: '13 de Junio', fecha_iso: '2026-06-13', hora: '22:00', jugadores: ['Duckens Nazon', 'Frantzdy Pierrot', 'Johny Placide', 'Carlens Arcus', 'Leverton Pierre', 'Ricardo Adé', 'Jean-Kévin Duverne', 'Alexandre Pierre', 'Josué Duverger', 'Wilguens Paugain', 'Duke Lacroix', 'Martin Experiénce', 'Hannes Delcroix', 'Keeto Thermoncy', 'Carl Sainté', 'Danley Jean Jacques', 'Jean-Ricner Bellegarde', 'Woodensky Pierre', 'Dominique Simon', 'Louicius Don Deedson', 'Ruben Providence', 'Josué Casimir', 'Derrick Etienne', 'Wilson Isidor', 'Yassin Fortune', 'Lenny Joseph',
         'Scott McTominay', 'John Mcginn', 'Billy Gilmour', 'Kieran Tierney', 'Angus Gunn', 'Jack Hendry', 'Che Adams', 'Ryan Christie', 'Lawrence Shankland', 'Lewis Ferguson', 'Craig Gordon', 'Liam Kelly', 'Grant Hanley', 'Aaron Hickey', 'Dominic Hyam', 'Scott McKenna', 'Nathan Patterson', 'Anthony Ralston', 'Andy Robertson', 'John Souttar', 'Findlay Curtis', 'Ben Gannon-Doak', 'Kenny McLean', 'Lyndon Dykes', 'George Hirst', 'Ross Stewart'] },
    { id: '8', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO D', local: 'AUSTRALIA', bandera_local: '🇦🇺', visitante: 'TURQUÍA', bandera_visitante: '🇹🇷', fecha: '14 de Junio', fecha_iso: '2026-06-14', hora: '01:00', jugadores: ['Patrick Beach', 'Paul Izzo', 'Aziz Behich', 'Jordan Bos', 'Cameron Burgess', 'Alessandro Circati', 'Milos Degenek', 'Jason Geria', 'Lucas Herrington', 'Jacob Italiano', 'Harry Souttar', 'Kai Trewin', 'Cameron Devlin', 'Ajdin Hrustić', 'Jackson Irvine', 'Connor Metcalfe', 'Paul Okon-Engstler', 'Aiden ONeill', 'Nestory Irankunda', 'Mathew Leckie', 'Awer Mabil', 'Mohamed Touré', 'Nishan Velupillay', 'Cristian Volpato', 'Tete Yengi',
          'Altay Bayındır', 'Mert Günok', 'Uğurcan Çakır', 'Abdülkerim Bardakcı', 'Merih Demiral', 'Çağlar Söyüncü', 'Eren Elmalı', 'Ferdi Kadıoğlu', 'Mert Müldür', 'Ozan Kabak', 'Samet Akaydin', 'Zeki Çelik', 'Hakan Çalhanoğlu', 'İsmail Yüksek', 'Kaan Ayhan', 'Orkun Kökçü', 'Salih Özcan', 'Arda Güler', 'Barış Alper Yılmaz', 'Can Uzun', 'Erencan Yardımcı', 'İrfan Can Kahveci', 'Kenan Yıldız', 'Kerem Aktürkoğlu', 'Oğuz Aydın', 'Semih Kılıçsoy'] },
    { id: '9', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO E', local: 'ALEMANIA', bandera_local: '🇩🇪', visitante: 'CURAZAO', bandera_visitante: '🇨🇼', fecha: '14 de Junio', fecha_iso: '2026-06-14', hora: '14:00', jugadores: ['Florian Wirtz', 'Jamal Musiala', 'Kai Havertz', 'Joshua Kimmich', 'Antonio Rüdiger', 'Leroy Sané', 'Jonathan Tah', 'Deniz Undav', 'Oliver Baumann', 'Manuel Neuer', 'Alexander Nübel', 'Waldemar Anton', 'Nathaniel Brown', 'David Raum', 'Nico Schlotterbeck', 'Malick Thiaw', 'Pascal Groß', 'Felix Nmecha', 'Aleksandar Pavlović', 'Angelo Stiller', 'Nadiem Amiri', 'Leon Goretzka', 'Maximilian Beier', 'Lennart Karl', 'Jamie Leweling', 'Nick Woltemade', 
         'Tahith Chong', 'Leandro Bacuna', 'Juninho Bacuna', 'Eloy Room', 'Armando Obispo', 'Riechedly Bazoer', 'Shurandy Sambo', 'Sherel Floranus', 'Juriën Gaari', 'Jürgen Locadia', 'Sontje Hansen', 'Livano Comenencia', 'Kenji Gorré', 'Tyrick Bodak', 'Trevor Doornbusch', 'Joshua Brenet', 'Roshon Van Eijma', 'Deveron Fonville', 'Kevin Felida', 'Arjany Martha', 'Tyrese Noslin', 'Godfried Roemeratoe', 'Jeremy Antonisse', 'Gervane Kastaneer', 'Brandley Kuwas', 'Jearl Margaritha'] },
    { id: '10', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO F', local: 'PAISES BAJOS', bandera_local: '🇳🇱', visitante: 'JAPÓN', bandera_visitante: '🇯🇵', fecha: '14 de Junio', fecha_iso: '2026-06-14', hora: '17:00', jugadores: ['Mark Flekken', 'Robin Roefs', 'Bart Verbruggen', 'Nathan Aké', 'Virgil van Dijk', 'Denzel Dumfries', 'Jorrel Hato', 'Jan Paul van Hecke', 'Jurriën Timber', 'Micky van de Ven', 'Ryan Gravenberch', 'Frenkie de Jong', 'Justin Kluivert', 'Teun Koopmeiners', 'Marten de Roon', 'Guus Til', 'Quinten Timber', 'Mats Wieffer', 'Brian Brobbey', 'Memphis Depay', 'Cody Gakpo', 'Noa Lang', 'Donyell Malen', 'Tijjani Reijnders', 'Crysencio Summerville', 'Wout Weghorst',
         'Takefusa Kubo', 'Wataru Endō', 'Zion Suzuki', 'Ritsu Dōan', 'Ayase Ueda', 'Hiroki Itō', 'Daichi Kamada', 'Yukinari Sugawara', 'Ao Tanaka', 'Kō Itakura', 'Daizen Maeda', 'Tomoki Hayakawa', 'Keisuke Ōsako', 'Yūto Nagatomo', 'Shōgo Taniguchi', 'Tsuyoshi Watanabe', 'Takehiro Tomiyasu', 'Ayumu Seko', 'Junnosuke Suzuki', 'Junya Itō', 'Keito Nakamura', 'Kaishū Sano', 'Yuito Suzuki', 'Kento Shiogai', 'Kōki Ogawa', 'Keisuke Gotō'] },
    { id: '11', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO E', local: 'COSTA DE MARFIL', bandera_local: '🇨🇮', visitante: 'ECUADOR', bandera_visitante: '🇪🇨', fecha: '14 de Junio', fecha_iso: '2026-06-14', hora: '20:00', jugadores: ['Hernán Galíndez', 'Gonzalo Valle', 'Moisés Ramírez', 'Ángelo Preciado', 'Félix Torres', 'Jackson Porozo', 'Joel Ordóñez', 'Willian Pacho', 'Piero Hincapié', 'Yaimar Medina', 'Pervis Estupiñán', 'Alan Franco', 'Denil Castillo', 'John Yeboah', 'Jordy Alcívar', 'Kendry Páez', 'Moisés Caicedo', 'Pedro Vite', 'Alan Minda', 'Anthony Valencia', 'Gonzalo Plata', 'Enner Valencia', 'Jordy Caicedo', 'Jeremy Arévalo', 'Nilson Angulo', 'Kevin Rodríguez',
         'Simon Adingra', 'Amad Diallo', 'Seko Fofana', 'Ibrahim Sangaré', 'Ousmane Diomandé', 'Evan N’Dicka', 'Elye Wahi', 'Yahia Fofana', 'Wilfried Singo', 'Nicolas Pépé', 'Evann Guessand', 'Mohamed Koné', 'Alban Lafont', 'Emmanuel Agbadou', 'Clément Akpa', 'Guéla Doué', 'Ghislain Konan', 'Odilon Kossounou', 'Parfait Guiagon', 'Christ Inao Oulai', 'Franck Kessié', 'Jean Michaël Seri', 'Ange-Yoan Bonny', 'Oumar Diakité', 'Yan Diomande', 'Bazoumana Touré'] },
    { id: '12', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO F', local: 'SUECIA', bandera_local: '🇸🇪', visitante: 'TÚNEZ', bandera_visitante: '🇹🇳', fecha: '14 de Junio', fecha_iso: '2026-06-14', hora: '23:00', jugadores: ['Viktor Gyökeres', 'Alexander Isak', 'Lucas Bergvall', 'Victor Lindelöf', 'Isak Hien', 'Anthony Elanga', 'Yasin Ayari', 'Daniel Svensson', 'Viktor Johansson', 'Kristoffer Nordfeldt', 'Jacob Widell Zetterström', 'Gabriel Gudmundsson', 'Emil Holm', 'Gustaf Lagerbielke', 'Eric Smith', 'Carl Starfelt', 'Elliot Stroud', 'Jesper Karlström', 'Mattias Svanberg', 'Besfort Zeneli', 'Ken Sema', 'Taha Ali', 'Alexander Bernhardsson', 'Gustaf Nilsson', 'Benjamin Nygren',
         'Hannibal Mejbri', 'Ellyes Skhiri', 'Elias Achouri', 'Ismaël Gharbi', 'Montassar Talbi', 'Aymen Dahmen', 'Elias Saad', 'Ali Abdi', 'Yan Valery', 'Rani Khedira', 'Marouane Chamakh', 'Sabri Ben Hassen', 'Moutaz Neffati', 'Dylan Bronn', 'Omar Rekik', 'Adem Arous', 'Raed Chikhaoui', 'Amine Ben Hamida', 'Hadj Mahmoud', 'Anis Ben Slimane', 'Mortadha Ben Ouanes', 'Khalil Ayari', 'Firas Chaouat', 'Hazem Mastouri', 'Rayan Elloumi', 'Sebastian Tounekti'] },
    { id: '13', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO H', local: 'ESPAÑA', bandera_local: '🇪🇸', visitante: 'CABO VERDE', bandera_visitante: '🇨🇻', fecha: '15 de Junio', fecha_iso: '2026-06-15', hora: '13:00', jugadores: ['Unai Simón', 'David Raya', 'Joan García', 'Pedro Porro', 'Marcos Llorente', 'Aymeric Laporte', 'Pau Cubarsi', 'Marc Pubill', 'Eric García', 'Marc Cucurella', 'Alejandro Grimaldo', 'Rodrigo Hernández', 'Martín Zubimendi', 'Pedri', 'Fabían Ruiz', 'Dani Olmo', 'Mikel Merino', 'Gavi', 'Alex Baena', 'Lamine Yamal', 'Yeremy Pino', 'Ferrán Torres', 'Mikel Oyarzabal', 'Borja Iglesias', 'Nico Williams', 'Víctor Muñoz', 
         'Ryan Mendes', 'Logan Costa', 'Josimar Dias (Vozinha)', 'Garry Rodrigues', 'Kevin Pina', 'Jovane Cabral', 'Roberto Lopes', 'Jamiro Monteiro', 'Steven Moreira', 'Deroy Duarte', 'Márcio Rosa', 'Carlos Santos', 'Wagner Pina', 'João Paulo Fernandes', 'Sidny Lopes Cabral', 'Kelvin Pires', 'Ianique Tavares (Stopíra)', 'Edilson Borges (Diney)', 'Telmo Arcanjo', 'Yannick Semedo', 'Laros Duarte', 'Willy Semedo', 'Nuno da Costa', 'Dailon Livramento', 'Gilson Tavares', 'Hélio Varela'] },
    { id: '14', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO G', local: 'BÉLGICA', bandera_local: '🇧🇪', visitante: 'EGIPTO', bandera_visitante: '🇪🇬', fecha: '15 de Junio', fecha_iso: '2026-06-15', hora: '16:00', jugadores: ['Kevin De Bruyne', 'Jérémy Doku', 'Romelu Lukaku', 'Leandro Trossard', 'Youri Tielemans', 'Thibaut Courtois', 'Amadou Onana', 'Arthur Theate', 'Charles De Ketelaere', 'Timothy Castagne', 'Zeno Debast', 'Senne Lammens', 'Mike Penders', 'Maxim De Cuyper', 'Koni De Winter', 'Brandon Mechele', 'Thomas Meunier', 'Nathan Ngoy', 'Joaquin Seys', 'Nicolas Raskin', 'Hans Vanaken', 'Axel Witsel', 'Matías Fernández-Pardo', 'Dodi Lukébakio', 'Diego Moreira', 'Alexis Saelemaekers', 
         'Mohamed Salah', 'Omar Marmoush', 'Mahmoud Trézéguet', 'Mohamed Abdelmonem', 'Mohamed El Shenawy', 'Emam Ashour', 'Ahmed Sayed', 'Mohamed Hany', 'Ahmed Fatouh', 'Mostafa Shobeir', 'Al-Mahdy Soliman', 'Mohamed Alaa', 'Tarek Alaa', 'Hamdy Fathy', 'Ramy Rabia', 'Yasser Ibrahim', 'Hossam Abdelmaguid', 'Karim Hafez', 'Marwan Attia', 'Mohanad Lasheen', 'Nabil Emad', 'Mahmoud Saber', 'Mostafa Ziko', 'Ibrahim Adel', 'Haissem Hassan'] },
    { id: '15', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO H', local: 'ARABIA SAUDITA', bandera_local: '🇸🇦', visitante: 'URUGUAY', bandera_visitante: '🇺🇾', fecha: '15 de Junio', fecha_iso: '2026-06-15', hora: '19:00', jugadores: ['Sergio Rochet', 'Fernando Muslera', 'Santiago Mele', 'Ronald Araujo', 'Guillermo Varela', 'Jose María Giménez', 'Santiago Bueno', 'Sebatían Cáceres', 'Mathías Olivera', 'Matías Viña', 'Joaquín Piquerez', 'Manuel Ugarte', 'Rodrigo Bentancur', 'Federico Valverde', 'Giorgian De Arrascaeta', 'Rodrigo Zalazar', 'Nicolás de la Cruz', 'Agustín Canobbio', 'Facundo Pellistri', 'Brian Rodríguez', 'Juan Manuel Sanabria', 'Maximiliano Araujo', 'Darwin Núñez', 'Rodrigo Aguirre', 'Federico Viñas',
         'Ahmed Al Kassar', 'Mohammed Al Owais', 'Nawaf Al Aqidi', 'Hassan Al Tambakti', 'Ali Lajami', 'Abdullah Al Amri', 'Jehad Thakri', 'Hassan Kadesh', 'Saud Abdulhamid', 'Moteb Al Harbi', 'Nawaf Boushal', 'Ali Majrashi', 'Mohammed Abu', 'Nasser Al Dawsari', 'Mohammed Kanno', 'Abdullah Al Khaibari', 'Ziyad Al Johani', 'Musab Al Juwayr', 'Ala Al Hajji', 'Khalid Al Ghannam', 'Salem Al Dawsari', 'Sultan Mandash', 'Aiman Yahya', 'Abdullah Al Hamdan', 'Feras Al Buraikan', 'Saleh Al Shehri'] },
    { id: '16', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO G', local: 'IRÁN', bandera_local: '🇮🇷', visitante: 'NUEVA ZELANDA', bandera_visitante: '🇳🇿', fecha: '15 de Junio', fecha_iso: '2026-06-15', hora: '22:00', jugadores: ['Max Crocombe', 'Alex Paulsen', 'Michael Woud', 'Tyler Bindon', 'Michael Boxall', 'Liberato Cacace', 'Francis De Vries', 'Callan Elliot', 'Tim Payne', 'Nando Pijnaker', 'Tommy Smith', 'Finn Surman', 'Lachlan Bayliss', 'Joe Bell', 'Matt Garbett', 'Ben Old', 'Alex Rufer', 'Sarpreet Singh', 'Marko Stamenić', 'Ryan Thomas', 'Kosta Barbarouses', 'Eli Just', 'Callum McCowatt', 'Jesse Randall', 'Ben Waine', 'Chris Wood',
         'Alireza Beiranvand', 'Seyed Hossein Hosseini', 'Payam Niazmand', 'Danial ⁠Eiri', 'Ehsan Hajsafi', 'Saleh Hardani', 'Hossein Kanaani', 'Shoja Khalilzadeh', 'Milad Mohammadi', 'Ali Nemati', 'Ramin Rezaeian', 'Rouzbeh Cheshmi', 'Saeid Ezatolahi', 'Mehdi Ghaedi', 'Saman Ghoddos', 'Mohammad Ghorbani', 'Alireza Jahanbakhsh', 'Mohammad Mohebi', 'Amir Mohammad Razzaghinia', 'Mehdi Torabi', 'Aria Yousefi', 'Ali Alipour', 'Dennis Dargahi', 'Amirhossein Hosseinzadeh', 'Mehdi Taremi', 'Shahriar Moghanlou'] },
    { id: '17', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO I', local: 'FRANCIA', bandera_local: '🇫🇷', visitante: 'SENEGAL', bandera_visitante: '🇸🇳', fecha: '16 de Junio', fecha_iso: '2026-06-16', hora: '16:00', jugadores: ['Kylian Mbappé', 'Michael Olise', 'Mike Maignan', 'William Saliba', 'Aurélien Tchouaméni', 'Ousmane Dembélé', 'Theo Hernández', 'Bradley Barcola', 'Warren Zaïre-Emery', 'Marcus Thuram', 'Robin Risser', 'Brice Samba', 'Lucas Digne', 'Malo Gusto', 'Lucas Hernandez', 'Ibrahima Konate', 'Jules Kounde', 'Maxence Lacroix', 'Dayot Upamecano', 'NGolo Kante', 'Manu Kone', 'Adrien Rabiot', 'Maghnes Akliouche', 'Rayan Cherki', 'Desire Doue', 'Jean-Philippe Mateta',
         'Edouard Mendy', 'Mory Diaw', 'Yehvann Diouf', 'Krépin Diatta', 'Antoine Mendy', 'Kalidou Koulibaly', 'El Hadji Malick Diouf', 'Mamadou Sarr', 'Moussa Niakhaté', 'Abdoulaye Seck', 'Ismaïl Jakobs', 'Idrissa Gana Gueye', 'Pape Gueye', 'Lamine Camara', 'Habib Diarra', 'Pathé Ciss', 'Pape Matar Sarr', 'Bara Sapoko Ndiaye', 'Sadio Mané', 'Ismaïla Sarr', 'Iliman Ndiaye', 'Assane Diao', 'Ibrahim Mbaye', 'Nicolas Jackson', 'Bamba Dieng', 'Cherif Ndiaye'] },
    { id: '18', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO I', local: 'IRAK', bandera_local: '🇮🇶', visitante: 'NORUEGA', bandera_visitante: '🇳🇴', fecha: '16 de Junio', fecha_iso: '2026-06-16', hora: '19:00', jugadores: ['Jalal Hassan', 'Ahmed Basil', 'Fahad Talib', 'Akam Hashen', 'Rebin Sulaka', 'Zaid Tahseem', 'Manaf Younis', 'Merchas Doski', 'Ahmed Yahya', 'Hussein Ali', 'Mustafa Saadoon', 'Frans Putros', 'Zaid Ismail', 'Zidane Iqbal', 'Aimar Sher', 'Amir Almmari', 'Kevin Yakob', 'Ibrahim Bayesh', 'Marko Farji', 'Youssef Amyn', 'Ahmed Qasim', 'Ali Jassim', 'Mohanad Ali', 'Aymen Hussein', 'Ali Al Hamadi', 'Ali Yousef',
         'Erling Haaland', 'Martin Ødegaard', 'Alexander Sørloth', 'Antonio Nusa', 'Julian Ryerson', 'Sander Berge', 'Oscar Bobb', 'Ørjan Nyland', 'Leo Østigård', 'David Møller Wolfe', 'Jørgen Strand Larsen', 'Egil Selvik', 'Sander Tangvik', 'Kristoffer Vassbakk Ajer', 'Fredrik Bjorkan', 'Henrik Falchener', 'Sondre Langas', 'Torbjorn Heggem', 'Marcus Holmgren Pedersen', 'Thelonious Aasgaard', 'Fredrik Aursnes', 'Patrick Berg', 'Jens Petter Hauge', 'Andreas Schjelderup', 'Morten Thorsby', 'Kristian Thorstvedt'] },
    { id: '19', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO J', local: 'ARGENTINA', bandera_local: '🇦🇷', visitante: 'ARGELIA', bandera_visitante: '🇩🇿', fecha: '16 de Junio', fecha_iso: '2026-06-16', hora: '22:00', jugadores: ['Emiliano Martínez', 'Gerónimo Rulli', 'Juan Musso', 'Leonardo Balerdi', 'Nicolás Tagliafico', 'Gonzalo Montiel', 'Lisandro Martínez', 'Cristian Romero', 'Nicolás Otamendi', 'Facundo Medina', 'Nahuel Molina', 'Leandro Paredes', 'Rodrigo De Paul', 'Valentín Barco', 'Giovani Lo Celso', 'Exequiel Palacios', 'Alexis Mac Allister', 'Enzo Fernández', 'Julián Álvarez', 'Lionel Messi', 'Nico González', 'Thiago Almada', 'Giuliano Simeone', 'Nico Paz', 'José Manuel López', 'Lautaro Martínez',
         'Luca Zidane', 'Oussama Benbot', 'Melvin Mastil', 'Abdelatif Ramdane', 'Rafik Belghali', 'Samir Chergui', 'Rayan Aït-Nouri', 'Jaouen Hadjam', 'Aïssa Mandi', 'Ramy Bensebaini', 'Zineddine Belaïd', 'Achref Abada', 'Mohamed Amine Tougai', 'Nabil Bentaleb', 'Hicham Boudaoui', 'Houssem Aouar', 'Farès Chaïbi', 'Ibrahim Maza', 'Yacine Titraoui', 'Ramiz Zerrouki', 'Mohamed Amoura', 'Nadhir Benbouali', 'Adil Boulbina', 'Farès Ghedjemis', 'Amine Gouiri', 'Anis Hadj Moussa', 'Riyad Mahrez'] },
    { id: '20', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO J', local: 'AUSTRIA', bandera_local: '🇦🇹', visitante: 'JORDANIA', bandera_visitante: '🇯🇴', fecha: '17 de Junio', fecha_iso: '2026-06-17', hora: '01:00', jugadores: ['Marcel Sabitzer', 'Konrad Laimer', 'David Alaba', 'Christoph Baumgartner', 'Kevin Danso', 'Michael Gregoritsch', 'Stefan Posch', 'Patrick Pentz', 'Patrick Wimmer', 'Nicolas Seiwald', 'Romano Schmid', 'Philipp Lienhart', 'Alexander Schlager', 'Florian Wiegele', 'David Affengruber', 'Phillipp Mwene', 'Alexander Prass', 'Marco Friedl', 'Michael Svoboda', 'Xaver Schlager', 'Florian Grillitsch', 'Carney Chukwuemeka', 'Paul Wanner', 'Alessandro Schöpf', 'Marko Arnautovic', 'Sasa Kalajdzic',
         'Yazid Abulaila', 'Abdallah Al Fakhouri', 'Nour Baniateyah', 'Mohammad Abualnadi', 'Husam Abu Dahab', 'Mohammad Abu Hashish', 'Mohannad Abu Taha', 'Yazan Al Arab', 'Saed Al Rosan', 'Anas Badawi', 'Abdallah Nasib', 'Ehsan Haddad', 'Saleem Obaid', 'Mohammad Al Dawoud', 'Nizar Al Rashdan', 'Noor Al Rawabdeh', 'Rajaei Ayed', 'Amer Jamous', 'Ibrahim Sadeh', 'Mohammad Abu Zraiq', 'Mousa Al Tamari', 'Ali Azaizeh', 'Odeh Fakhoury', 'Ali Olwan', 'Ibrahim Sabra', 'Mahmoud Almardi'] },
    { id: '21', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO K', local: 'PORTUGAL', bandera_local: '🇵🇹', visitante: 'RD CONGO', bandera_visitante: '🇨🇩', fecha: '17 de Junio', fecha_iso: '2026-06-17', hora: '14:00', jugadores: ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'Rafael Leão', 'Rúben Dias', 'Diogo Costa', 'João Félix', 'Vitinha', 'Nuno Mendes', 'João Neves', 'Gonçalo Ramos', 'José Sá', 'Rui Silva', 'Ricardo Velho', 'Diogo Dalot', 'Matheus Nunes', 'Nélson Semedo', 'Joao Cancelo', 'Gonçalo Inácio', 'Renato Veiga', 'Tomás Araújo', 'Rúben Neves', 'Samú Costa', 'Francisco Trincao', 'Francisco Conceiçao', 'Pedro Neto', 'Gonçalo Guedes',
         'Yoane Wissa', 'Théo Bongonda', 'Chancel Mbemba', 'Samuel Moutoussamy', 'Simon Banza', 'Elia Meschack', 'Arthur Masuaku', 'Charles Pickel', 'Dylan Batubinsika', 'Gédéon Kalulu', 'Gaël Kakuta', 'Timothy Fayulu', 'Matthieu Epolo', 'Lionel Mpasi', 'Aaron Wan-Bissaka', 'Joris Kayembe', 'Steve Kapuadi', 'Rocky Bushiri', 'Axel Tuanzebe', 'Noah Sadiki', 'Edo Kayembe', 'Ngalayel Mukau', 'Nathanaël Mbuku', 'Brian Cipenga', 'Fiston Mayele', 'Cédric Bakambu'] },
    { id: '22', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO L', local: 'INGLATERRA', bandera_local: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', visitante: 'CROACIA', bandera_visitante: '🇭🇷', fecha: '17 de Junio', fecha_iso: '2026-06-17', hora: '17:00', jugadores: ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka', 'Declan Rice', 'Jordan Pickford', 'John Stones', 'Reece James', 'Marcus Rashford', 'Kobbie Mainoo', 'Marc Guéhi', 'Dean Henderson', 'James Trafford', 'Dan Burn', 'Ezri Konsa', 'Tino Livramento', 'Nico O Reilly', 'Jarell Quansah', 'Djed Spence', 'Elliot Anderson', 'Eberechi Eze', 'Jordan Henderson', 'Morgan Rogers', 'Anthony Gordon', 'Noni Madueke', 'Ivan Toney', 'Ollie Watkins',
         'Luka Modrić', 'Joško Gvardiol', 'Mateo Kovačić', 'Dominik Livaković', 'Martin Baturina', 'Andrej Kramarić', 'Josip Šutalo', 'Josip Stanišić', 'Mario Pašalić', 'Dominik Kotarski', 'Ivor Pandur', 'Duje Ćaleta-Car', 'Marin Pongračić', 'Martin Erlić', 'Luka Vušković', 'Nikola Vlašić', 'Luka Sučić', 'Kristijan Jakić', 'Petar Sučić', 'Nikola Moro', 'Toni Fruk', 'Ivan Perišić', 'Ante Budimir', 'Marco Pašalić', 'Petar Musa', 'Igor Matanović'] },
    { id: '23', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO L', local: 'GHANA', bandera_local: '🇬🇭', visitante: 'PANAMÁ', bandera_visitante: '🇵🇦', fecha: '17 de Junio', fecha_iso: '2026-06-17', hora: '20:00', jugadores: ['Benjamín Asare', 'Lawrence Ati-Zigi', 'Joseph Anang', 'Salomon Agbasi', 'Paul Reverson', 'Baba Abdul Rahman', 'Gideon Mensah', 'Marvin Senaya', 'Alidu Seidu', 'Abdul Mumin', 'Jerome Opoku', 'Jonas Adjetey', 'Kojo Oppong Preprah', 'Alexander Djiku', 'Elisha Owusu', 'Thomas Partey', 'Kwasi Sibo', 'Augustine Boakye', 'Caleb Yirenkyi', 'Abdul Fatawu Issahaku', 'Kamal Deen Sulemana', 'Christopher Bonsu Baah', 'Ernest Nuamah', 'Antoine Semenyo', 'Brandon Thomas-Asante', 'Prince Kwabena Adu', 'Iñaki Williams', 'Jordan Ayew',
         'Orlando Mosquera', 'Luis Mejía', 'César Samudio', 'César Blackman', 'Jorge Gutiérrez', 'Amir Murillo', 'Fidel Escobar', 'Andrés Andrade', 'Edgardo Fariña', 'José Córdoba', 'Eric Davis', 'Jiovany Ramos', 'Roderick Miller', 'Aníbal Godoy', 'Adalberto Carrasquilla', 'Carlos Harvey', 'Cristian Martínez', 'José Luis Rodríguez', 'César Yanis', 'Yoel Bárcenas', 'Alberto Quintero', 'Azarías Londoño', 'Ismael Díaz', 'Cecilio Waterman', 'José Fajardo', 'Tomás Rodríguez'] },
    { id: '24', etapa: 'grupos', fase_nro: 1, grupo: 'GRUPO K', local: 'UZBEKISTÁN', bandera_local: '🇺🇿', visitante: 'COLOMBIA', bandera_visitante: '🇨🇴', fecha: '17 de Junio', fecha_iso: '2026-06-17', hora: '23:00', jugadores: ['Camilo Vargas', 'David Ospina', 'Álvaro Montero', 'Daniel Muñoz', 'Santiago Arias', 'Yerry Mina', 'Davinson Sánchez', 'Jhon Lucumí', 'Willer Ditta', 'Yohan Mojica', 'Déiver Machado', 'Richard Ríos', 'Jefferson Lerma', 'Gustavo Puerta', 'Kevin Castaño', 'Jhon Arias', 'James Rodríguez', 'Juan Fernando Quintero', 'Jorge Carrascal', 'Juan Camilo Portilla', 'Luis Díaz', 'Luis Suárez', 'Carlos Gómez', 'Jaminton Campaz', 'Jhon Córdoba', 'Juan Camilo Hernández',
         'Abduvokhid Nematov', 'Botirali Ergashev', 'Utkir Yusupov', 'Abdukodir Khusanov', 'Rustam Ashurmatov', 'Jakhongir Urozov', 'Sherzod Nasrullaev', 'Khozhiakbar Alizhonov', 'Bekhruz Karimov', 'Avazbek Ulmasaliev', 'Farrukh Sayfiev', 'Umar Eshmurodov', 'Odildzhon Khamrobekov', 'Abdulla Abdullaev', 'Azizjon Ganiev', 'Otabek Shukurov', 'Jamshid Iskanderov', 'Jaloliddin Masharipov', 'Sherzod Esanov', 'Akmal Mozgovoy', 'Eldor Shomurodov', 'Abbosbek Fayzullaev', 'Oston Urunov', 'Dostonbek Khamdamov', 'Igor Sergeev', 'Azizbek Amanov'] },
    

    { id: '25', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO A', local: 'REP. CHECA', bandera_local: '🇨🇿', visitante: 'SUDÁFRICA', bandera_visitante: '🇿🇦', fecha: '18 de Junio', fecha_iso: '2026-06-18', hora: '13:00', jugadores: ['Ronwen Williams', 'Ricardo Goss', 'Sipho Chaine', 'Khuliso Mudau', 'Olwethu Makhanya', 'Bradley Cross', 'Aubrey Modiba', 'Thabang Matuludi', 'Nkosinathi Sibisi', 'Ime Okon', 'Samukele Kabini', 'Mbekezeli Mbokazi', 'Kamolego Sebelebele', 'Khulumani Ndamane', 'Teboho Mokoena', 'Thalente Mbatha', 'Jayden Adams', 'Shephelo Sithole', 'Oswin Appollis', 'Tshepang Moremi', 'Evidence Makgopa', 'Lyle Foster', 'Ioraam Rayners', 'Relebohile Mofokeng', 'Themba Zawne', 'Thapelo Maseko',
         'Jindřich Staněk', 'Matěj Kovář', 'Lukáš Horníček', 'Vladimír Coufal', 'Tomáš Holeš', 'David Jurásek', 'Jaroslav Zelený', 'Ladislav Krejčí', 'Štěpán Chaloupek', 'Robin Hranáč', 'David Douděra', 'David Zima', 'Tomáš Souček', 'Lukáš Provod', 'Michal Sadílek', 'Pavel Šulc', 'Vladimír Darida', 'Alexandr Sojka', 'Lukáš Červ', 'Tomáš Ladra', 'Hugo Sochurek', 'Pavel Bucha', 'Denis Višinský', 'Tomáš Chorý', 'Patrik Schick', 'Mojmír Chytil', 'Jan Kuchta', 'Christophe Kabongo', 'Adam Hložek'] },
    { id: '26', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO B', local: 'SUIZA', bandera_local: '🇨🇭', visitante: 'BOSNIA Y HERZEGOVINA', bandera_visitante: '🇧🇦', fecha: '18 de Junio', fecha_iso: '2026-06-18', hora: '16:00', jugadores: ['Edin Džeko', 'Sead Kolašinac', 'Ermedin Demirovic', 'Amar Dedić', 'Benjamin Tahirović', 'Nikola Vasilj', 'Martin Zlomislić', 'Osman Hadžikić', 'Nihad Mujakić', 'Nikola Katić', 'Tarik Muharemović', 'Stjepan Radeljić', 'Dennis Hadžikadunić', 'Nidal Čelik', 'Amir Hadžiahmetović', 'Ivan Šunjić', 'Ivan Bašić', 'Dženis Burnić', 'Ermin Mahmić', 'Amar Memić', 'Armin Gigović', 'Kerim Alajbegović', 'Esmir Bajraktarević', 'Jovo Lukić', 'Samed Baždar', 'Haris Tabaković',
         'Granit Xhaka', 'Manuel Akanji', 'Breel Embolo', 'Gregor Kobel', 'Remo Freuler', 'Ruben Vargas', 'Dan Ndoye', 'Zeki Amdouni', 'Michel Aebischer', 'Denis Zakaria', 'Silvan Widmer', 'Ricardo Rodríguez', 'Noah Okafor', 'Marvin Keller', 'Yvon Mvogo', 'Aurele Amenda', 'Eray Comert', 'Nico Elvedi', 'Luca Jaquez', 'Miro Muheim', 'Christian Fassnacht', 'Johan Manzambi', 'Djibril Sow', 'Cedric Itten', 'Fabian Rieder', 'Ardon Jashari'] },
    { id: '27', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO B', local: 'CANADÁ', bandera_local: '🇨🇦', visitante: 'CATAR', bandera_visitante: '🇶🇦', fecha: '18 de Junio', fecha_iso: '2026-06-18', hora: '19:00', jugadores: ['Maxime Crépeau', 'Owen Goodman', 'Dayne St. Claire', 'Moïse Bombito', 'Derek Cornelius', 'Alphonso Davies', 'Luc de Fougerolles', 'Alistair Johnston', 'Alfie Jones', 'Richie Laryea', 'Niko Sigur', 'Joel Waterman', 'Ali Ahmed', 'Tajon Buchanan', 'Mathieu Choinière', 'Stephen Eustáquio', 'Marcelo Flores', 'Ismaël Koné', 'Liam Millar', 'Jonathan Osorio', 'Nathan Saliba', 'Jacob Shaffelburg', 'Jonathan David', 'Promise David', 'Cyle Larin', 'Tani Oluwaseyi',
         'Mahmoud Abunada', 'Meshaal Barsham', 'Salah Zakaria', 'Lucas Mendes', 'Issa Laye', 'Pedro Miguel', 'Al-Hashmi Al-Hussain', 'Boualem Khoukhi', 'Homam Ahmed Al-Amin', 'Sultan Al-Brake', 'Ayoub Al-Oui', 'Jassem Gaber', 'Mohamed Al-Mannai', 'Assim Madibo', 'Ahmed Fathi', 'Karim Bouadiaf', 'Abdulaziz Hatem', 'Hassan Al-Haydos', 'Akram Afif', 'Edmílson Júnior', 'Yusuf Abdurisag', 'Tahsin Jamshid', 'Ahmed Al-Ganehi', 'Almoez Ali', 'Ahmed Alaa’eldin', 'Mohammed Muntari'] },
    { id: '28', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO A', local: 'COREA DEL SUR', bandera_local: '🇰🇷', visitante: 'MÉXICO', bandera_visitante: '🇲🇽', fecha: '18 de Junio', fecha_iso: '2026-06-18', hora: '22:00', jugadores: ['Raúl Rangel', 'Carlos Acevedo', 'Guillermo Ochoa', 'César Montes', 'Johan Vásquez', 'Mateo Chávez', 'Jesús Gallardo', 'Israel Reyes', 'Jorge Sánchez', 'Erik Lira', 'Luis Romo', 'Obed Vargas', 'Brian Gutiérrez', 'Oberlín Pineda', 'Edson Álvarez', 'Gilberto Mora', 'César Huerta', 'Álvaro Fidalgo', 'Luis Chávez', 'Roberto Alvarado', 'Alexis Vega', 'Julián Quiñones', 'Santiago Gimenez', 'Guillermo Martínez', 'Armando González', 'Raúl Jiménez',
         'Son Heung-Min', 'Kim Min-jae', 'Cho Gue-sung', 'Hwang In-beom', 'Jo Hyeon-woo', 'Lee Jae-sung', 'Paik Seung-ho', 'Oh Hyeon-gyu', 'Seol Young-woo', 'Kim Seung-Gyu', 'Song Bum-keun', 'Kim Moon-hwan', 'Kim Tae-hyeon', 'Park Jin-seop', 'Jens Castrop', 'Lee Ki-hyuk', 'Lee Tae-seok', 'Lee Han-beom', 'Cho Yu-min', 'Kim Jin-gyu', 'Jun-Ho Bae', 'Yang Hyun-jun', 'Eom Ji-sung', 'Lee Kang-in', 'Lee Dong-gyeong', 'Hwang Hee-chan'] },
    { id: '29', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO D', local: 'ESTADOS UNIDOS', bandera_local: '🇺🇸', visitante: 'AUSTRALIA', bandera_visitante: '🇦🇺', fecha: '19 de Junio', fecha_iso: '2026-06-19', hora: '16:00', jugadores: ['Matt Freese', 'Matt Turner', 'Chris Brady', 'Max Arfsten', 'Sergiño Dest', 'Alex Freeman', 'Mark McKenzie', 'Tim Ream', 'Chris Richards', 'Antonee Robinson', 'Miles Robinson', 'Joe Scally', 'Auston Trusty', 'Tyler Adams', 'Sebastian Berhalter', 'Weston McKennie', 'Cristian Roldán', 'Brenden Aaronson', 'Christian Pulisic', 'Gio Reyna', 'Malik Tillman', 'Tim Weah', 'Alejandro Zendejas', 'Folarin Balogun', 'Ricardo Pepi', 'Haji Wright',
         'Patrick Beach', 'Paul Izzo', 'Aziz Behich', 'Jordan Bos', 'Cameron Burgess', 'Alessandro Circati', 'Milos Degenek', 'Jason Geria', 'Lucas Herrington', 'Jacob Italiano', 'Harry Souttar', 'Kai Trewin', 'Cameron Devlin', 'Ajdin Hrustić', 'Jackson Irvine', 'Connor Metcalfe', 'Paul Okon-Engstler', 'Aiden ONeill', 'Nestory Irankunda', 'Mathew Leckie', 'Awer Mabil', 'Mohamed Touré', 'Nishan Velupillay', 'Cristian Volpato', 'Tete Yengi'] },
    { id: '30', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO C', local: 'ESCOCIA', bandera_local: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', visitante: 'MARRUECOS', bandera_visitante: '🇲🇦', fecha: '19 de Junio', fecha_iso: '2026-06-19', hora: '19:00', jugadores: ['Yassine Bounou', 'Munir Mohand Mohamedi', 'Ahmed Reda Tagnaouti', 'Achraf Hakimi', 'Noussair Mazraoui', 'Anass Salah-Eddine', 'Youssef Belammari', 'Issa Diop', 'Chadi Riad', 'Zakaria El Ouahdi', 'Redouane Halhal', 'Nayef Aguerd', 'Neil El Aynaoui', 'Bilal El Khannouss', 'Azzedine Ounahi', 'Ayyoub Bouaddi', 'Ismael Saibari', 'Sofyan Amrabat', 'Samir El Mourabet', 'Brahim Díaz', 'Abde Ezzalzouli', 'Ayoube Amaimouni', 'Soufiane Rahimi', 'Chemsdine Talbi', 'Gessime Yassine', 'Ayoub El Kaabi',
         'Scott McTominay', 'John Mcginn', 'Billy Gilmour', 'Kieran Tierney', 'Angus Gunn', 'Jack Hendry', 'Che Adams', 'Ryan Christie', 'Lawrence Shankland', 'Lewis Ferguson', 'Craig Gordon', 'Liam Kelly', 'Grant Hanley', 'Aaron Hickey', 'Dominic Hyam', 'Scott McKenna', 'Nathan Patterson', 'Anthony Ralston', 'Andy Robertson', 'John Souttar', 'Findlay Curtis', 'Ben Gannon-Doak', 'Kenny McLean', 'Lyndon Dykes', 'George Hirst', 'Ross Stewart'] },
    { id: '31', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO C', local: 'BRASIL', bandera_local: '🇧🇷', visitante: 'HAITÍ', bandera_visitante: '🇭🇹', fecha: '19 de Junio', fecha_iso: '2026-06-19', hora: '21:30', jugadores: ['Vinícius Júnior', 'Endrick Felipe', 'Neymar Júnior', 'Raphinha Dias', 'Gabriel Martinelli', 'Lucas Paquetá', 'Bruno Guimarães', 'Marquinhos', 'Gabriel Magalhães', 'Danilo da Silva', 'Alisson Becker', 'Ederson Moraes', 'Weverton', 'Alex Sandro', 'Gleison Bremer', 'Douglas Santos', 'Roger Ibáñez da Silva', 'Léo Pereira', 'Wesley Ribeiro Silva', 'Casemiro', 'Danilo dos Santos', 'Fabinho Tavares', 'Igor Thiago', 'Luiz Henrique', 'Matheus Cunha', 'Rayan',
         'Duckens Nazon', 'Frantzdy Pierrot', 'Johny Placide', 'Carlens Arcus', 'Leverton Pierre', 'Ricardo Adé', 'Jean-Kévin Duverne', 'Alexandre Pierre', 'Josué Duverger', 'Wilguens Paugain', 'Duke Lacroix', 'Martin Experiénce', 'Hannes Delcroix', 'Keeto Thermoncy', 'Carl Sainté', 'Danley Jean Jacques', 'Jean-Ricner Bellegarde', 'Woodensky Pierre', 'Dominique Simon', 'Louicius Don Deedson', 'Ruben Providence', 'Josué Casimir', 'Derrick Etienne', 'Wilson Isidor', 'Yassin Fortune', 'Lenny Joseph'] },
    { id: '32', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO D', local: 'TURQUÍA', bandera_local: '🇹🇷', visitante: 'PARAGUAY', bandera_visitante: '🇵🇾', fecha: '20 de Junio', fecha_iso: '2026-06-20', hora: '00:00', jugadores: ['Altay Bayındır', 'Mert Günok', 'Uğurcan Çakır', 'Abdülkerim Bardakcı', 'Merih Demiral', 'Çağlar Söyüncü', 'Eren Elmalı', 'Ferdi Kadıoğlu', 'Mert Müldür', 'Ozan Kabak', 'Samet Akaydin', 'Zeki Çelik', 'Hakan Çalhanoğlu', 'İsmail Yüksek', 'Kaan Ayhan', 'Orkun Kökçü', 'Salih Özcan', 'Arda Güler', 'Barış Alper Yılmaz', 'Can Uzun', 'Erencan Yardımcı', 'İrfan Can Kahveci', 'Kenan Yıldız', 'Kerem Aktürkoğlu', 'Oğuz Aydın', 'Semih Kılıçsoy',
         'Orlando Gill', 'Roberto Jr. Fernández', 'Gastón Olveira', 'Juan José Cáceres', 'José Canale', 'Fabián Balbuena', 'Omar Alderete', 'Gustavo Gómez', 'Alexandro Maidana', 'Junior Alonso', 'Gustavo Velázquez', 'Braian Ojeda', 'Damián Bobadilla', 'Andrés Cubas', 'Diego Gómez Gómez', 'Alejandro Romero Gamarra', 'Mauricio Prado', 'Matías Galarza', 'Ramón Sosa', 'Gustavo Caballero', 'Miguel Almirón', 'Gabriel Ávalos', 'Isidro Pitta', 'Álex Arce', 'Julio Enciso', 'Antonio Sanabria'] },
    { id: '33', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO F', local: 'PAISES BAJOS', bandera_local: '🇳🇱', visitante: 'SUECIA', bandera_visitante: '🇸🇪', fecha: '20 de Junio', fecha_iso: '2026-06-20', hora: '14:00', jugadores: ['Mark Flekken', 'Robin Roefs', 'Bart Verbruggen', 'Nathan Aké', 'Virgil van Dijk', 'Denzel Dumfries', 'Jorrel Hato', 'Jan Paul van Hecke', 'Jurriën Timber', 'Micky van de Ven', 'Ryan Gravenberch', 'Frenkie de Jong', 'Justin Kluivert', 'Teun Koopmeiners', 'Marten de Roon', 'Guus Til', 'Quinten Timber', 'Mats Wieffer', 'Brian Brobbey', 'Memphis Depay', 'Cody Gakpo', 'Noa Lang', 'Donyell Malen', 'Tijjani Reijnders', 'Crysencio Summerville', 'Wout Weghorst',
         'Viktor Gyökeres', 'Alexander Isak', 'Lucas Bergvall', 'Victor Lindelöf', 'Isak Hien', 'Anthony Elanga', 'Yasin Ayari', 'Daniel Svensson', 'Viktor Johansson', 'Kristoffer Nordfeldt', 'Jacob Widell Zetterström', 'Gabriel Gudmundsson', 'Emil Holm', 'Gustaf Lagerbielke', 'Eric Smith', 'Carl Starfelt', 'Elliot Stroud', 'Jesper Karlström', 'Mattias Svanberg', 'Besfort Zeneli', 'Ken Sema', 'Taha Ali', 'Alexander Bernhardsson', 'Gustaf Nilsson', 'Benjamin Nygren'] },
    { id: '34', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO E', local: 'ALEMANIA', bandera_local: '🇩🇪', visitante: 'COSTA DE MARFIL', bandera_visitante: '🇨🇮', fecha: '20 de Junio', fecha_iso: '2026-06-20', hora: '17:00', jugadores: ['Florian Wirtz', 'Jamal Musiala', 'Kai Havertz', 'Joshua Kimmich', 'Antonio Rüdiger', 'Leroy Sané', 'Jonathan Tah', 'Deniz Undav', 'Oliver Baumann', 'Manuel Neuer', 'Alexander Nübel', 'Waldemar Anton', 'Nathaniel Brown', 'David Raum', 'Nico Schlotterbeck', 'Malick Thiaw', 'Pascal Groß', 'Felix Nmecha', 'Aleksandar Pavlović', 'Angelo Stiller', 'Nadiem Amiri', 'Leon Goretzka', 'Maximilian Beier', 'Lennart Karl', 'Jamie Leweling', 'Nick Woltemade',
         'Simon Adingra', 'Amad Diallo', 'Seko Fofana', 'Ibrahim Sangaré', 'Ousmane Diomandé', 'Evan N’Dicka', 'Elye Wahi', 'Yahia Fofana', 'Wilfried Singo', 'Nicolas Pépé', 'Evann Guessand', 'Mohamed Koné', 'Alban Lafont', 'Emmanuel Agbadou', 'Clément Akpa', 'Guéla Doué', 'Ghislain Konan', 'Odilon Kossounou', 'Parfait Guiagon', 'Christ Inao Oulai', 'Franck Kessié', 'Jean Michaël Seri', 'Ange-Yoan Bonny', 'Oumar Diakité', 'Yan Diomande', 'Bazoumana Touré'] },
    { id: '35', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO E', local: 'ECUADOR', bandera_local: '🇪🇨', visitante: 'CURAZAO', bandera_visitante: '🇨🇼', fecha: '20 de Junio', fecha_iso: '2026-06-20', hora: '21:00', jugadores: ['Tahith Chong', 'Leandro Bacuna', 'Juninho Bacuna', 'Eloy Room', 'Armando Obispo', 'Riechedly Bazoer', 'Shurandy Sambo', 'Sherel Floranus', 'Juriën Gaari', 'Jürgen Locadia', 'Sontje Hansen', 'Livano Comenencia', 'Kenji Gorré', 'Tyrick Bodak', 'Trevor Doornbusch', 'Joshua Brenet', 'Roshon Van Eijma', 'Deveron Fonville', 'Kevin Felida', 'Arjany Martha', 'Tyrese Noslin', 'Godfried Roemeratoe', 'Jeremy Antonisse', 'Gervane Kastaneer', 'Brandley Kuwas', 'Jearl Margaritha',
         'Hernán Galíndez', 'Gonzalo Valle', 'Moisés Ramírez', 'Ángelo Preciado', 'Félix Torres', 'Jackson Porozo', 'Joel Ordóñez', 'Willian Pacho', 'Piero Hincapié', 'Yaimar Medina', 'Pervis Estupiñán', 'Alan Franco', 'Denil Castillo', 'John Yeboah', 'Jordy Alcívar', 'Kendry Páez', 'Moisés Caicedo', 'Pedro Vite', 'Alan Minda', 'Anthony Valencia', 'Gonzalo Plata', 'Enner Valencia', 'Jordy Caicedo', 'Jeremy Arévalo', 'Nilson Angulo', 'Kevin Rodríguez'] },
    { id: '36', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO F', local: 'TÚNEZ', bandera_local: '🇹🇳', visitante: 'JAPÓN', bandera_visitante: '🇯🇵', fecha: '21 de Junio', fecha_iso: '2026-06-21', hora: '01:00', jugadores: ['Takefusa Kubo', 'Wataru Endō', 'Zion Suzuki', 'Ritsu Dōan', 'Ayase Ueda', 'Hiroki Itō', 'Daichi Kamada', 'Yukinari Sugawara', 'Ao Tanaka', 'Kō Itakura', 'Daizen Maeda', 'Tomoki Hayakawa', 'Keisuke Ōsako', 'Yūto Nagatomo', 'Shōgo Taniguchi', 'Tsuyoshi Watanabe', 'Takehiro Tomiyasu', 'Ayumu Seko', 'Junnosuke Suzuki', 'Junya Itō', 'Keito Nakamura', 'Kaishū Sano', 'Yuito Suzuki', 'Kento Shiogai', 'Kōki Ogawa', 'Keisuke Gotō',
         'Hannibal Mejbri', 'Ellyes Skhiri', 'Elias Achouri', 'Ismaël Gharbi', 'Montassar Talbi', 'Aymen Dahmen', 'Elias Saad', 'Ali Abdi', 'Yan Valery', 'Rani Khedira', 'Marouane Chamakh', 'Sabri Ben Hassen', 'Moutaz Neffati', 'Dylan Bronn', 'Omar Rekik', 'Adem Arous', 'Raed Chikhaoui', 'Amine Ben Hamida', 'Hadj Mahmoud', 'Anis Ben Slimane', 'Mortadha Ben Ouanes', 'Khalil Ayari', 'Firas Chaouat', 'Hazem Mastouri', 'Rayan Elloumi', 'Sebastian Tounekti'] },
    { id: '37', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO H', local: 'ESPAÑA', bandera_local: '🇪🇸', visitante: 'ARABIA SAUDITA', bandera_visitante: '🇸🇦', fecha: '21 de Junio', fecha_iso: '2026-06-21', hora: '13:00', jugadores: ['Unai Simón', 'David Raya', 'Joan García', 'Pedro Porro', 'Marcos Llorente', 'Aymeric Laporte', 'Pau Cubarsi', 'Marc Pubill', 'Eric García', 'Marc Cucurella', 'Alejandro Grimaldo', 'Rodrigo Hernández', 'Martín Zubimendi', 'Pedri', 'Fabían Ruiz', 'Dani Olmo', 'Mikel Merino', 'Gavi', 'Alex Baena', 'Lamine Yamal', 'Yeremy Pino', 'Ferrán Torres', 'Mikel Oyarzabal', 'Borja Iglesias', 'Nico Williams', 'Víctor Muñoz',
         'Ahmed Al Kassar', 'Mohammed Al Owais', 'Nawaf Al Aqidi', 'Hassan Al Tambakti', 'Ali Lajami', 'Abdullah Al Amri', 'Jehad Thakri', 'Hassan Kadesh', 'Saud Abdulhamid', 'Moteb Al Harbi', 'Nawaf Boushal', 'Ali Majrashi', 'Mohammed Abu', 'Nasser Al Dawsari', 'Mohammed Kanno', 'Abdullah Al Khaibari', 'Ziyad Al Johani', 'Musab Al Juwayr', 'Ala Al Hajji', 'Khalid Al Ghannam', 'Salem Al Dawsari', 'Sultan Mandash', 'Aiman Yahya', 'Abdullah Al Hamdan', 'Feras Al Buraikan', 'Saleh Al Shehri'] },
    { id: '38', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO G', local: 'BÉLGICA', bandera_local: '🇧🇪', visitante: 'IRÁN', bandera_visitante: '🇮🇷', fecha: '21 de Junio', fecha_iso: '2026-06-21', hora: '16:00', jugadores: ['Kevin De Bruyne', 'Jérémy Doku', 'Romelu Lukaku', 'Leandro Trossard', 'Youri Tielemans', 'Thibaut Courtois', 'Amadou Onana', 'Arthur Theate', 'Charles De Ketelaere', 'Timothy Castagne', 'Zeno Debast', 'Senne Lammens', 'Mike Penders', 'Maxim De Cuyper', 'Koni De Winter', 'Brandon Mechele', 'Thomas Meunier', 'Nathan Ngoy', 'Joaquin Seys', 'Nicolas Raskin', 'Hans Vanaken', 'Axel Witsel', 'Matías Fernández-Pardo', 'Dodi Lukébakio', 'Diego Moreira', 'Alexis Saelemaekers',
         'Alireza Beiranvand', 'Seyed Hossein Hosseini', 'Payam Niazmand', 'Danial ⁠Eiri', 'Ehsan Hajsafi', 'Saleh Hardani', 'Hossein Kanaani', 'Shoja Khalilzadeh', 'Milad Mohammadi', 'Ali Nemati', 'Ramin Rezaeian', 'Rouzbeh Cheshmi', 'Saeid Ezatolahi', 'Mehdi Ghaedi', 'Saman Ghoddos', 'Mohammad Ghorbani', 'Alireza Jahanbakhsh', 'Mohammad Mohebi', 'Amir Mohammad Razzaghinia', 'Mehdi Torabi', 'Aria Yousefi', 'Ali Alipour', 'Dennis Dargahi', 'Amirhossein Hosseinzadeh', 'Mehdi Taremi', 'Shahriar Moghanlou'] },
    { id: '39', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO H', local: 'URUGUAY', bandera_local: '🇺🇾', visitante: 'CABO VERDE', bandera_visitante: '🇨🇻', fecha: '21 de Junio', fecha_iso: '2026-06-21', hora: '19:00', jugadores: ['Sergio Rochet', 'Fernando Muslera', 'Santiago Mele', 'Ronald Araujo', 'Guillermo Varela', 'Jose María Giménez', 'Santiago Bueno', 'Sebatían Cáceres', 'Mathías Olivera', 'Matías Viña', 'Joaquín Piquerez', 'Manuel Ugarte', 'Rodrigo Bentancur', 'Federico Valverde', 'Giorgian De Arrascaeta', 'Rodrigo Zalazar', 'Nicolás de la Cruz', 'Agustín Canobbio', 'Facundo Pellistri', 'Brian Rodríguez', 'Juan Manuel Sanabria', 'Maximiliano Araujo', 'Darwin Núñez', 'Rodrigo Aguirre', 'Federico Viñas',
         'Ryan Mendes', 'Logan Costa', 'Josimar Dias (Vozinha)', 'Garry Rodrigues', 'Kevin Pina', 'Jovane Cabral', 'Roberto Lopes', 'Jamiro Monteiro', 'Steven Moreira', 'Deroy Duarte', 'Márcio Rosa', 'Carlos Santos', 'Wagner Pina', 'João Paulo Fernandes', 'Sidny Lopes Cabral', 'Kelvin Pires', 'Ianique Tavares (Stopíra)', 'Edilson Borges (Diney)', 'Telmo Arcanjo', 'Yannick Semedo', 'Laros Duarte', 'Willy Semedo', 'Nuno da Costa', 'Dailon Livramento', 'Gilson Tavares', 'Hélio Varela'] },
    { id: '40', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO G', local: 'NUEVA ZELANDA', bandera_local: '🇳🇿', visitante: 'EGIPTO', bandera_visitante: '🇪🇬', fecha: '21 de Junio', fecha_iso: '2026-06-21', hora: '22:00', jugadores: ['Mohamed Salah', 'Omar Marmoush', 'Mahmoud Trézéguet', 'Mohamed Abdelmonem', 'Mohamed El Shenawy', 'Emam Ashour', 'Ahmed Sayed', 'Mohamed Hany', 'Ahmed Fatouh', 'Mostafa Shobeir', 'Al-Mahdy Soliman', 'Mohamed Alaa', 'Tarek Alaa', 'Hamdy Fathy', 'Ramy Rabia', 'Yasser Ibrahim', 'Hossam Abdelmaguid', 'Karim Hafez', 'Marwan Attia', 'Mohanad Lasheen', 'Nabil Emad', 'Mahmoud Saber', 'Mostafa Ziko', 'Ibrahim Adel', 'Haissem Hassan',
         'Max Crocombe', 'Alex Paulsen', 'Michael Woud', 'Tyler Bindon', 'Michael Boxall', 'Liberato Cacace', 'Francis De Vries', 'Callan Elliot', 'Tim Payne', 'Nando Pijnaker', 'Tommy Smith', 'Finn Surman', 'Lachlan Bayliss', 'Joe Bell', 'Matt Garbett', 'Ben Old', 'Alex Rufer', 'Sarpreet Singh', 'Marko Stamenić', 'Ryan Thomas', 'Kosta Barbarouses', 'Eli Just', 'Callum McCowatt', 'Jesse Randall', 'Ben Waine', 'Chris Wood'] },
    { id: '41', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO J', local: 'ARGENTINA', bandera_local: '🇦🇷', visitante: 'AUSTRIA', bandera_visitante: '🇦🇹', fecha: '22 de Junio', fecha_iso: '2026-06-22', hora: '14:00', jugadores: ['Emiliano Martínez', 'Gerónimo Rulli', 'Juan Musso', 'Leonardo Balerdi', 'Nicolás Tagliafico', 'Gonzalo Montiel', 'Lisandro Martínez', 'Cristian Romero', 'Nicolás Otamendi', 'Facundo Medina', 'Nahuel Molina', 'Leandro Paredes', 'Rodrigo De Paul', 'Valentín Barco', 'Giovani Lo Celso', 'Exequiel Palacios', 'Alexis Mac Allister', 'Enzo Fernández', 'Julián Álvarez', 'Lionel Messi', 'Nico González', 'Thiago Almada', 'Giuliano Simeone', 'Nico Paz', 'José Manuel López', 'Lautaro Martínez',
         'Marcel Sabitzer', 'Konrad Laimer', 'David Alaba', 'Christoph Baumgartner', 'Kevin Danso', 'Michael Gregoritsch', 'Stefan Posch', 'Patrick Pentz', 'Patrick Wimmer', 'Nicolas Seiwald', 'Romano Schmid', 'Philipp Lienhart', 'Alexander Schlager', 'Florian Wiegele', 'David Affengruber', 'Phillipp Mwene', 'Alexander Prass', 'Marco Friedl', 'Michael Svoboda', 'Xaver Schlager', 'Florian Grillitsch', 'Carney Chukwuemeka', 'Paul Wanner', 'Alessandro Schöpf', 'Marko Arnautovic', 'Sasa Kalajdzic'] },
    { id: '42', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO I', local: 'FRANCIA', bandera_local: '🇫🇷', visitante: 'IRAK', bandera_visitante: '🇮🇶', fecha: '22 de Junio', fecha_iso: '2026-06-22', hora: '18:00', jugadores: ['Kylian Mbappé', 'Michael Olise', 'Mike Maignan', 'William Saliba', 'Aurélien Tchouaméni', 'Ousmane Dembélé', 'Theo Hernández', 'Bradley Barcola', 'Warren Zaïre-Emery', 'Marcus Thuram', 'Robin Risser', 'Brice Samba', 'Lucas Digne', 'Malo Gusto', 'Lucas Hernandez', 'Ibrahima Konate', 'Jules Kounde', 'Maxence Lacroix', 'Dayot Upamecano', 'NGolo Kante', 'Manu Kone', 'Adrien Rabiot', 'Maghnes Akliouche', 'Rayan Cherki', 'Desire Doue', 'Jean-Philippe Mateta',
         'Jalal Hassan', 'Ahmed Basil', 'Fahad Talib', 'Akam Hashen', 'Rebin Sulaka', 'Zaid Tahseem', 'Manaf Younis', 'Merchas Doski', 'Ahmed Yahya', 'Hussein Ali', 'Mustafa Saadoon', 'Frans Putros', 'Zaid Ismail', 'Zidane Iqbal', 'Aimar Sher', 'Amir Almmari', 'Kevin Yakob', 'Ibrahim Bayesh', 'Marko Farji', 'Youssef Amyn', 'Ahmed Qasim', 'Ali Jassim', 'Mohanad Ali', 'Aymen Hussein', 'Ali Al Hamadi', 'Ali Yousef'] },
    { id: '43', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO I', local: 'NORUEGA', bandera_local: '🇳🇴', visitante: 'SENEGAL', bandera_visitante: '🇸🇳', fecha: '22', fecha_iso: '2026-06-22', hora: '21:00', jugadores: ['Edouard Mendy', 'Mory Diaw', 'Yehvann Diouf', 'Krépin Diatta', 'Antoine Mendy', 'Kalidou Koulibaly', 'El Hadji Malick Diouf', 'Mamadou Sarr', 'Moussa Niakhaté', 'Abdoulaye Seck', 'Ismaïl Jakobs', 'Idrissa Gana Gueye', 'Pape Gueye', 'Lamine Camara', 'Habib Diarra', 'Pathé Ciss', 'Pape Matar Sarr', 'Bara Sapoko Ndiaye', 'Sadio Mané', 'Ismaïla Sarr', 'Iliman Ndiaye', 'Assane Diao', 'Ibrahim Mbaye', 'Nicolas Jackson', 'Bamba Dieng', 'Cherif Ndiaye',
         'Erling Haaland', 'Martin Ødegaard', 'Alexander Sørloth', 'Antonio Nusa', 'Julian Ryerson', 'Sander Berge', 'Oscar Bobb', 'Ørjan Nyland', 'Leo Østigård', 'David Møller Wolfe', 'Jørgen Strand Larsen', 'Egil Selvik', 'Sander Tangvik', 'Kristoffer Vassbakk Ajer', 'Fredrik Bjorkan', 'Henrik Falchener', 'Sondre Langas', 'Torbjorn Heggem', 'Marcus Holmgren Pedersen', 'Thelonious Aasgaard', 'Fredrik Aursnes', 'Patrick Berg', 'Jens Petter Hauge', 'Andreas Schjelderup', 'Morten Thorsby', 'Kristian Thorstvedt'] },
    { id: '44', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO J', local: 'JORDANIA', bandera_local: '🇯🇴', visitante: 'ARGELIA', bandera_visitante: '🇩🇿', fecha: '23 de Junio', fecha_iso: '2026-06-23', hora: '00:00', jugadores: ['Luca Zidane', 'Oussama Benbot', 'Melvin Mastil', 'Abdelatif Ramdane', 'Rafik Belghali', 'Samir Chergui', 'Rayan Aït-Nouri', 'Jaouen Hadjam', 'Aïssa Mandi', 'Ramy Bensebaini', 'Zineddine Belaïd', 'Achref Abada', 'Mohamed Amine Tougai', 'Nabil Bentaleb', 'Hicham Boudaoui', 'Houssem Aouar', 'Farès Chaïbi', 'Ibrahim Maza', 'Yacine Titraoui', 'Ramiz Zerrouki', 'Mohamed Amoura', 'Nadhir Benbouali', 'Adil Boulbina', 'Farès Ghedjemis', 'Amine Gouiri', 'Anis Hadj Moussa', 'Riyad Mahrez',
         'Yazid Abulaila', 'Abdallah Al Fakhouri', 'Nour Baniateyah', 'Mohammad Abualnadi', 'Husam Abu Dahab', 'Mohammad Abu Hashish', 'Mohannad Abu Taha', 'Yazan Al Arab', 'Saed Al Rosan', 'Anas Badawi', 'Abdallah Nasib', 'Ehsan Haddad', 'Saleem Obaid', 'Mohammad Al Dawoud', 'Nizar Al Rashdan', 'Noor Al Rawabdeh', 'Rajaei Ayed', 'Amer Jamous', 'Ibrahim Sadeh', 'Mohammad Abu Zraiq', 'Mousa Al Tamari', 'Ali Azaizeh', 'Odeh Fakhoury', 'Ali Olwan', 'Ibrahim Sabra', 'Mahmoud Almardi'] },
    { id: '45', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO K', local: 'PORTUGAL', bandera_local: '🇵🇹', visitante: 'UZBEKISTÁN', bandera_visitante: '🇺🇿', fecha: '23 de Junio', fecha_iso: '2026-06-23', hora: '14:00', jugadores: ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'Rafael Leão', 'Rúben Dias', 'Diogo Costa', 'João Félix', 'Vitinha', 'Nuno Mendes', 'João Neves', 'Gonçalo Ramos', 'José Sá', 'Rui Silva', 'Ricardo Velho', 'Diogo Dalot', 'Matheus Nunes', 'Nélson Semedo', 'Joao Cancelo', 'Gonçalo Inácio', 'Renato Veiga', 'Tomás Araújo', 'Rúben Neves', 'Samú Costa', 'Francisco Trincao', 'Francisco Conceiçao', 'Pedro Neto', 'Gonçalo Guedes',
         'Abduvokhid Nematov', 'Botirali Ergashev', 'Utkir Yusupov', 'Abdukodir Khusanov', 'Rustam Ashurmatov', 'Jakhongir Urozov', 'Sherzod Nasrullaev', 'Khozhiakbar Alizhonov', 'Bekhruz Karimov', 'Avazbek Ulmasaliev', 'Farrukh Sayfiev', 'Umar Eshmurodov', 'Odildzhon Khamrobekov', 'Abdulla Abdullaev', 'Azizjon Ganiev', 'Otabek Shukurov', 'Jamshid Iskanderov', 'Jaloliddin Masharipov', 'Sherzod Esanov', 'Akmal Mozgovoy', 'Eldor Shomurodov', 'Abbosbek Fayzullaev', 'Oston Urunov', 'Dostonbek Khamdamov', 'Igor Sergeev', 'Azizbek Amanov'] },
    { id: '46', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO L', local: 'INGLATERRA', bandera_local: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', visitante: 'GHANA', bandera_visitante: '🇬🇭', fecha: '23 de Junio', fecha_iso: '2026-06-23', hora: '17:00', jugadores: ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka', 'Declan Rice', 'Jordan Pickford', 'John Stones', 'Reece James', 'Marcus Rashford', 'Kobbie Mainoo', 'Marc Guéhi', 'Dean Henderson', 'James Trafford', 'Dan Burn', 'Ezri Konsa', 'Tino Livramento', 'Nico O Reilly', 'Jarell Quansah', 'Djed Spence', 'Elliot Anderson', 'Eberechi Eze', 'Jordan Henderson', 'Morgan Rogers', 'Anthony Gordon', 'Noni Madueke', 'Ivan Toney', 'Ollie Watkins',
         'Benjamín Asare', 'Lawrence Ati-Zigi', 'Joseph Anang', 'Salomon Agbasi', 'Paul Reverson', 'Baba Abdul Rahman', 'Gideon Mensah', 'Marvin Senaya', 'Alidu Seidu', 'Abdul Mumin', 'Jerome Opoku', 'Jonas Adjetey', 'Kojo Oppong Preprah', 'Alexander Djiku', 'Elisha Owusu', 'Thomas Partey', 'Kwasi Sibo', 'Augustine Boakye', 'Caleb Yirenkyi', 'Abdul Fatawu Issahaku', 'Kamal Deen Sulemana', 'Christopher Bonsu Baah', 'Ernest Nuamah', 'Antoine Semenyo', 'Brandon Thomas-Asante', 'Prince Kwabena Adu', 'Iñaki Williams', 'Jordan Ayew'] },
    { id: '47', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO L', local: 'PANAMÁ', bandera_local: '🇵🇦', visitante: 'CROACIA', bandera_visitante: '🇭🇷', fecha: '23 de Junio', fecha_iso: '2026-06-23', hora: '20:00', jugadores: ['Luka Modrić', 'Joško Gvardiol', 'Mateo Kovačić', 'Dominik Livaković', 'Martin Baturina', 'Andrej Kramarić', 'Josip Šutalo', 'Josip Stanišić', 'Mario Pašalić', 'Dominik Kotarski', 'Ivor Pandur', 'Duje Ćaleta-Car', 'Marin Pongračić', 'Martin Erlić', 'Luka Vušković', 'Nikola Vlašić', 'Luka Sučić', 'Kristijan Jakić', 'Petar Sučić', 'Nikola Moro', 'Toni Fruk', 'Ivan Perišić', 'Ante Budimir', 'Marco Pašalić', 'Petar Musa', 'Igor Matanović',
         'Orlando Mosquera', 'Luis Mejía', 'César Samudio', 'César Blackman', 'Jorge Gutiérrez', 'Amir Murillo', 'Fidel Escobar', 'Andrés Andrade', 'Edgardo Fariña', 'José Córdoba', 'Eric Davis', 'Jiovany Ramos', 'Roderick Miller', 'Aníbal Godoy', 'Adalberto Carrasquilla', 'Carlos Harvey', 'Cristian Martínez', 'José Luis Rodríguez', 'César Yanis', 'Yoel Bárcenas', 'Alberto Quintero', 'Azarías Londoño', 'Ismael Díaz', 'Cecilio Waterman', 'José Fajardo', 'Tomás Rodríguez'] },
    { id: '48', etapa: 'grupos', fase_nro: 2, grupo: 'GRUPO K', local: 'COLOMBIA', bandera_local: '🇨🇴', visitante: 'RD CONGO', bandera_visitante: '🇨🇩', fecha: '23 de Junio', fecha_iso: '2026-06-23', hora: '23:00', jugadores: ['Camilo Vargas', 'David Ospina', 'Álvaro Montero', 'Daniel Muñoz', 'Santiago Arias', 'Yerry Mina', 'Davinson Sánchez', 'Jhon Lucumí', 'Willer Ditta', 'Yohan Mojica', 'Déiver Machado', 'Richard Ríos', 'Jefferson Lerma', 'Gustavo Puerta', 'Kevin Castaño', 'Jhon Arias', 'James Rodríguez', 'Juan Fernando Quintero', 'Jorge Carrascal', 'Juan Camilo Portilla', 'Luis Díaz', 'Luis Suárez', 'Carlos Gómez', 'Jaminton Campaz', 'Jhon Córdoba', 'Juan Camilo Hernández',
         'Yoane Wissa', 'Théo Bongonda', 'Chancel Mbemba', 'Samuel Moutoussamy', 'Simon Banza', 'Elia Meschack', 'Arthur Masuaku', 'Charles Pickel', 'Dylan Batubinsika', 'Gédéon Kalulu', 'Gaël Kakuta', 'Timothy Fayulu', 'Matthieu Epolo', 'Lionel Mpasi', 'Aaron Wan-Bissaka', 'Joris Kayembe', 'Steve Kapuadi', 'Rocky Bushiri', 'Axel Tuanzebe', 'Noah Sadiki', 'Edo Kayembe', 'Ngalayel Mukau', 'Nathanaël Mbuku', 'Brian Cipenga', 'Fiston Mayele', 'Cédric Bakambu'] },
    

    { id: '49', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO B', local: 'SUIZA', bandera_local: '🇨🇭', visitante: 'CANADÁ', bandera_visitante: '🇨🇦', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '16:00', jugadores: ['Maxime Crépeau', 'Owen Goodman', 'Dayne St. Claire', 'Moïse Bombito', 'Derek Cornelius', 'Alphonso Davies', 'Luc de Fougerolles', 'Alistair Johnston', 'Alfie Jones', 'Richie Laryea', 'Niko Sigur', 'Joel Waterman', 'Ali Ahmed', 'Tajon Buchanan', 'Mathieu Choinière', 'Stephen Eustáquio', 'Marcelo Flores', 'Ismaël Koné', 'Liam Millar', 'Jonathan Osorio', 'Nathan Saliba', 'Jacob Shaffelburg', 'Jonathan David', 'Promise David', 'Cyle Larin', 'Tani Oluwaseyi',
         'Granit Xhaka', 'Manuel Akanji', 'Breel Embolo', 'Gregor Kobel', 'Remo Freuler', 'Ruben Vargas', 'Dan Ndoye', 'Zeki Amdouni', 'Michel Aebischer', 'Denis Zakaria', 'Silvan Widmer', 'Ricardo Rodríguez', 'Noah Okafor', 'Marvin Keller', 'Yvon Mvogo', 'Aurele Amenda', 'Eray Comert', 'Nico Elvedi', 'Luca Jaquez', 'Miro Muheim', 'Christian Fassnacht', 'Johan Manzambi', 'Djibril Sow', 'Cedric Itten', 'Fabian Rieder', 'Ardon Jashari'] },
    { id: '50', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO B', local: 'BOSNIA Y HERZEGOVINA', bandera_local: '🇧🇦', visitante: 'CATAR', bandera_visitante: '🇶🇦', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '16:00', jugadores: ['Edin Džeko', 'Sead Kolašinac', 'Ermedin Demirovic', 'Amar Dedić', 'Benjamin Tahirović', 'Nikola Vasilj', 'Martin Zlomislić', 'Osman Hadžikić', 'Nihad Mujakić', 'Nikola Katić', 'Tarik Muharemović', 'Stjepan Radeljić', 'Dennis Hadžikadunić', 'Nidal Čelik', 'Amir Hadžiahmetović', 'Ivan Šunjić', 'Ivan Bašić', 'Dženis Burnić', 'Ermin Mahmić', 'Amar Memić', 'Armin Gigović', 'Kerim Alajbegović', 'Esmir Bajraktarević', 'Jovo Lukić', 'Samed Baždar', 'Haris Tabaković',
         'Mahmoud Abunada', 'Meshaal Barsham', 'Salah Zakaria', 'Lucas Mendes', 'Issa Laye', 'Pedro Miguel', 'Al-Hashmi Al-Hussain', 'Boualem Khoukhi', 'Homam Ahmed Al-Amin', 'Sultan Al-Brake', 'Ayoub Al-Oui', 'Jassem Gaber', 'Mohamed Al-Mannai', 'Assim Madibo', 'Ahmed Fathi', 'Karim Bouadiaf', 'Abdulaziz Hatem', 'Hassan Al-Haydos', 'Akram Afif', 'Edmílson Júnior', 'Yusuf Abdurisag', 'Tahsin Jamshid', 'Ahmed Al-Ganehi', 'Almoez Ali', 'Ahmed Alaa’eldin', 'Mohammed Muntari'] },
    { id: '51', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO C', local: 'ESCOCIA', bandera_local: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', visitante: 'BRASIL', bandera_visitante: '🇧🇷', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '19:00', jugadores: ['Vinícius Júnior', 'Endrick Felipe', 'Neymar Júnior', 'Raphinha Dias', 'Gabriel Martinelli', 'Lucas Paquetá', 'Bruno Guimarães', 'Marquinhos', 'Gabriel Magalhães', 'Danilo da Silva', 'Alisson Becker', 'Ederson Moraes', 'Weverton', 'Alex Sandro', 'Gleison Bremer', 'Douglas Santos', 'Roger Ibáñez da Silva', 'Léo Pereira', 'Wesley Ribeiro Silva', 'Casemiro', 'Danilo dos Santos', 'Fabinho Tavares', 'Igor Thiago', 'Luiz Henrique', 'Matheus Cunha', 'Rayan',
         'Scott McTominay', 'John Mcginn', 'Billy Gilmour', 'Kieran Tierney', 'Angus Gunn', 'Jack Hendry', 'Che Adams', 'Ryan Christie', 'Lawrence Shankland', 'Lewis Ferguson', 'Craig Gordon', 'Liam Kelly', 'Grant Hanley', 'Aaron Hickey', 'Dominic Hyam', 'Scott McKenna', 'Nathan Patterson', 'Anthony Ralston', 'Andy Robertson', 'John Souttar', 'Findlay Curtis', 'Ben Gannon-Doak', 'Kenny McLean', 'Lyndon Dykes', 'George Hirst', 'Ross Stewart'] },
    { id: '52', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO C', local: 'MARRUECOS', bandera_local: '🇲🇦', visitante: 'HAITÍ', bandera_visitante: '🇭🇹', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '19:00', jugadores: ['Yassine Bounou', 'Munir Mohand Mohamedi', 'Ahmed Reda Tagnaouti', 'Achraf Hakimi', 'Noussair Mazraoui', 'Anass Salah-Eddine', 'Youssef Belammari', 'Issa Diop', 'Chadi Riad', 'Zakaria El Ouahdi', 'Redouane Halhal', 'Nayef Aguerd', 'Neil El Aynaoui', 'Bilal El Khannouss', 'Azzedine Ounahi', 'Ayyoub Bouaddi', 'Ismael Saibari', 'Sofyan Amrabat', 'Samir El Mourabet', 'Brahim Díaz', 'Abde Ezzalzouli', 'Ayoube Amaimouni', 'Soufiane Rahimi', 'Chemsdine Talbi', 'Gessime Yassine', 'Ayoub El Kaabi',
         'Duckens Nazon', 'Frantzdy Pierrot', 'Johny Placide', 'Carlens Arcus', 'Leverton Pierre', 'Ricardo Adé', 'Jean-Kévin Duverne', 'Alexandre Pierre', 'Josué Duverger', 'Wilguens Paugain', 'Duke Lacroix', 'Martin Experiénce', 'Hannes Delcroix', 'Keeto Thermoncy', 'Carl Sainté', 'Danley Jean Jacques', 'Jean-Ricner Bellegarde', 'Woodensky Pierre', 'Dominique Simon', 'Louicius Don Deedson', 'Ruben Providence', 'Josué Casimir', 'Derrick Etienne', 'Wilson Isidor', 'Yassin Fortune', 'Lenny Joseph'] },
    { id: '53', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO A', local: 'REP. CHECA', bandera_local: '🇨🇿', visitante: 'MÉXICO', bandera_visitante: '🇲🇽', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '22:00', jugadores: ['Raúl Rangel', 'Carlos Acevedo', 'Guillermo Ochoa', 'César Montes', 'Johan Vásquez', 'Mateo Chávez', 'Jesús Gallardo', 'Israel Reyes', 'Jorge Sánchez', 'Erik Lira', 'Luis Romo', 'Obed Vargas', 'Brian Gutiérrez', 'Oberlín Pineda', 'Edson Álvarez', 'Gilberto Mora', 'César Huerta', 'Álvaro Fidalgo', 'Luis Chávez', 'Roberto Alvarado', 'Alexis Vega', 'Julián Quiñones', 'Santiago Gimenez', 'Guillermo Martínez', 'Armando González', 'Raúl Jiménez',
         'Jindřich Staněk', 'Matěj Kovář', 'Lukáš Horníček', 'Vladimír Coufal', 'Tomáš Holeš', 'David Jurásek', 'Jaroslav Zelený', 'Ladislav Krejčí', 'Štěpán Chaloupek', 'Robin Hranáč', 'David Douděra', 'David Zima', 'Tomáš Souček', 'Lukáš Provod', 'Michal Sadílek', 'Pavel Šulc', 'Vladimír Darida', 'Alexandr Sojka', 'Lukáš Červ', 'Tomáš Ladra', 'Hugo Sochurek', 'Pavel Bucha', 'Denis Višinský', 'Tomáš Chorý', 'Patrik Schick', 'Mojmír Chytil', 'Jan Kuchta', 'Christophe Kabongo', 'Adam Hložek'] },
    { id: '54', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO A', local: 'SUDÁFRICA', bandera_local: '🇿🇦', visitante: 'COREA DEL SUR', bandera_visitante: '🇰🇷', fecha: '24 de Junio', fecha_iso: '2026-06-24', hora: '22:00', jugadores: ['Ronwen Williams', 'Ricardo Goss', 'Sipho Chaine', 'Khuliso Mudau', 'Olwethu Makhanya', 'Bradley Cross', 'Aubrey Modiba', 'Thabang Matuludi', 'Nkosinathi Sibisi', 'Ime Okon', 'Samukele Kabini', 'Mbekezeli Mbokazi', 'Kamolego Sebelebele', 'Khulumani Ndamane', 'Teboho Mokoena', 'Thalente Mbatha', 'Jayden Adams', 'Shephelo Sithole', 'Oswin Appollis', 'Tshepang Moremi', 'Evidence Makgopa', 'Lyle Foster', 'Ioraam Rayners', 'Relebohile Mofokeng', 'Themba Zawne', 'Thapelo Maseko',
         'Son Heung-Min', 'Kim Min-jae', 'Cho Gue-sung', 'Hwang In-beom', 'Jo Hyeon-woo', 'Lee Jae-sung', 'Paik Seung-ho', 'Oh Hyeon-gyu', 'Seol Young-woo', 'Kim Seung-Gyu', 'Song Bum-keun', 'Kim Moon-hwan', 'Kim Tae-hyeon', 'Park Jin-seop', 'Jens Castrop', 'Lee Ki-hyuk', 'Lee Tae-seok', 'Lee Han-beom', 'Cho Yu-min', 'Kim Jin-gyu', 'Jun-Ho Bae', 'Yang Hyun-jun', 'Eom Ji-sung', 'Lee Kang-in', 'Lee Dong-gyeong', 'Hwang Hee-chan'] },
    { id: '55', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO E', local: 'CURAZAO', bandera_local: '🇨🇼', visitante: 'COSTA DE MARFIL', bandera_visitante: '🇨🇮', fecha: '25 de Junio', fecha_iso: '2026-06-25', hora: '17:00', jugadores: ['Tahith Chong', 'Leandro Bacuna', 'Juninho Bacuna', 'Eloy Room', 'Armando Obispo', 'Riechedly Bazoer', 'Shurandy Sambo', 'Sherel Floranus', 'Juriën Gaari', 'Jürgen Locadia', 'Sontje Hansen', 'Livano Comenencia', 'Kenji Gorré', 'Tyrick Bodak', 'Trevor Doornbusch', 'Joshua Brenet', 'Roshon Van Eijma', 'Deveron Fonville', 'Kevin Felida', 'Arjany Martha', 'Tyrese Noslin', 'Godfried Roemeratoe', 'Jeremy Antonisse', 'Gervane Kastaneer', 'Brandley Kuwas', 'Jearl Margaritha',
         'Simon Adingra', 'Amad Diallo', 'Seko Fofana', 'Ibrahim Sangaré', 'Ousmane Diomandé', 'Evan N’Dicka', 'Elye Wahi', 'Yahia Fofana', 'Wilfried Singo', 'Nicolas Pépé', 'Evann Guessand', 'Mohamed Koné', 'Alban Lafont', 'Emmanuel Agbadou', 'Clément Akpa', 'Guéla Doué', 'Ghislain Konan', 'Odilon Kossounou', 'Parfait Guiagon', 'Christ Inao Oulai', 'Franck Kessié', 'Jean Michaël Seri', 'Ange-Yoan Bonny', 'Oumar Diakité', 'Yan Diomande', 'Bazoumana Touré'] },
    { id: '56', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO E', local: 'ECUADOR', bandera_local: '🇪🇨', visitante: 'ALEMANIA', bandera_visitante: '🇩🇪', fecha: '25', fecha_iso: '2026-06-25', hora: '17:00', jugadores: ['Florian Wirtz', 'Jamal Musiala', 'Kai Havertz', 'Joshua Kimmich', 'Antonio Rüdiger', 'Leroy Sané', 'Jonathan Tah', 'Deniz Undav', 'Oliver Baumann', 'Manuel Neuer', 'Alexander Nübel', 'Waldemar Anton', 'Nathaniel Brown', 'David Raum', 'Nico Schlotterbeck', 'Malick Thiaw', 'Pascal Groß', 'Felix Nmecha', 'Aleksandar Pavlović', 'Angelo Stiller', 'Nadiem Amiri', 'Leon Goretzka', 'Maximilian Beier', 'Lennart Karl', 'Jamie Leweling', 'Nick Woltemade',
         'Hernán Galíndez', 'Gonzalo Valle', 'Moisés Ramírez', 'Ángelo Preciado', 'Félix Torres', 'Jackson Porozo', 'Joel Ordóñez', 'Willian Pacho', 'Piero Hincapié', 'Yaimar Medina', 'Pervis Estupiñán', 'Alan Franco', 'Denil Castillo', 'John Yeboah', 'Jordy Alcívar', 'Kendry Páez', 'Moisés Caicedo', 'Pedro Vite', 'Alan Minda', 'Anthony Valencia', 'Gonzalo Plata', 'Enner Valencia', 'Jordy Caicedo', 'Jeremy Arévalo', 'Nilson Angulo', 'Kevin Rodríguez'] },
    { id: '57', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO F', local: 'JAPÓN', bandera_local: '🇯🇵', visitante: 'SUECIA', bandera_visitante: '🇸🇪', fecha: '25 de Junio', fecha_iso: '2026-06-25', hora: '20:00', jugadores: ['Takefusa Kubo', 'Wataru Endō', 'Zion Suzuki', 'Ritsu Dōan', 'Ayase Ueda', 'Hiroki Itō', 'Daichi Kamada', 'Yukinari Sugawara', 'Ao Tanaka', 'Kō Itakura', 'Daizen Maeda', 'Tomoki Hayakawa', 'Keisuke Ōsako', 'Yūto Nagatomo', 'Shōgo Taniguchi', 'Tsuyoshi Watanabe', 'Takehiro Tomiyasu', 'Ayumu Seko', 'Junnosuke Suzuki', 'Junya Itō', 'Keito Nakamura', 'Kaishū Sano', 'Yuito Suzuki', 'Kento Shiogai', 'Kōki Ogawa', 'Keisuke Gotō',
         'Viktor Gyökeres', 'Alexander Isak', 'Lucas Bergvall', 'Victor Lindelöf', 'Isak Hien', 'Anthony Elanga', 'Yasin Ayari', 'Daniel Svensson', 'Viktor Johansson', 'Kristoffer Nordfeldt', 'Jacob Widell Zetterström', 'Gabriel Gudmundsson', 'Emil Holm', 'Gustaf Lagerbielke', 'Eric Smith', 'Carl Starfelt', 'Elliot Stroud', 'Jesper Karlström', 'Mattias Svanberg', 'Besfort Zeneli', 'Ken Sema', 'Taha Ali', 'Alexander Bernhardsson', 'Gustaf Nilsson', 'Benjamin Nygren'] },
    { id: '58', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO F', local: 'TÚNEZ', bandera_local: '🇹🇳', visitante: 'PAISES BAJOS', bandera_visitante: '🇳🇱', fecha: '25 de Junio', fecha_iso: '2026-06-25', hora: '20:00', jugadores: ['Mark Flekken', 'Robin Roefs', 'Bart Verbruggen', 'Nathan Aké', 'Virgil van Dijk', 'Denzel Dumfries', 'Jorrel Hato', 'Jan Paul van Hecke', 'Jurriën Timber', 'Micky van de Ven', 'Ryan Gravenberch', 'Frenkie de Jong', 'Justin Kluivert', 'Teun Koopmeiners', 'Marten de Roon', 'Guus Til', 'Quinten Timber', 'Mats Wieffer', 'Brian Brobbey', 'Memphis Depay', 'Cody Gakpo', 'Noa Lang', 'Donyell Malen', 'Tijjani Reijnders', 'Crysencio Summerville', 'Wout Weghorst',
         'Hannibal Mejbri', 'Ellyes Skhiri', 'Elias Achouri', 'Ismaël Gharbi', 'Montassar Talbi', 'Aymen Dahmen', 'Elias Saad', 'Ali Abdi', 'Yan Valery', 'Rani Khedira', 'Marouane Chamakh', 'Sabri Ben Hassen', 'Moutaz Neffati', 'Dylan Bronn', 'Omar Rekik', 'Adem Arous', 'Raed Chikhaoui', 'Amine Ben Hamida', 'Hadj Mahmoud', 'Anis Ben Slimane', 'Mortadha Ben Ouanes', 'Khalil Ayari', 'Firas Chaouat', 'Hazem Mastouri', 'Rayan Elloumi', 'Sebastian Tounekti'] },
    { id: '59', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO D', local: 'TURQUÍA', bandera_local: '🇹🇷', visitante: 'ESTADOS UNIDOS', bandera_visitante: '🇺🇸', fecha: '25 de Junio', fecha_iso: '2026-06-25', hora: '23:00', jugadores: ['Matt Freese', 'Matt Turner', 'Chris Brady', 'Max Arfsten', 'Sergiño Dest', 'Alex Freeman', 'Mark McKenzie', 'Tim Ream', 'Chris Richards', 'Antonee Robinson', 'Miles Robinson', 'Joe Scally', 'Auston Trusty', 'Tyler Adams', 'Sebastian Berhalter', 'Weston McKennie', 'Cristian Roldán', 'Brenden Aaronson', 'Christian Pulisic', 'Gio Reyna', 'Malik Tillman', 'Tim Weah', 'Alejandro Zendejas', 'Folarin Balogun', 'Ricardo Pepi', 'Haji Wright',
         'Altay Bayındır', 'Mert Günok', 'Uğurcan Çakır', 'Abdülkerim Bardakcı', 'Merih Demiral', 'Çağlar Söyüncü', 'Eren Elmalı', 'Ferdi Kadıoğlu', 'Mert Müldür', 'Ozan Kabak', 'Samet Akaydin', 'Zeki Çelik', 'Hakan Çalhanoğlu', 'İsmail Yüksek', 'Kaan Ayhan', 'Orkun Kökçü', 'Salih Özcan', 'Arda Güler', 'Barış Alper Yılmaz', 'Can Uzun', 'Erencan Yardımcı', 'İrfan Can Kahveci', 'Kenan Yıldız', 'Kerem Aktürkoğlu', 'Oğuz Aydın', 'Semih Kılıçsoy'] },
    { id: '60', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO D', local: 'PARAGUAY', bandera_local: '🇵🇾', visitante: 'AUSTRALIA', bandera_visitante: '🇦🇺', fecha: '25 de Junio', fecha_iso: '2026-06-25', hora: '23:00', jugadores: ['Orlando Gill', 'Roberto Jr. Fernández', 'Gastón Olveira', 'Juan José Cáceres', 'José Canale', 'Fabián Balbuena', 'Omar Alderete', 'Gustavo Gómez', 'Alexandro Maidana', 'Junior Alonso', 'Gustavo Velázquez', 'Braian Ojeda', 'Damián Bobadilla', 'Andrés Cubas', 'Diego Gómez Gómez', 'Alejandro Romero Gamarra', 'Mauricio Prado', 'Matías Galarza', 'Ramón Sosa', 'Gustavo Caballero', 'Miguel Almirón', 'Gabriel Ávalos', 'Isidro Pitta', 'Álex Arce', 'Julio Enciso', 'Antonio Sanabria',
         'Patrick Beach', 'Paul Izzo', 'Aziz Behich', 'Jordan Bos', 'Cameron Burgess', 'Alessandro Circati', 'Milos Degenek', 'Jason Geria', 'Lucas Herrington', 'Jacob Italiano', 'Harry Souttar', 'Kai Trewin', 'Cameron Devlin', 'Ajdin Hrustić', 'Jackson Irvine', 'Connor Metcalfe', 'Paul Okon-Engstler', 'Aiden ONeill', 'Nestory Irankunda', 'Mathew Leckie', 'Awer Mabil', 'Mohamed Touré', 'Nishan Velupillay', 'Cristian Volpato', 'Tete Yengi'] },
    { id: '61', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO I', local: 'NORUEGA', bandera_local: '🇳🇴', visitante: 'FRANCIA', bandera_visitante: '🇫🇷', fecha: '26 de Junio', fecha_iso: '2026-06-26', hora: '16:00', jugadores: ['Kylian Mbappé', 'Michael Olise', 'Mike Maignan', 'William Saliba', 'Aurélien Tchouaméni', 'Ousmane Dembélé', 'Theo Hernández', 'Bradley Barcola', 'Warren Zaïre-Emery', 'Marcus Thuram', 'Robin Risser', 'Brice Samba', 'Lucas Digne', 'Malo Gusto', 'Lucas Hernandez', 'Ibrahima Konate', 'Jules Kounde', 'Maxence Lacroix', 'Dayot Upamecano', 'NGolo Kante', 'Manu Kone', 'Adrien Rabiot', 'Maghnes Akliouche', 'Rayan Cherki', 'Desire Doue', 'Jean-Philippe Mateta',
         'Erling Haaland', 'Martin Ødegaard', 'Alexander Sørloth', 'Antonio Nusa', 'Julian Ryerson', 'Sander Berge', 'Oscar Bobb', 'Ørjan Nyland', 'Leo Østigård', 'David Møller Wolfe', 'Jørgen Strand Larsen', 'Egil Selvik', 'Sander Tangvik', 'Kristoffer Vassbakk Ajer', 'Fredrik Bjorkan', 'Henrik Falchener', 'Sondre Langas', 'Torbjorn Heggem', 'Marcus Holmgren Pedersen', 'Thelonious Aasgaard', 'Fredrik Aursnes', 'Patrick Berg', 'Jens Petter Hauge', 'Andreas Schjelderup', 'Morten Thorsby', 'Kristian Thorstvedt'] },
    { id: '62', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO I', local: 'SENEGAL', bandera_local: '🇸🇳', visitante: 'IRAK', bandera_visitante: '🇮🇶', fecha: '26 de Junio', fecha_iso: '2026-06-26', hora: '16:00', jugadores: ['Jalal Hassan', 'Ahmed Basil', 'Fahad Talib', 'Akam Hashen', 'Rebin Sulaka', 'Zaid Tahseem', 'Manaf Younis', 'Merchas Doski', 'Ahmed Yahya', 'Hussein Ali', 'Mustafa Saadoon', 'Frans Putros', 'Zaid Ismail', 'Zidane Iqbal', 'Aimar Sher', 'Amir Almmari', 'Kevin Yakob', 'Ibrahim Bayesh', 'Marko Farji', 'Youssef Amyn', 'Ahmed Qasim', 'Ali Jassim', 'Mohanad Ali', 'Aymen Hussein', 'Ali Al Hamadi', 'Ali Yousef',
         'Edouard Mendy', 'Mory Diaw', 'Yehvann Diouf', 'Krépin Diatta', 'Antoine Mendy', 'Kalidou Koulibaly', 'El Hadji Malick Diouf', 'Mamadou Sarr', 'Moussa Niakhaté', 'Abdoulaye Seck', 'Ismaïl Jakobs', 'Idrissa Gana Gueye', 'Pape Gueye', 'Lamine Camara', 'Habib Diarra', 'Pathé Ciss', 'Pape Matar Sarr', 'Bara Sapoko Ndiaye', 'Sadio Mané', 'Ismaïla Sarr', 'Iliman Ndiaye', 'Assane Diao', 'Ibrahim Mbaye', 'Nicolas Jackson', 'Bamba Dieng', 'Cherif Ndiaye'] },
    { id: '63', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO H', local: 'CABO VERDE', bandera_local: '🇨🇻', visitante: 'ARABIA SAUDITA', bandera_visitante: '🇸🇦', fecha: '26', fecha_iso: '2026-06-26', hora: '21:00', jugadores: ['Ryan Mendes', 'Logan Costa', 'Josimar Dias (Vozinha)', 'Garry Rodrigues', 'Kevin Pina', 'Jovane Cabral', 'Roberto Lopes', 'Jamiro Monteiro', 'Steven Moreira', 'Deroy Duarte', 'Márcio Rosa', 'Carlos Santos', 'Wagner Pina', 'João Paulo Fernandes', 'Sidny Lopes Cabral', 'Kelvin Pires', 'Ianique Tavares (Stopíra)', 'Edilson Borges (Diney)', 'Telmo Arcanjo', 'Yannick Semedo', 'Laros Duarte', 'Willy Semedo', 'Nuno da Costa', 'Dailon Livramento', 'Gilson Tavares', 'Hélio Varela',
         'Ahmed Al Kassar', 'Mohammed Al Owais', 'Nawaf Al Aqidi', 'Hassan Al Tambakti', 'Ali Lajami', 'Abdullah Al Amri', 'Jehad Thakri', 'Hassan Kadesh', 'Saud Abdulhamid', 'Moteb Al Harbi', 'Nawaf Boushal', 'Ali Majrashi', 'Mohammed Abu', 'Nasser Al Dawsari', 'Mohammed Kanno', 'Abdullah Al Khaibari', 'Ziyad Al Johani', 'Musab Al Juwayr', 'Ala Al Hajji', 'Khalid Al Ghannam', 'Salem Al Dawsari', 'Sultan Mandash', 'Aiman Yahya', 'Abdullah Al Hamdan', 'Feras Al Buraikan', 'Saleh Al Shehri'] },
    { id: '64', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO H', local: 'URUGUAY', bandera_local: '🇺🇾', visitante: 'ESPAÑA', bandera_visitante: '🇪🇸', fecha: '26 de Junio', fecha_iso: '2026-06-26', hora: '21:00', jugadores: ['Sergio Rochet', 'Fernando Muslera', 'Santiago Mele', 'Ronald Araujo', 'Guillermo Varela', 'Jose María Giménez', 'Santiago Bueno', 'Sebatían Cáceres', 'Mathías Olivera', 'Matías Viña', 'Joaquín Piquerez', 'Manuel Ugarte', 'Rodrigo Bentancur', 'Federico Valverde', 'Giorgian De Arrascaeta', 'Rodrigo Zalazar', 'Nicolás de la Cruz', 'Agustín Canobbio', 'Facundo Pellistri', 'Brian Rodríguez', 'Juan Manuel Sanabria', 'Maximiliano Araujo', 'Darwin Núñez', 'Rodrigo Aguirre', 'Federico Viñas',
         'Unai Simón', 'David Raya', 'Joan García', 'Pedro Porro', 'Marcos Llorente', 'Aymeric Laporte', 'Pau Cubarsi', 'Marc Pubill', 'Eric García', 'Marc Cucurella', 'Alejandro Grimaldo', 'Rodrigo Hernández', 'Martín Zubimendi', 'Pedri', 'Fabían Ruiz', 'Dani Olmo', 'Mikel Merino', 'Gavi', 'Alex Baena', 'Lamine Yamal', 'Yeremy Pino', 'Ferrán Torres', 'Mikel Oyarzabal', 'Borja Iglesias', 'Nico Williams', 'Víctor Muñoz'] },
    { id: '65', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO G', local: 'EGIPTO', bandera_local: '🇪🇬', visitante: 'IRÁN', bandera_visitante: '🇮🇷', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '00:00', jugadores: ['Mohamed Salah', 'Omar Marmoush', 'Mahmoud Trézéguet', 'Mohamed Abdelmonem', 'Mohamed El Shenawy', 'Emam Ashour', 'Ahmed Sayed', 'Mohamed Hany', 'Ahmed Fatouh', 'Mostafa Shobeir', 'Al-Mahdy Soliman', 'Mohamed Alaa', 'Tarek Alaa', 'Hamdy Fathy', 'Ramy Rabia', 'Yasser Ibrahim', 'Hossam Abdelmaguid', 'Karim Hafez', 'Marwan Attia', 'Mohanad Lasheen', 'Nabil Emad', 'Mahmoud Saber', 'Mostafa Ziko', 'Ibrahim Adel', 'Haissem Hassan',
         'Alireza Beiranvand', 'Seyed Hossein Hosseini', 'Payam Niazmand', 'Danial ⁠Eiri', 'Ehsan Hajsafi', 'Saleh Hardani', 'Hossein Kanaani', 'Shoja Khalilzadeh', 'Milad Mohammadi', 'Ali Nemati', 'Ramin Rezaeian', 'Rouzbeh Cheshmi', 'Saeid Ezatolahi', 'Mehdi Ghaedi', 'Saman Ghoddos', 'Mohammad Ghorbani', 'Alireza Jahanbakhsh', 'Mohammad Mohebi', 'Amir Mohammad Razzaghinia', 'Mehdi Torabi', 'Aria Yousefi', 'Ali Alipour', 'Dennis Dargahi', 'Amirhossein Hosseinzadeh', 'Mehdi Taremi', 'Shahriar Moghanlou'] },
    { id: '66', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO G', local: 'NUEVA ZELANDA', bandera_local: '🇳🇿', visitante: 'BÉLGICA', bandera_visitante: '🇧🇪', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '00:00', jugadores: ['Kevin De Bruyne', 'Jérémy Doku', 'Romelu Lukaku', 'Leandro Trossard', 'Youri Tielemans', 'Thibaut Courtois', 'Amadou Onana', 'Arthur Theate', 'Charles De Ketelaere', 'Timothy Castagne', 'Zeno Debast', 'Senne Lammens', 'Mike Penders', 'Maxim De Cuyper', 'Koni De Winter', 'Brandon Mechele', 'Thomas Meunier', 'Nathan Ngoy', 'Joaquin Seys', 'Nicolas Raskin', 'Hans Vanaken', 'Axel Witsel', 'Matías Fernández-Pardo', 'Dodi Lukébakio', 'Diego Moreira', 'Alexis Saelemaekers',
         'Max Crocombe', 'Alex Paulsen', 'Michael Woud', 'Tyler Bindon', 'Michael Boxall', 'Liberato Cacace', 'Francis De Vries', 'Callan Elliot', 'Tim Payne', 'Nando Pijnaker', 'Tommy Smith', 'Finn Surman', 'Lachlan Bayliss', 'Joe Bell', 'Matt Garbett', 'Ben Old', 'Alex Rufer', 'Sarpreet Singh', 'Marko Stamenić', 'Ryan Thomas', 'Kosta Barbarouses', 'Eli Just', 'Callum McCowatt', 'Jesse Randall', 'Ben Waine', 'Chris Wood'] },
    { id: '67', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO L', local: 'PANAMÁ', bandera_local: '🇵🇦', visitante: 'INGLATERRA', bandera_visitante: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '18:00', jugadores: ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka', 'Declan Rice', 'Jordan Pickford', 'John Stones', 'Reece James', 'Marcus Rashford', 'Kobbie Mainoo', 'Marc Guéhi', 'Dean Henderson', 'James Trafford', 'Dan Burn', 'Ezri Konsa', 'Tino Livramento', 'Nico O Reilly', 'Jarell Quansah', 'Djed Spence', 'Elliot Anderson', 'Eberechi Eze', 'Jordan Henderson', 'Morgan Rogers', 'Anthony Gordon', 'Noni Madueke', 'Ivan Toney', 'Ollie Watkins',
         'Orlando Mosquera', 'Luis Mejía', 'César Samudio', 'César Blackman', 'Jorge Gutiérrez', 'Amir Murillo', 'Fidel Escobar', 'Andrés Andrade', 'Edgardo Fariña', 'José Córdoba', 'Eric Davis', 'Jiovany Ramos', 'Roderick Miller', 'Aníbal Godoy', 'Adalberto Carrasquilla', 'Carlos Harvey', 'Cristian Martínez', 'José Luis Rodríguez', 'César Yanis', 'Yoel Bárcenas', 'Alberto Quintero', 'Azarías Londoño', 'Ismael Díaz', 'Cecilio Waterman', 'José Fajardo', 'Tomás Rodríguez'] },
    { id: '68', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO L', local: 'CROACIA', bandera_local: '🇭🇷', visitante: 'GHANA', bandera_visitante: '🇬🇭', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '18:00', jugadores: ['Luka Modrić', 'Joško Gvardiol', 'Mateo Kovačić', 'Dominik Livaković', 'Martin Baturina', 'Andrej Kramarić', 'Josip Šutalo', 'Josip Stanišić', 'Mario Pašalić', 'Dominik Kotarski', 'Ivor Pandur', 'Duje Ćaleta-Car', 'Marin Pongračić', 'Martin Erlić', 'Luka Vušković', 'Nikola Vlašić', 'Luka Sučić', 'Kristijan Jakić', 'Petar Sučić', 'Nikola Moro', 'Toni Fruk', 'Ivan Perišić', 'Ante Budimir', 'Marco Pašalić', 'Petar Musa', 'Igor Matanović',
         'Benjamín Asare', 'Lawrence Ati-Zigi', 'Joseph Anang', 'Salomon Agbasi', 'Paul Reverson', 'Baba Abdul Rahman', 'Gideon Mensah', 'Marvin Senaya', 'Alidu Seidu', 'Abdul Mumin', 'Jerome Opoku', 'Jonas Adjetey', 'Kojo Oppong Preprah', 'Alexander Djiku', 'Elisha Owusu', 'Thomas Partey', 'Kwasi Sibo', 'Augustine Boakye', 'Caleb Yirenkyi', 'Abdul Fatawu Issahaku', 'Kamal Deen Sulemana', 'Christopher Bonsu Baah', 'Ernest Nuamah', 'Antoine Semenyo', 'Brandon Thomas-Asante', 'Prince Kwabena Adu', 'Iñaki Williams', 'Jordan Ayew'] },
    { id: '69', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO K', local: 'COLOMBIA', bandera_local: '🇨🇴', visitante: 'PORTUGAL', bandera_visitante: '🇵🇹', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '20:30', jugadores: ['Camilo Vargas', 'David Ospina', 'Álvaro Montero', 'Daniel Muñoz', 'Santiago Arias', 'Yerry Mina', 'Davinson Sánchez', 'Jhon Lucumí', 'Willer Ditta', 'Yohan Mojica', 'Déiver Machado', 'Richard Ríos', 'Jefferson Lerma', 'Gustavo Puerta', 'Kevin Castaño', 'Jhon Arias', 'James Rodríguez', 'Juan Fernando Quintero', 'Jorge Carrascal', 'Juan Camilo Portilla', 'Luis Díaz', 'Luis Suárez', 'Carlos Gómez', 'Jaminton Campaz', 'Jhon Córdoba', 'Juan Camilo Hernández',
         'Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'Rafael Leão', 'Rúben Dias', 'Diogo Costa', 'João Félix', 'Vitinha', 'Nuno Mendes', 'João Neves', 'Gonçalo Ramos', 'José Sá', 'Rui Silva', 'Ricardo Velho', 'Diogo Dalot', 'Matheus Nunes', 'Nélson Semedo', 'Joao Cancelo', 'Gonçalo Inácio', 'Renato Veiga', 'Tomás Araújo', 'Rúben Neves', 'Samú Costa', 'Francisco Trincao', 'Francisco Conceiçao', 'Pedro Neto', 'Gonçalo Guedes'] },
    { id: '70', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO K', local: 'RD CONGO', bandera_local: '🇨🇩', visitante: 'UZBEKISTÁN', bandera_visitante: '🇺🇿', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '20:30', jugadores: ['Yoane Wissa', 'Théo Bongonda', 'Chancel Mbemba', 'Samuel Moutoussamy', 'Simon Banza', 'Elia Meschack', 'Arthur Masuaku', 'Charles Pickel', 'Dylan Batubinsika', 'Gédéon Kalulu', 'Gaël Kakuta', 'Timothy Fayulu', 'Matthieu Epolo', 'Lionel Mpasi', 'Aaron Wan-Bissaka', 'Joris Kayembe', 'Steve Kapuadi', 'Rocky Bushiri', 'Axel Tuanzebe', 'Noah Sadiki', 'Edo Kayembe', 'Ngalayel Mukau', 'Nathanaël Mbuku', 'Brian Cipenga', 'Fiston Mayele', 'Cédric Bakambu',
         'Abduvokhid Nematov', 'Botirali Ergashev', 'Utkir Yusupov', 'Abdukodir Khusanov', 'Rustam Ashurmatov', 'Jakhongir Urozov', 'Sherzod Nasrullaev', 'Khozhiakbar Alizhonov', 'Bekhruz Karimov', 'Avazbek Ulmasaliev', 'Farrukh Sayfiev', 'Umar Eshmurodov', 'Odildzhon Khamrobekov', 'Abdulla Abdullaev', 'Azizjon Ganiev', 'Otabek Shukurov', 'Jamshid Iskanderov', 'Jaloliddin Masharipov', 'Sherzod Esanov', 'Akmal Mozgovoy', 'Eldor Shomurodov', 'Abbosbek Fayzullaev', 'Oston Urunov', 'Dostonbek Khamdamov', 'Igor Sergeev', 'Azizbek Amanov'] },
    { id: '71', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO J', local: 'ARGELIA', bandera_local: '🇩🇿', visitante: 'AUSTRIA', bandera_visitante: '🇦🇹', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '23:00', jugadores: ['Marcel Sabitzer', 'Konrad Laimer', 'David Alaba', 'Christoph Baumgartner', 'Kevin Danso', 'Michael Gregoritsch', 'Stefan Posch', 'Patrick Pentz', 'Patrick Wimmer', 'Nicolas Seiwald', 'Romano Schmid', 'Philipp Lienhart', 'Alexander Schlager', 'Florian Wiegele', 'David Affengruber', 'Phillipp Mwene', 'Alexander Prass', 'Marco Friedl', 'Michael Svoboda', 'Xaver Schlager', 'Florian Grillitsch', 'Carney Chukwuemeka', 'Paul Wanner', 'Alessandro Schöpf', 'Marko Arnautovic', 'Sasa Kalajdzic',
         'Luca Zidane', 'Oussama Benbot', 'Melvin Mastil', 'Abdelatif Ramdane', 'Rafik Belghali', 'Samir Chergui', 'Rayan Aït-Nouri', 'Jaouen Hadjam', 'Aïssa Mandi', 'Ramy Bensebaini', 'Zineddine Belaïd', 'Achref Abada', 'Mohamed Amine Tougai', 'Nabil Bentaleb', 'Hicham Boudaoui', 'Houssem Aouar', 'Farès Chaïbi', 'Ibrahim Maza', 'Yacine Titraoui', 'Ramiz Zerrouki', 'Mohamed Amoura', 'Nadhir Benbouali', 'Adil Boulbina', 'Farès Ghedjemis', 'Amine Gouiri', 'Anis Hadj Moussa', 'Riyad Mahrez'] },
    { id: '72', etapa: 'grupos', fase_nro: 3, grupo: 'GRUPO J', local: 'JORDANIA', bandera_local: '🇯🇴', visitante: 'ARGENTINA', bandera_visitante: '🇦🇷', fecha: '27 de Junio', fecha_iso: '2026-06-27', hora: '23:00', jugadores: ['Emiliano Martínez', 'Gerónimo Rulli', 'Juan Musso', 'Leonardo Balerdi', 'Nicolás Tagliafico', 'Gonzalo Montiel', 'Lisandro Martínez', 'Cristian Romero', 'Nicolás Otamendi', 'Facundo Medina', 'Nahuel Molina', 'Leandro Paredes', 'Rodrigo De Paul', 'Valentín Barco', 'Giovani Lo Celso', 'Exequiel Palacios', 'Alexis Mac Allister', 'Enzo Fernández', 'Julián Álvarez', 'Lionel Messi', 'Nico González', 'Thiago Almada', 'Giuliano Simeone', 'Nico Paz', 'José Manuel López', 'Lautaro Martínez',
         'Yazid Abulaila', 'Abdallah Al Fakhouri', 'Nour Baniateyah', 'Mohammad Abualnadi', 'Husam Abu Dahab', 'Mohammad Abu Hashish', 'Mohannad Abu Taha', 'Yazan Al Arab', 'Saed Al Rosan', 'Anas Badawi', 'Abdallah Nasib', 'Ehsan Haddad', 'Saleem Obaid', 'Mohammad Al Dawoud', 'Nizar Al Rashdan', 'Noor Al Rawabdeh', 'Rajaei Ayed', 'Amer Jamous', 'Ibrahim Sadeh', 'Mohammad Abu Zraiq', 'Mousa Al Tamari', 'Ali Azaizeh', 'Odeh Fakhoury', 'Ali Olwan', 'Ibrahim Sabra', 'Mahmoud Almardi'] },

         
    { id: '1001', etapa: '16avos', local: '2A', bandera_local: '🏳️', visitante: '2B', bandera_visitante: '🏳️', fecha: '28 de Junio', fecha_iso: '2026-06-28', hora: '16:00', jugadores: [] }, 
    { id: '1002', etapa: '16avos', local: '1C', bandera_local: '🏳️', visitante: '2F', bandera_visitante: '🏳️', fecha: '29 de Junio', fecha_iso: '2026-06-29', hora: '14:00', jugadores: [] },  
    { id: '1003', etapa: '16avos', local: '1E', bandera_local: '🏳️', visitante: '3ABCDF', bandera_visitante: '🏳️', fecha: '29 de Junio', fecha_iso: '2026-06-29', hora: '17:30', jugadores: [] },  
    { id: '1004', etapa: '16avos', local: '1F', bandera_local: '🏳️', visitante: '2C', bandera_visitante: '🏳️', fecha: '29 de Junio', fecha_iso: '2026-06-29', hora: '22:00', jugadores: [] },  
    { id: '1005', etapa: '16avos', local: '2E', bandera_local: '🏳️', visitante: '2I', bandera_visitante: '🏳️', fecha: '30 de Junio', fecha_iso: '2026-06-30', hora: '14:00', jugadores: [] },  
    { id: '1006', etapa: '16avos', local: '1I', bandera_local: '🏳️', visitante: '3CDFGH', bandera_visitante: '🏳️', fecha: '30 de Junio', fecha_iso: '2026-06-30', hora: '18:00', jugadores: [] },  
    { id: '1007', etapa: '16avos', local: '1A', bandera_local: '🏳️', visitante: '3CEFHI', bandera_visitante: '🏳️', fecha: '30 de Junio', fecha_iso: '2026-06-30', hora: '22:00', jugadores: [] },  
    { id: '1008', etapa: '16avos', local: '1L', bandera_local: '🏳️', visitante: '3EHIJK', bandera_visitante: '🏳️', fecha: '1 de Julio', fecha_iso: '2026-07-01', hora: '13:00', jugadores: [] },  
    { id: '1009', etapa: '16avos', local: '1G', bandera_local: '🏳️', visitante: '3AEHIJ', bandera_visitante: '🏳️', fecha: '1 de Julio', fecha_iso: '2026-07-01', hora: '17:00', jugadores: [] },  
    { id: '1010', etapa: '16avos', local: '1D', bandera_local: '🏳️', visitante: '3BEFIJ', bandera_visitante: '🏳️', fecha: '1 de Julio', fecha_iso: '2026-07-01', hora: '21:00', jugadores: [] },
    { id: '1011', etapa: '16avos', local: '1H', bandera_local: '🏳️', visitante: '2J', bandera_visitante: '🏳️', fecha: '2 de Julio', fecha_iso: '2026-07-02', hora: '16:00', jugadores: [] },  
    { id: '1012', etapa: '16avos', local: '2K', bandera_local: '🏳️', visitante: '2L', bandera_visitante: '🏳️', fecha: '2 de Julio', fecha_iso: '2026-07-02', hora: '20:00', jugadores: [] },  
    { id: '1013', etapa: '16avos', local: '1B', bandera_local: '🏳️', visitante: '3EFGIJ', bandera_visitante: '🏳️', fecha: '3 de Julio', fecha_iso: '2026-07-03', hora: '00:00', jugadores: [] },  
    { id: '1014', etapa: '16avos', local: '2D', bandera_local: '🏳️', visitante: '2G', bandera_visitante: '🏳️', fecha: '3 de Julio', fecha_iso: '2026-07-03', hora: '15:00', jugadores: [] },  
    { id: '1015', etapa: '16avos', local: '1J', bandera_local: '🏳️', visitante: '2H', bandera_visitante: '🏳️', fecha: '3 de Julio', fecha_iso: '2026-07-03', hora: '19:00', jugadores: [] },  
    { id: '1016', etapa: '16avos', local: '1K', bandera_local: '🏳️', visitante: '3DEIJL', bandera_visitante: '🏳️', fecha: '3 de Julio', fecha_iso: '2026-07-03', hora: '22:30', jugadores: [] },  

    { id: '2001', etapa: '8avos', local: '1001', bandera_local: '🏳️', visitante: '1002', bandera_visitante: '🏳️', fecha: '4 de Julio', fecha_iso: '2026-07-04', hora: '18:00', jugadores: [] },  
    { id: '2002', etapa: '8avos', local: '1003', bandera_local: '🏳️', visitante: '1004', bandera_visitante: '🏳️', fecha: '4 de Julio', fecha_iso: '2026-07-04', hora: '14:00', jugadores: [] },  
    { id: '2003', etapa: '8avos', local: '1005', bandera_local: '🏳️', visitante: '1006', bandera_visitante: '🏳️', fecha: '5 de Julio', fecha_iso: '2026-07-05', hora: '17:00', jugadores: [] },  
    { id: '2004', etapa: '8avos', local: '1007', bandera_local: '🏳️', visitante: '1008', bandera_visitante: '🏳️', fecha: '5 de Julio', fecha_iso: '2026-07-05', hora: '21:00', jugadores: [] },  
    { id: '2005', etapa: '8avos', local: '1009', bandera_local: '🏳️', visitante: '1010', bandera_visitante: '🏳️', fecha: '6 de Julio', fecha_iso: '2026-07-06', hora: '16:00', jugadores: [] },  
    { id: '2006', etapa: '8avos', local: '1011', bandera_local: '🏳️', visitante: '1012', bandera_visitante: '🏳️', fecha: '6 de Julio', fecha_iso: '2026-07-06', hora: '21:00', jugadores: [] },  
    { id: '2007', etapa: '8avos', local: '1013', bandera_local: '🏳️', visitante: '1014', bandera_visitante: '🏳️', fecha: '7 de Julio', fecha_iso: '2026-07-07', hora: '13:00', jugadores: [] },  
    { id: '2008', etapa: '8avos', local: '1015', bandera_local: '🏳️', visitante: '1016', bandera_visitante: '🏳️', fecha: '7 de Julio', fecha_iso: '2026-07-07', hora: '17:00', jugadores: [] },  

    { id: '3001', etapa: 'cuartos', local: '2001', bandera_local: '🏳️', visitante: '2002', bandera_visitante: '🏳️', fecha: '9 de Julio', fecha_iso: '2026-07-09', hora: '17:00', jugadores: [] },  
    { id: '3002', etapa: 'cuartos', local: '2003', bandera_local: '🏳️', visitante: '2004', bandera_visitante: '🏳️', fecha: '10 de Julio', fecha_iso: '2026-07-10', hora: '16:00', jugadores: [] },  
    { id: '3003', etapa: 'cuartos', local: '2005', bandera_local: '🏳️', visitante: '2006', bandera_visitante: '🏳️', fecha: '11 de Julio', fecha_iso: '2026-07-11', hora: '18:00', jugadores: [] },  
    { id: '3004', etapa: 'cuartos', local: '2007', bandera_local: '🏳️', visitante: '2008', bandera_visitante: '🏳️', fecha: '11 de Julio', fecha_iso: '2026-07-11', hora: '22:00', jugadores: [] },  

    { id: '4001', etapa: 'semis', local: '3001', bandera_local: '🏳️', visitante: '3002', bandera_visitante: '🏳️', fecha: '14 de Julio', fecha_iso: '2026-07-14', hora: '16:00', jugadores: [] },  
    { id: '4002', etapa: 'semis', local: '3003', bandera_local: '🏳️', visitante: '3004', bandera_visitante: '🏳️', fecha: '15 de Julio', fecha_iso: '2026-07-15', hora: '16:00', jugadores: [] },  

    { id: '5001', etapa: 'final', local: '4001', bandera_local: '🏳️', visitante: '4002', bandera_visitante: '🏳️', fecha: '19 de Julio', fecha_iso: '2026-07-19', hora: '16:00', jugadores: [] },  
    { id: '5002', etapa: 'final', local: '4001', bandera_local: '🏳️', visitante: '4002', bandera_visitante: '🏳️', fecha: '18 de Julio', fecha_iso: '2026-07-18', hora: '18:00', jugadores: [] },  
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
    cargarMisPredicciones(parsedUser.mail || parsedUser.email);
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

  if (!user || !user.email) {
    alert("❌ Error: No se detectó tu sesión. Por favor, volvé a ingresar.");
    return;
  }

  setLoading(partidoId);
  const p = pronosticos[partidoId];

  try {
    // 3. El UPSERT: La clave está en el 'onConflict'
    const { error } = await supabase
      .from('predicciones')
      .upsert({
        usuario_email: user.mail || user.email,
        partido_id: partidoId,
        goles_local: p?.goles_local || 0,
        goles_visitante: p?.goles_visitante || 0,
        jugador_partido: p?.jugador_partido || ''
      }, { 
        // ESTO es lo que le dice a Supabase: "Si coinciden mail y partido, pisalo"
        onConflict: 'usuario_email, partido_id' 
      });

    if (error) throw error;
    alert(`✅ Pronóstico para ${partidoInfo.local} vs ${partidoInfo.visitante} guardado correctamente.`);  
  } catch (err: any) {
    console.error("Error al guardar predicción:", err);
    alert(`❌ Error al guardar: ${err.message || 'Intenta nuevamente.'}`);
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
                      {/* Esto va justo abajo del botón de confirmar */}
                      {bloqueado && (
                        <button 
                          onClick={() => setPartidoParaComparar(partido)}
                          className="w-full mt-2 py-2 border border-slate-500 rounded-xl text-[10px] font-bold text-slate-400 hover:text-[#F6C83E]"
                        >
                          🔍 COMPARAR PREDICCIONES
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
      {/* Y esto ponelo al final de todo el return, antes del último </main> */}
                      {partidoParaComparar && (
                        <ModalComparador 
                          partido={partidoParaComparar} 
                          onClose={() => setPartidoParaComparar(null)} 
                        />
                      )}
    </main>
  );
}
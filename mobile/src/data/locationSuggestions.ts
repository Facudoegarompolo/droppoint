export type LocationSuggestion = {
  title: string;
  subtitle: string;
  value: string;
  keywords: string[];
};

type PlaceSeed = {
  title: string;
  province: string;
  aliases?: string[];
  kind?: string;
};

const localSuggestions: LocationSuggestion[] = [
  {
    title: "UADE",
    subtitle: "Lima 775, Monserrat",
    value: "UADE, Lima 775, CABA",
    keywords: ["uade", "universidad argentina de la empresa", "lima 775", "monserrat"]
  },
  {
    title: "Universidad de Palermo",
    subtitle: "Mario Bravo 1050, Palermo",
    value: "Universidad de Palermo, Mario Bravo 1050, CABA",
    keywords: ["up", "universidad de palermo", "palermo", "mario bravo"]
  },
  {
    title: "Facultad de Derecho UBA",
    subtitle: "Av. Figueroa Alcorta 2263, Recoleta",
    value: "Facultad de Derecho UBA, CABA",
    keywords: ["uba", "derecho", "facultad de derecho", "figueroa alcorta", "recoleta"]
  },
  {
    title: "UTN Medrano",
    subtitle: "Av. Medrano 951, Almagro",
    value: "UTN Medrano, Av. Medrano 951, CABA",
    keywords: ["utn", "medrano", "almagro"]
  },
  {
    title: "Estación Palermo",
    subtitle: "Av. Santa Fe y Juan B. Justo",
    value: "Estación Palermo, CABA",
    keywords: ["estacion palermo", "palermo", "santa fe", "juan b justo", "tren"]
  },
  {
    title: "Plaza Italia",
    subtitle: "Av. Santa Fe y Thames",
    value: "Plaza Italia, CABA",
    keywords: ["plaza italia", "santa fe", "thames", "palermo"]
  },
  {
    title: "Alto Palermo",
    subtitle: "Av. Santa Fe y Coronel Diaz",
    value: "Alto Palermo, CABA",
    keywords: ["alto palermo", "santa fe", "coronel diaz", "shopping"]
  },
  {
    title: "Av. Corrientes y Medrano",
    subtitle: "Almagro, CABA",
    value: "Av. Corrientes y Medrano, CABA",
    keywords: ["corrientes", "medrano", "almagro", "subte b"]
  },
  {
    title: "Av. Santa Fe y Scalabrini Ortiz",
    subtitle: "Palermo, CABA",
    value: "Av. Santa Fe y Scalabrini Ortiz, CABA",
    keywords: ["santa fe", "scalabrini", "scalabrini ortiz", "palermo"]
  },
  {
    title: "Av. Pueyrredon y Santa Fe",
    subtitle: "Recoleta, CABA",
    value: "Av. Pueyrredon y Av. Santa Fe, CABA",
    keywords: ["pueyrredon", "santa fe", "recoleta", "subte h"]
  },
  {
    title: "Obelisco",
    subtitle: "Av. 9 de Julio y Corrientes",
    value: "Obelisco, CABA",
    keywords: ["obelisco", "9 de julio", "corrientes", "centro"]
  }
];

const nationalPlaces: PlaceSeed[] = [
  { title: "Ciudad Autónoma de Buenos Aires", province: "CABA", aliases: ["caba", "capital federal", "buenos aires"] },
  { title: "La Plata", province: "Buenos Aires" },
  { title: "Mar del Plata", province: "Buenos Aires" },
  { title: "Bahía Blanca", province: "Buenos Aires" },
  { title: "Tandil", province: "Buenos Aires" },
  { title: "Olavarría", province: "Buenos Aires" },
  { title: "Junín", province: "Buenos Aires" },
  { title: "Pergamino", province: "Buenos Aires" },
  { title: "Luján", province: "Buenos Aires" },
  { title: "Pilar", province: "Buenos Aires" },
  { title: "Escobar", province: "Buenos Aires" },
  { title: "Campana", province: "Buenos Aires" },
  { title: "Zárate", province: "Buenos Aires" },
  { title: "San Nicolás de los Arroyos", province: "Buenos Aires", aliases: ["san nicolas"] },
  { title: "Vicente López", province: "Buenos Aires", aliases: ["zona norte"] },
  { title: "Olivos", province: "Buenos Aires", aliases: ["zona norte", "tren mitre"] },
  { title: "San Isidro", province: "Buenos Aires", aliases: ["zona norte", "tren mitre"] },
  { title: "Tigre", province: "Buenos Aires", aliases: ["zona norte", "delta"] },
  { title: "General San Martín", province: "Buenos Aires", aliases: ["san martin", "tren san martin"] },
  { title: "Ramos Mejía", province: "Buenos Aires", aliases: ["zona oeste", "sarmiento"] },
  { title: "Morón", province: "Buenos Aires", aliases: ["zona oeste", "sarmiento"] },
  { title: "Merlo", province: "Buenos Aires", aliases: ["zona oeste"] },
  { title: "Moreno", province: "Buenos Aires", aliases: ["zona oeste"] },
  { title: "Avellaneda", province: "Buenos Aires", aliases: ["zona sur", "tren roca"] },
  { title: "Lanús", province: "Buenos Aires", aliases: ["zona sur", "tren roca"] },
  { title: "Lomas de Zamora", province: "Buenos Aires", aliases: ["zona sur", "tren roca"] },
  { title: "Quilmes", province: "Buenos Aires", aliases: ["zona sur", "tren roca"] },
  { title: "Florencio Varela", province: "Buenos Aires", aliases: ["zona sur"] },
  { title: "Ezeiza", province: "Buenos Aires", aliases: ["aeropuerto ezeiza"] },
  { title: "Córdoba", province: "Córdoba", aliases: ["cordoba capital"] },
  { title: "Villa Carlos Paz", province: "Córdoba", aliases: ["carlos paz"] },
  { title: "Río Cuarto", province: "Córdoba" },
  { title: "Villa María", province: "Córdoba" },
  { title: "Rosario", province: "Santa Fe" },
  { title: "Santa Fe", province: "Santa Fe", aliases: ["santa fe capital"] },
  { title: "Rafaela", province: "Santa Fe" },
  { title: "Venado Tuerto", province: "Santa Fe" },
  { title: "Mendoza", province: "Mendoza", aliases: ["mendoza capital"] },
  { title: "San Rafael", province: "Mendoza" },
  { title: "Godoy Cruz", province: "Mendoza" },
  { title: "Guaymallén", province: "Mendoza" },
  { title: "Salta", province: "Salta", aliases: ["salta capital"] },
  { title: "San Miguel de Tucumán", province: "Tucumán", aliases: ["tucuman", "tucuman capital"] },
  { title: "Yerba Buena", province: "Tucumán" },
  { title: "San Salvador de Jujuy", province: "Jujuy", aliases: ["jujuy"] },
  { title: "San Fernando del Valle de Catamarca", province: "Catamarca", aliases: ["catamarca"] },
  { title: "La Rioja", province: "La Rioja" },
  { title: "San Juan", province: "San Juan" },
  { title: "San Luis", province: "San Luis" },
  { title: "Villa Mercedes", province: "San Luis" },
  { title: "Santiago del Estero", province: "Santiago del Estero" },
  { title: "La Banda", province: "Santiago del Estero" },
  { title: "Resistencia", province: "Chaco" },
  { title: "Presidencia Roque Sáenz Peña", province: "Chaco", aliases: ["saenz pena"] },
  { title: "Corrientes", province: "Corrientes" },
  { title: "Goya", province: "Corrientes" },
  { title: "Formosa", province: "Formosa" },
  { title: "Posadas", province: "Misiones" },
  { title: "Puerto Iguazú", province: "Misiones", aliases: ["iguazu"] },
  { title: "Oberá", province: "Misiones" },
  { title: "Paraná", province: "Entre Ríos" },
  { title: "Concordia", province: "Entre Ríos" },
  { title: "Gualeguaychú", province: "Entre Ríos" },
  { title: "Neuquén", province: "Neuquén" },
  { title: "San Martín de los Andes", province: "Neuquén" },
  { title: "Bariloche", province: "Río Negro", aliases: ["san carlos de bariloche"] },
  { title: "Viedma", province: "Río Negro" },
  { title: "General Roca", province: "Río Negro" },
  { title: "Cipolletti", province: "Río Negro" },
  { title: "Santa Rosa", province: "La Pampa" },
  { title: "General Pico", province: "La Pampa" },
  { title: "Rawson", province: "Chubut" },
  { title: "Trelew", province: "Chubut" },
  { title: "Puerto Madryn", province: "Chubut" },
  { title: "Comodoro Rivadavia", province: "Chubut" },
  { title: "Río Gallegos", province: "Santa Cruz" },
  { title: "El Calafate", province: "Santa Cruz" },
  { title: "Ushuaia", province: "Tierra del Fuego" },
  { title: "Río Grande", province: "Tierra del Fuego" }
];

const transportHubs: PlaceSeed[] = [
  { title: "Retiro", province: "CABA", kind: "Terminal / estación", aliases: ["terminal retiro", "tren mitre", "tren san martin", "belgrano norte"] },
  { title: "Constitución", province: "CABA", kind: "Estación", aliases: ["tren roca", "subte c"] },
  { title: "Once", province: "CABA", kind: "Estación", aliases: ["plaza miserere", "tren sarmiento", "subte a"] },
  { title: "Aeroparque Jorge Newbery", province: "CABA", kind: "Aeropuerto", aliases: ["aeroparque", "jorge newbery", "aep"] },
  { title: "Aeropuerto Internacional de Ezeiza", province: "Buenos Aires", kind: "Aeropuerto", aliases: ["ezeiza", "ministro pistarini", "eze"] },
  { title: "Terminal de Ómnibus de Córdoba", province: "Córdoba", kind: "Terminal" },
  { title: "Terminal de Ómnibus de Rosario", province: "Santa Fe", kind: "Terminal" },
  { title: "Terminal de Ómnibus de Mendoza", province: "Mendoza", kind: "Terminal" },
  { title: "Terminal de Ómnibus de La Plata", province: "Buenos Aires", kind: "Terminal" },
  { title: "Terminal de Ómnibus de Mar del Plata", province: "Buenos Aires", kind: "Terminal" },
  { title: "Terminal de Ómnibus de Salta", province: "Salta", kind: "Terminal" },
  { title: "Terminal de Ómnibus de Tucumán", province: "Tucumán", kind: "Terminal" },
  { title: "Aeropuerto Internacional Córdoba", province: "Córdoba", kind: "Aeropuerto", aliases: ["pajas blancas"] },
  { title: "Aeropuerto Internacional Mendoza", province: "Mendoza", kind: "Aeropuerto", aliases: ["el plumerillo"] },
  { title: "Aeropuerto Rosario", province: "Santa Fe", kind: "Aeropuerto", aliases: ["fisherton"] },
  { title: "Aeropuerto Bariloche", province: "Río Negro", kind: "Aeropuerto" },
  { title: "Aeropuerto Ushuaia", province: "Tierra del Fuego", kind: "Aeropuerto" }
];

const universities: PlaceSeed[] = [
  { title: "Universidad de Buenos Aires", province: "CABA", aliases: ["uba"] },
  { title: "Universidad Nacional de La Plata", province: "Buenos Aires", aliases: ["unlp"] },
  { title: "Universidad Nacional de Córdoba", province: "Córdoba", aliases: ["unc"] },
  { title: "Universidad Nacional de Rosario", province: "Santa Fe", aliases: ["unr"] },
  { title: "Universidad Nacional de Cuyo", province: "Mendoza", aliases: ["uncuyo"] },
  { title: "Universidad Nacional de Mar del Plata", province: "Buenos Aires", aliases: ["unmdp"] },
  { title: "Universidad Nacional del Litoral", province: "Santa Fe", aliases: ["unl"] },
  { title: "Universidad Nacional de Tucumán", province: "Tucumán", aliases: ["unt"] },
  { title: "Universidad Nacional de Salta", province: "Salta", aliases: ["unsa"] },
  { title: "Universidad Nacional del Comahue", province: "Neuquén", aliases: ["unco"] },
  { title: "Universidad Nacional del Sur", province: "Buenos Aires", aliases: ["uns", "bahia blanca"] },
  { title: "Universidad Nacional de Quilmes", province: "Buenos Aires", aliases: ["unq"] },
  { title: "Universidad Nacional de San Martín", province: "Buenos Aires", aliases: ["unsam"] },
  { title: "Universidad Nacional de Lanús", province: "Buenos Aires", aliases: ["unla"] },
  { title: "Universidad Nacional de La Matanza", province: "Buenos Aires", aliases: ["unlam"] }
];

function placeToSuggestion(place: PlaceSeed): LocationSuggestion {
  const subtitle = place.kind ? `${place.kind}, ${place.province}` : `${place.province}, Argentina`;
  return {
    title: place.title,
    subtitle,
    value: `${place.title}, ${place.province}, Argentina`,
    keywords: [place.title, place.province, "argentina", ...(place.aliases ?? [])]
  };
}

const suggestions: LocationSuggestion[] = [
  ...localSuggestions,
  ...transportHubs.map(placeToSuggestion),
  ...universities.map(placeToSuggestion),
  ...nationalPlaces.map(placeToSuggestion)
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(av|avenida|calle|ruta|rn|rp)\b/g, "")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreSuggestion(query: string, suggestion: LocationSuggestion) {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) return 0;

  const searchable = normalize(
    [suggestion.title, suggestion.subtitle, suggestion.value, ...suggestion.keywords].join(" ")
  );
  const title = normalize(suggestion.title);
  const queryParts = normalizedQuery.split(" ").filter(Boolean);

  let score = 0;
  if (title === normalizedQuery) score += 120;
  if (title.startsWith(normalizedQuery)) score += 55;
  if (searchable.includes(normalizedQuery)) score += 35;
  score += queryParts.filter((part) => searchable.includes(part)).length * 12;

  return score;
}

function typedLocationSuggestion(query: string): LocationSuggestion | null {
  const trimmed = query.trim();
  if (trimmed.length < 3) return null;

  return {
    title: `Usar "${trimmed}"`,
    subtitle: "Ubicación escrita manualmente",
    value: trimmed,
    keywords: [trimmed]
  };
}

export function findLocationSuggestions(query: string, limit = 5) {
  const normalizedQuery = normalize(query);
  const matches = suggestions
    .map((suggestion) => ({ suggestion, score: scoreSuggestion(query, suggestion) }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit - 1)
    .map((item) => item.suggestion);

  const hasExactMatch = matches.some((suggestion) => normalize(suggestion.value) === normalizedQuery);
  const typed = hasExactMatch ? null : typedLocationSuggestion(query);

  return typed ? [...matches, typed].slice(0, limit) : matches;
}

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

const buenosAiresPlaces: PlaceSeed[] = [
  { title: "Ciudad Autónoma de Buenos Aires", province: "CABA", aliases: ["caba", "capital federal", "buenos aires"] },
  { title: "San Miguel", province: "Buenos Aires", aliases: ["zona noroeste", "tren san martin"] },
  { title: "Bella Vista", province: "Buenos Aires", aliases: ["san miguel", "zona noroeste", "tren san martin"] },
  { title: "Muñiz", province: "Buenos Aires", aliases: ["san miguel", "tren san martin"] },
  { title: "José C. Paz", province: "Buenos Aires", aliases: ["jose c paz", "zona noroeste"] },
  { title: "Hurlingham", province: "Buenos Aires", aliases: ["zona oeste", "tren san martin"] },
  { title: "Villa de Mayo", province: "Buenos Aires", aliases: ["malvinas argentinas", "zona noroeste"] },
  { title: "Malvinas Argentinas", province: "Buenos Aires", aliases: ["los polvorines", "villa de mayo"] },
  { title: "La Plata", province: "Buenos Aires" },
  { title: "Luján", province: "Buenos Aires" },
  { title: "Pilar", province: "Buenos Aires" },
  { title: "Escobar", province: "Buenos Aires" },
  { title: "Vicente López", province: "Buenos Aires", aliases: ["zona norte"] },
  { title: "Olivos", province: "Buenos Aires", aliases: ["zona norte", "tren mitre"] },
  { title: "San Isidro", province: "Buenos Aires", aliases: ["zona norte", "tren mitre"] },
  { title: "Tigre", province: "Buenos Aires", aliases: ["zona norte", "delta"] },
  { title: "General San Martín", province: "Buenos Aires", aliases: ["san martin", "tren san martin"] },
  { title: "Ramos Mejía", province: "Buenos Aires", aliases: ["zona oeste", "sarmiento"] },
  { title: "Morón", province: "Buenos Aires", aliases: ["zona oeste", "sarmiento"] },
  { title: "Castelar", province: "Buenos Aires", aliases: ["zona oeste", "sarmiento"] },
  { title: "Ituzaingó", province: "Buenos Aires", aliases: ["zona oeste", "sarmiento"] },
  { title: "Merlo", province: "Buenos Aires", aliases: ["zona oeste"] },
  { title: "Moreno", province: "Buenos Aires", aliases: ["zona oeste"] },
  { title: "Avellaneda", province: "Buenos Aires", aliases: ["zona sur", "tren roca"] },
  { title: "Lanús", province: "Buenos Aires", aliases: ["zona sur", "tren roca"] },
  { title: "Lomas de Zamora", province: "Buenos Aires", aliases: ["zona sur", "tren roca"] },
  { title: "Quilmes", province: "Buenos Aires", aliases: ["zona sur", "tren roca"] },
  { title: "Florencio Varela", province: "Buenos Aires", aliases: ["zona sur"] },
  { title: "Ezeiza", province: "Buenos Aires", aliases: ["aeropuerto ezeiza"] }
];

const transportHubs: PlaceSeed[] = [
  { title: "Retiro", province: "CABA", kind: "Terminal / estación", aliases: ["terminal retiro", "tren mitre", "tren san martin", "belgrano norte"] },
  { title: "Constitución", province: "CABA", kind: "Estación", aliases: ["tren roca", "subte c"] },
  { title: "Once", province: "CABA", kind: "Estación", aliases: ["plaza miserere", "tren sarmiento", "subte a"] },
  { title: "Federico Lacroze", province: "CABA", kind: "Estación", aliases: ["chacarita", "tren urquiza", "subte b"] },
  { title: "Villa del Parque", province: "CABA", kind: "Estación", aliases: ["tren san martin"] },
  { title: "Liniers", province: "CABA", kind: "Estación", aliases: ["tren sarmiento", "general paz"] },
  { title: "Aeroparque Jorge Newbery", province: "CABA", kind: "Aeropuerto", aliases: ["aeroparque", "jorge newbery", "aep"] },
  { title: "Aeropuerto Internacional de Ezeiza", province: "Buenos Aires", kind: "Aeropuerto", aliases: ["ezeiza", "ministro pistarini", "eze"] },
  { title: "Terminal de Ómnibus de La Plata", province: "Buenos Aires", kind: "Terminal" }
];

const universities: PlaceSeed[] = [
  { title: "Universidad de Buenos Aires", province: "CABA", aliases: ["uba"] },
  { title: "Universidad Nacional de La Plata", province: "Buenos Aires", aliases: ["unlp"] },
  { title: "Universidad Nacional de Quilmes", province: "Buenos Aires", aliases: ["unq"] },
  { title: "Universidad Nacional de San Martín", province: "Buenos Aires", aliases: ["unsam"] },
  { title: "Universidad Nacional de Lanús", province: "Buenos Aires", aliases: ["unla"] },
  { title: "Universidad Nacional de La Matanza", province: "Buenos Aires", aliases: ["unlam"] }
];

function placeToSuggestion(place: PlaceSeed): LocationSuggestion {
  const subtitle = place.kind ? `${place.kind}, ${place.province}` : place.province;
  return {
    title: place.title,
    subtitle,
    value: `${place.title}, ${place.province}`,
    keywords: [place.title, place.province, "buenos aires", "amba", ...(place.aliases ?? [])]
  };
}

const suggestions: LocationSuggestion[] = [
  ...localSuggestions,
  ...transportHubs.map(placeToSuggestion),
  ...universities.map(placeToSuggestion),
  ...buenosAiresPlaces.map(placeToSuggestion)
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
    subtitle: "Ubicación escrita manualmente en Buenos Aires",
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

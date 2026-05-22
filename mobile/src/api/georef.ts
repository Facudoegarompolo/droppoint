import { LocationSuggestion } from "../data/locationSuggestions";

const GEOREF_API_URL = "https://apis.datos.gob.ar/georef/api/v2.0";
const BUENOS_AIRES_PROVINCES = ["Ciudad Autónoma de Buenos Aires", "Buenos Aires"];
const BUENOS_AIRES_LOCALITIES = [
  "San Miguel",
  "Bella Vista",
  "Muñiz",
  "José C. Paz",
  "Jose C Paz",
  "Hurlingham",
  "Pilar",
  "Morón",
  "Ramos Mejía",
  "Castelar",
  "Ituzaingó",
  "Vicente López",
  "Olivos",
  "San Isidro",
  "Tigre",
  "General San Martín",
  "Avellaneda",
  "Lanús",
  "Lomas de Zamora",
  "Quilmes",
  "La Plata",
  "Ezeiza"
];

type GeorefLocation = {
  nombre?: string;
  provincia?: {
    nombre?: string;
  };
  gobierno_local?: {
    nombre?: string;
  };
  localidad_censal?: {
    nombre?: string;
  };
};

type GeorefAddress = {
  nomenclatura?: string;
  calle?: {
    nombre?: string;
  };
  altura?: {
    valor?: number;
  };
  provincia?: {
    nombre?: string;
  };
  departamento?: {
    nombre?: string;
  };
  localidad_censal?: {
    nombre?: string;
  };
  ubicacion?: {
    lat?: number;
    lon?: number;
  };
};

type GeorefLocationsResponse = {
  localidades?: GeorefLocation[];
};

type GeorefAddressesResponse = {
  direcciones?: GeorefAddress[];
};

function buildUrl(path: string, params: Record<string, string>) {
  const url = new URL(`${GEOREF_API_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value.trim()) {
      url.searchParams.set(key, value.trim());
    }
  });
  return url.toString();
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T | null> {
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    return null;
  }
}

function hasStreetNumber(query: string) {
  return /\d{2,}/.test(query);
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function splitAddressQuery(query: string) {
  const parts = query.split(",").map((part) => part.trim()).filter(Boolean);
  const context = parts.slice(1).join(" ");
  const inferredContext = inferContext(query, context);
  const address = cleanAddress(parts[0] ?? query, inferredContext.locality);

  return {
    address,
    context,
    ...inferredContext
  };
}

function inferContext(query: string, explicitContext: string) {
  const contextSource = normalize(`${query} ${explicitContext}`);
  const locality = BUENOS_AIRES_LOCALITIES.find((item) => contextSource.includes(normalize(item))) ?? "";
  const mentionsCaba = /\b(caba|capital federal|ciudad autonoma)\b/.test(contextSource)
    || containsAny(contextSource, "monserrat", "palermo", "recoleta", "caballito", "retiro", "belgrano", "chacarita", "almagro");
  const mentionsProvince = containsAny(contextSource, "provincia de buenos aires", "gba", "amba", "zona norte", "zona oeste", "zona sur")
    || Boolean(locality);
  const provinces = mentionsCaba
    ? ["Ciudad Autónoma de Buenos Aires"]
    : mentionsProvince
      ? ["Buenos Aires"]
      : BUENOS_AIRES_PROVINCES;

  return {
    provinces,
    locality
  };
}

function cleanAddress(address: string, locality: string) {
  return [locality, "Ciudad Autónoma de Buenos Aires", "Buenos Aires", "Capital Federal", "CABA", "Argentina"]
    .filter(Boolean)
    .reduce((cleaned, removable) => cleaned.replace(new RegExp(escapeRegExp(removable), "gi"), ""), address)
    .replace(/\s+/g, " ")
    .trim();
}

function containsAny(value: string, ...terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isBuenosAiresProvince(name?: string) {
  const normalized = normalize(name ?? "");
  return normalized === "buenos aires" || normalized === "ciudad autonoma de buenos aires";
}

function addressToSuggestion(address: GeorefAddress): LocationSuggestion | null {
  if (!address.nomenclatura && !address.calle?.nombre) return null;

  const street = address.calle?.nombre;
  const number = address.altura?.valor;
  const title = address.nomenclatura ?? [street, number].filter(Boolean).join(" ");
  const locality = address.localidad_censal?.nombre ?? address.departamento?.nombre;
  const province = address.provincia?.nombre;
  const subtitle = [locality, province].filter(Boolean).join(", ");
  const value = [title, locality, province].filter(Boolean).join(", ");

  return {
    title,
    subtitle: subtitle || "Dirección normalizada por Georef",
    value,
    keywords: [title, street, locality, province, "buenos aires", "amba"].filter(Boolean) as string[]
  };
}

function locationToSuggestion(location: GeorefLocation): LocationSuggestion | null {
  if (!location.nombre || !location.provincia?.nombre) return null;

  const area = location.gobierno_local?.nombre ?? location.localidad_censal?.nombre;

  return {
    title: location.nombre,
    subtitle: [area, location.provincia.nombre].filter(Boolean).join(", "),
    value: `${location.nombre}, ${location.provincia.nombre}`,
    keywords: [location.nombre, area, location.provincia.nombre, "buenos aires", "amba"].filter(Boolean) as string[]
  };
}

function uniqueSuggestions(suggestions: LocationSuggestion[]) {
  const seen = new Set<string>();
  return suggestions.filter((suggestion) => {
    const key = suggestion.value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function findGeorefSuggestions(query: string, signal?: AbortSignal): Promise<LocationSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const { address, provinces, locality } = splitAddressQuery(trimmed);

  const localityUrls = provinces.map((province) => buildUrl("/localidades", {
    nombre: trimmed,
    max: "4",
    provincia: province,
    campos: "nombre,provincia.nombre,gobierno_local.nombre,localidad_censal.nombre"
  }));

  const addressUrls = provinces.map((province) => buildUrl("/direcciones", {
    direccion: address,
    max: hasStreetNumber(address) ? "5" : "3",
    campos: "nomenclatura,calle.nombre,altura.valor,ubicacion,provincia.nombre,departamento.nombre,localidad_censal.nombre",
    provincia: province,
    localidad: province === "Buenos Aires" ? locality : ""
  }));

  const [locationsResponses, addressesResponses] = await Promise.all([
    Promise.all(localityUrls.map((url) => fetchJson<GeorefLocationsResponse>(url, signal))),
    Promise.all(addressUrls.map((url) => fetchJson<GeorefAddressesResponse>(url, signal)))
  ]);

  const addressSuggestions = addressesResponses
    .flatMap((response) => response?.direcciones ?? [])
    .filter((address) => isBuenosAiresProvince(address.provincia?.nombre))
    .map(addressToSuggestion)
    .filter(Boolean) as LocationSuggestion[];
  const locationSuggestions = locationsResponses
    .flatMap((response) => response?.localidades ?? [])
    .filter((location) => isBuenosAiresProvince(location.provincia?.nombre))
    .map(locationToSuggestion)
    .filter(Boolean) as LocationSuggestion[];
  const orderedSuggestions = hasStreetNumber(address)
    ? [...addressSuggestions, ...locationSuggestions]
    : [...locationSuggestions, ...addressSuggestions];

  return uniqueSuggestions(orderedSuggestions).slice(0, 6);
}

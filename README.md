# DropPoint

DropPoint es un MVP mobile para decidir dónde conviene que un pasajero se baje de un auto compartido y continúe en transporte público o caminando, cuidando dos cosas: que el conductor no tenga un desvío molesto y que el pasajero mantenga un trayecto cómodo.

El monorepo incluye:

```text
droppoint/
  api/      Spring Boot backend
  mobile/   Expo React Native app
```

## Funcionalidad del MVP

- Carga de origen común, destino del conductor, destino del pasajero y hora aproximada de salida.
- Preferencias simples: máximo desvío del conductor, máxima caminata del pasajero y prioridad.
- Endpoint `POST /api/dropoff/optimize`.
- Proveedor mock obligatorio para probar sin API keys.
- Arquitectura preparada para sumar Google Maps más adelante.
- App mobile con pantalla inicial, resultados y detalle de cada opción.

## Backend

Requisitos:

- Java 21+
- Maven 3.9+

Ejecutar:

```bash
cd droppoint/api
mvn spring-boot:run
```

La API queda disponible en:

```text
http://localhost:8080
```

Probar el endpoint:

```bash
curl -X POST http://localhost:8080/api/dropoff/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Universidad de Palermo, CABA",
    "driverDestination": "Recoleta, CABA",
    "passengerDestination": "Caballito, CABA",
    "departureTime": "2026-05-16T18:00:00",
    "preferences": {
      "maxDriverDetourMinutes": 10,
      "maxPassengerWalkMinutes": 12,
      "priority": "BALANCED"
    }
  }'
```

Tests:

```bash
cd droppoint/api
mvn test
```

## Mobile

Requisitos:

- Node.js LTS 20 o 22. Expo SDK 51 puede comportarse mal con Node 25+.
- npm
- Expo CLI vía `npx expo`

Instalar y correr:

```bash
cd droppoint/mobile
nvm use
npm install
npm run start
```

Variables de entorno:

```bash
cp .env.example .env
```

Por defecto:

```text
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

Si usás Android Emulator, probablemente necesites:

```text
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080
```

Typecheck:

```bash
cd droppoint/mobile
npm run typecheck
```

## Modo Mock

El backend usa mock por defecto:

```properties
droppoint.route-provider=mock
```

`MockRouteProvider` devuelve puntos simulados en CABA con tiempos, caminata y transbordos realistas. Esto permite probar la app completa sin Google Maps API keys.

## Preparación Para Google Maps

Ya existe `GoogleMapsRouteProvider` como esqueleto. Para avanzar con integración real:

1. Configurar una API key:

```bash
export GOOGLE_MAPS_API_KEY=tu_api_key
```

2. Activar el proveedor:

```bash
cd droppoint/api
mvn spring-boot:run -Dspring-boot.run.arguments="--droppoint.route-provider=google"
```

3. Completar `GoogleMapsRouteProvider` usando APIs de rutas/direcciones y tránsito.

La idea es mantener estable `RouteProvider`, para cambiar el proveedor de mapas sin tocar el controller ni la app mobile.

## Algoritmo Inicial

La primera versión:

1. Obtiene candidatos desde el `RouteProvider`.
2. Filtra por máximo desvío del conductor y máxima caminata del pasajero.
3. Calcula score:

```text
score = 100
  - driverExtraMinutes * 3
  - passengerTotalMinutes * 1
  - passengerWalkMinutes * 1.5
  - passengerTransfers * 5
```

4. Ajusta ligeramente los pesos según prioridad.
5. Ordena de mejor a peor y devuelve hasta 5 opciones.

## Próximos Pasos

- Implementar candidatos reales sobre la ruta del conductor.
- Usar tránsito real para estimar tiempo del pasajero.
- Mostrar un mapa embebido en mobile.
- Guardar búsquedas recientes de forma local en el dispositivo.
- Agregar tests de controller y estados vacíos en mobile.

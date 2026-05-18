# DropPoint - Deploy y prueba con amigos

Esta guía deja el backend online en Render y la app mobile apuntando a esa URL pública, sin publicar todavía en App Store ni Play Store.

> Nota: este repo actual es DropPoint. Si más adelante lo renombrás o lo convertís en otra app, los pasos son los mismos, pero deberías ajustar nombres, package ids y URLs.

## 1. Backend en Render

Render no tiene runtime nativo para Java/Spring Boot, así que este proyecto queda preparado con Docker.

Archivos relevantes:

- `api/Dockerfile`
- `api/.dockerignore`
- `render.yaml`
- `api/src/main/resources/application.properties`
- `api/src/main/java/com/droppoint/api/controller/HealthController.java`

### Variables de entorno

En Render, configurar:

```text
SPRING_PROFILES_ACTIVE=prod
CORS_ALLOWED_ORIGIN_PATTERNS=*
GOOGLE_MAPS_API_KEY=
```

Para el MVP mock, `GOOGLE_MAPS_API_KEY` puede quedar vacío.

El backend usa:

```properties
server.port=${PORT:8080}
droppoint.cors.allowed-origin-patterns=${CORS_ALLOWED_ORIGIN_PATTERNS:*}
```

Render inyecta `PORT`; localmente sigue usando `8080`.

### Deploy con Blueprint

1. Subí el repo a GitHub.
2. Entrá a Render.
3. New > Blueprint.
4. Elegí el repo.
5. Render detecta `render.yaml`.
6. Creá el servicio `droppoint-api`.

Render va a usar:

```yaml
runtime: docker
rootDir: api
healthCheckPath: /api/health
plan: free
```

Con Docker no cargás manualmente build/start command en Render. El build sale del `Dockerfile` y el start sale del `CMD`:

```bash
java -jar app.jar
```

### Verificar backend online

Cuando Render termine, vas a tener una URL:

```text
https://droppoint-api.onrender.com
```

Probá:

```bash
curl https://droppoint-api.onrender.com/api/health
```

Y el endpoint principal:

```bash
curl -X POST https://droppoint-api.onrender.com/api/dropoff/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "UADE, Lima 775, CABA",
    "driverDestination": "Recoleta, CABA",
    "passengerDestination": "Caballito, CABA",
    "departureTime": "2026-05-18T18:00:00",
    "preferences": {
      "maxDriverDetourMinutes": 10,
      "maxPassengerWalkMinutes": 12,
      "priority": "BALANCED"
    }
  }'
```

### Limitación del plan gratis

En Render free, el servicio puede dormir si no recibe tráfico. La primera request después de estar dormido puede tardar más. Para mostrar la app, conviene abrir `/api/health` unos minutos antes.

## 2. Frontend apuntando a Render

La app ya usa:

```text
EXPO_PUBLIC_API_BASE_URL
```

El cliente centraliza la URL en:

```text
mobile/src/config/env.ts
```

### Desarrollo local

Crear `mobile/.env`:

```bash
cp mobile/.env.development.example mobile/.env
```

Ejemplos:

```text
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

Para Android Emulator:

```text
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080
```

Para celular físico en la misma WiFi:

```text
EXPO_PUBLIC_API_BASE_URL=http://TU_IP_LOCAL:8080
```

### Producción / demo con backend público

Cuando tengas la URL de Render:

```bash
cp mobile/.env.production.example mobile/.env
```

Editar:

```text
EXPO_PUBLIC_API_BASE_URL=https://TU-SERVICIO.onrender.com
```

Reiniciar Expo con cache limpio:

```bash
cd mobile
npx expo start --clear
```

## 3. Android: APK compartible

La forma más simple sin Play Store es una build preview con EAS en formato APK.

Antes de construir:

1. Editá `mobile/eas.json`.
2. Reemplazá `https://TU-SERVICIO.onrender.com` por tu URL real de Render.

Instalar/configurar EAS:

```bash
cd mobile
npx eas login
npx eas build:configure
```

Generar APK:

```bash
npm run build:android:preview
```

Equivalente:

```bash
npx eas build -p android --profile preview
```

Cuando termine, EAS te da un link de descarga. Ese link se puede mandar por WhatsApp/Telegram/email. En Android, la persona abre el link, descarga el APK y acepta instalar desde fuente externa.

Para instalar en emulador:

```bash
npx eas build:run -p android --latest
```

## 4. iOS: mejor opción gratuita

Para iPhone sin pagar Apple Developer, la opción realista es Expo Go.

Pasos:

```bash
cd mobile
npx expo start --tunnel --clear
```

Tus amigos instalan Expo Go desde App Store y escanean el QR.

Ventajas:

- Gratis.
- No requiere App Store.
- Sirve bien para mostrar un MVP.
- Con el backend en Render, no dependen de tu backend local.

Limitaciones:

- Tu computadora debe seguir corriendo el servidor de Expo.
- Expo Go no es una app instalada con tu ícono final.
- No sirve si agregás librerías nativas no incluidas en Expo Go.
- El SDK del proyecto debe ser compatible con la versión instalada de Expo Go.
- Sin Apple Developer pago no podés distribuir cómodamente una IPA a varios iPhones, ni TestFlight, ni App Store.

Si más adelante querés algo más cercano a producción en iPhone:

- TestFlight requiere Apple Developer Program.
- Development/ad hoc builds para dispositivos físicos también requieren firma/provisioning de Apple.
- iOS Simulator en una Mac sí puede correr sin publicar, pero no ayuda para amigos con iPhone físico.

## 5. Comandos de verificación local

Backend:

```bash
cd api
mvn test
mvn spring-boot:run
```

Mobile:

```bash
cd mobile
npm install
npm run typecheck
npx expo start --clear
```

Docker local opcional:

```bash
cd api
docker build -t droppoint-api .
docker run --rm -p 8080:8080 droppoint-api
```

## 6. Roadmap funcional pedido

### Hasta 3 pasajeros con distintos destinos

Es posible, pero cambia el problema de optimización.

MVP razonable sin base de datos:

- Request con `passengers: PassengerRequest[]`, máximo 3.
- Cada pasajero tiene nombre opcional y destino.
- El backend calcula opciones por pasajero.
- Luego arma combinaciones y ordena por:
  - desvío total del conductor;
  - tiempo total promedio de pasajeros;
  - peor caso individual;
  - cantidad total de transbordos;
  - prioridad elegida.

No requiere base de datos si el resultado se calcula y se descarta.

Complejidad: media. Es el próximo feature más natural.

### No salir todos del mismo punto: pasar a buscar gente

También es posible, pero es más complejo que el caso actual.

Hay dos modos:

- Orden de pickup fijo: el conductor dice a quién busca primero, segundo y tercero.
- Orden sugerido: el backend prueba permutaciones y sugiere el orden con menor costo.

Con hasta 3 pasajeros, probar todas las permutaciones todavía es viable para un MVP mock o con Google Routes.

El algoritmo pasa a resolver:

```text
origen conductor -> pickups -> dropoffs sugeridos -> destino conductor
```

Complejidad: media/alta.

### Grupos guardados y viajes frecuentes

Esto ya pide persistencia.

Opciones sin base de datos:

- Guardar grupos localmente en el teléfono con AsyncStorage.
- Compartir el viaje actual con un link codificado en la URL o QR.
- No hay sincronización real entre amigos.

Limitación: cada persona tendría su copia local, y si alguien cambia algo los demás no lo ven automáticamente.

Opción correcta con base de datos:

- Tabla/colección `groups`.
- Tabla/colección `group_members`.
- Tabla/colección `saved_routes`.
- Tabla/colección `trips`.
- Link compartible por `groupCode`.

Para evitar login al principio:

- Crear grupo con nombre.
- Generar código o link.
- Cualquiera con el link entra.
- Más adelante se agrega login/permisos.

Complejidad: alta si querés colaboración real entre varios teléfonos.

Recomendación de orden:

1. Deploy Render + Expo Go/APK.
2. Hasta 3 pasajeros con un origen común.
3. Pickups múltiples.
4. Grupos locales en el teléfono.
5. Grupos compartidos con base de datos.

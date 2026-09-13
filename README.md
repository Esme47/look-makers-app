# Look Makers — App de agendamiento

Web app (Next.js) para agendar citas de pestañas y cejas del estudio Look
Makers, en Montería, Córdoba. Construida para desplegarse con cuentas
gratuitas de **GitHub + Vercel + Supabase**.

## Por qué este stack (y no Flutter)

La especificación original recomendaba Flutter + Firebase para una app
nativa. Como ya tienes cuentas gratuitas en Vercel, Supabase, Neon y
GitHub, se migró a **Next.js**, que se despliega directamente en Vercel y
funciona como una web app instalable en el celular (PWA) — sin pasar por
App Store/Play Store todavía. El mismo código de negocio (agenda,
disponibilidad, citas) se puede envolver más adelante en Flutter o React
Native si decides publicarla como app nativa.

Se usa **Supabase** como base de datos principal porque incluye, en un
solo lugar y en el plan gratuito: Postgres, autenticación, storage para
fotos y suscripciones en tiempo real (clave para que dos personas no
reserven la misma hora). **Neon** queda como alternativa si en algún
momento prefieres separar la base de datos de la autenticación —el
`schema.sql` es Postgres estándar y funciona en ambos.

## Notas sobre tipografías

*Dream Avenue* y *Proxima Nova* son fuentes comerciales sin licencia
gratuita para web. Mientras las compras/licencias, el proyecto usa
*Playfair Display* (para títulos, similar espíritu editorial) y
*Poppins* (para texto, similar a Proxima Nova) desde Google Fonts, ya
configuradas en `app/globals.css`. Cuando tengas los archivos de fuente
originales, se reemplazan ahí mismo.

## Estructura del proyecto

```
app/
  page.tsx                    → Inicio (próxima cita real si hay sesión)
  servicios/page.tsx           → Catálogo de servicios (datos de Supabase)
  servicios/[id]/page.tsx      → Ficha de un servicio
  servicios/[id]/reservar/     → Verifica sesión y renderiza ReservaForm
  perfil/page.tsx              → Perfil, historial real y cerrar sesión
  login/page.tsx                → Inicio de sesión con enlace mágico
  auth/callback/route.ts        → Recibe el enlace mágico y crea la sesión
  auth/signout/route.ts         → Cierra la sesión
components/
  BottomNav.tsx                 → Navegación inferior
  ReservaForm.tsx                → Selección de fecha/hora y creación real de la cita
lib/
  supabase/client.ts             → Cliente de Supabase para el navegador
  supabase/server.ts             → Cliente de Supabase para Server Components
  queries.ts                     → Consultas: servicios, disponibilidad, citas
  mockData.ts                    → Solo el formateador de moneda (COP)
middleware.ts                    → Mantiene viva la sesión en cada request
supabase/
  schema.sql                     → Tablas, RLS, vista de horarios y datos de ejemplo
```

**Ya está conectado de verdad a Supabase:** login sin contraseña (enlace
mágico por correo), catálogo real, cálculo de horas disponibles cruzando
el horario de la profesional con las citas ya reservadas, creación real
de la cita, próxima cita en el inicio y historial en el perfil.

## Pasos para ponerla en línea (todo gratis)

### 1. Supabase (base de datos)
1. Crea un proyecto nuevo en supabase.com.
2. Ve a **SQL Editor** y pega el contenido de `supabase/schema.sql`, luego ejecútalo.
3. Ve a **Project Settings → API** y copia la `Project URL` y la `anon public key`.

### 2. Variables de entorno locales
1. Copia `.env.example` como `.env.local`.
2. Pega ahí la URL y la key de Supabase.

### 3. Instalar y correr localmente
```
npm install
npm run dev
```
Abre `http://localhost:3000`.

### 4. Subir a GitHub
```
git remote add origin https://github.com/TU-USUARIO/look-makers-app.git
git branch -M main
git push -u origin main
```

### 5. Desplegar en Vercel
1. En vercel.com, "Add New Project" → importa el repo de GitHub.
2. En "Environment Variables" agrega `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (las mismas del paso 1).
3. Deploy. Vercel te da una URL pública automáticamente, con despliegue
   automático cada vez que hagas push a `main`.

### 6. Habilitar el enlace mágico de login
En Supabase, ve a **Authentication → URL Configuration** y agrega:
- **Site URL**: la URL que te dio Vercel (ej. `https://look-makers.vercel.app`)
- **Redirect URLs**: esa misma URL + `/auth/callback`, y también
  `http://localhost:3000/auth/callback` para que funcione en desarrollo.

Sin este paso, el enlace que llega al correo no va a poder crear la
sesión.

## Siguientes pasos técnicos

- Agregar pasarela de pago para el abono (Wompi/PayU) en la confirmación.
- Configurar recordatorios por WhatsApp con una Edge Function de Supabase
  programada (o un cron job de Vercel) que revise `citas` próximas a
  vencer y también el "próximo retoque sugerido".
- Reemplazar los bloques de "resultados recientes" y "promo del mes" del
  inicio por datos reales (tabla `promociones` y Supabase Storage para
  las fotos).
- Si más adelante hay más de una profesional, ajustar
  `getProfesionalPrincipal` en `lib/queries.ts` para dejar elegir entre
  varias según el servicio.

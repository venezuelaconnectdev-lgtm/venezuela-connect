=====================================
  VENEZUELA CONNECT — MVP
  Plataforma de información humanitaria
=====================================

INSTRUCCIONES DE INSTALACIÓN
─────────────────────────────

1. Crea el archivo .env.local en esta carpeta con este contenido:

   NEXT_PUBLIC_SUPABASE_URL=https://rrjrglprxprmdtmpgeyx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_FIsgVwjRnbt9JkZfFoPWAQ_pJov_zbn

2. Abre la terminal en esta carpeta y ejecuta:

   npm install
   npm run dev

3. Abre tu navegador en:
   http://localhost:3000

ESTRUCTURA DEL PROYECTO
────────────────────────
app/
  page.tsx           → Dashboard principal
  refugios/          → Módulo de refugios
  hospitales/        → Módulo de hospitales
  noticias/          → Módulo de noticias
  donaciones/        → Módulo de donaciones
  diaspora/          → Guía para la diáspora

components/shared/
  Navbar.tsx         → Barra de navegación
  StatusCard.tsx     → Tarjeta de estado
  EmergencyFAB.tsx   → Botón de emergencia
  RegionBadge.tsx    → Badge de alerta por región
  VerifiedBadge.tsx  → Badge de verificación

lib/
  supabase.ts        → Cliente de base de datos
  types.ts           → Tipos TypeScript
  constants.ts       → Constantes globales

DEPLOY EN VERCEL
─────────────────
1. Sube esta carpeta a GitHub
2. Conecta el repo en vercel.com
3. Agrega las variables de entorno del paso 1
4. Click Deploy

=====================================

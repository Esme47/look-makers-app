import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente de solo lectura para Server Components y Server Actions.
// Ya no manejamos sesiones de usuario (el acceso de las clientas es libre),
// así que no necesitamos leer/escribir cookies de autenticación aquí.
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}

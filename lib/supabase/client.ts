import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente para componentes 'use client' (formulario de reserva, panel admin).
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}

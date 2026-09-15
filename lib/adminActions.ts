"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminVerifyPassword, adminUpdateServicio } from "@/lib/queries";

const COOKIE_NAME = "lm_admin_pw";
// 12 horas
const COOKIE_MAX_AGE = 60 * 60 * 12;

export async function loginAdmin(_prevState: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Escribe la clave" };

  const supabase = createClient();
  const ok = await adminVerifyPassword(supabase, password);
  if (!ok) return { error: "Clave incorrecta" };

  cookies().set(COOKIE_NAME, password, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  revalidatePath("/perfil");
  return { error: null };
}

export async function logoutAdmin() {
  cookies().delete(COOKIE_NAME);
  revalidatePath("/perfil");
}

export async function updateServicioAction(_prevState: unknown, formData: FormData) {
  const password = cookies().get(COOKIE_NAME)?.value;
  if (!password) return { error: "Tu sesión expiró, ingresa la clave de nuevo." };

  const id = String(formData.get("id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const duracion_min = Number(formData.get("duracion_min"));
  const precio = Number(formData.get("precio"));
  const descripcion = String(formData.get("descripcion") ?? "").trim();

  if (!nombre || !duracion_min || !precio) {
    return { error: "Completa nombre, duración y precio." };
  }

  const supabase = createClient();
  const { error } = await adminUpdateServicio(supabase, {
    id,
    password,
    nombre,
    duracion_min,
    precio,
    descripcion,
  });

  if (error) return { error: "Clave incorrecta o no se pudo guardar." };

  revalidatePath("/perfil");
  revalidatePath("/servicios");
  return { error: null, ok: true };
}

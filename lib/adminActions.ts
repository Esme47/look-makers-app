"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  adminVerifyPassword,
  adminUpdateServicio,
  adminActualizarCita,
  adminEliminarCita,
  adminCrearCliente,
  adminCrearGasto,
  adminEliminarGasto,
} from "@/lib/queries";

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

export async function confirmarCitaAction(_prevState: unknown, formData: FormData) {
  const password = cookies().get(COOKIE_NAME)?.value;
  if (!password) return { error: "Tu sesión expiró, ingresa la clave de nuevo." };
  const id = String(formData.get("id") ?? "");

  const supabase = createClient();
  const { error } = await adminActualizarCita(supabase, { id, password, estado: "confirmada" });
  if (error) return { error: "No se pudo confirmar la cita." };

  revalidatePath("/perfil");
  return { error: null };
}

export async function marcarPagadaAction(_prevState: unknown, formData: FormData) {
  const password = cookies().get(COOKIE_NAME)?.value;
  if (!password) return { error: "Tu sesión expiró, ingresa la clave de nuevo." };
  const id = String(formData.get("id") ?? "");

  const supabase = createClient();
  const { error } = await adminActualizarCita(supabase, { id, password, pagada: true });
  if (error) return { error: "No se pudo marcar como pagada." };

  revalidatePath("/perfil");
  return { error: null };
}

export async function eliminarCitaAction(_prevState: unknown, formData: FormData) {
  const password = cookies().get(COOKIE_NAME)?.value;
  if (!password) return { error: "Tu sesión expiró, ingresa la clave de nuevo." };
  const id = String(formData.get("id") ?? "");

  const supabase = createClient();
  const { error } = await adminEliminarCita(supabase, { id, password });
  if (error) return { error: "No se pudo eliminar la cita." };

  revalidatePath("/perfil");
  return { error: null };
}

export async function crearClienteAction(_prevState: unknown, formData: FormData) {
  const password = cookies().get(COOKIE_NAME)?.value;
  if (!password) return { error: "Tu sesión expiró, ingresa la clave de nuevo." };

  const nombre = String(formData.get("nombre") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const correo = String(formData.get("correo") ?? "").trim();

  if (!nombre || !telefono) {
    return { error: "Escribe al menos el nombre y el teléfono." };
  }

  const supabase = createClient();
  const { error } = await adminCrearCliente(supabase, { password, nombre, telefono, correo });
  if (error) return { error: "No se pudo guardar el cliente." };

  revalidatePath("/perfil");
  return { error: null, ok: true };
}

export async function crearGastoAction(_prevState: unknown, formData: FormData) {
  const password = cookies().get(COOKIE_NAME)?.value;
  if (!password) return { error: "Tu sesión expiró, ingresa la clave de nuevo." };

  const concepto = String(formData.get("concepto") ?? "").trim();
  const monto = Number(formData.get("monto"));
  const fecha = String(formData.get("fecha") ?? "").trim();

  if (!concepto || !monto || monto <= 0) {
    return { error: "Escribe el concepto y un monto válido." };
  }

  const supabase = createClient();
  const { error } = await adminCrearGasto(supabase, {
    password,
    concepto,
    monto,
    fecha: fecha || new Date().toISOString().slice(0, 10),
  });
  if (error) return { error: "No se pudo guardar el gasto." };

  revalidatePath("/perfil");
  return { error: null, ok: true };
}

export async function eliminarGastoAction(_prevState: unknown, formData: FormData) {
  const password = cookies().get(COOKIE_NAME)?.value;
  if (!password) return { error: "Tu sesión expiró, ingresa la clave de nuevo." };
  const id = String(formData.get("id") ?? "");

  const supabase = createClient();
  const { error } = await adminEliminarGasto(supabase, { id, password });
  if (error) return { error: "No se pudo eliminar el gasto." };

  revalidatePath("/perfil");
  return { error: null };
}

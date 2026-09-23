import type { SupabaseClient } from "@supabase/supabase-js";

export type Servicio = {
  id: string;
  nombre: string;
  categoria: "pestanas" | "cejas";
  duracion_min: number;
  precio: number;
  descripcion: string | null;
};

export async function getServicios(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("servicios")
    .select("*")
    .order("categoria");
  if (error) throw error;
  return data as Servicio[];
}

export async function getServicio(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("servicios")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Servicio;
}

// Por ahora Look Makers tiene una sola profesional activa; si más adelante
// hay varias, aquí se filtraría por el servicio que cada una realiza.
export async function getProfesionalPrincipal(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("profesionales")
    .select("*")
    .limit(1)
    .single();
  if (error) return null;
  return data as { id: string; nombre: string };
}

function sumarMinutos(hora: string, minutos: number) {
  const [h, m] = hora.split(":").map(Number);
  const total = h * 60 + m + minutos;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function generarFranjas(horaInicio: string, horaFin: string, duracionMin: number) {
  const franjas: string[] = [];
  let actual = horaInicio.slice(0, 5);
  while (actual < horaFin.slice(0, 5)) {
    const siguiente = sumarMinutos(actual, duracionMin);
    if (siguiente > horaFin.slice(0, 5)) break;
    franjas.push(actual);
    actual = siguiente;
  }
  return franjas;
}

// Calcula las horas libres de un profesional para una fecha y un servicio,
// cruzando su horario habitual (disponibilidad) con las citas ya reservadas.
export async function getHorasDisponibles(
  supabase: SupabaseClient,
  profesionalId: string,
  fechaISO: string,
  duracionMin: number
) {
  const diaSemana = new Date(`${fechaISO}T00:00:00`).getDay();

  const { data: rangos, error: errRangos } = await supabase
    .from("disponibilidad")
    .select("hora_inicio, hora_fin")
    .eq("profesional_id", profesionalId)
    .eq("dia_semana", diaSemana)
    .eq("bloqueado", false);
  if (errRangos) throw errRangos;
  if (!rangos || rangos.length === 0) return [];

  const { data: ocupadas, error: errOcupadas } = await supabase
    .from("horarios_ocupados")
    .select("hora_inicio")
    .eq("profesional_id", profesionalId)
    .eq("fecha", fechaISO);
  if (errOcupadas) throw errOcupadas;

  const horasOcupadas = new Set(
    (ocupadas ?? []).map((c) => c.hora_inicio.slice(0, 5))
  );

  const todasLasFranjas = rangos.flatMap((r) =>
    generarFranjas(r.hora_inicio, r.hora_fin, duracionMin)
  );

  return todasLasFranjas.filter((h) => !horasOcupadas.has(h));
}

// Crea una cita de invitada: no requiere cuenta, solo sus datos de contacto.
export async function crearCita(
  supabase: SupabaseClient,
  params: {
    clienteNombre: string;
    clienteTelefono: string;
    clienteCorreo: string;
    servicioId: string;
    profesionalId: string;
    fechaISO: string;
    horaInicio: string;
    duracionMin: number;
  }
) {
  const horaFin = sumarMinutos(params.horaInicio, params.duracionMin);
  const { error } = await supabase.from("citas").insert({
    usuario_id: null,
    cliente_nombre: params.clienteNombre,
    cliente_telefono: params.clienteTelefono,
    cliente_correo: params.clienteCorreo,
    servicio_id: params.servicioId,
    profesional_id: params.profesionalId,
    fecha: params.fechaISO,
    hora_inicio: params.horaInicio,
    hora_fin: horaFin,
    estado: "pendiente",
  });
  return { error };
}

// Próximos N días para mostrar como selector, con su fecha ISO (YYYY-MM-DD)
// y una etiqueta corta en español, ej. "jue 18".
export function proximosDias(cantidad = 7) {
  const dias = [];
  const hoy = new Date();
  for (let i = 1; i <= cantidad; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    const iso = fecha.toISOString().slice(0, 10);
    const etiqueta = fecha
      .toLocaleDateString("es-CO", { weekday: "short", day: "numeric" })
      .replace(".", "");
    dias.push({ iso, etiqueta });
  }
  return dias;
}

// --- Panel de la administradora (Perfil) ---

export async function adminVerifyPassword(supabase: SupabaseClient, password: string) {
  const { data, error } = await supabase.rpc("admin_verify_password", {
    p_password: password,
  });
  if (error) return false;
  return Boolean(data);
}

export async function adminUpdateServicio(
  supabase: SupabaseClient,
  params: {
    id: string;
    password: string;
    nombre: string;
    duracion_min: number;
    precio: number;
    descripcion: string;
  }
) {
  const { error } = await supabase.rpc("admin_update_servicio", {
    p_id: params.id,
    p_password: params.password,
    p_nombre: params.nombre,
    p_duracion_min: params.duracion_min,
    p_precio: params.precio,
    p_descripcion: params.descripcion,
  });
  return { error };
}

export type CitaAdmin = {
  id: string;
  fecha: string;
  hora_inicio: string;
  estado: string;
  pagada: boolean;
  cliente_nombre: string | null;
  cliente_telefono: string | null;
  cliente_correo: string | null;
  servicio_nombre: string;
  precio: number;
  duracion_min: number;
};

export async function adminListarCitas(supabase: SupabaseClient, password: string) {
  const { data, error } = await supabase.rpc("admin_listar_citas", {
    p_password: password,
  });
  if (error) return null;
  return data as CitaAdmin[];
}

export async function adminActualizarCita(
  supabase: SupabaseClient,
  params: { id: string; password: string; estado?: string; pagada?: boolean }
) {
  const { error } = await supabase.rpc("admin_actualizar_cita", {
    p_id: params.id,
    p_password: params.password,
    p_estado: params.estado ?? null,
    p_pagada: params.pagada ?? null,
  });
  return { error };
}

export async function adminEliminarCita(
  supabase: SupabaseClient,
  params: { id: string; password: string }
) {
  const { error } = await supabase.rpc("admin_eliminar_cita", {
    p_id: params.id,
    p_password: params.password,
  });
  return { error };
}

export type ClienteAdmin = {
  id: string;
  nombre: string;
  telefono: string;
  correo: string | null;
  creado_en: string;
};

export async function adminListarClientes(supabase: SupabaseClient, password: string) {
  const { data, error } = await supabase.rpc("admin_listar_clientes", {
    p_password: password,
  });
  if (error) return null;
  return data as ClienteAdmin[];
}

export async function adminCrearCliente(
  supabase: SupabaseClient,
  params: { password: string; nombre: string; telefono: string; correo: string }
) {
  const { error } = await supabase.rpc("admin_crear_cliente", {
    p_password: params.password,
    p_nombre: params.nombre,
    p_telefono: params.telefono,
    p_correo: params.correo,
  });
  return { error };
}

export type GastoAdmin = {
  id: string;
  concepto: string;
  monto: number;
  fecha: string;
  creado_en: string;
};

export async function adminListarGastos(supabase: SupabaseClient, password: string) {
  const { data, error } = await supabase.rpc("admin_listar_gastos", {
    p_password: password,
  });
  if (error) return null;
  return data as GastoAdmin[];
}

export async function adminCrearGasto(
  supabase: SupabaseClient,
  params: { password: string; concepto: string; monto: number; fecha: string }
) {
  const { error } = await supabase.rpc("admin_crear_gasto", {
    p_password: params.password,
    p_concepto: params.concepto,
    p_monto: params.monto,
    p_fecha: params.fecha,
  });
  return { error };
}

export async function adminEliminarGasto(
  supabase: SupabaseClient,
  params: { id: string; password: string }
) {
  const { error } = await supabase.rpc("admin_eliminar_gasto", {
    p_id: params.id,
    p_password: params.password,
  });
  return { error };
}

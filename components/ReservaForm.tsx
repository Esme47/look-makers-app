"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getHorasDisponibles, crearCita } from "@/lib/queries";
import type { Servicio } from "@/lib/queries";
import { getServicioImagen } from "@/lib/servicioImagen";

type Profesional = { id: string; nombre: string };

const DIAS_SEMANA = ["L", "M", "M", "J", "V", "S", "D"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatoHora12(hora24: string) {
  const [h, m] = hora24.split(":").map(Number);
  const periodo = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${periodo}`;
}

function sumarMinutosISO(fechaISO: string, hora: string, minutos: number) {
  const [h, m] = hora.split(":").map(Number);
  const d = new Date(`${fechaISO}T00:00:00`);
  d.setHours(h, m + minutos, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

function fechaGoogleCalendar(fechaISO: string, hora: string) {
  const [h, m] = hora.split(":").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${fechaISO.replace(/-/g, "")}T${pad(h)}${pad(m)}00`;
}

export default function ReservaForm({
  servicio,
  profesional,
}: {
  servicio: Servicio;
  profesional: Profesional;
}) {
  const [paso, setPaso] = useState<"fecha" | "datos" | "listo">("fecha");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [mesOffset, setMesOffset] = useState(0);
  const mesVisible = new Date(hoy.getFullYear(), hoy.getMonth() + mesOffset, 1);

  const [fechaSel, setFechaSel] = useState<Date | null>(null);
  const [horas, setHoras] = useState<string[]>([]);
  const [cargandoHoras, setCargandoHoras] = useState(false);
  const [horaSel, setHoraSel] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fechaSel) return;
    let activo = true;
    setCargandoHoras(true);
    setHoraSel(null);
    const supabase = createClient();
    getHorasDisponibles(supabase, profesional.id, toISO(fechaSel), servicio.duracion_min)
      .then((res) => {
        if (activo) setHoras(res);
      })
      .catch(() => {
        if (activo) setError("No se pudo cargar la disponibilidad.");
      })
      .finally(() => {
        if (activo) setCargandoHoras(false);
      });
    return () => {
      activo = false;
    };
  }, [fechaSel, profesional.id, servicio.duracion_min]);

  // Grid del mes: lunes primero
  const primerDiaSemana = (mesVisible.getDay() + 6) % 7;
  const diasEnMes = new Date(
    mesVisible.getFullYear(),
    mesVisible.getMonth() + 1,
    0
  ).getDate();
  const celdas: (Date | null)[] = [
    ...Array(primerDiaSemana).fill(null),
    ...Array.from(
      { length: diasEnMes },
      (_, i) => new Date(mesVisible.getFullYear(), mesVisible.getMonth(), i + 1)
    ),
  ];

  function esSeleccionable(d: Date) {
    return d.getTime() > hoy.getTime();
  }

  async function confirmarCita() {
    if (!fechaSel || !horaSel) return;
    if (!nombre.trim() || !telefono.trim()) {
      setError("Escribe tu nombre y tu teléfono para poder confirmarte la cita");
      return;
    }
    setError(null);
    setEnviando(true);
    const supabase = createClient();
    const { error: insertError } = await crearCita(supabase, {
      clienteNombre: nombre.trim(),
      clienteTelefono: telefono.trim(),
      clienteCorreo: correo.trim(),
      servicioId: servicio.id,
      profesionalId: profesional.id,
      fechaISO: toISO(fechaSel),
      horaInicio: horaSel,
      duracionMin: servicio.duracion_min,
    });
    setEnviando(false);
    if (insertError) {
      setError("Esa hora ya se acaba de ocupar, elige otra por favor.");
      setPaso("fecha");
      setFechaSel((f) => (f ? new Date(f) : f));
      return;
    }
    setPaso("listo");
  }

  // --- Paso 3: confirmación ---
  if (paso === "listo" && fechaSel && horaSel) {
    const fechaLarga = fechaSel.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const inicioGCal = fechaGoogleCalendar(toISO(fechaSel), horaSel);
    const finGCal = sumarMinutosISO(toISO(fechaSel), horaSel, servicio.duracion_min);
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      "Look Makers - " + servicio.nombre
    )}&dates=${inicioGCal}/${finGCal}&location=${encodeURIComponent(
      "Montería, Córdoba"
    )}&details=${encodeURIComponent("Cita en Look Makers")}`;

    return (
      <div className="text-center pt-4">
        <p className="font-voice text-3xl text-lmGold mb-4">M</p>
        <div className="w-16 h-16 rounded-full border-2 border-lmGold text-lmGold flex items-center justify-center mx-auto mb-4 text-2xl">
          ✓
        </div>
        <p className="font-voice text-xl mb-1">¡Cita confirmada!</p>
        <p className="text-sm text-lmMuted mb-6">Nos vemos pronto ♡</p>

        <div className="lm-card text-left mb-4 flex gap-3 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getServicioImagen(servicio.nombre)}
            alt={servicio.nombre}
            className="w-14 h-14 rounded-xl object-cover shrink-0"
          />
          <div>
            <p className="text-sm font-medium">{servicio.nombre}</p>
            <p className="text-xs text-lmMuted capitalize">{servicio.categoria}</p>
          </div>
        </div>

        <div className="lm-card text-left mb-6 space-y-2">
          <p className="text-sm">📅 {fechaLarga}</p>
          <p className="text-sm">⏰ {formatoHora12(horaSel)}</p>
          <p className="text-sm">⏱️ Duración: {servicio.duracion_min} minutos</p>
        </div>

        <a
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="lm-btn block mb-3"
        >
          📅 Ver en calendario
        </a>
        <Link
          href="/inicio"
          className="block w-full py-3 rounded-full border border-lmGold text-lmGold font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  // --- Paso 2: datos de contacto ---
  if (paso === "datos" && fechaSel && horaSel) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-1">
          <button onClick={() => setPaso("fecha")} aria-label="Volver" className="text-lmGold">
            ←
          </button>
          <p className="font-voice text-lg">Tus datos</p>
        </div>
        <p className="text-xs text-lmMuted mb-5">
          {servicio.nombre} · {toISO(fechaSel)} · {formatoHora12(horaSel)}
        </p>

        <div className="space-y-2 mb-4">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            className="w-full rounded-xl border border-lmGold/40 px-4 py-3 text-sm bg-white"
          />
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Teléfono / WhatsApp"
            type="tel"
            className="w-full rounded-xl border border-lmGold/40 px-4 py-3 text-sm bg-white"
          />
          <input
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Correo (opcional)"
            type="email"
            className="w-full rounded-xl border border-lmGold/40 px-4 py-3 text-sm bg-white"
          />
        </div>

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

        <button onClick={confirmarCita} disabled={enviando} className="lm-btn">
          {enviando ? "Agendando…" : "Confirmar cita"}
        </button>
      </div>
    );
  }

  // --- Paso 1: fecha y hora ---
  return (
    <div>
      <p className="font-voice text-lg mb-1">Selecciona fecha</p>
      <p className="text-xs text-lmMuted mb-4">
        Elige el día que mejor se adapte a ti · {servicio.nombre}
      </p>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setMesOffset((m) => Math.max(0, m - 1))}
          disabled={mesOffset === 0}
          className="text-lmGold disabled:opacity-30 px-2"
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <p className="text-sm font-medium">
          {MESES[mesVisible.getMonth()]} {mesVisible.getFullYear()}
        </p>
        <button
          onClick={() => setMesOffset((m) => m + 1)}
          className="text-lmGold px-2"
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1 text-center">
        {DIAS_SEMANA.map((d, i) => (
          <span key={i} className="text-[11px] text-lmMuted">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-5">
        {celdas.map((d, i) => {
          if (!d) return <div key={i} />;
          const seleccionable = esSeleccionable(d);
          const activo = fechaSel && toISO(fechaSel) === toISO(d);
          return (
            <button
              key={i}
              disabled={!seleccionable}
              onClick={() => setFechaSel(d)}
              className={`aspect-square rounded-full text-xs flex items-center justify-center
                ${activo ? "bg-lmGold text-white" : seleccionable ? "text-lmDark" : "text-lmMuted/40"}
              `}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      {fechaSel && (
        <>
          <p className="text-xs text-lmMuted mb-2">Selecciona un horario</p>
          {cargandoHoras ? (
            <p className="text-xs text-lmMuted mb-4">Cargando horarios…</p>
          ) : horas.length === 0 ? (
            <p className="text-xs text-lmMuted mb-4">
              No hay horas disponibles ese día, prueba con otra fecha.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 mb-5">
              {horas.map((h) => (
                <button
                  key={h}
                  onClick={() => setHoraSel(h)}
                  className={`lm-pill justify-center ${horaSel === h ? "selected" : ""}`}
                >
                  {formatoHora12(h)}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

      <button
        onClick={() => setPaso("datos")}
        disabled={!fechaSel || !horaSel}
        className="lm-btn"
      >
        Continuar →
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getHorasDisponibles, crearCita, proximosDias } from "@/lib/queries";
import type { Servicio } from "@/lib/queries";

type Profesional = { id: string; nombre: string };

function formatoHora12(hora24: string) {
  const [h, m] = hora24.split(":").map(Number);
  const periodo = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${periodo}`;
}

export default function ReservaForm({
  servicio,
  profesional,
  usuarioId,
}: {
  servicio: Servicio;
  profesional: Profesional;
  usuarioId: string;
}) {
  const dias = proximosDias(7);
  const [diaSel, setDiaSel] = useState(dias[0].iso);
  const [horas, setHoras] = useState<string[]>([]);
  const [cargandoHoras, setCargandoHoras] = useState(true);
  const [horaSel, setHoraSel] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    setCargandoHoras(true);
    setHoraSel(null);
    const supabase = createClient();
    getHorasDisponibles(supabase, profesional.id, diaSel, servicio.duracion_min)
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
  }, [diaSel, profesional.id, servicio.duracion_min]);

  async function confirmarCita() {
    if (!horaSel) {
      setError("Elige una hora disponible");
      return;
    }
    setError(null);
    setEnviando(true);
    const supabase = createClient();
    const { error: insertError } = await crearCita(supabase, {
      usuarioId,
      servicioId: servicio.id,
      profesionalId: profesional.id,
      fechaISO: diaSel,
      horaInicio: horaSel,
      duracionMin: servicio.duracion_min,
    });
    setEnviando(false);
    if (insertError) {
      setError(
        "Esa hora ya se acaba de ocupar, elige otra por favor."
      );
      // refresca la lista de horas disponibles
      setDiaSel((d) => d);
      return;
    }
    setConfirmado(true);
  }

  const etiquetaDia = dias.find((d) => d.iso === diaSel)?.etiqueta ?? diaSel;

  if (confirmado) {
    return (
      <div className="text-center pt-6">
        <div className="w-14 h-14 rounded-full bg-lmGold text-white flex items-center justify-center mx-auto mb-3 text-2xl">
          ✓
        </div>
        <p className="font-voice text-lg mb-1">Cita confirmada</p>
        <p className="text-xs text-lmMuted mb-6">
          Te esperamos en Look Makers
        </p>
        <div className="lm-card text-left mb-6">
          <p className="text-sm mb-1">✨ {servicio.nombre}</p>
          <p className="text-sm mb-1">
            📅 {etiquetaDia}, {horaSel && formatoHora12(horaSel)}
          </p>
          <p className="text-sm">📍 Montería, Córdoba</p>
        </div>
        <Link href="/" className="lm-btn block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="font-voice text-lg mb-1">Elige fecha y hora</p>
      <p className="text-xs text-lmMuted mb-4">
        {servicio.nombre} · {servicio.duracion_min} min con {profesional.nombre}
      </p>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {dias.map((d) => (
          <button
            key={d.iso}
            onClick={() => setDiaSel(d.iso)}
            className={`lm-pill shrink-0 ${diaSel === d.iso ? "selected" : ""}`}
          >
            {d.etiqueta}
          </button>
        ))}
      </div>

      <p className="text-xs text-lmMuted mb-2">Horas disponibles</p>
      {cargandoHoras ? (
        <p className="text-xs text-lmMuted mb-4">Cargando horarios…</p>
      ) : horas.length === 0 ? (
        <p className="text-xs text-lmMuted mb-4">
          No hay horas disponibles ese día, prueba con otra fecha.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {horas.map((h) => (
            <button
              key={h}
              onClick={() => {
                setHoraSel(h);
                setError(null);
              }}
              className={`lm-pill justify-center ${horaSel === h ? "selected" : ""}`}
            >
              {formatoHora12(h)}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

      <button
        onClick={confirmarCita}
        disabled={enviando || !horaSel}
        className="lm-btn"
      >
        {enviando ? "Agendando…" : "Confirmar cita"}
      </button>
    </div>
  );
}

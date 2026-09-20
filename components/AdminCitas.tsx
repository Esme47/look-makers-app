"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  confirmarCitaAction,
  marcarPagadaAction,
  eliminarCitaAction,
} from "@/lib/adminActions";
import type { CitaAdmin } from "@/lib/queries";
import { formatCOP } from "@/lib/mockData";

function whatsappUrl(telefono: string, mensaje: string) {
  let digitos = telefono.replace(/\D/g, "");
  if (digitos.length === 10) digitos = "57" + digitos;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}

function formatoHora12(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  const periodo = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${periodo}`;
}

function BotonMini({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs px-3 py-1.5 rounded-full border border-lmGold text-lmGold disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function FilaCita({ cita }: { cita: CitaAdmin }) {
  const [, confirmarAction] = useFormState(confirmarCitaAction, { error: null });
  const [, pagadaAction] = useFormState(marcarPagadaAction, { error: null });
  const [, eliminarAction] = useFormState(eliminarCitaAction, { error: null });

  const mensaje = `Hola ${cita.cliente_nombre ?? ""}, te confirmamos tu cita en Look Makers: ${cita.servicio_nombre} el ${cita.fecha} a las ${formatoHora12(cita.hora_inicio)}. ¡Te esperamos!`;

  return (
    <div className="lm-card mb-3">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-sm font-medium">
            {cita.cliente_nombre || "Sin nombre"}
          </p>
          <p className="text-xs text-lmMuted">{cita.cliente_telefono}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-lmPink/50 text-[#7a4f57] capitalize">
            {cita.estado}
          </span>
          {cita.pagada && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-lmGold text-white">
              Pagada
            </span>
          )}
        </div>
      </div>

      <p className="text-sm mb-1">✨ {cita.servicio_nombre}</p>
      <p className="text-xs text-lmMuted mb-3">
        📅 {cita.fecha} · ⏰ {formatoHora12(cita.hora_inicio)} · {formatCOP(cita.precio)}
      </p>

      <div className="flex flex-wrap gap-2">
        {cita.estado !== "confirmada" && (
          <form action={confirmarAction}>
            <input type="hidden" name="id" value={cita.id} />
            <BotonMini>Confirmar</BotonMini>
          </form>
        )}
        {!cita.pagada && (
          <form action={pagadaAction}>
            <input type="hidden" name="id" value={cita.id} />
            <BotonMini>Pagada</BotonMini>
          </form>
        )}
        {cita.cliente_telefono && (
          <a
            href={whatsappUrl(cita.cliente_telefono, mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-full bg-lmGold text-white"
          >
            WhatsApp
          </a>
        )}
        <form
          action={eliminarAction}
          onSubmit={(e) => {
            if (!confirm("¿Eliminar esta cita? No se puede deshacer.")) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={cita.id} />
          <button
            type="submit"
            className="text-xs px-3 py-1.5 rounded-full border border-red-300 text-red-500"
          >
            Eliminar
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminCitas({ citas }: { citas: CitaAdmin[] }) {
  if (citas.length === 0) {
    return <p className="text-sm text-lmMuted">Todavía no hay citas agendadas.</p>;
  }
  return (
    <div>
      {citas.map((c) => (
        <FilaCita key={c.id} cita={c} />
      ))}
    </div>
  );
}

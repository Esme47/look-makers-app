"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { crearClienteAction } from "@/lib/adminActions";
import type { ClienteAdmin, CitaAdmin } from "@/lib/queries";
import { formatCOP } from "@/lib/mockData";

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="lm-btn">
      {pending ? "Guardando…" : "Registrar cliente"}
    </button>
  );
}

function soloDigitos(v: string | null | undefined) {
  return (v ?? "").replace(/\D/g, "");
}

function formatFecha(fechaISO: string) {
  return new Date(`${fechaISO}T00:00:00`).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// El historial de cada cliente no se guarda aparte: se arma solo, cruzando
// sus citas (fecha, servicio, si ya pago) por telefono o por nombre cuando
// el telefono no coincide exactamente (espacios, +57, etc.).
function historialDeCliente(cliente: ClienteAdmin, citas: CitaAdmin[]) {
  const telCliente = soloDigitos(cliente.telefono).slice(-10);
  return citas
    .filter((c) => {
      const telCita = soloDigitos(c.cliente_telefono).slice(-10);
      if (telCliente && telCita) return telCita === telCliente;
      return (
        (c.cliente_nombre || "").trim().toLowerCase() ===
        cliente.nombre.trim().toLowerCase()
      );
    })
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

function HistorialCliente({
  cliente,
  citas,
}: {
  cliente: ClienteAdmin;
  citas: CitaAdmin[];
}) {
  const [abierto, setAbierto] = useState(false);
  const historial = historialDeCliente(cliente, citas);

  return (
    <div className="mt-2 pt-2 border-t border-lmGold/15">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="text-xs text-lmGold"
      >
        {abierto ? "Ocultar historial ‹" : `Ver historial (${historial.length}) ›`}
      </button>
      {abierto && (
        <div className="mt-2 space-y-2">
          {historial.length === 0 && (
            <p className="text-xs text-lmMuted">Todavia no tiene citas agendadas.</p>
          )}
          {historial.map((cita) => (
            <div
              key={cita.id}
              className="flex items-center justify-between text-xs bg-lmPink/20 rounded-lg px-2.5 py-1.5"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{cita.servicio_nombre}</p>
                <p className="text-lmMuted">
                  {formatFecha(cita.fecha)} · {formatCOP(cita.precio)}
                </p>
              </div>
              <span
                className={`shrink-0 ml-2 px-2 py-0.5 rounded-full ${
                  cita.pagada
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {cita.pagada ? "Pagado" : "Pendiente"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminClientes({
  clientes,
  citas,
}: {
  clientes: ClienteAdmin[];
  citas: CitaAdmin[];
}) {
  const [state, formAction] = useFormState(crearClienteAction, {
    error: null,
    ok: false,
  });

  return (
    <div>
      <form action={formAction} className="lm-card mb-5 space-y-2">
        <p className="text-sm font-medium mb-1">Registrar cliente</p>
        <input
          name="nombre"
          placeholder="Nombre completo"
          className="w-full rounded-lg border border-lmGold/30 px-3 py-2 text-sm"
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          className="w-full rounded-lg border border-lmGold/30 px-3 py-2 text-sm"
        />
        <input
          name="correo"
          placeholder="Correo (opcional)"
          className="w-full rounded-lg border border-lmGold/30 px-3 py-2 text-sm"
        />
        {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
        {state?.ok && <p className="text-xs text-lmGold">Cliente guardado ✓</p>}
        <BotonGuardar />
      </form>

      <p className="text-xs text-lmMuted mb-2">
        {clientes.length} cliente{clientes.length === 1 ? "" : "s"}
      </p>
      {clientes.map((c) => (
        <div key={c.id} className="lm-card mb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{c.nombre || "Sin nombre"}</p>
              <p className="text-xs text-lmMuted">{c.telefono}</p>
              {c.correo && <p className="text-xs text-lmMuted">{c.correo}</p>}
            </div>
            <a
              href={`https://wa.me/${c.telefono.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-full bg-lmGold text-white shrink-0"
            >
              WhatsApp
            </a>
          </div>
          <HistorialCliente cliente={c} citas={citas} />
        </div>
      ))}
    </div>
  );
}

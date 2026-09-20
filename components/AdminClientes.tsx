"use client";

import { useFormState, useFormStatus } from "react-dom";
import { crearClienteAction } from "@/lib/adminActions";
import type { ClienteAdmin } from "@/lib/queries";

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="lm-btn">
      {pending ? "Guardando…" : "Registrar cliente"}
    </button>
  );
}

export default function AdminClientes({ clientes }: { clientes: ClienteAdmin[] }) {
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
        <div key={c.id} className="lm-card mb-2 flex items-center justify-between">
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
      ))}
    </div>
  );
}

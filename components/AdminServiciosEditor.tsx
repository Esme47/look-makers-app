"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateServicioAction, logoutAdmin } from "@/lib/adminActions";
import type { Servicio } from "@/lib/queries";

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="lm-btn">
      {pending ? "Guardando…" : "Guardar cambios"}
    </button>
  );
}

function FilaServicio({ servicio }: { servicio: Servicio }) {
  const [state, formAction] = useFormState(updateServicioAction, {
    error: null,
    ok: false,
  });

  return (
    <form action={formAction} className="lm-card mb-3 space-y-2">
      <input type="hidden" name="id" value={servicio.id} />

      <label className="block text-xs text-lmMuted">Nombre del servicio</label>
      <input
        name="nombre"
        defaultValue={servicio.nombre}
        className="w-full rounded-lg border border-lmGold/30 px-3 py-2 text-sm"
      />

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs text-lmMuted">Duración (min)</label>
          <input
            name="duracion_min"
            type="number"
            defaultValue={servicio.duracion_min}
            className="w-full rounded-lg border border-lmGold/30 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-lmMuted">Precio (COP)</label>
          <input
            name="precio"
            type="number"
            defaultValue={servicio.precio}
            className="w-full rounded-lg border border-lmGold/30 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <label className="block text-xs text-lmMuted">Descripción</label>
      <textarea
        name="descripcion"
        defaultValue={servicio.descripcion ?? ""}
        rows={2}
        className="w-full rounded-lg border border-lmGold/30 px-3 py-2 text-sm"
      />

      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-xs text-lmGold">Guardado ✓</p>}

      <BotonGuardar />
    </form>
  );
}

export default function AdminServiciosEditor({
  servicios,
}: {
  servicios: Servicio[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-voice text-lg">Servicios</p>
        <form action={logoutAdmin}>
          <button className="text-xs text-lmMuted underline">
            Cerrar sesión
          </button>
        </form>
      </div>
      {servicios.map((s) => (
        <FilaServicio key={s.id} servicio={s} />
      ))}
    </div>
  );
}

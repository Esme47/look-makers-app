"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { CitaAdmin, GastoAdmin } from "@/lib/queries";
import { formatCOP } from "@/lib/mockData";
import { crearGastoAction, eliminarGastoAction } from "@/lib/adminActions";

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function BotonGuardarGasto() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="lm-btn">
      {pending ? "Guardando…" : "Registrar gasto"}
    </button>
  );
}

function FormNuevoGasto() {
  const [state, formAction] = useFormState(crearGastoAction, { error: null, ok: false });
  return (
    <form action={formAction} className="lm-card mb-5 space-y-2">
      <p className="text-sm font-medium mb-1">Registrar gasto</p>
      <input
        name="concepto"
        placeholder="Concepto (ej. insumos, arriendo)"
        className="w-full rounded-lg border border-lmGold/30 px-3 py-2 text-sm"
      />
      <input
        name="monto"
        type="number"
        min="1"
        step="1"
        placeholder="Monto en COP"
        className="w-full rounded-lg border border-lmGold/30 px-3 py-2 text-sm"
      />
      <input
        name="fecha"
        type="date"
        defaultValue={hoyISO()}
        className="w-full rounded-lg border border-lmGold/30 px-3 py-2 text-sm"
      />
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-xs text-lmGold">Gasto guardado ✓</p>}
      <BotonGuardarGasto />
    </form>
  );
}

function BotonEliminarGasto({ id }: { id: string }) {
  const [, formAction] = useFormState(eliminarGastoAction, { error: null });
  const { pending } = useFormStatus();
  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs px-3 py-1.5 rounded-full border border-red-300 text-red-600 shrink-0"
      >
        Eliminar
      </button>
    </form>
  );
}

export default function AdminCartera({
  citas,
  gastos,
}: {
  citas: CitaAdmin[];
  gastos: GastoAdmin[];
}) {
  const pagadas = citas.filter((c) => c.pagada);
  const hoy = hoyISO();
  const mesActual = hoy.slice(0, 7); // YYYY-MM

  const totalHoy = pagadas
    .filter((c) => c.fecha === hoy)
    .reduce((sum, c) => sum + Number(c.precio), 0);

  const delMes = pagadas.filter((c) => c.fecha.slice(0, 7) === mesActual);
  const totalMes = delMes.reduce((sum, c) => sum + Number(c.precio), 0);

  const gastosDelMes = gastos.filter((g) => g.fecha.slice(0, 7) === mesActual);
  const totalGastosMes = gastosDelMes.reduce((sum, g) => sum + Number(g.monto), 0);

  const utilidadMes = totalMes - totalGastosMes;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="lm-card text-center">
          <p className="text-xs text-lmMuted mb-1">Hoy</p>
          <p className="text-lg font-medium text-lmGold">{formatCOP(totalHoy)}</p>
        </div>
        <div className="lm-card text-center">
          <p className="text-xs text-lmMuted mb-1">Ingresos del mes</p>
          <p className="text-lg font-medium text-lmGold">{formatCOP(totalMes)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="lm-card text-center">
          <p className="text-xs text-lmMuted mb-1">Gastos del mes</p>
          <p className="text-lg font-medium text-red-500">{formatCOP(totalGastosMes)}</p>
        </div>
        <div className="lm-card text-center">
          <p className="text-xs text-lmMuted mb-1">Utilidad del mes</p>
          <p className={`text-lg font-medium ${utilidadMes >= 0 ? "text-lmGold" : "text-red-500"}`}>
            {formatCOP(utilidadMes)}
          </p>
        </div>
      </div>

      <FormNuevoGasto />

      <p className="text-xs text-lmMuted mb-2">Gastos de este mes</p>
      {gastosDelMes.length === 0 ? (
        <p className="text-sm text-lmMuted mb-5">Aún no hay gastos registrados este mes.</p>
      ) : (
        <div className="mb-5">
          {gastosDelMes.map((g) => (
            <div key={g.id} className="lm-card mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{g.concepto}</p>
                <p className="text-xs text-lmMuted">{g.fecha}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-red-500 font-medium">{formatCOP(g.monto)}</p>
                <BotonEliminarGasto id={g.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-lmMuted mb-2">Citas pagadas este mes</p>
      {delMes.length === 0 ? (
        <p className="text-sm text-lmMuted">Aún no hay citas pagadas este mes.</p>
      ) : (
        delMes.map((c) => (
          <div key={c.id} className="lm-card mb-2 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{c.cliente_nombre || "Sin nombre"}</p>
              <p className="text-xs text-lmMuted">
                {c.servicio_nombre} · {c.fecha}
              </p>
            </div>
            <p className="text-sm text-lmGold font-medium">{formatCOP(c.precio)}</p>
          </div>
        ))
      )}
    </div>
  );
}

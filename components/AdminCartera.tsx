"use client";

import type { CitaAdmin } from "@/lib/queries";
import { formatCOP } from "@/lib/mockData";

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AdminCartera({ citas }: { citas: CitaAdmin[] }) {
  const pagadas = citas.filter((c) => c.pagada);
  const hoy = hoyISO();
  const mesActual = hoy.slice(0, 7); // YYYY-MM

  const totalHoy = pagadas
    .filter((c) => c.fecha === hoy)
    .reduce((sum, c) => sum + Number(c.precio), 0);

  const delMes = pagadas.filter((c) => c.fecha.slice(0, 7) === mesActual);
  const totalMes = delMes.reduce((sum, c) => sum + Number(c.precio), 0);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="lm-card text-center">
          <p className="text-xs text-lmMuted mb-1">Hoy</p>
          <p className="text-lg font-medium text-lmGold">{formatCOP(totalHoy)}</p>
        </div>
        <div className="lm-card text-center">
          <p className="text-xs text-lmMuted mb-1">Este mes</p>
          <p className="text-lg font-medium text-lmGold">{formatCOP(totalMes)}</p>
        </div>
      </div>

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

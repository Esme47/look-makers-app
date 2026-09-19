"use client";

import { useState } from "react";
import Link from "next/link";
import type { Servicio } from "@/lib/queries";
import { getServicioImagen } from "@/lib/servicioImagen";
import { formatCOP } from "@/lib/mockData";

const FILTROS: { key: "todos" | "pestanas" | "cejas"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "pestanas", label: "Pestañas" },
  { key: "cejas", label: "Cejas" },
];

export default function ServiciosCatalogo({
  servicios,
}: {
  servicios: Servicio[];
}) {
  const [filtro, setFiltro] = useState<"todos" | "pestanas" | "cejas">(
    "todos"
  );

  const visibles =
    filtro === "todos"
      ? servicios
      : servicios.filter((s) => s.categoria === filtro);

  return (
    <div>
      <p className="font-voice text-lg mb-4 text-center">Servicios</p>

      <div className="flex gap-2 mb-5 overflow-x-auto">
        {FILTROS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`lm-pill shrink-0 ${filtro === f.key ? "selected" : ""}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visibles.map((s) => (
          <Link
            key={s.id}
            href={`/servicios/${s.id}`}
            className="lm-card flex items-center gap-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getServicioImagen(s.nombre)}
              alt={s.nombre}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{s.nombre}</p>
              <p className="text-xs text-lmMuted mb-1">{s.descripcion}</p>
              <p className="text-xs text-lmGold font-medium">
                Desde {formatCOP(s.precio)}
              </p>
            </div>
            <span className="text-lmGold shrink-0">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

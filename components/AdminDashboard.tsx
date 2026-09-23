"use client";

import { useState } from "react";
import { logoutAdmin } from "@/lib/adminActions";
import type { Servicio, CitaAdmin, ClienteAdmin, GastoAdmin } from "@/lib/queries";
import AdminServiciosEditor from "@/components/AdminServiciosEditor";
import AdminCitas from "@/components/AdminCitas";
import AdminClientes from "@/components/AdminClientes";
import AdminCartera from "@/components/AdminCartera";

type Tab = "citas" | "servicios" | "clientes" | "cartera";

const TABS: { key: Tab; label: string }[] = [
  { key: "citas", label: "Citas" },
  { key: "servicios", label: "Servicios" },
  { key: "clientes", label: "Clientes" },
  { key: "cartera", label: "Cartera" },
];

export default function AdminDashboard({
  servicios,
  citas,
  clientes,
  gastos,
}: {
  servicios: Servicio[];
  citas: CitaAdmin[];
  clientes: ClienteAdmin[];
  gastos: GastoAdmin[];
}) {
  const [tab, setTab] = useState<Tab>("citas");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-voice text-lg">Panel de Look Makers</p>
        <form action={logoutAdmin}>
          <button className="text-xs text-lmMuted underline">Cerrar sesión</button>
        </form>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`lm-pill shrink-0 ${tab === t.key ? "selected" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "citas" && <AdminCitas citas={citas} />}
      {tab === "servicios" && <AdminServiciosEditor servicios={servicios} />}
      {tab === "clientes" && <AdminClientes clientes={clientes} />}
      {tab === "cartera" && <AdminCartera citas={citas} gastos={gastos} />}
    </div>
  );
}

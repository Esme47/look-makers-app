import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getServicios } from "@/lib/queries";
import { formatCOP } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export default async function Servicios() {
  const supabase = createClient();
  const servicios = await getServicios(supabase);

  return (
    <div>
      <p className="font-voice text-lg mb-4">Servicios</p>
      <div className="space-y-3">
        {servicios.map((s) => (
          <Link
            key={s.id}
            href={`/servicios/${s.id}`}
            className="lm-card flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium">{s.nombre}</p>
              <p className="text-xs text-lmMuted mt-1">
                {Math.floor(s.duracion_min / 60)
                  ? `${Math.floor(s.duracion_min / 60)}h `
                  : ""}
                {s.duracion_min % 60 ? `${s.duracion_min % 60}m` : ""} ·{" "}
                {formatCOP(s.precio)}
              </p>
            </div>
            <span className="text-lmGold">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

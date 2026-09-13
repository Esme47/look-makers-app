import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServicio } from "@/lib/queries";
import { formatCOP } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export default async function ServicioDetalle({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const servicio = await getServicio(supabase, params.id);
  if (!servicio) notFound();

  return (
    <div>
      <p className="font-voice text-lg mb-1">{servicio.nombre}</p>
      <p className="text-xs text-lmMuted mb-4">
        {servicio.duracion_min} min · {formatCOP(servicio.precio)}
      </p>

      <div className="aspect-video rounded-2xl bg-[#e9ddd0] mb-4" />

      <p className="text-sm mb-6">{servicio.descripcion}</p>

      <Link href={`/servicios/${servicio.id}/reservar`} className="lm-btn block">
        Agendar
      </Link>
    </div>
  );
}

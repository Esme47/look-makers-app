import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServicio, getProfesionalPrincipal } from "@/lib/queries";
import ReservaForm from "@/components/ReservaForm";

export const dynamic = "force-dynamic";

export default async function Reservar({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const servicio = await getServicio(supabase, params.id);
  if (!servicio) notFound();

  const profesional = await getProfesionalPrincipal(supabase);
  if (!profesional) {
    return (
      <p className="text-sm text-lmMuted pt-6">
        No hay profesionales configuradas todavía.
      </p>
    );
  }

  return <ReservaForm servicio={servicio} profesional={profesional} />;
}

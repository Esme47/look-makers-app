import Link from "next/link";
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  if (!user) {
    return (
      <div className="pt-10 text-center">
        <p className="font-voice text-lg mb-2">Inicia sesión para agendar</p>
        <p className="text-sm text-lmMuted mb-6">
          Necesitas una cuenta para reservar {servicio.nombre}.
        </p>
        <Link
          href={`/login?next=/servicios/${servicio.id}/reservar`}
          className="lm-btn block"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <ReservaForm servicio={servicio} profesional={profesional} usuarioId={user.id} />
  );
}

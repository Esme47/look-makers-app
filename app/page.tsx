import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProximaCita } from "@/lib/queries";
import { EYE_DATA_URI, LASHISTA_DATA_URI } from "@/lib/brandImages";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const proximaCita = user ? await getProximaCita(supabase, user.id) : null;

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={EYE_DATA_URI}
          alt="Look Makers, tu mirada, nuestra pasión"
          className="w-full h-44 object-cover"
        />
        <div className="absolute -bottom-6 right-4 w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LASHISTA_DATA_URI}
            alt="Tu lashista en Look Makers"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <p className="font-voice text-xl mb-1 mt-8">
        {user ? `Hola, ${user.email?.split("@")[0]}` : "Hola"}
      </p>
      <p className="text-sm text-lmMuted mb-4">
        Bienvenida de nuevo a Look Makers
      </p>

      <div className="lm-card mb-3">
        <p className="text-xs text-lmMuted mb-1">Tu próxima cita</p>
        {proximaCita ? (
          <p className="text-sm font-medium mb-3">
            {/* @ts-expect-error el join de supabase-js tipa como arreglo */}
            {proximaCita.servicios?.nombre} · {proximaCita.fecha} ·{" "}
            {proximaCita.hora_inicio?.slice(0, 5)}
          </p>
        ) : (
          <p className="text-sm font-medium mb-3">
            {user ? "Aún no tienes citas agendadas" : "Inicia sesión para ver tus citas"}
          </p>
        )}
        <Link href={user ? "/servicios" : "/login"} className="lm-btn block">
          {proximaCita ? "Ver servicios" : user ? "Agendar cita" : "Iniciar sesión"}
        </Link>
      </div>

      <div className="rounded-2xl bg-lmPink p-4 mb-4">
        <p className="text-xs text-[#7a4f57] mb-1">Promo del mes</p>
        <p className="text-sm font-medium">
          Volumen ruso + diseño de cejas, 15% off
        </p>
      </div>

      <p className="text-xs text-lmMuted mb-2">Resultados recientes</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="aspect-square rounded-xl bg-[#e9ddd0]" />
        <div className="aspect-square rounded-xl bg-[#ecd9d9]" />
        <div className="aspect-square rounded-xl bg-[#e9ddd0]" />
      </div>
    </div>
  );
}

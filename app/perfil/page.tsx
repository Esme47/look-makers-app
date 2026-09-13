import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getHistorialCitas } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Perfil() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="pt-10 text-center">
        <p className="font-voice text-lg mb-2">Aún no has iniciado sesión</p>
        <Link href="/login?next=/perfil" className="lm-btn block">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const historial = await getHistorialCitas(supabase, user.id);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-lmPink flex items-center justify-center font-medium">
          {user.email?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium">{user.email}</p>
          <p className="text-xs text-lmMuted">Clienta Look Makers</p>
        </div>
      </div>

      <div className="lm-card text-center mb-4">
        <p className="text-xl font-medium">{historial.length}</p>
        <p className="text-xs text-lmMuted mt-1">Citas registradas</p>
      </div>

      <p className="text-xs text-lmMuted mb-2">Historial</p>
      {historial.length === 0 ? (
        <p className="text-sm text-lmMuted">Todavía no tienes citas.</p>
      ) : (
        <div className="space-y-2">
          {historial.map((c: any) => (
            <div key={c.id} className="lm-card text-sm flex justify-between">
              <span>{c.servicios?.nombre}</span>
              <span className="text-lmMuted">{c.fecha}</span>
            </div>
          ))}
        </div>
      )}

      <form action="/auth/signout" method="post" className="mt-6">
        <button className="text-xs text-lmMuted underline">
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}

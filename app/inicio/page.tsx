import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getServicios } from "@/lib/queries";
import { getServicioImagen } from "@/lib/servicioImagen";
import { EYE_DATA_URI } from "@/lib/brandImages";
import { formatCOP } from "@/lib/mockData";

export const dynamic = "force-dynamic";

const WHATSAPP_NUMERO = "573000000000"; // reemplaza por el número real de Look Makers

export default async function Inicio() {
  const supabase = createClient();
  const servicios = await getServicios(supabase);
  const destacados = servicios.slice(0, 3);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-voice text-2xl">Hola, hermosa ♡</p>
          <p className="text-sm text-lmMuted">Tu mirada, mi mayor inspiración</p>
        </div>
        <Link
          href="/perfil"
          className="w-10 h-10 rounded-full bg-lmPink/60 flex items-center justify-center text-lmGold shrink-0"
          aria-label="Perfil"
        >
          <i className="ti ti-user" aria-hidden="true">👤</i>
        </Link>
      </div>

      <Link
        href="/servicios"
        className="relative block rounded-2xl overflow-hidden mb-5 h-40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={EYE_DATA_URI}
          alt="Agenda tu cita"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-5">
          <p className="font-voice text-white text-2xl leading-tight">
            Agenda
          </p>
          <p className="font-voice text-white text-2xl leading-tight mb-1">
            TU CITA
          </p>
          <p className="text-xs text-white/80">Rápido · Fácil · Seguro</p>
        </div>
        <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center text-lmGold">
          →
        </div>
      </Link>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link href="/servicios" className="flex flex-col items-center gap-1.5">
          <div className="w-14 h-14 rounded-2xl bg-lmPink/50 flex items-center justify-center text-xl">
            🗓️
          </div>
          <span className="text-[11px] text-center text-lmMuted">
            Agendar cita
          </span>
        </Link>
        <Link href="/servicios" className="flex flex-col items-center gap-1.5">
          <div className="w-14 h-14 rounded-2xl bg-lmPink/50 flex items-center justify-center text-xl">
            ✨
          </div>
          <span className="text-[11px] text-center text-lmMuted">
            Servicios
          </span>
        </Link>
        <a
          href={`https://wa.me/${WHATSAPP_NUMERO}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5"
        >
          <div className="w-14 h-14 rounded-2xl bg-lmPink/50 flex items-center justify-center text-xl">
            📞
          </div>
          <span className="text-[11px] text-center text-lmMuted">
            Contacto
          </span>
        </a>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="font-voice text-lg">Nuestros servicios</p>
        <Link href="/servicios" className="text-xs text-lmGold">
          Ver todos ›
        </Link>
      </div>

      <div className="space-y-3">
        {destacados.map((s) => (
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
              <p className="text-sm font-medium truncate">{s.nombre}</p>
              <p className="text-xs text-lmMuted truncate">
                {s.descripcion}
              </p>
            </div>
            <span className="text-lmGold shrink-0">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

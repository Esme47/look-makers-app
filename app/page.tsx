import Link from "next/link";
import { EYE_DATA_URI, LASHISTA_DATA_URI, LOGO_DATA_URI } from "@/lib/brandImages";

export default function Home() {
  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={EYE_DATA_URI}
          alt="Look Makers, tu mirada, nuestra pasión"
          className="w-full h-44 object-cover"
        />
        {/* Logo grande y con fondo propio para que se vea bien sobre cualquier foto */}
        <div className="absolute -bottom-6 left-4 w-16 h-16 rounded-full bg-white shadow flex items-center justify-center p-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_DATA_URI}
            alt="Look Makers"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute -bottom-6 right-4 w-20 h-20 rounded-full border-2 border-white overflow-hidden shadow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LASHISTA_DATA_URI}
            alt="Tu lashista en Look Makers"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <p className="font-voice text-xl mb-1 mt-8">Hola</p>
      <p className="text-sm text-lmMuted mb-4">
        Bienvenida de nuevo a Look Makers
      </p>

      <div className="lm-card mb-3">
        <p className="text-sm font-medium mb-3">
          Agenda tu cita de pestañas o cejas en segundos
        </p>
        <Link href="/servicios" className="lm-btn block">
          Agendar cita
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

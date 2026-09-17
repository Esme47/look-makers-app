import Link from "next/link";
import { EYE_PORTADA_DATA_URI } from "@/lib/brandImages";

export default function Home() {
  return (
    <div className="-mx-4 -mt-6 relative min-h-[calc(100dvh-5rem)] w-[calc(100%+2rem)] overflow-hidden flex flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={EYE_PORTADA_DATA_URI}
        alt="Look Makers"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 from-5% via-black/35 via-55% to-transparent" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-end px-8 pb-16 text-center">
        <p className="font-voice text-4xl text-lmGold mb-1">Look Makers</p>
        <p className="text-[11px] tracking-[0.3em] text-lmGold/80 mb-8">
          LOOK MAKERS
        </p>

        <p className="font-voice text-2xl text-white mb-2">Realza tu mirada</p>
        <p className="text-sm text-white/80 mb-8 max-w-[260px]">
          Agenda tu cita y luce la belleza de cada detalle
        </p>

        <Link
          href="/servicios"
          className="inline-flex items-center gap-2 bg-lmPink text-[#5a3a3f] font-medium px-8 py-3 rounded-full"
        >
          Comenzar <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

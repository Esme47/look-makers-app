import Link from "next/link";
import { PORTADA_BG_URI } from "@/lib/portadaFondo";
import { PORTADA_LOGO_URI } from "@/lib/portadaLogo";

export default function Home() {
  return (
    <div className="-mx-4 -mt-6 relative min-h-[calc(100dvh-5rem)] w-[calc(100%+2rem)] overflow-hidden flex flex-col bg-[#2b1a14]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PORTADA_BG_URI}
        alt=""
        className="absolute inset-x-0 top-0 w-full h-[64%] object-cover object-[60%_45%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2b1a14] from-30% via-[#2b1a14]/80 via-45% to-transparent to-75%" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-end px-8 pb-14 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PORTADA_LOGO_URI}
          alt="Look Makers"
          className="w-32 h-32 object-contain mb-2"
        />
        <p className="font-voice text-4xl text-lmGold leading-none mb-2">
          Look Makers
        </p>
        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-10 bg-lmGold/70" />
          <span className="text-[10px] tracking-[0.3em] text-lmGold/90">
            LOOK MAKERS
          </span>
          <span className="h-px w-10 bg-lmGold/70" />
        </div>

        <p className="font-voice text-2xl text-white mb-2">Realza tu mirada</p>
        <p className="text-sm text-white/85 mb-8 max-w-[260px]">
          Agenda tu cita y luce la belleza de cada detalle
        </p>

        <Link
          href="/inicio"
          className="inline-flex items-center justify-center gap-2 bg-lmPink text-[#5a3a3f] font-medium px-10 py-3.5 rounded-full w-full max-w-[300px]"
        >
          Comenzar <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

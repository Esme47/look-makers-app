"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAdmin } from "@/lib/adminActions";
import { LOGO_DATA_URI } from "@/lib/brandImages";

function BotonEntrar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="lm-btn">
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}

export default function AdminLogin() {
  const [state, formAction] = useFormState(loginAdmin, { error: null });

  return (
    <div className="pt-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_DATA_URI}
        alt="Look Makers"
        className="w-24 h-24 mx-auto mb-4"
      />
      <p className="font-voice text-lg mb-1">Acceso de la lashista</p>
      <p className="text-xs text-lmMuted mb-4">
        Esta sección es solo para administrar los servicios de Look Makers.
      </p>
      <form action={formAction} className="text-left">
        <input
          type="password"
          name="password"
          placeholder="Clave"
          className="w-full rounded-xl border border-lmGold/40 px-4 py-3 text-sm mb-2 bg-white"
        />
        {state?.error && (
          <p className="text-xs text-red-600 mb-2">{state.error}</p>
        )}
        <BotonEntrar />
      </form>
    </div>
  );
}

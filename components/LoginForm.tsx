"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviarEnlace(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Escribe un correo válido");
      return;
    }
    setError(null);
    setEnviando(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setEnviando(false);
    if (authError) {
      setError("No se pudo enviar el enlace, intenta de nuevo.");
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="text-center pt-10">
        <p className="font-voice text-lg mb-2">Revisa tu correo</p>
        <p className="text-sm text-lmMuted">
          Te enviamos un enlace de acceso a {email}. Ábrelo desde este mismo
          celular para iniciar sesión.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <p className="font-voice text-lg mb-1">Inicia sesión</p>
      <p className="text-xs text-lmMuted mb-4">
        Te enviamos un enlace mágico, sin contraseña.
      </p>
      <form onSubmit={enviarEnlace}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className="w-full rounded-xl border border-lmGold/40 px-4 py-3 text-sm mb-2 bg-white"
        />
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        <button type="submit" disabled={enviando} className="lm-btn">
          {enviando ? "Enviando…" : "Enviar enlace de acceso"}
        </button>
      </form>
    </div>
  );
}

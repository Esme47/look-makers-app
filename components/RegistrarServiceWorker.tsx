"use client";

import { useEffect } from "react";

export default function RegistrarServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {
        // Si falla (por ejemplo en desarrollo local), no pasa nada grave:
        // la app sigue funcionando normal, solo sin instalación offline.
      });
    }
  }, []);

  return null;
}

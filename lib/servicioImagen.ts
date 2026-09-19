import {
  SERVICIO_PESTANAS_DATA_URI,
  SERVICIO_LIFTING_DATA_URI,
  SERVICIO_CEJAS_DATA_URI,
  SERVICIO_COMBO_DATA_URI,
} from "@/lib/servicioImages";

export function getServicioImagen(nombre: string) {
  const n = nombre.toLowerCase();
  if (n.includes("combo")) return SERVICIO_COMBO_DATA_URI;
  if (n.includes("lifting")) return SERVICIO_LIFTING_DATA_URI;
  if (n.includes("cejas")) return SERVICIO_CEJAS_DATA_URI;
  return SERVICIO_PESTANAS_DATA_URI;
}

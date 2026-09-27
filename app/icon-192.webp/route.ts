import { NextResponse } from "next/server";
import { ICON_192_DATA_URI } from "@/lib/pwaIcons";

// Sirve el icono de 192x192 como un archivo real (no data URI) en /icon-192.webp.
// Chrome exige que los iconos del manifest sean descargables desde una URL propia
// para considerar el sitio instalable; un data URI incrustado no siempre cumple
// ese requisito de forma confiable.
export const dynamic = "force-static";

export async function GET() {
  const base64 = ICON_192_DATA_URI.split(",")[1];
  const buffer = Buffer.from(base64, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

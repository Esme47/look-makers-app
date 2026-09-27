import { NextResponse } from "next/server";
import { FAVICON_DATA_URI } from "@/lib/pwaIcons";

// Favicon pequeno, servido como archivo real en /favicon-48.png para que el
// navegador lo muestre de forma confiable en la pestana y en el selector
// "Instalar y crear acceso directo".
export const dynamic = "force-static";

export async function GET() {
  const base64 = FAVICON_DATA_URI.split(",")[1];
  const buffer = Buffer.from(base64, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

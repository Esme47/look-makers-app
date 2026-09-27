import { NextResponse } from "next/server";
import { ICON_512_DATA_URI } from "@/lib/pwaIcons";

export const dynamic = "force-static";

export async function GET() {
  const base64 = ICON_512_DATA_URI.split(",")[1];
  const buffer = Buffer.from(base64, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

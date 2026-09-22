import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import RegistrarServiceWorker from "@/components/RegistrarServiceWorker";
import { ICON_192_DATA_URI, ICON_512_DATA_URI, APPLE_TOUCH_ICON_DATA_URI } from "@/lib/pwaIcons";

export const metadata: Metadata = {
  title: "Look Makers",
  description: "Agenda tu cita de pestañas y cejas en Montería",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: ICON_192_DATA_URI, sizes: "192x192", type: "image/webp" },
      { url: ICON_512_DATA_URI, sizes: "512x512", type: "image/webp" },
    ],
    apple: APPLE_TOUCH_ICON_DATA_URI,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Look Makers",
  },
};

export const viewport: Viewport = {
  themeColor: "#b8934a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="max-w-md mx-auto min-h-screen pb-20 px-4 pt-6">
          {children}
        </div>
        <BottomNav />
        <RegistrarServiceWorker />
      </body>
    </html>
  );
}

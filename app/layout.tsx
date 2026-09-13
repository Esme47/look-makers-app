import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Look Makers",
  description: "Agenda tu cita de pestañas y cejas en Montería",
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
      </body>
    </html>
  );
}

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getServicios, adminListarCitas, adminListarClientes } from "@/lib/queries";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function Perfil() {
  const passwordCookie = cookies().get("lm_admin_pw")?.value;

  if (!passwordCookie) {
    return <AdminLogin />;
  }

  const supabase = createClient();
  const [servicios, citas, clientes] = await Promise.all([
    getServicios(supabase),
    adminListarCitas(supabase, passwordCookie),
    adminListarClientes(supabase, passwordCookie),
  ]);

  if (citas === null || clientes === null) {
    return <AdminLogin />;
  }

  return (
    <AdminDashboard servicios={servicios} citas={citas} clientes={clientes} />
  );
}

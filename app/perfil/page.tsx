import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getServicios } from "@/lib/queries";
import AdminLogin from "@/components/AdminLogin";
import AdminServiciosEditor from "@/components/AdminServiciosEditor";

export const dynamic = "force-dynamic";

export default async function Perfil() {
  const passwordCookie = cookies().get("lm_admin_pw")?.value;

  if (!passwordCookie) {
    return <AdminLogin />;
  }

  const supabase = createClient();
  const servicios = await getServicios(supabase);

  return <AdminServiciosEditor servicios={servicios} />;
}

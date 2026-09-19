import { createClient } from "@/lib/supabase/server";
import { getServicios } from "@/lib/queries";
import ServiciosCatalogo from "@/components/ServiciosCatalogo";

export const dynamic = "force-dynamic";

export default async function Servicios() {
  const supabase = createClient();
  const servicios = await getServicios(supabase);

  return <ServiciosCatalogo servicios={servicios} />;
}

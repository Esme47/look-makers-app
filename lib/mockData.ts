// Utilidades compartidas. Los datos de servicios, profesionales y citas
// ahora vienen de Supabase (ver lib/queries.ts) — este archivo solo
// conserva el formateador de moneda.

export function formatCOP(valor: number) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

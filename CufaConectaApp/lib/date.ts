/** ISO date yyyy-MM-dd */
export function isoDateFrom(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Converte yyyy-MM-dd (ou retorno de `normalizeApiDate`) para dd-MM-yyyy exigido pelo PUT `/usuarios`. */
export function toDdMmYyyyFromIso(isoYyyyMmDd: string): string {
  const base = normalizeApiDate(isoYyyyMmDd);
  if (base.length < 10) return "";
  const [y, m, d] = base.split("-");
  if (!y || !m || !d) return "";
  return `${d}-${m}-${y}`;
}

export function defaultExperienciaRange() {
  const end = new Date();
  const start = new Date();
  start.setFullYear(end.getFullYear() - 1);
  return { dtInicio: isoDateFrom(start), dtFim: isoDateFrom(end) };
}

/** Aceita string ISO ou array [ano, mês, dia] do Jackson. */
export function normalizeApiDate(raw: unknown): string {
  if (typeof raw === "string") return raw.slice(0, 10);
  if (Array.isArray(raw) && raw.length >= 3) {
    const [y, m, d] = raw;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  return "";
}

export function formatExperienciaPeriod(dtInicio: unknown, dtFim: unknown) {
  const a = normalizeApiDate(dtInicio);
  const b = normalizeApiDate(dtFim);
  if (!a || !b) return "";
  return `${a} → ${b}`;
}

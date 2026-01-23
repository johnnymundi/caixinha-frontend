export function normalizeBRLAmount(raw: string): string {
  const v = raw.trim();

  if (!v) return "";

  // remove espaços
  // se tiver vírgula, assume pt-BR: "1.234,56" -> "1234.56"
  if (v.includes(",")) {
    return v.replace(/\./g, "").replace(",", ".");
  }

  // se não tiver vírgula, assume que já veio em "14.99" ou "10"
  return v;
}

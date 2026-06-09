export function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR');
}

export function formatKm(km: number): string {
  if (km >= 1_000_000) return `${(km / 1_000_000).toFixed(2)}M km`;
  if (km >= 1_000) return `${(km / 1_000).toFixed(1)}k km`;
  return `${km.toFixed(0)} km`;
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function getDiameterLabel(min: number, max: number): string {
  const avgM = ((min + max) / 2) * 1000;
  if (avgM < 1000) return `~${avgM.toFixed(0)} m`;
  return `~${((min + max) / 2).toFixed(2)} km`;
}

export function getHazardLabel(isHazardous: boolean): string {
  return isHazardous ? 'PERIGOSO' : 'Seguro';
}

export function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Hoje';
  if (diff === -1) return 'Ontem';
  if (diff === 1) return 'Amanhã';
  if (diff < 0) return `Há ${Math.abs(diff)} dias`;
  return `Em ${diff} dias`;
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
}

export function formatVolume(volume: string, unit: string): string {
  const num = parseFloat(volume);
  const formatted = Number.isInteger(num)
    ? num.toString()
    : num.toFixed(2).replace(/\.?0+$/, '');
  return `${formatted} ${unit}`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isValidDateRange(dateFrom: string, dateTo: string): boolean {
  if (!dateFrom || !dateTo) {
    return true;
  }
  return dateFrom <= dateTo;
}

export function isNotFutureDate(isoDate: string): boolean {
  if (!isoDate) {
    return true;
  }
  return isoDate <= todayIso();
}

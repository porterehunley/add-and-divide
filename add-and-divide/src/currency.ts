export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}

export function parseCurrency(formatted: string): number {
  console.log(formatCurrency(9));
  const sanitized = formatted.replace(/[$,]/g, '');
  console.log(sanitized);
  return parseFloat(sanitized);
}

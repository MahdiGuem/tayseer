export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    SAR: 'SAR ',
    EGP: 'EGP ',
    EUR: '€',
    GBP: '£',
  };
  return symbols[currency] || currency + ' ';
};

export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency);
  return symbol + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/**
 * Currency and Number Formatters for Indian Locale (en-IN)
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatINRPerMonth = (amount: number): string => {
  return `${formatINR(amount)}/mo`;
};

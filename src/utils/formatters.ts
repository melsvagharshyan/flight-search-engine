export const formatTime = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export const formatDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.floor((hours % 1) * 60);
  return `${h}h ${m}m`;
};

export const calculatePrice = (basePrice: number, stops: number, randomFactor: number): number => {
  const priceMultiplier = 1 + stops * 0.1 + randomFactor * 0.3;
  return Math.round(basePrice * priceMultiplier);
};

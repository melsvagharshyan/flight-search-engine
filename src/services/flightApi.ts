import type { Flight, PriceDataPoint } from '../types/flight';
import { format, addDays } from 'date-fns';

const DEFAULT_DATE_RANGE = 7;

export const getPriceTrends = (flights: Flight[], dateRange: number = DEFAULT_DATE_RANGE): PriceDataPoint[] => {
  if (flights.length === 0) return [];
  
  const sortedFlights = [...flights].sort((a, b) => a.price - b.price);
  const minPrice = sortedFlights[0].price;
  const maxPrice = sortedFlights[sortedFlights.length - 1].price;
  const priceRange = maxPrice - minPrice;
  const dataPoints: PriceDataPoint[] = [];
  const today = new Date();
  
  for (let i = 0; i < dateRange; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, 'MMM dd');
    const trendFactor = Math.sin((i / dateRange) * Math.PI * 2) * 0.3 + 1;
    const basePrice = minPrice + (priceRange * (i / dateRange));
    const price = Math.round(basePrice * trendFactor);
    const clampedPrice = Math.max(minPrice, Math.min(maxPrice, price));
    
    dataPoints.push({
      date: dateStr,
      price: clampedPrice,
    });
  }
  
  return dataPoints;
};

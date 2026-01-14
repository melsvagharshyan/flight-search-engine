import { format } from 'date-fns';
import type { Flight } from '../../types/flight';
import type { AmadeusResponse } from './types';

const parseDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?/);
  if (!match) return '0h 0m';
  
  const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
  const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
  return `${hours}h ${minutes}m`;
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'HH:mm');
};

const getAirlineName = (carrierCode: string): string => {
  const airlineMap: Record<string, string> = {
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'WN': 'Southwest Airlines',
    'B6': 'JetBlue Airways',
    'AS': 'Alaska Airlines',
    'NK': 'Spirit Airlines',
    'F9': 'Frontier Airlines',
    'LH': 'Lufthansa',
    'BA': 'British Airways',
    'AF': 'Air France',
    'KL': 'KLM',
    'LX': 'Swiss International Air Lines',
    'OS': 'Austrian Airlines',
    'SN': 'Brussels Airlines',
  };
  return airlineMap[carrierCode] || carrierCode;
};

export const transformAmadeusResponse = (data: AmadeusResponse): Flight[] => {
  return data.data.map((offer, index) => {
    const itinerary = offer.itineraries[0];
    const segments = itinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    const totalStops = segments.reduce((sum, seg) => sum + seg.numberOfStops, 0);

    return {
      id: offer.id || `flight-${index}`,
      airline: getAirlineName(offer.validatingAirlineCodes[0] || firstSegment.carrierCode),
      airlineCode: offer.validatingAirlineCodes[0] || firstSegment.carrierCode,
      origin: firstSegment.departure.iataCode,
      destination: lastSegment.arrival.iataCode,
      departureTime: formatTime(firstSegment.departure.at),
      arrivalTime: formatTime(lastSegment.arrival.at),
      duration: parseDuration(itinerary.duration),
      stops: totalStops,
      price: Math.round(parseFloat(offer.price.total)),
      currency: offer.price.currency,
      aircraft: firstSegment.aircraft?.code || 'Unknown',
    };
  });
};

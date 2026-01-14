import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { Flight, SearchParams } from '../../types/flight';
import { format } from 'date-fns';

interface AmadeusTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface AmadeusFlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
      carrierCode: string;
      duration: string;
      numberOfStops: number;
      aircraft?: {
        code: string;
      };
    }>;
  }>;
  validatingAirlineCodes: string[];
}

interface AmadeusResponse {
  data: AmadeusFlightOffer[];
  meta?: {
    count: number;
  };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

const getAccessToken = async (): Promise<string> => {
  const apiKey = import.meta.env.VITE_AMADEUS_API_KEY;
  const apiSecret = import.meta.env.VITE_AMADEUS_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('Amadeus API credentials not found. Please set VITE_AMADEUS_API_KEY and VITE_AMADEUS_API_SECRET in your .env file.');
  }

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: apiKey,
      client_secret: apiSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get access token: ${response.statusText} - ${errorText}`);
  }

  const data: AmadeusTokenResponse = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
};

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

const transformAmadeusResponse = (data: AmadeusResponse): Flight[] => {
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

const baseQuery: BaseQueryFn<string, unknown, unknown> = async (args) => {
  const token = await getAccessToken();
  const url = `https://test.api.amadeus.com/v2/shopping/flight-offers${args}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return {
      error: {
        status: response.status,
        data: errorData,
      },
    };
  }

  const data = await response.json();
  return { data };
};

export const flightApi = createApi({
  reducerPath: 'flightApi',
  baseQuery,
  tagTypes: ['Flights'],
  endpoints: (builder) => ({
    searchFlights: builder.query<Flight[], SearchParams>({
      query: (params) => {
        const departureDate = format(params.departureDate, 'yyyy-MM-dd');
        const queryParams = new URLSearchParams({
          originLocationCode: params.origin,
          destinationLocationCode: params.destination,
          departureDate,
          adults: params.passengers.toString(),
          max: '20',
        });

        if (params.returnDate) {
          queryParams.append('returnDate', format(params.returnDate, 'yyyy-MM-dd'));
        }

        return `?${queryParams.toString()}`;
      },
      transformResponse: (response: AmadeusResponse): Flight[] => {
        if (!response.data || response.data.length === 0) {
          return [];
        }
        return transformAmadeusResponse(response);
      },
      transformErrorResponse: (response: { status: number; data?: unknown }) => {
        return {
          status: response.status,
          data: response.data,
        };
      },
    }),
  }),
});

export const { useSearchFlightsQuery, useLazySearchFlightsQuery } = flightApi;

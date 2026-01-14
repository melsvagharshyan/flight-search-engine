import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { Flight, SearchParams } from '../../types/flight';
import { format } from 'date-fns';
import { getAccessToken } from './auth';
import { transformAmadeusResponse } from './utils';
import type { AmadeusResponse } from './types';

const baseQueryWithAuth: BaseQueryFn<
  string | { url: string; params?: Record<string, string> },
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  try {
    const token = await getAccessToken();
    
    const baseQuery = fetchBaseQuery({
      baseUrl: 'https://test.api.amadeus.com/v2/shopping/flight-offers',
      prepareHeaders: (headers) => {
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('Content-Type', 'application/json');
        return headers;
      },
    });

    const queryArgs = typeof args === 'string' 
      ? { url: args }
      : args;

    return baseQuery(queryArgs, api, extraOptions);
  } catch (error) {
    return {
      error: {
        status: 'FETCH_ERROR',
        error: error instanceof Error ? error.message : 'Failed to get access token',
      },
    };
  }
};

export const flightApi = createApi({
  reducerPath: 'flightApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Flights'],
  endpoints: (builder) => ({
    searchFlights: builder.query<Flight[], SearchParams>({
      query: (params) => {
        const departureDate = format(params.departureDate, 'yyyy-MM-dd');
        const queryParams: Record<string, string> = {
          originLocationCode: params.origin,
          destinationLocationCode: params.destination,
          departureDate,
          adults: params.passengers.toString(),
          max: '20',
        };

        if (params.returnDate) {
          queryParams.returnDate = format(params.returnDate, 'yyyy-MM-dd');
        }

        return {
          url: '',
          params: queryParams,
        };
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

export const { useLazySearchFlightsQuery } = flightApi;

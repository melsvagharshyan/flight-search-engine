import { useMemo } from 'react';
import type { Flight, Filters } from '../types/flight';

export const useFlightFilters = (flights: Flight[], filters: Filters) => {
  return useMemo(() => {
    let filtered = [...flights];

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(f => f.price <= filters.maxPrice!);
    }

    if (filters.maxStops !== undefined) {
      filtered = filtered.filter(f => f.stops <= filters.maxStops!);
    }

    if (filters.airlines && filters.airlines.length > 0) {
      filtered = filtered.filter(f => filters.airlines!.includes(f.airline));
    }

    return filtered;
  }, [flights, filters]);
};

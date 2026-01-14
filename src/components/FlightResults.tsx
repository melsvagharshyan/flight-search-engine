import type { Flight } from '../types/flight';
import FlightCard from './FlightCard';
import LoadingSpinner from './ui/LoadingSpinner';
import EmptyState from './ui/EmptyState';
import { Plane } from 'lucide-react';

interface FlightResultsProps {
  flights: Flight[];
  isLoading?: boolean;
}

export default function FlightResults({ flights, isLoading }: FlightResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 md:py-20">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-6" />
          <p className="text-gray-600 text-lg font-medium">Loading flights...</p>
        </div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <EmptyState
        icon={<Plane className="w-12 h-12 text-gray-400" />}
        title="No flights found"
        description="Try adjusting your search criteria or filters."
        className="p-12 md:p-16"
      />
    );
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {flights.length} {flights.length === 1 ? 'Flight' : 'Flights'} Found
        </h2>
        <p className="text-sm md:text-base text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-lg">
          Sorted by price (lowest first)
        </p>
      </div>
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
}

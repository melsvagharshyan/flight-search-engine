import type { Flight } from '../types/flight';
import { Clock, MapPin, Plane } from 'lucide-react';
import Button from './ui/Button';

interface FlightCardProps {
  flight: Flight;
}

const StopsBadge = ({ stops }: { stops: number }) => {
  if (stops === 0) {
    return (
      <p className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Direct</p>
    );
  }
  return (
    <p className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full">
      {stops} {stops === 1 ? 'Stop' : 'Stops'}
    </p>
  );
};

export default function FlightCard({ flight }: FlightCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 shadow-sm">
            <Plane className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-1">{flight.airline}</h3>
            <p className="text-sm font-medium text-gray-500">{flight.airlineCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8 flex-1 min-w-0">
          <div className="text-center flex-shrink-0">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{flight.departureTime}</p>
            <p className="text-xs font-semibold text-gray-600">{flight.origin}</p>
          </div>
          
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-200 to-gray-300"></div>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0 px-3">
              <Clock className="w-4 h-4 text-blue-500" />
              <p className="text-[10px] font-semibold text-gray-600 whitespace-nowrap">{flight.duration}</p>
              <StopsBadge stops={flight.stops} />
            </div>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200"></div>
          </div>
          
          <div className="text-center flex-shrink-0">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{flight.arrivalTime}</p>
            <p className="text-xs font-semibold text-gray-600">{flight.destination}</p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-center justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8 md:min-w-[140px]">
          <div className="text-left md:text-center">
            <p className="text-4xl font-bold text-blue-600 mb-1">${flight.price}</p>
            <p className="text-sm font-medium text-gray-500">{flight.currency}</p>
          </div>
          <Button className="px-10 py-3.5 min-w-[120px] whitespace-nowrap shadow-md hover:shadow-lg">
            Select
          </Button>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{flight.aircraft}</span>
        </div>
        {flight.stops > 0 && (
          <span className="text-orange-600 font-semibold bg-orange-50 px-3 py-1.5 rounded-lg">
            Layover information available
          </span>
        )}
      </div>
    </div>
  );
}

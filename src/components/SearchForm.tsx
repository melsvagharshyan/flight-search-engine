import { useState } from 'react';
import type { SearchParams } from '../types/flight';
import { Calendar, Users, Plane, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';
import { POPULAR_CITIES } from '../constants/cities';
import InputWithIcon from './ui/InputWithIcon';
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
}

const getDefaultDate = (daysFromNow: number): string => {
  return format(new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
};

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [origin, setOrigin] = useState('NYC');
  const [destination, setDestination] = useState('LAX');
  const [departureDate, setDepartureDate] = useState(getDefaultDate(7));
  const [returnDate, setReturnDate] = useState(getDefaultDate(14));
  const [passengers, setPassengers] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      origin,
      destination,
      departureDate: new Date(departureDate),
      returnDate: tripType === 'round-trip' ? new Date(returnDate) : undefined,
      passengers,
      tripType,
    });
  };

  const swapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const inputBaseClasses = 'w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium transition-all duration-200 hover:border-gray-300';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-10">
      <div className="flex gap-3 mb-8">
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          className={`flex-1 py-3.5 px-8 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer ${
            tripType === 'round-trip'
              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Round Trip
        </button>
        <button
          type="button"
          onClick={() => setTripType('one-way')}
          className={`flex-1 py-3.5 px-8 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer ${
            tripType === 'one-way'
              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          One Way
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-end">
          <InputWithIcon
            icon={<Plane className="w-5 h-5" />}
            label="From"
          >
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className={`${inputBaseClasses} appearance-none bg-white`}
              required
            >
              {POPULAR_CITIES.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name} ({city.code})
                </option>
              ))}
            </select>
          </InputWithIcon>

          <div className="flex items-end justify-center">
            <button
              type="button"
              onClick={swapCities}
              className="w-14 h-14 flex items-center justify-center hover:bg-blue-50 rounded-xl transition-all duration-200 group cursor-pointer border-2 border-gray-200 hover:border-blue-500 bg-white"
              aria-label="Swap cities"
            >
              <ArrowRightLeft className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
            </button>
          </div>

          <InputWithIcon
            icon={<Plane className="w-5 h-5 rotate-90" />}
            label="To"
          >
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={`${inputBaseClasses} appearance-none bg-white`}
              required
            >
              {POPULAR_CITIES.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name} ({city.code})
                </option>
              ))}
            </select>
          </InputWithIcon>

          <InputWithIcon
            icon={<Calendar className="w-5 h-5" />}
            label="Departure"
          >
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className={inputBaseClasses}
              required
            />
          </InputWithIcon>

          {tripType === 'round-trip' && (
            <InputWithIcon
              icon={<Calendar className="w-5 h-5" />}
              label="Return"
            >
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departureDate}
                className={inputBaseClasses}
                required
              />
            </InputWithIcon>
          )}

          <div className={tripType === 'one-way' ? 'md:col-span-2' : ''}>
            <InputWithIcon
              icon={<Users className="w-5 h-5" />}
              label="Passengers"
            >
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className={`${inputBaseClasses} appearance-none bg-white`}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </InputWithIcon>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          fullWidth
          className="py-4 px-8 text-lg min-h-[56px] shadow-lg hover:shadow-xl mt-2 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="border-white" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <span>Search Flights</span>
              <Plane className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

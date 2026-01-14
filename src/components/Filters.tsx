import type { Filters, Flight } from '../types/flight';
import { Sliders, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Button from './ui/Button';

interface FiltersProps {
  flights: Flight[];
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const FilterButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer min-w-[100px] ${
      isActive
        ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

export default function FiltersComponent({ flights, filters, onFiltersChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const { maxPrice, minPrice, uniqueAirlines, uniqueStops } = useMemo(() => {
    const prices = flights.map(f => f.price);
    return {
      maxPrice: Math.max(...prices, 1000),
      minPrice: Math.min(...prices, 0),
      uniqueAirlines: Array.from(new Set(flights.map(f => f.airline))).sort(),
      uniqueStops: Array.from(new Set(flights.map(f => f.stops))).sort((a, b) => a - b),
    };
  }, [flights]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;
  const currentMaxPrice = localFilters.maxPrice || maxPrice;
  const pricePercentage = ((currentMaxPrice - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-xl p-2">
            <Sliders className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer font-medium"
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className={`space-y-8 ${isOpen ? 'block' : 'hidden md:block'}`}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Max Price: <span className="text-blue-600 text-lg">${currentMaxPrice}</span>
          </label>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={currentMaxPrice}
            onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${pricePercentage}%, #e5e7eb ${pricePercentage}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
            <span>${minPrice}</span>
            <span>${maxPrice}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Max Stops</label>
          <div className="flex flex-wrap gap-3">
            {uniqueStops.map((stop) => (
              <FilterButton
                key={stop}
                label={stop === 0 ? 'Direct' : `${stop} ${stop === 1 ? 'Stop' : 'Stops'}`}
                isActive={localFilters.maxStops === stop}
                onClick={() => {
                  const newMaxStops = localFilters.maxStops === stop ? undefined : stop;
                  handleFilterChange('maxStops', newMaxStops);
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Airlines</label>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {uniqueAirlines.map((airline) => {
              const isSelected = localFilters.airlines?.includes(airline);
              return (
                <label
                  key={airline}
                  className="flex items-center gap-3 cursor-pointer hover:bg-blue-50 p-3 rounded-xl transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const currentAirlines = localFilters.airlines || [];
                      const newAirlines = e.target.checked
                        ? [...currentAirlines, airline]
                        : currentAirlines.filter(a => a !== airline);
                      handleFilterChange('airlines', newAirlines.length > 0 ? newAirlines : undefined);
                    }}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">{airline}</span>
                </label>
              );
            })}
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            fullWidth
            onClick={clearFilters}
            className="py-3.5 px-6 gap-3"
          >
            <X className="w-5 h-5" />
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
}

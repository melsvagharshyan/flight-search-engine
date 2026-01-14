import { useState, useMemo } from 'react';
import { useLazySearchFlightsQuery } from './store/api/flightApi';
import { getPriceTrends } from './services/flightApi';
import SearchForm from './components/SearchForm';
import FlightResults from './components/FlightResults';
import PriceGraph from './components/PriceGraph';
import EmptyState from './components/ui/EmptyState';
import { Plane } from 'lucide-react';

function App() {
  const [hasSearched, setHasSearched] = useState(false);
  const [triggerSearch, { data: flights = [], isLoading, isFetching, error }] = useLazySearchFlightsQuery();

  const priceTrends = useMemo(() => {
    if (flights.length === 0) return [];
    return getPriceTrends(flights);
  }, [flights]);

  const handleSearch = async (params: Parameters<typeof triggerSearch>[0]) => {
    setHasSearched(true);
    await triggerSearch(params);
  };

  if (error) {
    console.error('Error searching flights:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="text-center mb-10 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 shadow-lg">
              <Plane className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Flight Search Engine
            </h1>
          </div>
          <p className="text-gray-600 text-lg md:text-xl">
            Find the best flights at the best prices
          </p>
        </header>

        <SearchForm onSearch={handleSearch} isLoading={isLoading || isFetching} />

        {hasSearched && (
          <div className="space-y-6 md:space-y-8">
            <PriceGraph data={priceTrends} isLoading={isLoading} />
            <FlightResults flights={flights} isLoading={isLoading} />
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-20 md:py-24">
            <EmptyState
              icon={<Plane className="w-12 h-12 text-blue-600" />}
              title="Start Your Search"
              description="Enter your travel details above to find the perfect flight for your journey."
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

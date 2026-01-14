import type { PriceDataPoint } from '../types/flight';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';

interface PriceGraphProps {
  data: PriceDataPoint[];
  isLoading?: boolean;
}

const calculateStats = (data: PriceDataPoint[]) => {
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const averagePrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);
  return { minPrice, maxPrice, averagePrice };
};

export default function PriceGraph({ data, isLoading }: PriceGraphProps) {
  if (isLoading || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div className="h-72 md:h-80 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-6" />
            <p className="text-gray-600 text-lg font-medium">Loading price trends...</p>
          </div>
        </div>
      </div>
    );
  }

  const { minPrice, maxPrice, averagePrice } = calculateStats(data);
  const trend = data[data.length - 1].price - data[0].price;
  const isTrendingUp = trend > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Price Trends</h3>
          <p className="text-sm md:text-base text-gray-600">7-day price forecast</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 w-fit">
          {isTrendingUp ? (
            <TrendingUp className="w-6 h-6 text-red-500" />
          ) : (
            <TrendingDown className="w-6 h-6 text-green-500" />
          )}
          <span className={`font-bold text-lg ${isTrendingUp ? 'text-red-500' : 'text-green-500'}`}>
            {isTrendingUp ? '+' : ''}${Math.abs(trend)}
          </span>
        </div>
      </div>

      <div className="h-72 md:h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '13px', fontWeight: '500' }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '13px', fontWeight: '500' }}
              domain={[minPrice - 50, maxPrice + 50]}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
              }}
              formatter={(value: number | undefined) => value !== undefined ? [`$${value}`, 'Price'] : ['', '']}
              labelStyle={{ color: '#374151', fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-gray-600 mb-1">Lowest</p>
          <p className="text-2xl font-bold text-blue-600">${minPrice}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-gray-600 mb-1">Average</p>
          <p className="text-2xl font-bold text-gray-900">${averagePrice}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-gray-600 mb-1">Highest</p>
          <p className="text-2xl font-bold text-orange-600">${maxPrice}</p>
        </div>
      </div>
    </div>
  );
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  aircraft?: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
  tripType: 'one-way' | 'round-trip';
}

export interface PriceDataPoint {
  date: string;
  price: number;
  airline?: string;
}

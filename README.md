# Flight Search Engine

A modern, responsive flight search engine built with React, TypeScript, and Tailwind CSS. This application provides an intuitive interface for searching flights with real-time price visualization and advanced filtering capabilities.

## Features

- **Search & Results**: Comprehensive search form with origin, destination, dates, and passenger selection
- **Live Price Graph**: Real-time price trend visualization using Recharts that updates as filters are applied
- **Complex Filtering**: Simultaneous filters for stops, price range, and airlines that instantly update both flight list and price graph
- **Responsive Design**: Fully functional layouts optimized for both mobile and desktop devices
- **Modern UI/UX**: Clean, intuitive design with smooth animations and transitions

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Chart library for price visualization
- **Lucide React** - Icon library
- **date-fns** - Date utilities

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## API Integration

The application uses the **Amadeus Self-Service API** for flight searches. You need to provide your Amadeus API credentials to use the application.

### Setup Amadeus API

1. Sign up for an Amadeus API account at https://developers.amadeus.com/
2. Create a new app in the Self-Service portal
3. Get your API Key and API Secret
4. Create a `.env` file in the root directory:
```env
VITE_AMADEUS_API_KEY=your_amadeus_api_key_here
VITE_AMADEUS_API_SECRET=your_amadeus_api_secret_here
```

5. Restart your development server

### API Features

- ✅ Automatic OAuth2 token management with caching
- ✅ Flight search with origin, destination, dates, and passengers
- ✅ Support for both one-way and round-trip flights
- ✅ Real-time flight data from Amadeus
- ✅ Response transformation to match application data structure

## Project Structure

```
src/
├── components/
│   ├── SearchForm.tsx      # Search input form
│   ├── FlightCard.tsx      # Individual flight result card
│   ├── FlightResults.tsx   # Flight results list
│   ├── PriceGraph.tsx      # Price trend visualization
│   └── Filters.tsx         # Filter sidebar
├── services/
│   └── flightApi.ts        # API service layer
├── types/
│   └── flight.ts           # TypeScript interfaces
├── App.tsx                 # Main application component
└── main.tsx               # Application entry point
```

## Key Features Implementation

### Real-time Price Graph
The price graph updates instantly when filters are applied, showing price trends over a 7-day period. The graph uses Recharts' AreaChart component with gradient fills for a modern look.

### Complex Filtering
Filters work simultaneously and update both the flight list and price graph in real-time:
- **Price Range**: Slider-based price filter
- **Stops**: Filter by number of stops (Direct, 1 Stop, 2+ Stops)
- **Airlines**: Multi-select airline filter

### Responsive Design
- Mobile-first approach with breakpoints at `md:` (768px) and `lg:` (1024px)
- Collapsible filters on mobile
- Optimized card layouts for different screen sizes
- Touch-friendly interactive elements

## Development

The application requires Amadeus API credentials to function. Make sure you have:
1. Created a `.env` file with your Amadeus API credentials
2. Restarted the development server after adding credentials

The application will fetch real flight data from the Amadeus Test API environment.

## License

MIT

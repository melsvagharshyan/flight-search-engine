export interface AmadeusTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AmadeusFlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
      carrierCode: string;
      duration: string;
      numberOfStops: number;
      aircraft?: {
        code: string;
      };
    }>;
  }>;
  validatingAirlineCodes: string[];
}

export interface AmadeusResponse {
  data: AmadeusFlightOffer[];
  meta?: {
    count: number;
  };
}

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AmadeusTokenResponse } from './types';

const authBaseUrl = import.meta.env.VITE_AMADEUS_AUTH_BASE_URL || 'https://test.api.amadeus.com/v1/security/oauth2';

const authBaseQuery = fetchBaseQuery({
  baseUrl: authBaseUrl,
});

let cachedToken: { token: string; expiresAt: number } | null = null;

export const getAccessToken = async (): Promise<string> => {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const apiKey = import.meta.env.VITE_AMADEUS_API_KEY;
  const apiSecret = import.meta.env.VITE_AMADEUS_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('Amadeus API credentials not found. Please set VITE_AMADEUS_API_KEY and VITE_AMADEUS_API_SECRET in your .env file.');
  }

  const tokenParams = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: apiKey,
    client_secret: apiSecret,
  });

  const result = await authBaseQuery(
    {
      url: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    },
    {} as any,
    {}
  );

  if ('data' in result && result.data) {
    const data = result.data as AmadeusTokenResponse;
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };
    return data.access_token;
  } else {
    const error = result.error as { status?: number; data?: unknown; error?: string };
    const errorMessage = 
      (typeof error === 'object' && error !== null && 'data' in error && error.data)
        ? JSON.stringify(error.data)
        : error?.error || `Failed to get access token: ${error?.status || 'Unknown error'}`;
    throw new Error(errorMessage);
  }
};

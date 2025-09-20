import { AuthResponse, OffersResponse, DeeplinkRequest, DeeplinkResponse } from '../types/api';

// Check if Supabase is configured, otherwise fall back to direct API calls
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use different base URLs based on environment and configuration
const getBaseUrl = () => {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    return `${SUPABASE_URL}/functions/v1/involve-asia-proxy`;
  }
  // Use Vite proxy for development
  return '/api';
};

const BASE_URL = getBaseUrl();

class InvolveAsiaAPI {
  private token: string | null = null;

  async authenticate(key: string, secret: string): Promise<string> {
    console.log('Attempting authentication with:', { key, secret: secret.substring(0, 10) + '...' });
    
    try {
      const requestBody = { key, secret };
      console.log('Using base URL:', BASE_URL);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Add Supabase auth header if using Supabase
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
        console.log('Using Supabase Edge Function proxy');
      } else {
        console.log('Using direct API calls (may have CORS issues)');
      }
      
      const endpoint = SUPABASE_URL ? '/authenticate' : '/authenticate';
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        
        if (response.status === 0 || response.status >= 500) {
          throw new Error('Network error: Unable to connect to Involve Asia API. Please check your internet connection.');
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: AuthResponse = await response.json();
      console.log('Response data:', data);

      if (data.status === 'success') {
        this.token = data.data.token;
        console.log('Authentication successful, token received');
        return data.data.token;
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Involve Asia API. Please check your internet connection.');
      }
      
      if (error instanceof Error && error.message.includes('CORS')) {
        throw new Error('CORS error: Unable to access Involve Asia API directly from browser. Please use a proxy server.');
      }
      
      throw new Error(error instanceof Error ? error.message : 'Authentication failed');
    }
  }

  async fetchOffers(filters: Record<string, any> = {}): Promise<OffersResponse['data']> {
    if (!this.token) {
      throw new Error('Not authenticated. Please authenticate first.');
    }

    console.log('Fetching offers with filters:', filters);
    
    try {
      const requestBody = {
        page: filters.page || 1,
        limit: filters.limit || 100,
        sort_by: filters.sort_by || 'relevance',
      };

      const response = await fetch(`${BASE_URL}/offers/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(SUPABASE_URL && SUPABASE_ANON_KEY 
            ? { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
            : {}
          ),
          ...(this.token && !SUPABASE_URL 
            ? { 'Authorization': `Bearer ${this.token}` }
            : {}
          ),
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Offers response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        
        if (response.status === 401) {
          this.token = null;
          throw new Error('Authentication expired. Please login again.');
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: OffersResponse = await response.json();
      console.log('Offers response data:', data);

      if (data.status === 'success') {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch offers');
      }
    } catch (error) {
      console.error('Fetch offers error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Involve Asia API. Please check your internet connection.');
      }
      
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch offers');
    }
  }

  async generateDeeplink(request: DeeplinkRequest): Promise<DeeplinkResponse['data']> {
    if (!this.token) {
      throw new Error('Not authenticated. Please authenticate first.');
    }

    console.log('Generating deeplink with request:', request);
    
    try {
      const response = await fetch(`${BASE_URL}/deeplink/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(SUPABASE_URL && SUPABASE_ANON_KEY 
            ? { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
            : {}
          ),
          ...(this.token && !SUPABASE_URL 
            ? { 'Authorization': `Bearer ${this.token}` }
            : {}
          ),
        },
        body: JSON.stringify(request),
      });

      console.log('Deeplink response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        
        if (response.status === 401) {
          this.token = null;
          throw new Error('Authentication expired. Please login again.');
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: DeeplinkResponse = await response.json();
      console.log('Deeplink response data:', data);

      if (data.status === 'success') {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to generate deeplink');
      }
    } catch (error) {
      console.error('Generate deeplink error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Involve Asia API. Please check your internet connection.');
      }
      
      throw new Error(error instanceof Error ? error.message : 'Failed to generate deeplink');
    }
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  logout(): void {
    this.token = null;
  }
}

export const involveAsiaAPI = new InvolveAsiaAPI();
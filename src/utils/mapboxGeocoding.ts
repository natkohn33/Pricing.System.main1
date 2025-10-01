/**
 * Mapbox Geocoding Service
 * Uses Mapbox's Geocoding API for address geocoding with higher rate limits
 */

// Your Mapbox API key
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibmF0a29objMzIiwiYSI6ImNtZmVhbXVuaTA0czgyaW9lbW82eXFnaTMifQ.R33T-EYy8zmwnKSogCA0Vg';

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  boundingBox?: [number, number, number, number]; // [south, north, west, east]
}

export interface MapboxResponse {
  features: Array<{
    center: [number, number]; // [longitude, latitude]
    place_name: string;
    bbox?: [number, number, number, number]; // [west, south, east, north]
    properties: {
      accuracy?: string;
    };
  }>;
  query: string[];
  type: string;
}

/**
 * Geocode an address using Mapbox Geocoding API
 * @param address - Full address string to geocode
 * @param countryCode - Optional country code to limit search (default: 'us')
 * @returns Promise resolving to geocoding result or null if not found
 */
export async function geocodeAddress(
  address: string, 
  countryCode: string = 'us'
): Promise<GeocodingResult | null> {
  if (!address || address.trim().length === 0) {
    console.warn('⚠️ Empty address provided to geocoding service');
    return null;
  }

  const trimmedAddress = address.trim();
  console.log('🗺️ Geocoding locations:', {
    address: trimmedAddress,
    countryCode,
    apiEndpoint: 'https://api.mapbox.com/geocoding/v5/mapbox.places'
  });

  try {
    // Construct Mapbox Geocoding API URL
    const encodedAddress = encodeURIComponent(trimmedAddress);
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1&country=${countryCode}&types=address`;
    
    console.log('🔗 Mapbox API request URL:', apiUrl.replace(MAPBOX_ACCESS_TOKEN, 'HIDDEN_TOKEN'));

    // Make request to Mapbox API
    let response;
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
    } catch (fetchError) {
      console.warn('⚠️ Network error accessing Mapbox API, using fallback geocoding:', fetchError);
      return getFallbackGeocodingResult(trimmedAddress);
    }

    if (!response.ok) {
      throw new Error(`Mapbox API request failed: ${response.status} ${response.statusText}`);
    }

    const data: MapboxResponse = await response.json();
    console.log('📍 Mapbox API response:', {
      resultsCount: data.features.length,
      firstResult: data.features[0] ? {
        center: data.features[0].center,
        place_name: data.features[0].place_name,
        accuracy: data.features[0].properties?.accuracy
      } : null
    });

    if (!data.features || data.features.length === 0) {
      console.warn('❌ No geocoding results found for address:', trimmedAddress);
      return null;
    }

    const result = data.features[0];
    const [longitude, latitude] = result.center; // Note: Mapbox returns [lng, lat]

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('❌ Invalid coordinates returned from Mapbox:', {
        lat: latitude,
        lng: longitude
      });
      return null;
    }

    // Parse bounding box if available (Mapbox format: [west, south, east, north])
    let boundingBox: [number, number, number, number] | undefined;
    if (result.bbox && result.bbox.length === 4) {
      boundingBox = [
        result.bbox[1], // south
        result.bbox[3], // north
        result.bbox[0], // west
        result.bbox[2]  // east
      ];
    }

    const geocodingResult: GeocodingResult = {
      latitude,
      longitude,
      displayName: result.place_name,
      boundingBox
    };

    console.log('✅ Geocoding successful:', {
      originalAddress: trimmedAddress,
      geocodedCoordinates: [latitude, longitude],
      displayName: result.place_name,
      accuracy: result.properties?.accuracy,
      hasBoundingBox: !!boundingBox
    });

    return geocodingResult;

  } catch (error) {
    console.error('❌ Geocoding error:', {
      address: trimmedAddress,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // If it's a network error, try fallback
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('⚠️ Network connectivity issue, using fallback geocoding for:', trimmedAddress);
      return getFallbackGeocodingResult(trimmedAddress);
    }
    
    return null;
  }
}

/**
 * Fallback geocoding function for development/testing when network access is limited
 * Provides approximate coordinates for common Texas cities and addresses
 */
function getFallbackGeocodingResult(address: string): GeocodingResult | null {
  const addressLower = address.toLowerCase();
  
  // Common Texas cities with approximate coordinates
  const fallbackCoordinates: Record<string, { lat: number; lng: number; name: string }> = {
    'austin': { lat: 30.2672, lng: -97.7431, name: 'Austin, TX' },
    'houston': { lat: 29.7604, lng: -95.3698, name: 'Houston, TX' },
    'dallas': { lat: 32.7767, lng: -96.7970, name: 'Dallas, TX' },
    'san antonio': { lat: 29.4241, lng: -98.4936, name: 'San Antonio, TX' },
    'fort worth': { lat: 32.7555, lng: -97.3308, name: 'Fort Worth, TX' },
    'waco': { lat: 31.5494, lng: -97.1467, name: 'Waco, TX' },
    'conroe': { lat: 30.3119, lng: -95.4560, name: 'Conroe, TX' },
    'crosby': { lat: 29.9077, lng: -95.0610, name: 'Crosby, TX' },
    'burleson': { lat: 32.5421, lng: -97.3208, name: 'Burleson, TX' }
  };
  
  // Try to match city name in address
  for (const [city, coords] of Object.entries(fallbackCoordinates)) {
    if (addressLower.includes(city)) {
      console.log(`🎯 Using fallback coordinates for ${city}:`, coords);
      return {
        latitude: coords.lat,
        longitude: coords.lng,
        displayName: `${address} (fallback: ${coords.name})`
      };
    }
  }
  
  // Default fallback to Austin, TX area if no city match
  console.log('🎯 Using default fallback coordinates (Austin, TX area)');
  return {
    latitude: 30.2672,
    longitude: -97.7431,
    displayName: `${address} (fallback: Austin, TX area)`
  };
}

/**
 * Batch geocode multiple addresses with optimized rate limiting for Mapbox
 * @param addresses - Array of address strings to geocode
 * @param delayMs - Delay between requests in milliseconds (default: 100ms for Mapbox)
 * @param countryCode - Optional country code to limit search (default: 'us')
 * @returns Promise resolving to array of geocoding results (null for failed geocoding)
 */
export async function batchGeocodeAddresses(
  addresses: string[],
  delayMs: number = 100, // Much shorter delay for Mapbox
  countryCode: string = 'us'
): Promise<(GeocodingResult | null)[]> {
  console.log('🗺️ Starting batch geocoding with Mapbox:', {
    totalAddresses: addresses.length,
    delayBetweenRequests: `${delayMs}ms`,
    countryCode,
    estimatedTime: `${Math.round((addresses.length * delayMs) / 1000)}s`,
    service: 'Mapbox Geocoding API'
  });

  const results: (GeocodingResult | null)[] = [];

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    console.log(`🔄 Geocoding ${i + 1}/${addresses.length}: ${address}`);

    try {
      const result = await geocodeAddress(address, countryCode);
      results.push(result);

      if (result) {
        console.log(`✅ Geocoded ${i + 1}/${addresses.length}: ${address} -> [${result.latitude}, ${result.longitude}]`);
      } else {
        console.warn(`❌ Failed to geocode ${i + 1}/${addresses.length}: ${address}`);
      }

      // Rate limiting: wait before next request (except for last request)
      if (i < addresses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

    } catch (error) {
      console.error(`❌ Error geocoding ${i + 1}/${addresses.length}: ${address}`, error);
      results.push(null);
    }
  }

  const successCount = results.filter(r => r !== null).length;
  const failureCount = results.length - successCount;

  console.log('🎯 Batch geocoding complete with Mapbox:', {
    totalProcessed: addresses.length,
    successful: successCount,
    failed: failureCount,
    successRate: `${Math.round((successCount / addresses.length) * 100)}%`,
    service: 'Mapbox Geocoding API'
  });

  return results;
}

/**
 * Validate coordinates are within reasonable bounds
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Boolean indicating if coordinates are valid
 */
export function validateCoordinates(latitude: number, longitude: number): boolean {
  // Basic coordinate validation
  const isValidLat = latitude >= -90 && latitude <= 90;
  const isValidLon = longitude >= -180 && longitude <= 180;
  
  // Additional validation for US coordinates (rough bounds)
  const isInUS = latitude >= 24.396308 && latitude <= 49.384358 && 
                longitude >= -125.0 && longitude <= -66.93457;
  
  const isValid = isValidLat && isValidLon && isInUS;
  
  if (!isValid) {
    console.warn('⚠️ Coordinates validation failed:', {
      latitude,
      longitude,
      isValidLat,
      isValidLon,
      isInUS
    });
  }
  
  return isValid;
}

/**
 * Format coordinates for display
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param precision - Number of decimal places (default: 6)
 * @returns Formatted coordinate string
 */
export function formatCoordinates(
  latitude: number, 
  longitude: number, 
  precision: number = 6
): string {
  return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
}

/**
 * Calculate distance between two coordinate points using Haversine formula
 * @param lat1 - First point latitude
 * @param lon1 - First point longitude
 * @param lat2 - Second point latitude
 * @param lon2 - Second point longitude
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
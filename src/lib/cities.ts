export interface City {
  id: string;
  name: string;
  country: string;
  timeZone: string;
  lat: number;
  lon: number;
}

export const CITIES: City[] = [
  { id: "lagos", name: "Lagos", country: "Nigeria", timeZone: "Africa/Lagos", lat: 6.5244, lon: 3.3792 },
  { id: "tehran", name: "Tehran", country: "Iran", timeZone: "Asia/Tehran", lat: 35.6892, lon: 51.389 },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", timeZone: "Asia/Riyadh", lat: 24.7136, lon: 46.6753 },
  { id: "tokyo", name: "Tokyo", country: "Japan", timeZone: "Asia/Tokyo", lat: 35.6762, lon: 139.6503 },
  { id: "dhaka", name: "Dhaka", country: "Bangladesh", timeZone: "Asia/Dhaka", lat: 23.8103, lon: 90.4125 },
  { id: "london", name: "London", country: "United Kingdom", timeZone: "Europe/London", lat: 51.5072, lon: -0.1276 },
  { id: "new-york", name: "New York", country: "United States", timeZone: "America/New_York", lat: 40.7128, lon: -74.006 },
  { id: "san-francisco", name: "San Francisco", country: "United States", timeZone: "America/Los_Angeles", lat: 37.7749, lon: -122.4194 },
  { id: "los-angeles", name: "Los Angeles", country: "United States", timeZone: "America/Los_Angeles", lat: 34.0522, lon: -118.2437 },
  { id: "chicago", name: "Chicago", country: "United States", timeZone: "America/Chicago", lat: 41.8781, lon: -87.6298 },
  { id: "denver", name: "Denver", country: "United States", timeZone: "America/Denver", lat: 39.7392, lon: -104.9903 },
  { id: "honolulu", name: "Honolulu", country: "United States", timeZone: "Pacific/Honolulu", lat: 21.3069, lon: -157.8583 },
  { id: "toronto", name: "Toronto", country: "Canada", timeZone: "America/Toronto", lat: 43.6532, lon: -79.3832 },
  { id: "mexico-city", name: "Mexico City", country: "Mexico", timeZone: "America/Mexico_City", lat: 19.4326, lon: -99.1332 },
  { id: "sao-paulo", name: "Sao Paulo", country: "Brazil", timeZone: "America/Sao_Paulo", lat: -23.5505, lon: -46.6333 },
  { id: "buenos-aires", name: "Buenos Aires", country: "Argentina", timeZone: "America/Argentina/Buenos_Aires", lat: -34.6037, lon: -58.3816 },
  { id: "sydney", name: "Sydney", country: "Australia", timeZone: "Australia/Sydney", lat: -33.8688, lon: 151.2093 },
  { id: "melbourne", name: "Melbourne", country: "Australia", timeZone: "Australia/Melbourne", lat: -37.8136, lon: 144.9631 },
  { id: "auckland", name: "Auckland", country: "New Zealand", timeZone: "Pacific/Auckland", lat: -36.8485, lon: 174.7633 },
  { id: "paris", name: "Paris", country: "France", timeZone: "Europe/Paris", lat: 48.8566, lon: 2.3522 },
  { id: "berlin", name: "Berlin", country: "Germany", timeZone: "Europe/Berlin", lat: 52.52, lon: 13.405 },
  { id: "madrid", name: "Madrid", country: "Spain", timeZone: "Europe/Madrid", lat: 40.4168, lon: -3.7038 },
  { id: "rome", name: "Rome", country: "Italy", timeZone: "Europe/Rome", lat: 41.9028, lon: 12.4964 },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", timeZone: "Europe/Amsterdam", lat: 52.3676, lon: 4.9041 },
  { id: "zurich", name: "Zurich", country: "Switzerland", timeZone: "Europe/Zurich", lat: 47.3769, lon: 8.5417 },
  { id: "stockholm", name: "Stockholm", country: "Sweden", timeZone: "Europe/Stockholm", lat: 59.3293, lon: 18.0686 },
  { id: "moscow", name: "Moscow", country: "Russia", timeZone: "Europe/Moscow", lat: 55.7558, lon: 37.6173 },
  { id: "istanbul", name: "Istanbul", country: "Turkey", timeZone: "Europe/Istanbul", lat: 41.0082, lon: 28.9784 },
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", timeZone: "Asia/Dubai", lat: 25.2048, lon: 55.2708 },
  { id: "cairo", name: "Cairo", country: "Egypt", timeZone: "Africa/Cairo", lat: 30.0444, lon: 31.2357 },
  { id: "nairobi", name: "Nairobi", country: "Kenya", timeZone: "Africa/Nairobi", lat: -1.2921, lon: 36.8219 },
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", timeZone: "Africa/Johannesburg", lat: -26.2041, lon: 28.0473 },
  { id: "mumbai", name: "Mumbai", country: "India", timeZone: "Asia/Kolkata", lat: 19.076, lon: 72.8777 },
  { id: "delhi", name: "Delhi", country: "India", timeZone: "Asia/Kolkata", lat: 28.7041, lon: 77.1025 },
  { id: "karachi", name: "Karachi", country: "Pakistan", timeZone: "Asia/Karachi", lat: 24.8607, lon: 67.0011 },
  { id: "singapore", name: "Singapore", country: "Singapore", timeZone: "Asia/Singapore", lat: 1.3521, lon: 103.8198 },
  { id: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", timeZone: "Asia/Kuala_Lumpur", lat: 3.139, lon: 101.6869 },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", timeZone: "Asia/Jakarta", lat: -6.2088, lon: 106.8456 },
  { id: "bangkok", name: "Bangkok", country: "Thailand", timeZone: "Asia/Bangkok", lat: 13.7563, lon: 100.5018 },
  { id: "manila", name: "Manila", country: "Philippines", timeZone: "Asia/Manila", lat: 14.5995, lon: 120.9842 },
  { id: "hong-kong", name: "Hong Kong", country: "Hong Kong", timeZone: "Asia/Hong_Kong", lat: 22.3193, lon: 114.1694 },
  { id: "shanghai", name: "Shanghai", country: "China", timeZone: "Asia/Shanghai", lat: 31.2304, lon: 121.4737 },
  { id: "beijing", name: "Beijing", country: "China", timeZone: "Asia/Shanghai", lat: 39.9042, lon: 116.4074 },
  { id: "seoul", name: "Seoul", country: "South Korea", timeZone: "Asia/Seoul", lat: 37.5665, lon: 126.978 },
];

export function findCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}

/** Best-effort match of the device's IANA time zone to a known city. */
export function findCityByTimeZone(timeZone: string): City | undefined {
  return CITIES.find((c) => c.timeZone === timeZone);
}

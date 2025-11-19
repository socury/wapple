export const config = {
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || '',
  wifiApiKey: import.meta.env.VITE_WIFI_API_KEY || '',
} as const;

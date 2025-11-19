export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface SearchResult {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

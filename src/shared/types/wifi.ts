export interface WifiPoint {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  provider: string;
  installationType: string;
  installationFloor: string;
  serviceType: string;
  installDate?: string;
}

export interface WifiApiResponse {
  data: WifiPoint[];
  total: number;
}

import React, { useState, useEffect } from 'react';
import { Header } from '../components/header/Header';
import { MapWidget } from '../components/map/MapWidget';
import { SearchLocation } from '../components/search/SearchLocation';
import { WifiList } from '../components/wifi-list/WifiList';
import { wifiApi } from '../libs/wifiApi';
import type { Location } from '../utils/types/location';
import type { WifiPoint } from '../utils/types/wifi';

export const Home: React.FC = () => {
  const [location, setLocation] = useState<Location>({
    latitude: 37.5665,
    longitude: 126.9780,
  });
  const [wifiPoints, setWifiPoints] = useState<WifiPoint[]>([]);
  const [radius, setRadius] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWifiPoints = async (loc: Location) => {
    setIsLoading(true);
    try {
      const points = await wifiApi.getWifiPoints(loc.latitude, loc.longitude, radius);
      setWifiPoints(points);
    } catch (error) {
      console.error('Failed to fetch wifi points:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWifiPoints(location);
  }, [location, radius]);

  const handleLocationSelect = (newLocation: Location) => {
    setLocation(newLocation);
  };

  const handleWifiSelect = (wifi: WifiPoint) => {
    setLocation({
      latitude: wifi.latitude,
      longitude: wifi.longitude,
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto p-4">
          <div className="space-y-6">
            <SearchLocation onLocationSelect={handleLocationSelect} />
            
            <div className="border-t border-gray-200 pt-4">
              <label className="block mb-2 font-semibold">
                반경 설정 (Radius)
              </label>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={500}>500m</option>
                <option value={1000}>1km</option>
                <option value={2000}>2km</option>
                <option value={5000}>5km</option>
              </select>
            </div>

            <WifiList 
              wifiPoints={wifiPoints} 
              onWifiSelect={handleWifiSelect}
              loading={isLoading}
            />
          </div>
        </div>

        {/* Map */}
        <div className="flex-1">
          <MapWidget
            location={location}
            wifiPoints={wifiPoints}
            radius={radius}
            onRefreshLocation={handleLocationSelect}
          />
        </div>
      </div>
    </div>
  );
};

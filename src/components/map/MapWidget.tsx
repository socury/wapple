import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslation } from 'react-i18next';
import type { WifiPoint } from '../../utils/types/wifi';
import { config } from '../../libs/env';

mapboxgl.accessToken = config.mapboxToken;

interface MapWidgetProps {
  location: {
    latitude: number;
    longitude: number;
  };
  wifiPoints: WifiPoint[];
  radius: number;
  onRefreshLocation?: (location: { latitude: number; longitude: number }) => void;
}

export const MapWidget: React.FC<MapWidgetProps> = ({ location, wifiPoints, radius, onRefreshLocation }) => {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedWifi, setSelectedWifi] = useState<WifiPoint | null>(null);

  const handleRefreshCurrentView = () => {
    if (map.current && onRefreshLocation) {
      const center = map.current.getCenter();
      onRefreshLocation({
        latitude: center.lat,
        longitude: center.lng,
      });
    }
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [location.longitude, location.latitude],
      zoom: 13
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    map.current.addControl(geolocate, 'top-right');
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.flyTo({ 
        center: [location.longitude, location.latitude], 
        zoom: 14 
      });
    }
  }, [location]);

  useEffect(() => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    wifiPoints.forEach(wifi => {
      const el = document.createElement('div');
      el.className = 'w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-blue-600';
      el.onclick = () => setSelectedWifi(wifi);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([wifi.longitude, wifi.latitude])
        .addTo(map.current!);
      
      markers.current.push(marker);
    });
  }, [wifiPoints]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />

      {/* Refresh button */}
      <button
        onClick={handleRefreshCurrentView}
        className="absolute bottom-24 right-4 bg-white hover:bg-blue-50 text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-lg z-10 flex items-center gap-2 transition-colors duration-200 border border-gray-200"
        title={t('refreshCurrentView')}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        <span className="hidden sm:inline">{t('refreshCurrentView')}</span>
      </button>

      {selectedWifi && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-xl z-20 max-w-md w-full mx-4">
          <button 
            onClick={() => setSelectedWifi(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
          <h3 className="text-lg font-bold mb-3 pr-6">{selectedWifi.name}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <span className="font-semibold min-w-[100px]">{t('address')}:</span>
              <span className="text-gray-700 flex-1">{selectedWifi.address}</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold min-w-[100px]">{t('provider')}:</span>
              <span className="text-gray-700 flex-1">{selectedWifi.provider}</span>
            </div>
            {selectedWifi.installationType && (
              <div className="flex items-start">
                <span className="font-semibold min-w-[100px]">{t('installationType')}:</span>
                <span className="text-gray-700 flex-1">{selectedWifi.installationType}</span>
              </div>
            )}
            {selectedWifi.installationFloor && (
              <div className="flex items-start">
                <span className="font-semibold min-w-[100px]">{t('installationFloor')}:</span>
                <span className="text-gray-700 flex-1">{selectedWifi.installationFloor}</span>
              </div>
            )}
            {selectedWifi.serviceType && (
              <div className="flex items-start">
                <span className="font-semibold min-w-[100px]">{t('serviceType')}:</span>
                <span className="text-gray-700 flex-1">{selectedWifi.serviceType}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

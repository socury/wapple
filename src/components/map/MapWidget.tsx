import React, { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import type { WifiPoint } from '../../utils/types/wifi';
import type { SavedWifiEntry } from '../../utils/types/savedWifi';
import { config } from '../../libs/env';

mapboxgl.accessToken = config.mapboxToken;

const ROUTE_SOURCE_ID = 'location-to-wifi-route';
const ROUTE_LAYER_ID = 'location-to-wifi-route-line';

const createLocationMarkerElement = () => {
  const el = document.createElement('div');
  el.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 24 24" style="fill:#2563eb;filter:drop-shadow(0 6px 10px rgba(0,0,0,0.35));">
      <path d="M12 2l4.5 13.5L12 13l-4.5 2.5L12 2z" />
    </svg>
  `;
  return el;
};

const createWifiMarkerElement = (isSaved: boolean) => {
  const el = document.createElement('div');
  el.className = `w-6 h-6 rounded-full border-2 shadow-lg cursor-pointer transition-colors ${
    isSaved
      ? 'bg-yellow-400 border-yellow-200 hover:bg-yellow-500'
      : 'bg-blue-500 border-white hover:bg-blue-600'
  }`;
  return el;
};


interface MapWidgetProps {
  location: {
    latitude: number;
    longitude: number;
  };
  wifiPoints: WifiPoint[];
  radius: number;
  onRefreshLocation?: (location: { latitude: number; longitude: number }) => void;
  selectedWifi?: WifiPoint | null;
  onWifiSelect?: (wifi: WifiPoint | null) => void;
  savedWifiEntries?: SavedWifiEntry[];
}

export const MapWidget: React.FC<MapWidgetProps> = ({
  location,
  wifiPoints,
  radius,
  onRefreshLocation,
  selectedWifi,
  onWifiSelect,
  savedWifiEntries,
}) => {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const savedMarkers = useRef<mapboxgl.Marker[]>([]);
  const locationMarker = useRef<mapboxgl.Marker | null>(null);
  const [internalSelectedWifi, setInternalSelectedWifi] = useState<WifiPoint | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [routeFeature, setRouteFeature] = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null);
  const savedWifiIds = useMemo(() => new Set(savedWifiEntries?.map((entry) => entry.id) ?? []), [savedWifiEntries]);

  const activeSelectedWifi = selectedWifi ?? internalSelectedWifi;

  const handleWifiSelection = (wifi: WifiPoint | null) => {
    if (onWifiSelect) {
      onWifiSelect(wifi);
    } else {
      setInternalSelectedWifi(wifi);
    }
  };

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

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [location.longitude, location.latitude],
      zoom: 13,
      language:"ko"
    });

    map.current = mapInstance;

    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    mapInstance.addControl(geolocate, 'top-right');

    mapInstance.on('load', () => {
      setIsMapReady(true);
    });
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
    if (!map.current || !isMapReady) return;

    if (!locationMarker.current) {
      locationMarker.current = new mapboxgl.Marker(createLocationMarkerElement(), { anchor: 'bottom' })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current);
      return;
    }

    locationMarker.current.setLngLat([location.longitude, location.latitude]);
  }, [location, isMapReady]);

  useEffect(() => {
    return () => {
      locationMarker.current?.remove();
      locationMarker.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      savedMarkers.current.forEach((marker) => marker.remove());
      savedMarkers.current = [];
    };
  }, []);

  useEffect(() => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    wifiPoints.forEach(wifi => {
      const el = createWifiMarkerElement(savedWifiIds.has(wifi.id));
      el.onclick = () => handleWifiSelection(wifi);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([wifi.longitude, wifi.latitude])
        .addTo(map.current!);
      
      markers.current.push(marker);
    });
  }, [wifiPoints, savedWifiIds]);

  useEffect(() => {
    if (!map.current) return;

    savedMarkers.current.forEach(marker => marker.remove());
    savedMarkers.current = [];

    if (!savedWifiEntries?.length) return;

    const existingWifiIds = new Set(wifiPoints.map((wifi) => wifi.id));

    savedWifiEntries.forEach((entry) => {
      if (existingWifiIds.has(entry.id)) {
        return;
      }

      const el = createWifiMarkerElement(true);
      el.onclick = () => handleWifiSelection(entry.wifi);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([entry.wifi.longitude, entry.wifi.latitude])
        .addTo(map.current!);

      savedMarkers.current.push(marker);
    });
  }, [savedWifiEntries, wifiPoints]);

  useEffect(() => {
    if (!activeSelectedWifi) {
      setRouteFeature(null);
      return;
    }

    let isCancelled = false;

    const fetchRoute = async () => {
      try {
        const coordinates = [
          [location.longitude, location.latitude],
          [activeSelectedWifi.longitude, activeSelectedWifi.latitude],
        ];
        const coordString = coordinates.map(([lng, lat]) => `${lng},${lat}`).join(';');
        const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordString}`;
        const res = await axios.get(url, {
          params: {
            alternatives: true,
            geometries: 'geojson',
            overview: 'full',
            steps: true,
            language: 'ko',
            access_token: mapboxgl.accessToken,
          },
        });

        if (isCancelled) return;

        const geo = res.data?.routes?.[0]?.geometry as GeoJSON.LineString | undefined;
        if (geo) {
          setRouteFeature({
            type: 'Feature',
            geometry: geo,
            properties: {},
          });
          return;
        }

        setRouteFeature({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
          properties: {},
        });
      } catch (error) {
        console.error('Failed to fetch walking route', error);
        if (isCancelled) return;
        setRouteFeature({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [location.longitude, location.latitude],
              [activeSelectedWifi.longitude, activeSelectedWifi.latitude],
            ],
          },
          properties: {},
        });
      }
    };

    fetchRoute();

    return () => {
      isCancelled = true;
    };
  }, [activeSelectedWifi, location.latitude, location.longitude]);

  useEffect(() => {
    if (!map.current || !isMapReady) return;

    const mapInstance = map.current;

    if (!routeFeature) {
      if (mapInstance.getLayer(ROUTE_LAYER_ID)) {
        mapInstance.removeLayer(ROUTE_LAYER_ID);
      }
      if (mapInstance.getSource(ROUTE_SOURCE_ID)) {
        mapInstance.removeSource(ROUTE_SOURCE_ID);
      }
      return;
    }

    const existingSource = mapInstance.getSource(ROUTE_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;

    if (existingSource) {
      existingSource.setData(routeFeature);
    } else {
      mapInstance.addSource(ROUTE_SOURCE_ID, {
        type: 'geojson',
        data: routeFeature,
      });

      mapInstance.addLayer({
        id: ROUTE_LAYER_ID,
        type: 'line',
        source: ROUTE_SOURCE_ID,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#2563eb',
          'line-width': 4,
          'line-opacity': 0.7,
        },
      });
    }
  }, [routeFeature, isMapReady]);

  useEffect(() => {
    return () => {
      if (!map.current) return;
      if (map.current.getLayer(ROUTE_LAYER_ID)) {
        map.current.removeLayer(ROUTE_LAYER_ID);
      }
      if (map.current.getSource(ROUTE_SOURCE_ID)) {
        map.current.removeSource(ROUTE_SOURCE_ID);
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !activeSelectedWifi) return;

    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([location.longitude, location.latitude]);
    bounds.extend([activeSelectedWifi.longitude, activeSelectedWifi.latitude]);

    map.current.fitBounds(bounds, { padding: 80, duration: 800 });
  }, [activeSelectedWifi, location]);

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
    </div>
  );
};

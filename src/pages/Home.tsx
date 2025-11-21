import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/header/Header';
import { MapWidget } from '../components/map/MapWidget';
import { SearchLocation } from '../components/search/SearchLocation';
import { WifiList } from '../components/wifi-list/WifiList';
import { SelectedWifiPanel } from '../components/wifi-list/SelectedWifiPanel';
import { wifiApi } from '../libs/wifiApi';
import type { Location } from '../utils/types/location';
import type { WifiPoint } from '../utils/types/wifi';
import { useSavedWifi } from '../hooks/useSavedWifi';
import { useAuth } from '../hooks/useAuth';
import { useWifiComments } from '../hooks/useWifiComments';
import { calculateDistanceKm, formatDistance } from '../utils/distance';

const RADIUS_OPTIONS = [500, 1000, 2000, 5000];
const formatRadius = (value: number) => (value >= 1000 ? `${value / 1000}km` : `${value}m`);

export const Home: React.FC = () => {
  const [location, setLocation] = useState<Location>({
    latitude: 37.5665,
    longitude: 126.9780,
  });
  const [wifiPoints, setWifiPoints] = useState<WifiPoint[]>([]);
  const [radius, setRadius] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWifi, setSelectedWifi] = useState<WifiPoint | null>(null);
  const { savedWifi, saveWifi, removeWifi } = useSavedWifi();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { commentsByWifi, addComment } = useWifiComments();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const selectedWifiId = selectedWifi?.id;
  const selectedWifiComments = useMemo(
    () => (selectedWifiId ? commentsByWifi[selectedWifiId] ?? [] : []),
    [commentsByWifi, selectedWifiId]
  );

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

  useEffect(() => {
    const state = routerLocation.state as { savedWifiId?: string } | null;
    const savedWifiId = state?.savedWifiId;
    if (!savedWifiId) return;

    const entry = savedWifi.find((item) => item.id === savedWifiId);
    if (entry) {
      setLocation(entry.origin);
      setSelectedWifi(entry.wifi);
    }

    navigate(routerLocation.pathname, { replace: true, state: null });
  }, [routerLocation, savedWifi, navigate]);

  const handleLocationSelect = (newLocation: Location, options?: { preserveSelection?: boolean }) => {
    if (!options?.preserveSelection) {
      setSelectedWifi(null);
    }
    setLocation(newLocation);
  };

  const handleWifiSelect = (wifi: WifiPoint) => {
    setSelectedWifi(wifi);
  };

  const handleSaveWifi = () => {
    if (!selectedWifi) return;
    saveWifi(selectedWifi, location);
    if (typeof window !== 'undefined') {
      window.alert('와이파이 정보가 저장되었습니다.');
    }
  };

  const handleRemoveWifi = () => {
    if (!selectedWifi) return;
    removeWifi(selectedWifi.id);
    if (typeof window !== 'undefined') {
      window.alert('와이파이 저장이 취소되었습니다.');
    }
  };

  const handleRadiusChange = (value: number) => {
    setSelectedWifi(null);
    setRadius(value);
  };

  const handleAddComment = (content: string, parentId?: string) => {
    if (!selectedWifi) return;
    const trimmed = content.trim();
    if (!trimmed) return;
    addComment(selectedWifi.id, trimmed, parentId);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="relative w-96 bg-white border-r border-gray-200 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 pb-28 space-y-6">
            {selectedWifi ? (
              <SelectedWifiPanel
                wifi={selectedWifi}
                distanceLabel={formatDistance(calculateDistanceKm(location, selectedWifi))}
                onSaveWifi={handleSaveWifi}
                onRemoveWifi={handleRemoveWifi}
                onClearSelection={() => setSelectedWifi(null)}
                isSaved={savedWifi.some((entry) => entry.id === selectedWifi.id)}
                showBackButton
                onBack={() => setSelectedWifi(null)}
                comments={selectedWifiComments}
                onAddComment={handleAddComment}
              />
            ) : (
              <>
                <SearchLocation onLocationSelect={handleLocationSelect} />
                
                <div className="border-t border-gray-200 pt-4">
                  <label className="block mb-2 font-semibold">
                      {t('home.radiusTitle')}
                    </label>
                  <div className="grid grid-cols-2 gap-2">
                    {RADIUS_OPTIONS.map((value) => {
                      const isActive = radius === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleRadiusChange(value)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            isActive
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 hover:border-blue-300 hover:text-blue-500'
                          }`}
                        >
                          {formatRadius(value)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <WifiList 
                  wifiPoints={wifiPoints} 
                  onWifiSelect={handleWifiSelect}
                  selectedWifiId={selectedWifiId}
                  originLocation={location}
                  loading={isLoading}
                />
              </>
            )}
          </div>
          {!selectedWifi && user && (
            <div className="absolute bottom-5 left-0 right-0 px-4">
              <button
                type="button"
                onClick={() => navigate('/saved')}
                className="w-full px-4 py-3 border  rounded-lg text-white font-semibold bg-blue-500  hover:bg-blue-600 hover: transition-colors"
              >
                {t('home.gotoSavedPage')}
              </button>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1">
          <MapWidget
            location={location}
            wifiPoints={wifiPoints}
            radius={radius}
            onRefreshLocation={handleLocationSelect}
            selectedWifi={selectedWifi}
            onWifiSelect={setSelectedWifi}
            savedWifiEntries={savedWifi}
          />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentLocation } from '../../hooks/geolocation';
import type { Location } from '../../utils/types/location';

interface SearchLocationProps {
  onLocationSelect: (location: Location) => void;
}

export const SearchLocation: React.FC<SearchLocationProps> = ({ onLocationSelect }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCurrentLocation = async () => {
    setIsLoading(true);
    try {
      console.log('🎯 User clicked current location button');
      const location = await getCurrentLocation();
      console.log('📍 Location received:', location);
      onLocationSelect(location);
    } catch (error) {
      console.error('❌ Failed to get current location:', error);
      const errorMessage = error instanceof Error ? error.message : t('error');
      
      // Show user-friendly message
      if (confirm(`${errorMessage}\n\n${t('useDefaultLocation')}`)) {
        // Use Seoul as default
        onLocationSelect({
          latitude: 37.5665,
          longitude: 126.9780,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Mock search - in production, use geocoding API
    // For demo, use Seoul coordinates
    const mockLocation: Location = {
      latitude: 37.5665,
      longitude: 126.9780,
      address: searchQuery,
    };
    
    onLocationSelect(mockLocation);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('search')}
        </button>
      </div>
      <button
        onClick={handleCurrentLocation}
        disabled={isLoading}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        📍 {isLoading ? t('loading') : t('currentLocation')}
      </button>
    </div>
  );
};

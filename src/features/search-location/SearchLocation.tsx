import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button } from '../../shared/ui';
import { getCurrentLocation } from '../../shared/lib/geolocation';
import type { Location } from '../../shared/types/location';

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
        <Input
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('searchPlaceholder')}
          className="flex-1"
        />
        <Button onClick={handleSearch} variant="primary">
          {t('search')}
        </Button>
      </div>
      <Button
        onClick={handleCurrentLocation}
        variant="outline"
        disabled={isLoading}
        className="w-full"
      >
        📍 {isLoading ? t('loading') : t('currentLocation')}
      </Button>
    </div>
  );
};

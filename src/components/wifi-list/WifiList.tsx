import React from 'react';
import { useTranslation } from 'react-i18next';
import type { WifiPoint } from '../../utils/types/wifi';
import type { Location } from '../../utils/types/location';
import { calculateDistanceKm, formatDistance } from '../../utils/distance';

interface WifiListProps {
  wifiPoints: WifiPoint[];
  onWifiSelect: (wifi: WifiPoint) => void;
  loading?: boolean;
  selectedWifiId?: string;
  originLocation?: Location;
}

export const WifiList: React.FC<WifiListProps> = ({
  wifiPoints,
  onWifiSelect,
  loading,
  selectedWifiId,
  originLocation,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span>{t('loading')}</span>
        </div>
      </div>
    );
  }

  if (wifiPoints.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        {t('noResults')}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg mb-3">
        {t('wifiPoints')} ({wifiPoints.length})
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {wifiPoints.map((wifi) => {
          const distanceLabel = originLocation
            ? formatDistance(calculateDistanceKm(originLocation, wifi))
            : null;

          return (
            <div
              key={wifi.id}
              onClick={() => onWifiSelect(wifi)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedWifiId === wifi.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-semibold text-blue-600">{wifi.name}</h4>
                {distanceLabel && (
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {distanceLabel}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{wifi.address}</p>
              <div className="flex gap-2 text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">{wifi.provider}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{wifi.installationType}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

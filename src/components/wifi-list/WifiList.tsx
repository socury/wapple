import React from 'react';
import { useTranslation } from 'react-i18next';
import type { WifiPoint } from '../../utils/types/wifi';

interface WifiListProps {
  wifiPoints: WifiPoint[];
  onWifiSelect: (wifi: WifiPoint) => void;
  loading?: boolean;
}

export const WifiList: React.FC<WifiListProps> = ({ wifiPoints, onWifiSelect, loading }) => {
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
        {wifiPoints.map((wifi) => (
          <div
            key={wifi.id}
            onClick={() => onWifiSelect(wifi)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200"
          >
            <h4 className="font-semibold text-blue-600 mb-1">{wifi.name}</h4>
            <p className="text-sm text-gray-600 mb-1">{wifi.address}</p>
            <div className="flex gap-2 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">{wifi.provider}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{wifi.installationType}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

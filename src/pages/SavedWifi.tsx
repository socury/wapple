import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/header/Header';
import { useSavedWifi } from '../hooks/useSavedWifi';
import { useWifiComments } from '../hooks/useWifiComments';
import type { SavedWifiEntry } from '../utils/types/savedWifi';

export const SavedWifi: React.FC = () => {
  const navigate = useNavigate();
  const { savedWifi, removeWifi, clearAll } = useSavedWifi();
  const { commentCount } = useWifiComments();
  const { t } = useTranslation();

  const handleNavigateToMap = (entry: SavedWifiEntry) => {
    navigate('/', { state: { savedWifiId: entry.id } });
  };

  const renderEntry = (entry: SavedWifiEntry) => {
    const comments = commentCount[entry.id] ?? 0;

    return (
      <div
      key={entry.id}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm cursor-pointer hover:border-blue-400"
      onClick={() => handleNavigateToMap(entry)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleNavigateToMap(entry);
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-blue-600">{entry.wifi.name}</h2>
          <p className="text-sm text-gray-600 mt-1">{entry.wifi.address}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {entry.savedAt && (
            <span className="text-xs text-gray-500">{new Date(entry.savedAt).toLocaleString()}</span>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              removeWifi(entry.id);
            }}
            className="text-xs text-red-500 hover:text-red-600"
          >
            {t('actions.delete')}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-3">
        <span className="bg-gray-100 px-2 py-1 rounded">{entry.wifi.provider}</span>
        <span className="bg-gray-100 px-2 py-1 rounded">{entry.wifi.installationType}</span>
        {entry.wifi.serviceType && (
          <span className="bg-gray-100 px-2 py-1 rounded">{entry.wifi.serviceType}</span>
        )}
        <span className="px-2 py-1 rounded bg-blue-50 text-blue-600">
          {t('savedDetail.commentsCount', { count: comments })}
        </span>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        {t('savedDetail.locationPrefix')} lat {entry.origin.latitude.toFixed(4)}, lng {entry.origin.longitude.toFixed(4)}
      </div>
      <div className="mt-2 text-right text-xs text-blue-500">
        {t('savedDetail.clickInfo')}
      </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{t('saved.title')}</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
                {t('saved.backToHome')}
            </button>
          </div>

          {savedWifi.length ? (
            <>
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  {t('actions.clearAll')}
                </button>
              </div>
              <div className="space-y-4">
                {savedWifi.map(renderEntry)}
              </div>
            </>
          ) : (
            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
              {t('saved.noSaved')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

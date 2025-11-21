import React, { useState } from 'react';
import type { SavedWifiEntry } from '../../utils/types/savedWifi';

interface SavedWifiListProps {
  savedWifi: SavedWifiEntry[];
  onSelect: (entry: SavedWifiEntry) => void;
  onRemove: (id: string) => void;
  onClear?: () => void;
}

export const SavedWifiList: React.FC<SavedWifiListProps> = ({ savedWifi, onSelect, onRemove, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="border-t border-gray-200 pt-4">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-700"
      >
        <span>[ 저장된 와이파이 ]</span>
        <span className="text-xs text-gray-500">{isOpen ? '접기' : '펼치기'}</span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {savedWifi.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-4">저장된 와이파이가 없습니다.</p>
          )}

          {savedWifi.map((entry) => (
            <div
              key={entry.id}
              className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelect(entry)}
                  className="text-left flex-1"
                >
                  <p className="font-semibold text-blue-600">{entry.wifi.name}</p>
                  {entry.comment && (
                    <p className="text-sm text-gray-600 mt-1">"{entry.comment}"</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(entry.savedAt).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}

          {savedWifi.length > 0 && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              전체 삭제
            </button>
          )}
        </div>
      )}
    </div>
  );
};

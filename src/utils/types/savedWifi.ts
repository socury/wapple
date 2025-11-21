import type { WifiPoint } from './wifi';
import type { Location } from './location';

export interface SavedWifiEntry {
  id: string;
  wifi: WifiPoint;
  origin: Location;
  comment?: string;
  savedAt: string;
}

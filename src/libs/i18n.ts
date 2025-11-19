import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const locales = {
  ko: 'ko',
  en: 'en',
  ja: 'ja',
} as const;

export type Locale = typeof locales[keyof typeof locales];

const resources = {
  ko: {
    translation: {
      title: '공공 와이파이 지도',
      search: '위치 검색',
      searchPlaceholder: '주소 또는 장소명을 입력하세요',
      currentLocation: '현재 위치',
      radius: '반경',
      meters: 'm',
      wifiPoints: '와이파이 지점',
      noResults: '검색 결과가 없습니다',
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      name: '이름',
      address: '주소',
      provider: '제공자',
      installationType: '설치 유형',
      installationFloor: '설치 층',
      serviceType: '서비스 유형',
      close: '닫기',
      useDefaultLocation: '기본 위치(서울)를 사용하시겠습니까?',
      refreshCurrentView: '현재 화면에서 검색',
    },
  },
  en: {
    translation: {
      title: 'Public WiFi Map',
      search: 'Search Location',
      searchPlaceholder: 'Enter address or place name',
      currentLocation: 'Current Location',
      radius: 'Radius',
      meters: 'm',
      wifiPoints: 'WiFi Points',
      noResults: 'No results found',
      loading: 'Loading...',
      error: 'An error occurred',
      name: 'Name',
      address: 'Address',
      provider: 'Provider',
      installationType: 'Installation Type',
      installationFloor: 'Installation Floor',
      serviceType: 'Service Type',
      close: 'Close',
      useDefaultLocation: 'Use default location (Seoul)?',
      refreshCurrentView: 'Search Here',
    },
  },
  ja: {
    translation: {
      title: '公共WiFiマップ',
      search: '位置検索',
      searchPlaceholder: '住所または場所名を入力してください',
      currentLocation: '現在地',
      radius: '半径',
      meters: 'm',
      wifiPoints: 'WiFiポイント',
      noResults: '検索結果がありません',
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      name: '名前',
      address: '住所',
      provider: 'プロバイダー',
      installationType: '設置タイプ',
      installationFloor: '設置階',
      serviceType: 'サービスタイプ',
      close: '閉じる',
      useDefaultLocation: 'デフォルトの場所（ソウル）を使用しますか？',
      refreshCurrentView: 'ここで検索',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ko',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

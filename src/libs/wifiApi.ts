import axios from 'axios';
import { config } from './env';
import type { WifiPoint } from '../utils/types/wifi';

// 공공와이파이 OpenAPI 엔드포인트
// 개발 환경: /api/wapple -> vite proxy -> https://www.wififree.kr/getApList.do
// 프로덕션: 백엔드 프록시 필요 또는 서버리스 함수 사용
const BASE_URL = import.meta.env.DEV ? '/api/wapple' : 'https://www.wififree.kr';
const API_ENDPOINT = '/getApList.do';

interface WifiApiItem {
  RN: string;           // 순번
  AP_NAME: string;      // AP명
  LAT: number;          // 위도
  LON: number;          // 경도
  ADDR_STATE: string;   // 시도
  ADDR_CITY: string;    // 시군구
  ADDR_DETAIL: string;  // 상세주소
}

interface WifiApiResponse {
  apList: {
    result: string;           // 성공 여부 (__OK__)
    description: string;      // 설명
    data: {
      resultcnt: {
        cnt: number;          // 전체 개수
      };
    };
    list: WifiApiItem[];      // WiFi 데이터 배열
  };
}

// 거리 계산 함수 (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // 지구 반경 (미터)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const fetchNearbyWifi = async (lat: number, lng: number, radius: number): Promise<WifiPoint[]> => {
    try {
      // API 키가 설정되지 않은 경우 빈 배열 반환
      if (!config.wifiApiKey || config.wifiApiKey === 'your_wifi_api_key_here') {
        console.error('❌ WiFi API key is not configured. Please set VITE_WIFI_API_KEY in .env file');
        return [];
      }

      // Form-data 형식으로 파라미터 생성
      const formData = new FormData();
      formData.append('apiAuthKey', config.wifiApiKey);
      formData.append('searchLat', lat.toString());
      formData.append('searchLon', lng.toString());
      formData.append('searchDistance', (radius / 1000).toString()); // 미터를 km로 변환

      const requestUrl = `${BASE_URL}${API_ENDPOINT}`;

      // 요청 정보 로깅
      console.group('📤 WiFi API Request');
      console.log('🔗 Full URL:', requestUrl);
      console.log('🔗 BASE_URL:', BASE_URL);
      console.log('🔗 API_ENDPOINT:', API_ENDPOINT);
      console.log('🔗 DEV mode:', import.meta.env.DEV);
      console.log('📍 Location:', { latitude: lat, longitude: lng, radius: `${radius}m (${(radius/1000).toFixed(2)}km)` });
      console.log('🔑 API Key:', config.wifiApiKey ? `${config.wifiApiKey.substring(0, 10)}...` : 'Not set');
      console.log('📋 Request Method:', 'POST (form-data)');
      console.log('📦 Form Data:', {
        apiAuthKey: config.wifiApiKey ? `${config.wifiApiKey.substring(0, 10)}...` : 'Not set',
        searchLat: lat,
        searchLon: lng,
        searchDistance: (radius / 1000).toFixed(2) + 'km'
      });
      console.log('⏰ Request Time:', new Date().toISOString());
      console.groupEnd();
      
      const requestStartTime = performance.now();
      
      const response = await axios.post<WifiApiResponse>(requestUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 15000,
      });

      const requestEndTime = performance.now();
      const requestDuration = (requestEndTime - requestStartTime).toFixed(2);

      // 응답 정보 로깅
      console.group('📥 WiFi API Response');
      console.log('✅ Status:', response.status, response.statusText);
      console.log('⏱️ Duration:', `${requestDuration}ms`);
      console.log('📊 Headers:', response.headers);
      console.log('📦 Data:', response.data);
      console.groupEnd();

      // API 응답 구조 확인
      if (!response.data?.apList) {
        console.error('❌ No apList in response');
        return [];
      }

      const { apList } = response.data;

      // 응답 결과 확인
      console.group('📊 API Response Details');
      console.log('✅ Result:', apList.result);
      console.log('📝 Description:', apList.description);
      console.log('📈 Total Count:', apList.data.resultcnt.cnt);
      console.log('📍 List Length:', apList.list.length);
      console.groupEnd();

      if (apList.result !== '__OK__') {
        console.error('❌ API Error Result:', apList.result);
        console.error('❌ API Description:', apList.description);
        return [];
      }

      if (!apList.list || !Array.isArray(apList.list)) {
        console.warn('⚠️ No WiFi data available for this location');
        return [];
      }

      // API 응답을 WifiPoint 형식으로 변환
      const wifiPoints = apList.list
        .map((item): WifiPoint | null => {
          const itemLat = item.LAT;
          const itemLng = item.LON;
          
          // 유효한 좌표인지 확인
          if (typeof itemLat !== 'number' || typeof itemLng !== 'number' || 
              isNaN(itemLat) || isNaN(itemLng)) {
            console.warn('⚠️ Invalid coordinates for item:', item);
            return null;
          }

          // 반경 내에 있는지 확인
          const distance = calculateDistance(lat, lng, itemLat, itemLng);
          if (distance > radius) {
            return null;
          }

          return {
            id: `wifi-${item.RN}-${item.AP_NAME}-${itemLat}-${itemLng}`,
            name: item.AP_NAME || '이름 없음',
            address: `${item.ADDR_STATE || ''} ${item.ADDR_CITY || ''} ${item.ADDR_DETAIL || ''}`.trim() || '주소 정보 없음',
            latitude: itemLat,
            longitude: itemLng,
            provider: item.ADDR_STATE || '정보 없음',
            installationType: '공공 WiFi',
            installationFloor: '정보 없음',
            serviceType: '무료 공공 WiFi',
          };
        })
        .filter((item): item is WifiPoint => item !== null);

      console.log(`✅ Found ${wifiPoints.length} WiFi points within ${radius}m radius`);
      return wifiPoints;

    } catch (error) {
      console.group('❌ WiFi API Error');
      console.log('⏰ Error Time:', new Date().toISOString());
      
      if (axios.isAxiosError(error)) {
        console.error('🚨 Axios Error Details:');
        console.error('  📝 Message:', error.message);
        console.error('  🔢 Status:', error.response?.status);
        console.error('  📊 Status Text:', error.response?.statusText);
        console.error('  🔗 Request URL:', error.config?.url);
        console.error('  📋 Request Method:', error.config?.method?.toUpperCase());
        console.error('  📥 Response Data:', error.response?.data);
        console.error('  📊 Response Headers:', error.response?.headers);
        
        if (error.code) {
          console.error('  🏷️ Error Code:', error.code);
        }
        
        if (error.response?.status === 404) {
          console.error('🚫 API endpoint not found - check the URL');
        } else if (error.response?.status === 401 || error.response?.status === 403) {
          console.error('🔒 Authentication error - check your API key');
        } else if (error.response?.status === 500) {
          console.error('💥 Server error - the API server is having issues');
        } else if (error.code === 'ECONNABORTED') {
          console.error('⏱️ Request timeout - the server took too long to respond');
        } else if (error.code === 'ERR_NETWORK') {
          console.error('🌐 Network error - check your internet connection or CORS settings');
        }
      } else if (error instanceof Error) {
        console.error('❌ General Error:', error.message);
        console.error('📚 Stack:', error.stack);
      } else {
        console.error('❌ Unknown Error:', error);
      }
      
      console.groupEnd();
      
      // API 호출 실패 시 빈 배열 반환
      return [];
    }
};



export const wifiApi = {
  getWifiPoints: fetchNearbyWifi
};

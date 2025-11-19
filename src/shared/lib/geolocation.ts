import type { Location } from '../types/location';

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    console.log('🌍 Requesting geolocation permission...');

    // Try with high accuracy first
    const tryHighAccuracy = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('✅ Location obtained (high accuracy):', position.coords);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('⚠️ High accuracy failed:', error.message);
          // Fallback to low accuracy
          tryLowAccuracy();
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 60000 // Cache for 1 minute
        }
      );
    };

    // Fallback with low accuracy
    const tryLowAccuracy = () => {
      console.log('🔄 Trying with low accuracy...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('✅ Location obtained (low accuracy):', position.coords);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('❌ Geolocation error:', error);
          let message = 'Unable to retrieve your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location permission denied. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable. Please check your device settings.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out. Using default location (Seoul).';
              // Provide default location instead of rejecting
              console.warn('⚠️ Using default location');
              resolve({
                latitude: 37.5665,
                longitude: 126.9780,
              });
              return;
          }
          
          reject(new Error(message));
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 120000 // Cache for 2 minutes
        }
      );
    };

    // Start with high accuracy
    tryHighAccuracy();
  });
};

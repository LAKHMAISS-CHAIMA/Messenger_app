// Get the local IP address for the development machine
// For Android emulator, use 10.0.2.2
// For physical device, use your computer's local IP
export const API_URL = __DEV__ 
  ? 'http://10.0.2.2:5000'  // Android emulator
  : 'http://your-production-url.com'; // Production URL

export const SOCKET_URL = API_URL;

// Debug info
console.log('API URL:', API_URL);
console.log('Development mode:', __DEV__); 
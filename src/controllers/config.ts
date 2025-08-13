// API 기본 설정
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_APP_API_HOST,
  TIMEOUT: 10000, // 10초
  RETRY_ATTEMPTS: 3,
};

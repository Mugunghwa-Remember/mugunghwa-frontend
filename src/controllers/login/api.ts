import { API_CONFIG } from "../config";

export const fetchKakaoLogin = async (payload: {
  code: string;
  redirectUri: string;
}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login/kakao`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    clearTimeout(timeoutId);

    return {
      success: true,
      data,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("요청 시간이 초과되었습니다.");
      }
      throw error;
    }

    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

import type { Feature, Point } from "geojson";
import { mockExistingFlowersApi } from "./mock";
import { clusterIndex, supercluster } from "./clustering";
import type { PointFeature } from "supercluster";

// API 기본 설정
const API_CONFIG = {
  // BASE_URL: process.env.REACT_APP_API_BASE_URL || "https://api.mugunghwa.com",
  TIMEOUT: 10000, // 10초
  RETRY_ATTEMPTS: 3,
} as const;

export const fetchExistingFlowers = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    // const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     ...options.headers,
    //   },
    //   signal: controller.signal,
    //   ...options,
    // });

    // if (!response.ok) {
    //   throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    // }

    // const data = await response.json();

    const data = await mockExistingFlowersApi();

    const points: Feature<Point>[] = data.flowers.map((d) => ({
      type: "Feature",
      properties: d, // 필요한 속성
      geometry: { type: "Point", coordinates: [d.longitude, d.latitude] },
    }));

    clusterIndex.body = await supercluster.load(
      points as PointFeature<Record<string, unknown>>[]
    );
    clusterIndex.updatedAt = await new Date();

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

export const fetchExistingFlower = async (flowerId: string) => {
  return flowerId;
};

export const fetchExistingFlowerGroup = async (flowerId: string) => {
  return flowerId;
};

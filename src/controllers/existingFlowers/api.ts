import type { Feature, Point } from "geojson";
import { mockExistingFlowersApi } from "./mock";
import { clusterIndex, supercluster } from "./clustering";
import type { PointFeature } from "supercluster";
import { API_CONFIG } from "../config";
import type { ExistingFlower } from "./types";

export const fetchExistingFlowers = async (): Promise<{
  success: boolean;
  data: ExistingFlower[];
}> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
  const mockEnabled = false;

  try {
    const data = await (mockEnabled
      ? (async () => {
          return await mockExistingFlowersApi();
        })()
      : (async () => {
          const response = await fetch(
            `${API_CONFIG.BASE_URL}/mugunghwa/getAllFlowers`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              signal: controller.signal,
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          return data;
        })());

    const points: Feature<Point>[] = data.map((flower: ExistingFlower) => ({
      type: "Feature",
      properties: flower, // 필요한 속성
      geometry: {
        type: "Point",
        coordinates: [flower.longitude, flower.latitude],
      },
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

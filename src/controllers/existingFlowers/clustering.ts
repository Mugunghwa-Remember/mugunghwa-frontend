/* eslint-disable @typescript-eslint/no-explicit-any */
// 클러스터링 관련 로직
import Supercluster from "supercluster";
import type {
  ClusteredExistingFlowers,
  ClusteredExistingFlowersData,
  ZoomData,
} from "./types";

const MAX_ZOOM = 17;

export const supercluster = new Supercluster({
  radius: 128, // 클러스터 반경(px). 밀도 표현 강도
  maxZoom: 17, // 데이터 클러스터링 최대 줌
  minPoints: 2, // 몇 개부터 클러스터로 묶을지
});

export const clusterIndex: {
  body: Supercluster<any> | null;
  updatedAt: Date | null;
} = { body: null, updatedAt: null };

// 클러스터 타입 결정 함수
function determineClusterType(
  cluster: any,
  zoom: number
): "FLOWER" | "CLUSER" | "LEAF" {
  const pointCount = cluster.properties.point_count;
  if (!pointCount) return "FLOWER";
  if (zoom === MAX_ZOOM) return "LEAF";

  return pointCount <= 10 && zoom >= MAX_ZOOM - 1 ? "LEAF" : "CLUSER";
}

// 클러스터 데이터 변환 함수
function transformClusterToFlower(
  cluster: any,
  type: "FLOWER" | "CLUSER" | "LEAF",
  zoom: number
): ClusteredExistingFlowers | null {
  const baseData = {
    id: "",
    type,
    latitude: cluster.geometry.coordinates[1],
    longitude: cluster.geometry.coordinates[0],
    data: {},
  };
  if (!clusterIndex.body) return null;

  switch (type) {
    case "FLOWER":
      return {
        ...baseData,
        id: `flower_${cluster.properties.id}`,
        data: {
          name: cluster.properties.name,
          message: cluster.properties.message,
          plantedAt: cluster.properties.plantedAt,
        },
      } as ClusteredExistingFlowers;

    case "CLUSER":
      return {
        ...baseData,
        id: `cluster_${cluster.properties.cluster_id}`,
        data: { count: cluster.properties.point_count },
      } as ClusteredExistingFlowers;

    case "LEAF": {
      const leaves =
        zoom !== MAX_ZOOM
          ? clusterIndex.body.getChildren(cluster.properties.cluster_id)
          : clusterIndex.body.getLeaves(cluster.properties.cluster_id, 32);

      const children = leaves.map((child) => {
        const childType = child.properties.point_count ? "CLUSER" : "FLOWER";
        return {
          id:
            childType === "FLOWER"
              ? `flower_${child.properties.id}`
              : `cluster_${child.properties.cluster_id}`,
          type: childType,
          latitude: child.geometry.coordinates[1],
          longitude: child.geometry.coordinates[0],
          data:
            childType === "FLOWER"
              ? {
                  name: child.properties.name,
                  message: child.properties.message,
                  plantedAt: child.properties.plantedAt,
                }
              : { count: child.properties.point_count },
        };
      });

      return {
        ...baseData,
        id: `leaf_${cluster.properties.id}`,
        data: {
          count: cluster.properties.point_count,
          children,
        },
      } as ClusteredExistingFlowers;
    }
  }
}

export async function getExistingFlowersData(
  zoomData: ZoomData
): Promise<ClusteredExistingFlowersData> {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 300));

  const { zoom, minlat, minlng, maxlat, maxlng } = zoomData;

  if (!clusterIndex.body)
    return { flowers: [], totalCount: 0, lastUpdated: "" };

  const flowerClusters = clusterIndex.body.getClusters(
    [minlng, minlat, maxlng, maxlat],
    zoom
  );

  const flowers = flowerClusters.map((cluster) => {
    const type = determineClusterType(cluster, zoom);
    return transformClusterToFlower(cluster, type, zoom);
  });

  return {
    flowers,
    totalCount: flowers.length,
    lastUpdated: new Date().toISOString(),
  };
}

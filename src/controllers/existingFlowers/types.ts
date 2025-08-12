// 타입 정의
export interface ExistingFlower {
  id: string;
  name: string;
  message?: string;
  count: number;
  latitude: number;
  longitude: number;
  plantedAt: string;
  flowerType: "mugunghwa";
}

export interface ExistingFlowersData {
  flowers: ExistingFlower[];
  totalCount: number;
  lastUpdated: string;
}

export type FLOWER_TYPE = "FLOWER" | "CLUSER" | "LEAF";

export interface ClusteredExistingFlowersFlower {
  name: string;
  message: string;
  plantedAt: Date;
}

export interface ClusteredExistingFlowersCluster {
  count: number;
}

export interface ClusteredExistingFlowersLeaf {
  count: number;
  children: {
    id: string;
    type: "FLOWER" | "CLUSER";
    latitude: number;
    longitude: number;
    data: ClusteredExistingFlowersFlower | ClusteredExistingFlowersCluster;
  }[];
}

export interface ClusteredExistingFlowers {
  id: string;
  type: FLOWER_TYPE;
  latitude: number;
  longitude: number;
  data:
    | ClusteredExistingFlowersFlower
    | ClusteredExistingFlowersCluster
    | ClusteredExistingFlowersLeaf;
}

export interface ClusteredExistingFlowersData {
  flowers: (ClusteredExistingFlowers | null)[];
  totalCount: number;
  lastUpdated: string;
}

export interface ZoomData {
  zoom: number;
  minlat: number;
  minlng: number;
  maxlat: number;
  maxlng: number;
}

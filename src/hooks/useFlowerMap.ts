import { useEffect, useRef, useState } from "react";
import {
  KOREA_LAND_BOUNDARY,
  KOREA_MAP_BOUNDARY,
  MAP_DEFAULT_OPTIONS,
} from "../constants/koreaMap";
import {
  clusterSize,
  createMarker,
  getFlowerHTML,
  smoothMoveTo,
} from "../utils/FlowerMap";
import { generateRandomPointInPolygon, isPointInPolygon } from "../utils/Point";
import type {
  ClusteredExistingFlowers,
  ClusteredExistingFlowersCluster,
  ClusteredExistingFlowersFlower,
  ClusteredExistingFlowersLeaf,
  ZoomData,
} from "../controllers/existingFlowers/types";
import { getExistingFlowersData } from "../controllers/existingFlowers/clustering";
import { fetchExistingFlowers } from "../controllers/existingFlowers/api";
import * as styles from "./useFlower.css";
import fetchFlowerProgress from "../controllers/flowerProgress/api";
import { safeTrack } from "../utils/mixpanel";
interface SubFlowerRef {
  parent: naver.maps.Marker;
  childMarkers: naver.maps.Marker[];
  childLines: naver.maps.Polyline[];
}

const useFlowerMap = ({
  mapOptions,
  enableClickEvent = true,
  enableUserMarker = false,
  onRandomLocation,
}: {
  mapOptions?: naver.maps.MapOptions;
  enableClickEvent?: boolean;
  enableUserMarker?: boolean;
  onRandomLocation?: React.RefObject<(() => void) | null>;
}) => {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const userMarkerRef = useRef<naver.maps.Marker | null>(null);
  const existingFlowersRef = useRef<naver.maps.Marker[]>([]);
  const SubFlowerRef = useRef<SubFlowerRef | null>(null);
  const flowerMessageRef = useRef<{
    id: string;
    marker: naver.maps.Marker;
  } | null>(null);
  const targetFlowerCountRef = useRef<number>(0);

  const [userMarkerLocation, setUserMarkerLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [zoomData, setZoomData] = useState<ZoomData | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<{
    message: string;
    timestamp: Date;
  } | null>(null);

  const loadMarkers = async () => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();

    if (bounds) {
      setZoomData({
        zoom: mapRef.current.getZoom() || 7,
        minlat: bounds.getMin().y,
        minlng: bounds.getMin().x,
        maxlat: bounds.getMax().y,
        maxlng: bounds.getMax().x,
      });
    }
  };

  // 에러 처리 함수
  const handleError = (errorMessage: string) => {
    setError({ message: errorMessage, timestamp: new Date() });
    console.error("Map Error:", errorMessage);
    // 지도 관련 에러 발생 시 추적
    safeTrack("map_error", { error_message: errorMessage });
  };

  const clearError = () => {
    setError(null);
  };

  // 마커 관리
  const resetExistingFlowers = () => {
    existingFlowersRef.current.forEach((flower) => flower.setMap(null));
    existingFlowersRef.current = [];
  };

  const resetSubFlower = () => {
    if (!SubFlowerRef.current) return;
    const { parent, childMarkers, childLines } = SubFlowerRef.current;

    [...childMarkers, ...childLines].forEach((item) => item.setMap(null));

    const beforeIcon = parent.getIcon() as naver.maps.HtmlIcon;
    const html = beforeIcon.content as string;

    if (html) {
      parent.setIcon({
        ...beforeIcon,
        content: html.replace('class="cluster opacity-50"', 'class="cluster"'),
      });
    }
    SubFlowerRef.current = null;
  };

  const resetFlowerMessage = () => {
    if (!flowerMessageRef.current) return;
    flowerMessageRef.current.marker.setMap(null);
    flowerMessageRef.current = null;
  };

  // 사용자 마커 추가 함수
  const addUserMarker = (lat: number, lng: number) => {
    if (!isPointInPolygon([lat, lng], KOREA_LAND_BOUNDARY)) {
      handleError("한국 영역 내에서만 심을 수 있어요");
      // 한국 영역 밖에 마커 추가 시도 시 추적
      safeTrack("map_user_marker_out_of_bounds", { lat, lng });
      return;
    }

    if (!mapRef.current) {
      handleError("지도가 초기화되지 않았습니다.");
      return;
    }

    // 기존 사용자 마커가 있으면 제거
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      // 기존 마커 제거 시 추적
      safeTrack("map_user_marker_removed");
    }

    try {
      const marker = createMarker(
        mapRef.current,
        new naver.maps.LatLng(lat, lng),
        `<div class="${styles.markerContainer}">
          <div class="${styles.userMarker} bloom">🌸</div>
        </div>`,
        24,
        1000
      );

      if (enableClickEvent) {
        // 마커 클릭 이벤트 - 마커 제거
        naver.maps.Event.addListener(marker, "click", () => {
          // 사용자 마커 클릭으로 제거 시 추적
          safeTrack("map_user_marker_click_remove");
          marker.setMap(null);
          userMarkerRef.current = null;
          setUserMarkerLocation(null);
        });
      }

      userMarkerRef.current = marker;
      setUserMarkerLocation({ lat, lng });
      smoothMoveTo(mapRef.current, lat, lng);
      clearError(); // 성공 시 에러 클리어

      // 새 마커 추가 성공 시 추적
      safeTrack("map_user_marker_added", { lat, lng });
      return marker;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "마커 생성 중 오류가 발생했습니다.";
      handleError(errorMessage);
      return null;
    }
  };

  const handleClusterClick = (flower: ClusteredExistingFlowers) => {
    if (!mapRef.current) return;

    // 클러스터 클릭 시 추적 (클러스터 타입, 위치 정보)
    safeTrack("map_cluster_click", {
      cluster_type: flower.type,
      latitude: flower.latitude,
      longitude: flower.longitude,
    });

    resetSubFlower();
    resetFlowerMessage();
    resetExistingFlowers();
    const center = new naver.maps.LatLng(flower.latitude, flower.longitude);
    mapRef.current.zoomBy(1, center, true);
  };

  const handleLeafClick = (
    marker: naver.maps.Marker,
    flower: ClusteredExistingFlowers
  ) => {
    // 리프 클릭 시 추적 (리프 타입, 위치 정보)
    safeTrack("map_leaf_click", {
      leaf_type: flower.type,
      latitude: flower.latitude,
      longitude: flower.longitude,
    });

    resetSubFlower();
    resetFlowerMessage();

    const beforeIcon = marker.getIcon() as naver.maps.HtmlIcon;
    const html = beforeIcon.content as string;
    const enabled = !html.includes('class="cluster opacity-50"');

    smoothMoveTo(mapRef.current, flower.latitude, flower.longitude);
    marker.setIcon({
      ...beforeIcon,
      content: enabled
        ? html.replace('class="cluster"', 'class="cluster opacity-50"')
        : html.replace('class="cluster opacity-50"', 'class="cluster"'),
    });

    if (enabled && flower.type === "LEAF") {
      const leafData = flower.data as ClusteredExistingFlowersLeaf;
      SubFlowerRef.current = {
        parent: marker,
        childMarkers: [],
        childLines: [],
      };

      // 자식 마커들과 선들 생성
      const { childMarkers, childLines } = createChildElements(
        leafData.children,
        flower
      );

      SubFlowerRef.current.childMarkers = childMarkers;
      SubFlowerRef.current.childLines = childLines;
    }
  };

  const createChildElements = (
    children: ClusteredExistingFlowers[],
    parent: ClusteredExistingFlowers
  ) => {
    const childMarkers: naver.maps.Marker[] = [];
    const childLines: naver.maps.Polyline[] = [];

    children.forEach((child) => {
      if (!mapRef.current) return;
      // 연결선 생성
      const childLine = new naver.maps.Polyline({
        map: mapRef.current,
        path: [
          new naver.maps.LatLng(parent.latitude, parent.longitude),
          new naver.maps.LatLng(child.latitude, child.longitude),
        ],
        strokeColor: "#000",
        strokeWeight: 2,
        strokeOpacity: 0.5,
      });

      const childMarker = createFlowerMarker(child, true);

      if (childMarker) {
        childMarkers.push(childMarker);
      }
      childLines.push(childLine);
    });

    return { childMarkers, childLines };
  };

  const handleFlowerClick = (
    flower: ClusteredExistingFlowers,
    isSubFlower?: boolean
  ) => {
    const flowerData = flower.data as ClusteredExistingFlowersFlower;

    // 개별 꽃 클릭 시 추적 (꽃 ID, 이름, 위치, 서브플라워 여부, 메시지 존재 여부)
    safeTrack("map_flower_click", {
      flower_id: flower.id,
      flower_name: flowerData.name,
      latitude: flower.latitude,
      longitude: flower.longitude,
      is_sub_flower: isSubFlower,
      has_message: !!flowerData.message.trim(),
    });

    smoothMoveTo(mapRef.current, flower.latitude, flower.longitude);

    if (!mapRef.current) return;

    if (!isSubFlower) {
      resetSubFlower();
    }

    const beforeFlowerId = flowerMessageRef.current?.id;
    resetFlowerMessage();
    if (beforeFlowerId === flower.id) return;

    const flowerMessageMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(flower.latitude, flower.longitude),
      map: mapRef.current,
      icon: {
        content: `
          <div class="${styles.markerContainer} bloom">
            ${
              flowerData.message.trim() &&
              `<div class="${styles.flowerMessage}">
                ${flowerData.message}
              </div>`
            }
            <div class="${styles.flowerName}">
              ${flowerData.name}
            </div>
          </div>
        `,
        size: new naver.maps.Size(0, 0),
        anchor: new naver.maps.Point(0, 0),
      },
      zIndex: 1000,
    });

    flowerMessageRef.current = {
      id: flower.id,
      marker: flowerMessageMarker,
    };
  };

  // 마커 생성 및 이벤트 설정을 위한 헬퍼 함수들
  const createFlowerMarker = (
    flower: ClusteredExistingFlowers,
    isSubFlower?: boolean
  ) => {
    if (!mapRef.current) return;

    const count =
      flower.type === "CLUSER"
        ? (flower.data as ClusteredExistingFlowersCluster).count
        : flower.type === "LEAF"
        ? (flower.data as ClusteredExistingFlowersLeaf).count
        : 1;
    const size = clusterSize(count, targetFlowerCountRef.current);
    const html = getFlowerHTML(count, size);

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(flower.latitude, flower.longitude),
      map: mapRef.current,
      icon: {
        content: html,
        size: new naver.maps.Size(size, size),
        anchor: new naver.maps.Point(0, 0),
      },
    });

    if (enableClickEvent) {
      if (flower.type === "CLUSER") {
        naver.maps.Event.addListener(marker, "click", () =>
          handleClusterClick(flower)
        );
      } else if (flower.type === "LEAF") {
        naver.maps.Event.addListener(marker, "click", () =>
          handleLeafClick(marker, flower)
        );
      } else if (flower.type === "FLOWER") {
        naver.maps.Event.addListener(marker, "click", () =>
          handleFlowerClick(flower, isSubFlower)
        );
      }
    }

    return marker;
  };

  useEffect(() => {
    if (!isMounted) return;

    (async () => {
      targetFlowerCountRef.current = await fetchFlowerProgress().then((res) => {
        return res.data.targetCount;
      });

      await fetchExistingFlowers();
      loadMarkers();
    })();

    const newMap = new naver.maps.Map("map", {
      ...MAP_DEFAULT_OPTIONS,
      ...mapOptions,
    });

    if (enableClickEvent) {
      if (enableUserMarker) {
        naver.maps.Event.addListener(newMap, "click", (e) => {
          resetFlowerMessage();
          addUserMarker(e.coord.lat(), e.coord.lng());
        });
      }

      naver.maps.Event.addListener(newMap, "zoomstart", () => {
        // 지도 줌 시작 시 추적
        safeTrack("map_zoom_start");
        resetFlowerMessage();
        resetSubFlower();
        resetExistingFlowers();
      });

      naver.maps.Event.addListener(newMap, "idle", () => {
        if (!mapRef.current) return;
        loadMarkers();
      });
    }

    mapRef.current = newMap;
  }, [isMounted]);

  useEffect(() => {
    if (!onRandomLocation) return;

    onRandomLocation.current = () => {
      safeTrack("plant_map_random_location_generated");

      const randomLocation = generateRandomPointInPolygon(
        KOREA_LAND_BOUNDARY,
        [KOREA_MAP_BOUNDARY[0][0], KOREA_MAP_BOUNDARY[0][1]],
        [KOREA_MAP_BOUNDARY[1][0], KOREA_MAP_BOUNDARY[1][1]]
      );
      if (randomLocation) {
        addUserMarker(randomLocation[0], randomLocation[1]);
      }
    };
  }, [onRandomLocation]);

  useEffect(() => {
    if (!zoomData) return;

    const map = mapRef.current;
    if (!map) return;

    getExistingFlowersData(zoomData).then((data) => {
      // 꽃 데이터 로드 완료 시 추적 (줌 레벨, 꽃 개수, 경계 정보)
      safeTrack("map_flowers_loaded", {
        zoom_level: zoomData.zoom,
        flower_count: data.flowers.length,
        bounds: {
          minlat: zoomData.minlat,
          minlng: zoomData.minlng,
          maxlat: zoomData.maxlat,
          maxlng: zoomData.maxlng,
        },
      });

      // 기존 마커들을 Map으로 변환하여 빠른 검색 가능
      const existingMarkersMap = new Map<string, naver.maps.Marker>();
      existingFlowersRef.current.forEach((marker) => {
        const pos = marker.getPosition();
        existingMarkersMap.set(`${pos.y},${pos.x}`, marker);
      });

      const newFlowers: naver.maps.Marker[] = [];

      // 각 꽃 타입별로 마커 생성 및 이벤트 설정
      data.flowers.forEach((flower: ClusteredExistingFlowers | null) => {
        if (!flower) return;
        const key = `${flower.latitude},${flower.longitude}`;

        // 기존 마커가 있으면 재사용
        if (existingMarkersMap.has(key)) {
          newFlowers.push(existingMarkersMap.get(key)!);
          existingMarkersMap.delete(key);
          return;
        }

        const marker = createFlowerMarker(flower);
        if (!marker) return;

        newFlowers.push(marker);
      });

      // 사용되지 않는 기존 마커들 제거
      existingMarkersMap.forEach((marker) => marker.setMap(null));
      existingFlowersRef.current = newFlowers;
    });
  }, [zoomData]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    mapRef,
    userMarkerLocation,
    error: error,
  };
};

export default useFlowerMap;

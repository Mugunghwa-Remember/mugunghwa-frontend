import { useEffect, useRef, useState } from "react";
import { useToast } from "../hooks/useToast";
import {
  KOREA_LAND_BOUNDARY,
  KOREA_MAP_BOUNDARY,
  MAP_DEFAULT_OPTIONS,
} from "../constants/koreaMap";
import { fetchExistingFlowers } from "../controllers/existingFlowers/api";
import { getExistingFlowersData } from "../controllers/existingFlowers/clustering";
import type {
  ClusteredExistingFlowers,
  ClusteredExistingFlowersCluster,
  ClusteredExistingFlowersFlower,
  ClusteredExistingFlowersLeaf,
  ZoomData,
} from "../controllers/existingFlowers/types";
import { generateRandomPointInPolygon, isPointInPolygon } from "../utils/Point";
import {
  clusterSize,
  createMarker,
  getFlowerHTML,
  smoothMoveTo,
} from "../utils/FlowerMap";

interface SubFlowerRef {
  parent: naver.maps.Marker;
  childMarkers: naver.maps.Marker[];
  childLines: naver.maps.Polyline[];
}

const PlantMap = ({
  setUserMarkerData,
  onRandomLocation,
}: {
  setUserMarkerData: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    } | null>
  >;
  onRandomLocation: React.MutableRefObject<(() => void) | null>;
}) => {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const userMarkerRef = useRef<naver.maps.Marker | null>(null);
  const existingFlowersRef = useRef<naver.maps.Marker[]>([]);
  const SubFlowerRef = useRef<SubFlowerRef | null>(null);

  const [zoomData, setZoomData] = useState<ZoomData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 토스트 훅 사용
  const { toast, showToast } = useToast(1500);

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

  // 사용자 마커 추가 함수
  const addUserMarker = (lat: number, lng: number) => {
    // 한국 영역 내에 있는지 확인
    if (!isPointInPolygon([lat, lng], KOREA_LAND_BOUNDARY)) {
      showToast("한국 영역 내에서만 무궁화를 심을 수 있습니다.");
      return;
    }

    if (!mapRef.current) return;

    // 기존 사용자 마커가 있으면 제거
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    const marker = createMarker(
      mapRef.current,
      new naver.maps.LatLng(lat, lng),
      `<div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div class="bloom" style="
          background: #d8493f;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          box-sizing: border-box;
          transform-origin: center;
          position: absolute;
        ">🌸</div>
      </div>`,
      24,
      1000
    );

    // 마커 클릭 이벤트 - 마커 제거
    naver.maps.Event.addListener(marker, "click", () => {
      marker.setMap(null);
      userMarkerRef.current = null;
      setUserMarkerData(null);
    });

    userMarkerRef.current = marker;
    setUserMarkerData({ lat, lng });
    smoothMoveTo(mapRef.current, lat, lng);
    return marker;
  };

  // 마커 생성 및 이벤트 설정을 위한 헬퍼 함수들
  const createFlowerMarker = (
    flower: ClusteredExistingFlowers,
    count: number,
    maxCount: number
  ) => {
    if (!mapRef.current) return;

    const size = clusterSize(count, maxCount);
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

    return marker;
  };

  const handleClusterClick = (flower: ClusteredExistingFlowers) => {
    if (!mapRef.current) return;

    resetSubFlower();
    resetExistingFlowers();
    const center = new naver.maps.LatLng(flower.latitude, flower.longitude);
    mapRef.current.zoomBy(1, center, true);
  };

  const handleLeafClick = (
    marker: naver.maps.Marker,
    flower: ClusteredExistingFlowers,
    maxCount: number
  ) => {
    resetSubFlower();

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
        flower,
        maxCount
      );

      SubFlowerRef.current.childMarkers = childMarkers;
      SubFlowerRef.current.childLines = childLines;
    }
  };

  const createChildElements = (
    children: ClusteredExistingFlowers[],
    parentFlower: ClusteredExistingFlowers,
    maxCount: number
  ) => {
    const childMarkers: naver.maps.Marker[] = [];
    const childLines: naver.maps.Polyline[] = [];

    children.forEach((child) => {
      if (!mapRef.current) return;
      // 연결선 생성
      const childLine = new naver.maps.Polyline({
        map: mapRef.current,
        path: [
          new naver.maps.LatLng(parentFlower.latitude, parentFlower.longitude),
          new naver.maps.LatLng(child.latitude, child.longitude),
        ],
        strokeColor: "#000",
        strokeWeight: 2,
        strokeOpacity: 0.5,
      });

      // 자식 마커 생성
      const count =
        child.type === "CLUSER"
          ? (child.data as ClusteredExistingFlowersCluster).count
          : 1;
      const size = clusterSize(count, maxCount);
      const html = getFlowerHTML(count, size);

      const childMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(child.latitude, child.longitude),
        map: mapRef.current,
        icon: {
          content: html,
          size: new naver.maps.Size(size, size),
          anchor: new naver.maps.Point(0, 0),
        },
      });

      childMarkers.push(childMarker);
      childLines.push(childLine);
    });

    return { childMarkers, childLines };
  };

  const handleFlowerClick = (flower: ClusteredExistingFlowers) => {
    const flowerData = flower.data as ClusteredExistingFlowersFlower;
    console.log(flowerData.name, flowerData.message, flowerData.plantedAt);
    smoothMoveTo(mapRef.current, flower.latitude, flower.longitude);
  };

  useEffect(() => {
    if (!zoomData) return;

    const map = mapRef.current;
    if (!map) return;

    getExistingFlowersData(zoomData).then((data) => {
      // 기존 마커들을 Map으로 변환하여 빠른 검색 가능
      const existingMarkersMap = new Map<string, naver.maps.Marker>();
      existingFlowersRef.current.forEach((marker) => {
        const pos = marker.getPosition();
        existingMarkersMap.set(`${pos.y},${pos.x}`, marker);
      });

      const newFlowers: naver.maps.Marker[] = [];
      const maxCount = Math.max(
        ...data.flowers.map((flower) =>
          flower
            ? flower.type === "CLUSER"
              ? (flower.data as ClusteredExistingFlowersCluster).count
              : flower.type === "LEAF"
              ? (flower.data as ClusteredExistingFlowersLeaf).count
              : 1
            : 0
        )
      );

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

        // 꽃 타입에 따른 처리
        const flowerHandlers = {
          CLUSER: () => {
            const clusterData = flower.data as ClusteredExistingFlowersCluster;
            const marker = createFlowerMarker(
              flower,
              clusterData.count,
              maxCount
            );

            naver.maps.Event.addListener(marker, "click", () =>
              handleClusterClick(flower)
            );

            return marker;
          },
          LEAF: () => {
            const leafData = flower.data as ClusteredExistingFlowersLeaf;
            const marker = createFlowerMarker(flower, leafData.count, maxCount);
            if (!marker) return;

            naver.maps.Event.addListener(marker, "click", () =>
              handleLeafClick(marker, flower, maxCount)
            );

            return marker;
          },
          FLOWER: () => {
            const marker = createFlowerMarker(flower, 1, maxCount);

            naver.maps.Event.addListener(marker, "click", () =>
              handleFlowerClick(flower)
            );

            return marker;
          },
        };

        const marker = flowerHandlers[flower.type]?.();
        if (marker) {
          newFlowers.push(marker);
        }
      });

      // 사용되지 않는 기존 마커들 제거
      existingMarkersMap.forEach((marker) => marker.setMap(null));
      existingFlowersRef.current = newFlowers;
    });
  }, [zoomData]);

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

  // 랜덤 위치 함수를 props로 전달받은 함수에 연결
  useEffect(() => {
    if (onRandomLocation) {
      onRandomLocation.current = () => {
        const randomLocation = generateRandomPointInPolygon(
          KOREA_LAND_BOUNDARY,
          [KOREA_MAP_BOUNDARY[0][0], KOREA_MAP_BOUNDARY[0][1]],
          [KOREA_MAP_BOUNDARY[1][0], KOREA_MAP_BOUNDARY[1][1]]
        );
        if (randomLocation) {
          addUserMarker(randomLocation[0], randomLocation[1]);
        }
      };
    }
  }, [onRandomLocation]);

  useEffect(() => {
    if (!isMounted) return;

    (async () => {
      const data = await fetchExistingFlowers();
      console.log(data);
      loadMarkers();
    })();

    const newMap = new naver.maps.Map("map", MAP_DEFAULT_OPTIONS);

    naver.maps.Event.addListener(newMap, "click", (e) => {
      addUserMarker(e.coord.lat(), e.coord.lng());
    });

    naver.maps.Event.addListener(newMap, "zoomstart", () => {
      resetSubFlower();
      resetExistingFlowers();
    });

    naver.maps.Event.addListener(newMap, "idle", () => {
      if (!mapRef.current) return;
      loadMarkers();
    });

    // const bounds = newMap.getBounds();
    // setZoomData({
    //   zoom: newMap.getZoom() || 7,
    //   minlat: bounds.getMin().y,
    //   minlng: bounds.getMin().x,
    //   maxlat: bounds.getMax().y,
    //   maxlng: bounds.getMax().x,
    // });

    mapRef.current = newMap;
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          overflow: "hidden",
        }}
        id="map"
      >
        <div>지도를 불러오는 중...</div>
      </div>

      {/* 토스트 메시지 */}
      {toast.enabled && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "Pretendard, sans-serif",
            fontWeight: "500",
            zIndex: 1001,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            animation: "slideUp 0.3s ease-out",
            transition: "opacity 0.3s ease-out",
            opacity: toast.closing ? 0 : 1,
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default PlantMap;

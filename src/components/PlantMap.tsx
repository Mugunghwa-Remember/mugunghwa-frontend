import { useEffect, useRef, useState } from "react";
import {
  fetchExistingFlowers,
  type ClusteredExistingFlowers,
  type ClusteredExistingFlowersCluster,
  type ClusteredExistingFlowersFlower,
  type ClusteredExistingFlowersLeaf,
  type ExistingFlower,
} from "../controllers/existingFlowersController";
import mugunghwaRaw from "../assets/mugunghwa2.svg?raw";

const KOREA_CENTER = [36.013522147, 128.180999088];

// 대한민국 경계 좌표
const KOREA_BOUNDS = {
  north: 38.6,
  south: 33.2,
  east: 132.0,
  west: 124.5,
};

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
  const SubFlowerRef = useRef<{
    size: number;
    parent: naver.maps.Marker;
    childMarkers: naver.maps.Marker[];
    childLines: naver.maps.Polyline[];
  } | null>(null);

  const [zoomData, setZoomData] = useState<{
    zoom: number;
    minlat: number;
    minlng: number;
    maxlat: number;
    maxlng: number;
  } | null>(null);

  const mapOption: naver.maps.MapOptions = {
    center: new naver.maps.LatLng(KOREA_CENTER[0], KOREA_CENTER[1]),
    zoom: 7,
    minZoom: 7,
    maxZoom: 17,
    tileDuration: 300,
    tileSpare: 5,
    mapDataControl: false,
  };

  const mugunghwaSVGHTML = mugunghwaRaw.replace(
    "<svg ",
    `<svg class="bloom" width="100%" height="100%" `
  );

  function clusterSize(count: number, zoom = 6, maxCount: number) {
    const MIN = 42;
    const MAX = 72;
    const REF = maxCount;
    const t = Math.min(1, REF === 1 ? 0 : Math.log10(count) / Math.log10(REF));
    const size = MIN + (MAX - MIN) * t;
    return Math.round(size);
  }

  const getFlowerHTML = (count: number, size: number) => {
    const rotate = Math.random() * 360;

    const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div class="cluster" style="position: absolute; width:${size}px;height:${size}px;">
        <div style="transform: rotate(${rotate}deg);">
          ${mugunghwaSVGHTML}
        </div>
        ${count == 1 ? "" : `<div class="cluster-num">${count}</div>`}
      </div>
    </div>`;

    return html;
  };

  const resetExistingFlowers = () => {
    existingFlowersRef.current.forEach((flower) => {
      flower.setMap(null);
    });
    existingFlowersRef.current = [];
  };

  const resetSubFlower = () => {
    if (!SubFlowerRef.current) return;
    const subFlower = SubFlowerRef.current;

    const { size, parent, childMarkers, childLines } = subFlower;

    childMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    subFlower.childMarkers = [];
    childLines.forEach((line) => {
      line.setMap(null);
    });
    subFlower.childLines = [];

    const html = parent.getIcon()?.content;
    if (!html) return;

    parent.setIcon({
      content: html.replace('class="cluster opacity-50"', 'class="cluster"'),
      size: new naver.maps.Size(size, size),
      anchor: new naver.maps.Point(0, 0),
    });
    SubFlowerRef.current = null;
  };

  useEffect(() => {
    if (!zoomData) return;

    const map = mapRef.current;
    if (!map) return;

    fetchExistingFlowers(zoomData).then((data) => {
      const existingMarkersMap = new Map<string, naver.maps.Marker>();
      existingFlowersRef.current.forEach((marker) => {
        const pos = marker.getPosition();
        const key = `${pos.lat()},${pos.lng()}`;
        existingMarkersMap.set(key, marker);
      });

      const newFlowers: naver.maps.Marker[] = [];

      const maxCount = Math.max(
        ...data.flowers.map((flower) =>
          flower.type === "CLUSER"
            ? (flower.data as ClusteredExistingFlowersCluster).count
            : flower.type === "LEAF"
            ? (flower.data as ClusteredExistingFlowersLeaf).count
            : 1
        )
      );

      data.flowers.forEach((flower: ClusteredExistingFlowers) => {
        const key = `${flower.latitude},${flower.longitude}`;

        if (existingMarkersMap.has(key)) {
          const existingMarker = existingMarkersMap.get(key)!;
          newFlowers.push(existingMarker);
          existingMarkersMap.delete(key);

          return;
        }

        if (flower.type === "CLUSER") {
          const data = flower.data as ClusteredExistingFlowersCluster;

          const size = clusterSize(data.count, map.getZoom() || 7, maxCount);
          const html = getFlowerHTML(data.count, size);

          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(flower.latitude, flower.longitude),
            map: map,
            icon: {
              content: html,
              size: new naver.maps.Size(size, size),
              anchor: new naver.maps.Point(0, 0),
            },
          });

          naver.maps.Event.addListener(marker, "click", () => {
            const map = mapRef.current;
            if (!map) return;

            resetSubFlower();
            resetExistingFlowers();
            const center = new naver.maps.LatLng(
              flower.latitude,
              flower.longitude
            );
            map.zoomBy(1, center, true);
          });

          newFlowers.push(marker);
        }

        if (flower.type === "LEAF") {
          const data = flower.data as ClusteredExistingFlowersLeaf;

          const size = clusterSize(data.count, map.getZoom() || 7, maxCount);
          const html = getFlowerHTML(data.count, size);

          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(flower.latitude, flower.longitude),
            map: map,
            icon: {
              content: html,
              size: new naver.maps.Size(size, size),
              anchor: new naver.maps.Point(0, 0),
            },
          });

          naver.maps.Event.addListener(marker, "click", () => {
            const map = mapRef.current;
            if (!map) return;

            resetSubFlower();

            const html = marker.getIcon().content;
            const enabled = html.indexOf('class="cluster opacity-50"') == -1;

            smoothMoveTo(flower.latitude, flower.longitude);
            marker.setIcon({
              content: enabled
                ? html.replace('class="cluster"', 'class="cluster opacity-50"')
                : html.replace('class="cluster opacity-50"', 'class="cluster"'),
              size: new naver.maps.Size(size, size),
              anchor: new naver.maps.Point(0, 0),
            });

            if (enabled) {
              SubFlowerRef.current = {
                size: size,
                parent: marker,
                childMarkers: [],
                childLines: [],
              };

              const childMarkers = [];
              const childLines = [];
              data.children.forEach((child) => {
                const childLine = new naver.maps.Polyline({
                  map: map,
                  path: [
                    new naver.maps.LatLng(flower.latitude, flower.longitude),
                    new naver.maps.LatLng(child.latitude, child.longitude),
                  ],
                  strokeColor: "#000",
                  strokeWeight: 2,
                  strokeOpacity: 0.5,
                });

                const count =
                  child.type === "CLUSER"
                    ? (child.data as ClusteredExistingFlowersCluster).count
                    : 1;
                const size = clusterSize(count, map.getZoom() || 7, maxCount);
                const html = getFlowerHTML(count, size);

                const childMarker = new naver.maps.Marker({
                  position: new naver.maps.LatLng(
                    child.latitude,
                    child.longitude
                  ),
                  map: map,
                  icon: {
                    content: html,
                    size: new naver.maps.Size(size, size),
                    anchor: new naver.maps.Point(0, 0),
                  },
                });

                childMarkers.push(childMarker);
                childLines.push(childLine);
              });

              SubFlowerRef.current.childMarkers = childMarkers;
              SubFlowerRef.current.childLines = childLines;
            }
          });

          newFlowers.push(marker);
        }

        if (flower.type === "FLOWER") {
          const data = flower.data as ClusteredExistingFlowersFlower;

          const size = clusterSize(1, map.getZoom() || 7, maxCount);
          const html = getFlowerHTML(1, size);

          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(flower.latitude, flower.longitude),
            map: map,
            icon: {
              content: html,
              size: new naver.maps.Size(size, size),
              anchor: new naver.maps.Point(0, 0),
            },
          });

          naver.maps.Event.addListener(marker, "click", () => {
            const map = mapRef.current;
            if (!map) return;

            console.log(data.name, data.message, data.plantedAt);
            smoothMoveTo(flower.latitude, flower.longitude);
          });

          newFlowers.push(marker);
        }
      });

      existingMarkersMap.forEach((marker) => {
        marker.setMap(null);
      });

      existingFlowersRef.current = newFlowers;
    });
  }, [zoomData]);

  // 랜덤 위치 생성 함수
  const getRandomLocation = () => {
    const lat =
      KOREA_BOUNDS.south +
      Math.random() * (KOREA_BOUNDS.north - KOREA_BOUNDS.south);
    const lng =
      KOREA_BOUNDS.west +
      Math.random() * (KOREA_BOUNDS.east - KOREA_BOUNDS.west);

    return { lat, lng };
  };

  // 사용자 마커 추가 함수
  const addUserMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return;

    // 기존 사용자 마커가 있으면 제거
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    const position = new naver.maps.LatLng(lat, lng);

    const marker = new naver.maps.Marker({
      position: position,
      map: mapRef.current,
      icon: {
        content: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
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
            ">
              🌸
            </div>
          </div>
        `,
        size: new naver.maps.Size(24, 24),
        anchor: new naver.maps.Point(0, 0),
        zIndex: 1000,
      },
    });

    // 마커 클릭 이벤트 - 마커 제거
    naver.maps.Event.addListener(marker, "click", () => {
      marker.setMap(null);
      userMarkerRef.current = null;
      setUserMarkerData(null);
    });

    userMarkerRef.current = marker;
    setUserMarkerData({ lat, lng });

    // 지도 중심을 랜덤 위치로 이동
    // smoothMoveTo(lat, lng);

    return marker;
  };

  // 부드러운 이동 함수
  const smoothMoveTo = (lat: number, lng: number) => {
    if (!mapRef.current) return;

    const targetPosition = new naver.maps.LatLng(lat, lng);
    mapRef.current.panTo(targetPosition, {
      duration: 800,
      easing: "easeOutCubic",
    });
  };

  // 랜덤 위치 함수를 props로 전달받은 함수에 연결
  useEffect(() => {
    if (onRandomLocation) {
      onRandomLocation.current = () => {
        const randomLocation = getRandomLocation();
        if (randomLocation) {
          addUserMarker(randomLocation.lat, randomLocation.lng);
        }
      };
    }
  }, [onRandomLocation]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) return;

    const newMap = new naver.maps.Map("map", mapOption);

    naver.maps.Event.addListener(newMap, "click", (e) => {
      const lat = e.coord.lat();
      const lng = e.coord.lng();
      addUserMarker(lat, lng);
    });

    naver.maps.Event.addListener(newMap, "zoomstart", () => {
      resetSubFlower();
      resetExistingFlowers();
    });

    naver.maps.Event.addListener(newMap, "idle", () => {
      const map = mapRef.current;
      if (!map) return;

      const bounds = map.getBounds();
      if (bounds) {
        setZoomData({
          zoom: map.getZoom() || 7,
          minlat: bounds._min._lat,
          minlng: bounds._min._lng,
          maxlat: bounds._max._lat,
          maxlng: bounds._max._lng,
        });
      }
    });

    if (newMap.getBounds) {
      const bounds = newMap.getBounds();
      setZoomData({
        zoom: newMap.getZoom() || 7,
        minlat: bounds._min._lat,
        minlng: bounds._min._lng,
        maxlat: bounds._max._lat,
        maxlng: bounds._max._lng,
      });
    }

    mapRef.current = newMap;
    console.log(newMap);
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: "16px",
        border: "2px dashed rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
      }}
      id="map"
    >
      <div>지도를 불러오는 중...</div>
    </div>
  );
};

export default PlantMap;

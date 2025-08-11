import { useEffect, useRef, useState } from "react";
import {
  fetchExistingFlowers,
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

  function buildMugunghwaSVGHTML(size = 46) {
    const gid = "mg" + Math.random().toString(36).slice(2, 8);
    let svg = mugunghwaRaw.replaceAll("hp2", `${gid}`);
    svg = svg.replace("<svg ", `<svg width="${size}" height="${size}" `);
    return `<div class="bloom">${svg}</div>`;
  }

  function clusterSize(count: number, zoom = 6) {
    const MIN = 32;
    const MAX = 128;
    const REF = 400;
    const t = Math.min(1, Math.log10(count) / Math.log10(REF));
    let size = MIN + (MAX - MIN) * t;
    const zoomScale = 0.9 + (zoom - 7) * 0.08;
    size *= Math.max(0.8, Math.min(1.5, zoomScale));
    return Math.round(size);
  }

  const resetExistingFlowers = () => {
    existingFlowersRef.current.forEach((flower) => {
      flower.setMap(null);
    });
    existingFlowersRef.current = [];
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

      data.flowers.forEach((flower: ExistingFlower) => {
        const key = `${flower.latitude},${flower.longitude}`;

        if (existingMarkersMap.has(key)) {
          const existingMarker = existingMarkersMap.get(key)!;
          newFlowers.push(existingMarker);
          existingMarkersMap.delete(key);
        } else {
          const size = clusterSize(flower.count, map.getZoom() || 7);
          const html = `<div class="relative" style="width:${size}px;height:${size}px">${buildMugunghwaSVGHTML(
            size
          )}<div class="cluster-num">${flower.count}</div></div>`;

          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(flower.latitude, flower.longitude),
            map: map,
            icon: {
              content: html,
              size: new naver.maps.Size(16, 16),
              anchor: new naver.maps.Point(8, 8),
            },
          });

          naver.maps.Event.addListener(marker, "click", () => {
            const map = mapRef.current;
            if (!map) return;
            resetExistingFlowers();
            const center = new naver.maps.LatLng(
              flower.latitude,
              flower.longitude
            );
            map.zoomBy(1, center, true);
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
          ">
            🌸
          </div>
        `,
        size: new naver.maps.Size(24, 24),
        anchor: new naver.maps.Point(12, 12),
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
    smoothMoveTo(lat, lng);

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
      smoothMoveTo(lat, lng);
    });

    naver.maps.Event.addListener(newMap, "zoomstart", () => {
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

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import mugunghwaRaw from "../assets/mugunghwa2.svg?raw";

// Extend Leaflet types for MarkerCluster
declare module "leaflet" {
  interface MarkerClusterGroup extends L.LayerGroup {
    refreshClusters?: () => void;
  }

  function markerClusterGroup(
    options?: Record<string, unknown>
  ): MarkerClusterGroup;
}

// Constants from PlantPage
const koreaMapBoundary: [number, number][] = [
  [33.0, 124.5], // Southwest
  [38.5, 132.0], // Northeast
];

const KOREA_CENTER: L.LatLngTuple = [
  koreaMapBoundary[0][0] + koreaMapBoundary[1][0] / 2,
  koreaMapBoundary[0][1] + koreaMapBoundary[1][1] / 2,
];

const KOREA_BOUNDS = L.latLngBounds(
  [koreaMapBoundary[0][0], koreaMapBoundary[0][1]],
  [koreaMapBoundary[1][0], koreaMapBoundary[1][1]]
);

const API_BASE =
  (globalThis as unknown as { MUGUNGHWA_API?: string }).MUGUNGHWA_API || "/api";

const MAX_EXPLORE_POINTS = 1000;

// Mock data for fallback
const mockNames = [
  "김민준",
  "이서연",
  "박도윤",
  "최지우",
  "정하윤",
  "강시우",
  "조서아",
  "윤이준",
  "임아인",
  "한지호",
];

// Types
interface FlowerPoint {
  lat: number;
  lng: number;
  name?: string;
  msg?: string;
  ts?: number;
}

interface Cluster {
  getChildCount: () => number;
}

// Utility functions
function esc(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return String(str || "").replace(/[&<>"']/g, (m) => map[m]);
}

function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait = 300
): (...args: Parameters<T>) => void {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// SVG generation for flower icons
function buildMugunghwaSVGHTML(size = 46): string {
  const gid = "mg" + Math.random().toString(36).slice(2, 8);
  // rewrite IDs to avoid collisions
  let svg = (mugunghwaRaw || "").replaceAll("hp2", `${gid}`);
  // inject size and class on <svg>
  svg = svg.replace("<svg ", `<svg width="${size}" height="${size}" `);
  const rot = (-5 + Math.random() * 10).toFixed(2);
  return `<div class="bloom" style="transform: rotate(${rot}deg)">${svg}</div>`;
}

function createFlowerIcon(): L.DivIcon {
  const html = buildMugunghwaSVGHTML(42);
  return L.divIcon({
    html,
    className: "mugunghwa",
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

function clusterSize(count: number, zoom = 6): number {
  const MIN = 46,
    MAX = 120; // px
  const REF = 400; // count at which we approach MAX
  const t = Math.min(1, Math.log10(count + 1) / Math.log10(REF));
  let size = MIN + (MAX - MIN) * t;
  const zoomScale = 0.9 + (zoom - 6) * 0.08; // gentle zoom influence
  size *= Math.max(0.8, Math.min(1.5, zoomScale));
  return Math.round(size);
}

function createClusterFlowerIcon(count: number, zoom = 6): L.DivIcon {
  const size = clusterSize(count, zoom);
  const html = `<div class="relative" style="width:${size}px;height:${size}px">${buildMugunghwaSVGHTML(
    size
  )}<div class="cluster-num">${count}</div></div>`;
  return L.divIcon({
    html,
    className: "cluster",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function popupHTML(item: FlowerPoint): string {
  const name = esc(item.name || "익명");
  const msg = esc(item.msg || "");
  const date = item.ts ? new Date(item.ts).toISOString().slice(0, 10) : "";
  return `<div class="text-sm"><div class="font-bold mb-1">${name}</div>${
    msg ? `<div class="leading-snug">${msg}</div>` : ""
  }${
    date ? `<div class="text-xs text-gray-500 mt-1">${date}</div>` : ""
  }</div>`;
}

export default function ExplorePage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const exploreLayerRef = useRef<L.MarkerClusterGroup | null>(null);
  const exploreAbortRef = useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function updateExploreMarkers(points: FlowerPoint[]): void {
    if (!exploreLayerRef.current) return;
    exploreLayerRef.current.clearLayers();
    (points || []).forEach((p) => {
      const m = L.marker([p.lat, p.lng], {
        icon: createFlowerIcon(),
      }).bindPopup(popupHTML(p));
      exploreLayerRef.current!.addLayer(m);
    });
  }

  async function loadExploreForBounds(): Promise<void> {
    if (!mapInstanceRef.current) return;
    const b = mapInstanceRef.current.getBounds();
    const bbox = [
      b.getWest().toFixed(6),
      b.getSouth().toFixed(6),
      b.getEast().toFixed(6),
      b.getNorth().toFixed(6),
    ].join(",");

    try {
      setIsLoading(true);
      if (exploreAbortRef.current) exploreAbortRef.current.abort();
      exploreAbortRef.current = new AbortController();

      const res = await fetch(
        `${API_BASE}/plants/search?bbox=${bbox}&limit=${MAX_EXPLORE_POINTS}`,
        { signal: exploreAbortRef.current.signal, cache: "no-store" }
      );

      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      updateExploreMarkers(Array.isArray(data) ? data : data.items || []);
    } catch {
      // fallback: mock few points around center
      const c = mapInstanceRef.current.getCenter();
      const arr: FlowerPoint[] = Array.from({ length: 120 }, () => ({
        lat: c.lat + (Math.random() - 0.5) * 2,
        lng: c.lng + (Math.random() - 0.5) * 2,
        name: mockNames[Math.floor(Math.random() * mockNames.length)],
        msg: ["대한독립만세", "고맙습니다", "잊지 않겠습니다", "평화를 빕니다"][
          Math.floor(Math.random() * 4)
        ],
        ts: Date.now() - Math.floor(Math.random() * 86400000),
      }));
      updateExploreMarkers(arr);
    } finally {
      setIsLoading(false);
    }
  }

  function initExploreMap(): void {
    if (mapInstanceRef.current) return; // once

    if (!mapRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: KOREA_CENTER,
      zoom: 6,
      minZoom: 6,
      maxZoom: 12,
      maxBounds: KOREA_BOUNDS,
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      attributionControl: false, // Leaflet attribution 제거
      doubleClickZoom: false, // 더블클릭 줌 비활성화
    });

    L.control.zoom({ position: "bottomright" }).addTo(mapInstanceRef.current);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
      crossOrigin: true,
    }).addTo(mapInstanceRef.current);

    exploreLayerRef.current = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster: Cluster) =>
        createClusterFlowerIcon(
          cluster.getChildCount(),
          mapInstanceRef.current ? mapInstanceRef.current.getZoom() : 6
        ),
    });

    mapInstanceRef.current.addLayer(exploreLayerRef.current);

    // keep cluster icon size synced with zoom
    mapInstanceRef.current.on(
      "zoomend",
      () =>
        exploreLayerRef.current?.refreshClusters &&
        exploreLayerRef.current.refreshClusters()
    );

    const debounced = debounce(loadExploreForBounds, 250);
    mapInstanceRef.current.on("moveend", debounced);

    // Initial load
    loadExploreForBounds();
  }

  useEffect(() => {
    initExploreMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (exploreAbortRef.current) {
        exploreAbortRef.current.abort();
      }
    };
  }, []);

  return (
    <section className="animate-fadeUp w-full h-full flex flex-col">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            대한민국에 피어난 무궁화 구경하기
          </h2>
          <p className="text-sm text-gray-600">
            지도를 움직이면 주변 헌화를 불러옵니다. 마커를 누르면 이름과 편지를
            볼 수 있어요.
          </p>
        </div>
        <div className="hidden items-center gap-3"></div>
      </header>

      <div
        ref={mapRef}
        className="w-full h-auto grow md:h-[620px] rounded-xl overflow-hidden shadow-soft relative"
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/85 px-3 py-2 rounded-full text-sm shadow-soft z-[1000]">
          마커를 눌러 이름과 편지를 보세요
        </div>

        {isLoading && (
          <div className="absolute top-3 right-3 bg-white/85 px-3 py-2 rounded-full text-sm shadow-soft z-[1000]">
            불러오는 중…
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2 text-right">
        이동/확대 시 최대 1,000개까지 로드합니다.
      </p>
    </section>
  );
}

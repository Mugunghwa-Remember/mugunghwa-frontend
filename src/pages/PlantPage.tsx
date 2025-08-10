import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppState";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import confetti from "canvas-confetti";
import type { MarkerClusterGroup } from "leaflet.markercluster";
import mugunghwaRaw from "../assets/mugunghwa2.svg?raw";

const koreaLandBoundary: [number, number][] = [
  [37.58891431411286, 124.50648969748589], // 백령도 남서
  [38.02673345916925, 124.28475233270295], // 백령도 북서
  [38.020780896680584, 124.76882889768024], // 백령도 북동
  [37.609879943747146, 125.14551291739005], // 연평도 서
  [37.91820111976663, 126.56824773470423], // 파주 북서
  [38.35888785866677, 127.10919082293168], // 철원 북서
  [38.36211833953394, 128.0787856082678], // 양구 북동
  [38.63725461835644, 128.27384914215762], // 고성 북서
  [38.72194763292809, 128.60926955591654], // 강원도 북동
  [37.974514992024616, 129.17800640351092], // 강릉 북동
  [37.618582632478834, 131.04521120688565], // 울릉 북동
  [37.19095471582608, 132.03582182674253], // 독도
  [37.33522435930641, 131.02325275097365], // 울릉 남동
  [35.89795019335754, 129.91380460608474], // 포항 남동
  [34.79125047210742, 129.3868129061297], // 부산 남동
  [33.211116472416855, 127.26892066176524], // 제주 남동
  [31.711077993772918, 124.91465371526903], // 이어도
  [33.57343808567735, 125.90381791600889], // 제주 북서
  [33.93424531117312, 124.9813639629714], // 가거도
  [34.854382885097905, 125.06357208606961], // 홍도
  [35.427299587140354, 125.8090942671344], // 안마도
  [36.17651323453557, 125.86757082904286], // 어청도
  [36.67477110122844, 125.45510484961102], // 격렬비열도
  [37.2633653930117, 125.78873367805456], // 굴업도
];

const koreaMapBoundary = koreaLandBoundary.reduce(
  (acc, e) => {
    return [
      [Math.min(acc[0][0], e[0]), Math.min(acc[0][1], e[1])],
      [Math.max(acc[1][0], e[0]), Math.max(acc[1][1], e[1])],
    ];
  },
  [
    [999, 999],
    [-999, -999],
  ]
);

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

function vibrate(ms = 10) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function toComma(n: number) {
  return n.toLocaleString("ko-KR");
}

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

// Point-in-polygon check using ray casting algorithm
function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}

// Generate random point within polygon bounds
function generateRandomPointInPolygon(
  polygon: [number, number][]
): [number, number] | null {
  // Get bounding box of polygon
  const bounds = polygon.reduce(
    (acc, point) => {
      return [
        [Math.min(acc[0][0], point[0]), Math.min(acc[0][1], point[1])],
        [Math.max(acc[1][0], point[0]), Math.max(acc[1][1], point[1])],
      ];
    },
    [
      [999, 999],
      [-999, -999],
    ]
  );

  // Try to find a point inside polygon (max 100 attempts)
  for (let attempt = 0; attempt < 100; attempt++) {
    const lat = randBetween(bounds[0][0], bounds[1][0]);
    const lng = randBetween(bounds[0][1], bounds[1][1]);

    if (isPointInPolygon([lat, lng], polygon)) {
      return [lat, lng];
    }
  }

  return null;
}

function buildMugunghwaSVGHTML(size = 46) {
  const gid = "mg" + Math.random().toString(36).slice(2, 8);
  // rewrite IDs to avoid collisions
  let svg = mugunghwaRaw.replaceAll("hp2", `${gid}`);
  // inject size and class on <svg>
  svg = svg.replace("<svg ", `<svg width="${size}" height="${size}" `);
  const rot = (-5 + Math.random() * 10).toFixed(2);
  return `<div class="bloom" style="transform: rotate(${rot}deg)">${svg}</div>`;
}

function createFlowerIcon() {
  const html = buildMugunghwaSVGHTML(42);
  return L.divIcon({
    html,
    className: "mugunghwa",
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

function clusterSize(count: number, zoom = 6) {
  const MIN = 32,
    MAX = 64;
  const REF = 400;
  const t = Math.min(1, Math.log10(count + 1) / Math.log10(REF));
  let size = MIN + (MAX - MIN) * t;
  const zoomScale = 0.9 + (zoom - 6) * 0.08;
  size *= Math.max(0.8, Math.min(1.5, zoomScale));
  return Math.round(size);
}

function createClusterFlowerIcon(count: number, zoom = 6) {
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

export default function PlantPage() {
  const navigate = useNavigate();
  const { name, setName, msg, setMsg } = useAppState();

  const [flowerCount, setFlowerCount] = useState(785432);
  const [target, setTarget] = useState(800000);
  const [tapCoachHidden, setTapCoachHidden] = useState(true);
  const [plantedOnce, setPlantedOnce] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState<L.LatLng | null>(null);
  const [showMobileInputs, setShowMobileInputs] = useState(false);

  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<MarkerClusterGroup | null>(null);
  const pendingMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) initMap();
    loadStats();
    const es = setupRealtime();
    return () => {
      try {
        if (es) es.close();
      } catch {
        /* noop */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 다각형 그리기 함수
  function initMap() {
    // Map configuration
    const mapConfig = {
      center: KOREA_CENTER,
      zoom: 6,
      minZoom: 6,
      maxZoom: 12,
      maxBounds: KOREA_BOUNDS,
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      attributionControl: false, // Leaflet attribution 제거
      doubleClickZoom: false, // 더블클릭 줌 비활성화
      tap: false, // 터치 줌 비활성화
    };

    // Initialize map
    const map = L.map("map", mapConfig);
    mapRef.current = map;

    // Add zoom control
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add tile layer (한글 지명 포함)
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      // "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
      {
        attribution: "",
        crossOrigin: true,
      }
    ).addTo(map);

    // Initialize marker cluster group
    const layer = (
      L as unknown as {
        markerClusterGroup: (opts: unknown) => MarkerClusterGroup;
      }
    ).markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster: { getChildCount(): number }) =>
        createClusterFlowerIcon(cluster.getChildCount(), map.getZoom()),
    });
    markerLayerRef.current = layer;
    map.addLayer(layer);

    // Refresh clusters on zoom
    map.on("zoomend", () => layer.refreshClusters?.());

    // Add mock flowers
    seedMockFlowers(1000);

    // Handle map clicks with debouncing
    let clickTimeout: number;
    map.on("click", (e: L.LeafletMouseEvent) => {
      // Clear previous timeout
      clearTimeout(clickTimeout);

      if (!isPointInPolygon([e.latlng.lat, e.latlng.lng], koreaLandBoundary)) {
        return;
      }

      // Set new timeout to handle single clicks only
      clickTimeout = setTimeout(() => {
        // Remove existing pending marker

        if (pendingMarkerRef.current) {
          map.removeLayer(pendingMarkerRef.current);
        }

        // Create new pending marker
        const marker = L.marker(e.latlng, {
          icon: createFlowerIcon(),
          keyboard: true,
          alt: "심을 위치",
        }).addTo(map);

        map.setView(e.latlng, Math.max(map.getZoom(), 10), { animate: true });

        pendingMarkerRef.current = marker;
        setSelectedLatLng(e.latlng);
        setTapCoachHidden(true);
        // Reset mobile inputs when new location is selected
        setShowMobileInputs(false);
        // Reset planted state for new location
        setPlantedOnce(false);
        vibrate(10);
      }, 150); // 150ms 지연으로 더블클릭과 구분
    });

    // Prevent double click zoom
    map.on("dblclick", (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
    });
  }

  function seedMockFlowers(n = 200) {
    const layer = markerLayerRef.current;
    if (!layer) return;

    let plantedCount = 0;
    let attempts = 0;
    const maxAttempts = n * 10; // Prevent infinite loops

    while (plantedCount < n && attempts < maxAttempts) {
      const point = generateRandomPointInPolygon(koreaLandBoundary);
      attempts++;

      if (point) {
        const [lat, lng] = point;
        const m = L.marker([lat, lng], { icon: createFlowerIcon() });
        layer.addLayer(m);
        plantedCount++;
      }
    }

    console.log(`Planted ${plantedCount} mock flowers in ${attempts} attempts`);
  }

  function validateName() {
    const v = name.trim();
    return v.length >= 2 && v.length <= 15;
  }

  function handleRandom() {
    const map = mapRef.current;
    if (!map) return;

    const point = generateRandomPointInPolygon(koreaLandBoundary);
    if (!point) {
      console.warn("Could not find valid land point for random location");
      return;
    }

    const [lat, lng] = point;
    const ll = L.latLng(lat, lng);
    map.setView(ll, 10, { animate: true });
    if (pendingMarkerRef.current) map.removeLayer(pendingMarkerRef.current);
    pendingMarkerRef.current = L.marker(ll, { icon: createFlowerIcon() }).addTo(
      map
    );
    setSelectedLatLng(ll);
    setTapCoachHidden(true);
    // Reset mobile inputs when new location is selected
    setShowMobileInputs(false);
    // Reset planted state for new location
    setPlantedOnce(false);
  }

  async function postPlant(payload: {
    name: string;
    msg: string;
    lat: number;
    lng: number;
    ts: number;
  }) {
    try {
      await fetch(`${API_BASE}/plants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* noop */
    }
  }

  function handlePlant() {
    setShowMobileInputs(true);
    if (!validateName()) {
      document.getElementById("nameInput")?.focus();
      vibrate(20);
      return;
    }
    if (!selectedLatLng) {
      vibrate(20);
      alert("심을 위치를 먼저 선택하세요.");
      return;
    }
    if (plantedOnce) return;

    // Show mobile inputs after plant button is pressed
    setPlantedOnce(true);

    const planted = L.marker(selectedLatLng, { icon: createFlowerIcon() });
    markerLayerRef.current?.addLayer(planted);
    if (pendingMarkerRef.current) {
      mapRef.current?.removeLayer(pendingMarkerRef.current);
      pendingMarkerRef.current = null;
    }

    setFlowerCount((n) => clamp(n + 1, 0, 10000000));
    postPlant({
      name: name.trim(),
      msg: msg.trim(),
      lat: selectedLatLng.lat,
      lng: selectedLatLng.lng,
      ts: Date.now(),
    });

    try {
      confetti({
        particleCount: 90,
        spread: 60,
        startVelocity: 38,
        origin: { y: 0.25 },
      });
    } catch {
      /* noop */
    }
    vibrate(15);

    setTimeout(() => setDonationOpen(true), 900);
  }

  async function loadStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.target === "number") setTarget(data.target);
        if (typeof data.count === "number")
          setFlowerCount(clamp(data.count, 0, 10000000));
      }
    } catch {
      /* noop */
    }
  }
  function setupRealtime() {
    try {
      const es = new EventSource(`${API_BASE}/stats/stream`);
      es.onmessage = (ev) => {
        try {
          const d = JSON.parse(ev.data);
          if (typeof d.count === "number")
            setFlowerCount(clamp(d.count, 0, 10000000));
        } catch {
          const n = +ev.data;
          if (!Number.isNaN(n)) setFlowerCount(clamp(n, 0, 10000000));
        }
      };
      es.onerror = () => {
        try {
          es.close();
        } catch {
          /* noop */
        }
      };
      return es;
    } catch {
      return null;
    }
  }

  const progress = clamp((flowerCount / target) * 100, 0, 100);
  const showNameHelp = !validateName();

  const [donationOpen, setDonationOpen] = useState(false);
  function closeDonationAndGoResult(withOpen: boolean) {
    setDonationOpen(false);
    if (withOpen) window.open("https://together.kakao.com/", "_blank");
    setTimeout(() => navigate("/result"), 200);
  }

  return (
    <section className="animate-fadeUp w-full md:h-auto h-auto overflow-hidden flex flex-col grow md:grow-0 ">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            당신의 이름으로 무궁화를 심어주세요
          </h2>
          <p className="text-sm text-ink/70">
            대한민국 지도 위 아무 곳이나 탭하여 위치를 고르세요.
          </p>
        </div>
        <div className="hidden items-center gap-3" />
      </header>

      <div className="md:grid md:grid-cols-5 gap-4 flex flex-col grow ">
        <div className="md:col-span-2 space-y-4 order-2 md:order-1 flex flex-col">
          <div
            className={`grow flex-col ${
              showMobileInputs ? "flex" : "hidden md:flex"
            }`}
          >
            <div>
              <label
                htmlFor="nameInput"
                className="block text-sm font-semibold mb-1"
              >
                이름/별명
              </label>
              <input
                id="nameInput"
                type="text"
                autoComplete="name"
                placeholder="이름 또는 별명 (2~15자)"
                maxLength={20}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-100 focus:border-rose-100 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p
                className={`mt-1 text-xs text-rose-600 ${
                  showNameHelp ? "" : "hidden"
                }`}
              >
                이름/별명은 2~15자로 입력해주세요.
              </p>
            </div>
            <div className={`grow flex-col flex`}>
              <label
                htmlFor="msgInput"
                className="block text-sm font-semibold mb-1"
              >
                감사 편지 (선택)
              </label>
              <textarea
                id="msgInput"
                rows={3}
                maxLength={50}
                placeholder="50자 이내로 감사의 마음을 남겨주세요"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-100 focus:border-rose-100 outline-none font-pen text-2xl grow"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <p className="text-right text-xs text-ink/60">
                <span>{msg.length}</span> / 50
              </p>
            </div>
          </div>

          <div className="p-4 bg-white/80 rounded-xl shadow-soft">
            <h3 className="font-semibold text-center mb-2">전체 헌화 현황</h3>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-bold text-primary">
                {toComma(flowerCount)}
              </span>
              <span className="text-ink/60">목표 {toComma(target)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  background: "linear-gradient(90deg,#f2c6cc,#e8a7b1)",
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              className={`py-3 rounded-xl font-bold ${
                selectedLatLng
                  ? "btn-cta cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handlePlant}
              disabled={!selectedLatLng}
            >
              이 위치에 심기
            </button>
            <button
              className="py-3 rounded-xl border border-gray-300 font-bold bg-white cursor-pointer"
              onClick={handleRandom}
            >
              랜덤 위치
            </button>
          </div>
          <p className="text-xs text-ink/60 m-0">
            지도를 탭하면 임시 위치 표시가 생깁니다. 심기를 눌러 확정하세요.
          </p>
        </div>

        <div
          className="md:col-span-3 order-1 md:order-2 flex flex-col-reverse
        md:flex-col md:gap-4 gap-2  grow"
        >
          <div className="relative md:h-[50vh] bg-[#c1c9cc] h-auto grow ">
            <div
              id="map"
              className="w-full h-full md:rounded-xl overflow-hidden shadow-soft md:relative absolute "
            >
              <div
                className={`absolute inset-0 pointer-events-none grid place-items-center z-[1000] ${
                  tapCoachHidden ? "hidden" : ""
                }`}
              >
                <div className="bg-white/85 px-3 py-2 rounded-full text-sm shadow-soft">
                  지도를 탭하여 심을 위치를 선택하세요
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {donationOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 p-4 z-[10000]"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full text-center shadow-soft">
            <h3 className="text-xl font-bold mb-2">마음을 나누어주세요</h3>
            <p className="text-sm text-ink/80">
              이 캠페인은 자발적인 기부로 이어집니다. 독립유공자 후손 지원을
              위해 함께 해주세요.
            </p>
            <button
              className="btn-cta w-full mt-5 py-3 rounded-xl font-bold"
              onClick={() => closeDonationAndGoResult(true)}
            >
              카카오같이가치 기부하기
            </button>
            <button
              className="mt-3 text-sm text-ink/60 underline"
              onClick={() => closeDonationAndGoResult(false)}
            >
              다음에 할게요
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

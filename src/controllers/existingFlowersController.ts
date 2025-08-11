import { flower } from "../pages/IntroPage.css";
import type { Feature, Point } from "geojson";

// 다른 사람이 심은 꽃 데이터 타입
export interface ExistingFlower {
  id: string;
  name: string;
  message?: string;
  latitude: number;
  longitude: number;
  plantedAt: string;
  flowerType: "mugunghwa";
}

// 기존 꽃 목록 데이터 타입
export interface ExistingFlowersData {
  flowers: ExistingFlower[];
  totalCount: number;
  lastUpdated: string;
}

const LATLNG_SCALE = 0.66;
const LATLNG_DISTANCE = 111000 * LATLNG_SCALE;

const koreaMapBoundary = [
  [31.711077993772918, 124.28475233270295],
  [38.72194763292809, 132.03582182674253],
];

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

const zoomScale = [
  0, 0, 0, 0, 0, 0, 0, 50000, 30000, 20000, 10000, 5000, 3000, 1000, 500, 300,
  100, 50,
];

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
  // Try to find a point inside polygon (max 100 attempts)
  for (let attempt = 0; attempt < 100; attempt++) {
    const lat = randBetween(koreaMapBoundary[0][0], koreaMapBoundary[1][0]);
    const lng = randBetween(koreaMapBoundary[0][1], koreaMapBoundary[1][1]);

    if (isPointInPolygon([lat, lng], polygon)) {
      return [lat, lng];
    }
  }

  return null;
}
// 목 데이터 - 실제 API 연동 전까지 사용
const generateMockExistingFlowers = (count: number): ExistingFlower[] => {
  const flowers: ExistingFlower[] = [];

  for (let i = 0; i < count; i++) {
    const [lat, lng] = generateRandomPointInPolygon(koreaLandBoundary) ?? [
      0, 0,
    ];

    const names = [
      "김철수",
      "이영희",
      "박민수",
      "최지영",
      "정현우",
      "한소영",
      "윤준호",
      "임수진",
      "강동원",
      "송혜교",
      "배수지",
      "이민호",
      "김태희",
      "원빈",
      "전지현",
      "현빈",
      "김수현",
      "박보검",
      "김고은",
      "공유",
      "이준기",
      "한지민",
      "조인성",
      "김하늘",
      "장동건",
      "고소영",
      "이병헌",
      "김윤진",
      "차태현",
      "한예슬",
      "김래원",
      "문근영",
    ];

    const messages = [
      "감사합니다!",
      "사랑합니다!",
      "고맙습니다!",
      "행복합니다!",
      "축하합니다!",
      "건강하세요!",
      "행운이 가득하세요!",
      "감사한 마음입니다!",
      "사랑과 평화!",
      "무궁화처럼 아름다운 나라!",
      "자유와 평등!",
      "민주주의 만세!",
      "대한민국 화이팅!",
      "우리나라 자랑스럽습니다!",
      "광복절을 기념하며!",
      "역사를 잊지 않겠습니다!",
      "미래를 향해!",
      "희망찬 내일!",
      "감사한 마음으로!",
      "사랑하는 나라!",
    ];

    flowers.push({
      id: `flower_${i + 1}`,
      name: names[Math.floor(Math.random() * names.length)],
      message:
        Math.random() > 0.3
          ? messages[Math.floor(Math.random() * messages.length)]
          : undefined,
      latitude: lat,
      longitude: lng,
      plantedAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 최근 30일 내
      flowerType: "mugunghwa",
    });
  }

  return flowers;
};

// 목 데이터
const mockExistingFlowersData: ExistingFlowersData = {
  flowers: generateMockExistingFlowers(100000),
  totalCount: 100000,
  lastUpdated: new Date().toISOString(),
};

import Supercluster from "supercluster";
/**
 * 다른 사람이 심은 꽃 목록을 가져오는 함수
 * @param limit 가져올 꽃의 개수 (기본값: 1000)
 * @param offset 시작 위치 (기본값: 0)
 * @returns Promise<ExistingFlowersData>
 */
export const fetchExistingFlowers = async ({
  zoom,
  minlat,
  minlng,
  maxlat,
  maxlng,
}: {
  zoom: number;
  minlat: number;
  minlng: number;
  maxlat: number;
  maxlng: number;
}): Promise<ExistingFlowersData> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 300));

  const points: Feature<Point>[] = mockExistingFlowersData.flowers.map((d) => ({
    type: "Feature",
    properties: { id: d.id }, // 필요한 속성
    geometry: { type: "Point", coordinates: [d.longitude, d.latitude] },
  }));

  const index = new Supercluster({
    radius: 128, // 클러스터 반경(px). 밀도 표현 강도
    maxZoom: 18, // 데이터 클러스터링 최대 줌
    minPoints: 2, // 몇 개부터 클러스터로 묶을지
  }).load(points as any);

  const flowerCluster = index.getClusters(
    [minlng, minlat, maxlng, maxlat],
    zoom
  );
  console.log(flowerCluster);

  const flowers2 = flowerCluster.map((e, i) => ({
    id: `flower_${i + 1}`,
    name: "test",
    message: "test",
    count: e.properties.point_count,
    latitude: e.geometry.coordinates[1],
    longitude: e.geometry.coordinates[0],
    plantedAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(), // 최근 30일 내
    flowerType: "mugunghwa",
  }));
  console.log(flowers2);

  return {
    flowers: flowers2,
    totalCount: flowers2?.length ?? 0,
    lastUpdated: new Date().toISOString(),
  };

  // 페이지네이션 적용
  const paginatedFlowers = mockExistingFlowersData.flowers;

  const flowers: ExistingFlower[] = [];

  const scale = zoomScale[zoom] / LATLNG_DISTANCE;

  const minlatidx = Math.floor((minlat - koreaMapBoundary[0][0]) / scale);
  const maxlatidx = Math.ceil((maxlat - koreaMapBoundary[0][0]) / scale);
  const minlngidx = Math.floor((minlng - koreaMapBoundary[0][1]) / scale);
  const maxlngidx = Math.ceil((maxlng - koreaMapBoundary[0][1]) / scale);

  const tmp: any = {};

  mockExistingFlowersData.flowers
    .filter((flower) => {
      const latidx = Math.floor(
        (flower.latitude - koreaMapBoundary[0][0]) / scale
      );
      const lngidx = Math.floor(
        (flower.longitude - koreaMapBoundary[0][1]) / scale
      );
      if (
        latidx >= minlatidx &&
        latidx < maxlatidx &&
        lngidx >= minlngidx &&
        lngidx < maxlngidx
      )
        return true;
      return false;
    })
    .forEach((flower) => {
      const latidx = Math.floor(
        (flower.latitude - koreaMapBoundary[0][0]) / scale
      );
      const lngidx = Math.floor(
        (flower.longitude - koreaMapBoundary[0][1]) / scale
      );

      if (`${latidx},${lngidx}` in tmp) {
        tmp[`${latidx},${lngidx}`].flowers.push(flower);
      } else {
        tmp[`${latidx},${lngidx}`] = {
          position: [0, 0],
          flowers: [flower],
        };
      }
    });

  Object.values(tmp).forEach((value, i) => {
    if (value.flowers.length === 0) return;
    const [lat, lng] = value.flowers.reduce(
      (acc, e) => {
        return [acc[0] + e.latitude, acc[1] + e.longitude];
      },
      [0, 0]
    );

    flowers.push({
      id: `flower_${i + 1}`,
      name: "test",
      message: "test",
      count: value.flowers.length,
      latitude: lat / value.flowers.length,
      longitude: lng / value.flowers.length,
      plantedAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 최근 30일 내
      flowerType: "mugunghwa",
    });
  });

  const updatedData: ExistingFlowersData = {
    flowers: flowers,
    totalCount: flowers.length,
    lastUpdated: new Date().toISOString(),
  };

  return updatedData;
};

/**
 * 특정 지역의 꽃들을 가져오는 함수
 * @param centerLat 중심 위도
 * @param centerLng 중심 경도
 * @param radius 반경 (km)
 * @param limit 가져올 꽃의 개수 (기본값: 100)
 * @returns Promise<ExistingFlower[]>
 */
export const fetchFlowersInArea = async (
  centerLat: number,
  centerLng: number,
  radius: number,
  limit: number = 100
): Promise<ExistingFlower[]> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 200));

  // 간단한 거리 계산 (하버사인 공식 대신 유클리드 거리 사용)
  const flowersInArea = mockExistingFlowersData.flowers
    .filter((flower) => {
      const latDiff = flower.latitude - centerLat;
      const lngDiff = flower.longitude - centerLng;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      return distance <= radius / 111; // 1도 ≈ 111km
    })
    .slice(0, limit);

  return flowersInArea;
};

/**
 * 특정 사용자가 심은 꽃들을 가져오는 함수
 * @param userName 사용자 이름
 * @param limit 가져올 꽃의 개수 (기본값: 50)
 * @returns Promise<ExistingFlower[]>
 */
export const fetchFlowersByUser = async (
  userName: string,
  limit: number = 50
): Promise<ExistingFlower[]> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 200));

  const userFlowers = mockExistingFlowersData.flowers
    .filter((flower) => flower.name === userName)
    .slice(0, limit);

  return userFlowers;
};

/**
 * 최근에 심어진 꽃들을 가져오는 함수
 * @param hours 최근 몇 시간 내 (기본값: 24)
 * @param limit 가져올 꽃의 개수 (기본값: 100)
 * @returns Promise<ExistingFlower[]>
 */
export const fetchRecentFlowers = async (
  hours: number = 24,
  limit: number = 100
): Promise<ExistingFlower[]> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 200));

  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

  const recentFlowers = mockExistingFlowersData.flowers
    .filter((flower) => new Date(flower.plantedAt) > cutoffTime)
    .sort(
      (a, b) =>
        new Date(b.plantedAt).getTime() - new Date(a.plantedAt).getTime()
    )
    .slice(0, limit);

  return recentFlowers;
};

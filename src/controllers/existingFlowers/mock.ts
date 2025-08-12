// 목 데이터 생성 및 관리

import {
  KOREA_LAND_BOUNDARY,
  KOREA_MAP_BOUNDARY,
} from "../../constants/koreaMap";
import { generateRandomPointInPolygon } from "../../utils/Point";
import type { ExistingFlower, ExistingFlowersData } from "./types";

const NAMES = [
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

const MESSAGES = [
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

function generateMockFlower(id: number): ExistingFlower {
  const [lat, lng] = generateRandomPointInPolygon(
    KOREA_LAND_BOUNDARY,
    [KOREA_MAP_BOUNDARY[0][0], KOREA_MAP_BOUNDARY[0][1]],
    [KOREA_MAP_BOUNDARY[1][0], KOREA_MAP_BOUNDARY[1][1]]
  ) ?? [0, 0];

  return {
    id: `flower_${id + 1}`,
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    message:
      Math.random() > 0.3
        ? MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
        : undefined,
    count: 1,
    latitude: lat,
    longitude: lng,
    plantedAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(), // 최근 30일 내
    flowerType: "mugunghwa",
  };
}

export function generateMockExistingFlowers(count: number): ExistingFlower[] {
  return Array.from({ length: count }, (_, i) => generateMockFlower(i));
}

export const mockExistingFlowersData: ExistingFlowersData = {
  flowers: generateMockExistingFlowers(100000),
  totalCount: 100000,
  lastUpdated: new Date().toISOString(),
};

export const mockExistingFlowersApi =
  async (): Promise<ExistingFlowersData> => {
    // await new Promise((resolve) => setTimeout(resolve, 300));

    return mockExistingFlowersData;
  };

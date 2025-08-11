// 전체 헌화 현황 데이터 타입
export interface FlowerProgressData {
  currentCount: number;
  targetCount: number;
  lastUpdated: string;
}

const currentCount = Math.floor(Math.random() * 800000);
const targetCount = 800000;

// 목 데이터
const mockFlowerProgressData: FlowerProgressData = {
  currentCount: currentCount,
  targetCount: targetCount,
  lastUpdated: new Date().toISOString(),
};

/**
 * 전체 헌화 현황 데이터를 가져오는 함수
 * @returns Promise<FlowerProgressData>
 */
export const fetchFlowerProgress = async (): Promise<FlowerProgressData> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 랜덤하게 데이터를 약간 변경하여 동적인 느낌 연출
  const randomVariation = Math.floor(Math.random() * 100) - 50; // -50 ~ +49
  const updatedData: FlowerProgressData = {
    ...mockFlowerProgressData,
    currentCount: Math.max(
      0,
      mockFlowerProgressData.currentCount + randomVariation
    ),
    lastUpdated: new Date().toISOString(),
  };

  return updatedData;
};

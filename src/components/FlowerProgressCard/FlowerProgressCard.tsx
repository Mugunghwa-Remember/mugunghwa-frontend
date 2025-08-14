import { useEffect, useState } from "react";
import * as styles from "./FlowerProgressCard.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import fetchFlowerProgress from "../../controllers/flowerProgress/api";
import type { FlowerProgressData } from "../../controllers/flowerProgress/types";
import { safeTrack } from "../../utils/mixpanel";

const REFRESH_INTERVAL = 3 * 60 * 1000; // 3분

export default function FlowerProgressCard() {
  const [data, setData] = useState<FlowerProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 데이터를 가져오는 함수
  const fetchProgressData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      safeTrack("flower_progress_data_request");

      const response = await fetchFlowerProgress();
      setData(response.data);

      safeTrack("flower_progress_data_success", {
        current_count: response.data.currentCount,
        target_count: response.data.targetCount,
        progress_percentage: Math.min(
          (response.data.currentCount / response.data.targetCount) * 100,
          100
        ),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다";
      setError(errorMessage);
      console.error("FlowerProgressCard API Error:", err);

      safeTrack("flower_progress_data_error", {
        error: errorMessage,
        error_type: err instanceof Error ? err.constructor.name : "unknown",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    safeTrack("flower_progress_card_mounted");
    fetchProgressData();
    if (REFRESH_INTERVAL <= 0) return;

    const interval = setInterval(fetchProgressData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // 진행률 계산
  const progressPercentage = data
    ? Math.min((data.currentCount / data.targetCount) * 100, 100)
    : 0;

  // 로딩 상태일 때
  if (isLoading) {
    return (
      <div className={styles.progressCard}>
        <h3 className={styles.progressTitle}>전체 헌화 현황</h3>
        <div className={styles.progressContainer}>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <span>데이터를 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태일 때
  if (error) {
    return (
      <div className={styles.progressCard}>
        <h3 className={styles.progressTitle}>전체 헌화 현황</h3>
        <div className={styles.progressContainer}>
          <div className={styles.errorState}>
            <span className={styles.errorMessage}>⚠️ {error}</span>
            <button
              className={styles.retryButton}
              onClick={() => {
                safeTrack("flower_progress_retry_click", {
                  error: error,
                });
                fetchProgressData();
              }}
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.progressCard}>
      <h3 className={styles.progressTitle}>전체 헌화 현황</h3>
      <div className={styles.progressContainer}>
        <div className={styles.progressInfo}>
          <span className={styles.currentCount}>
            {data?.currentCount.toLocaleString()}
          </span>
          <span className={styles.targetCount}>
            목표 {data?.targetCount.toLocaleString()}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill}`}
            style={assignInlineVars({
              width: `${progressPercentage}%`,
            })}
          />
        </div>
      </div>
    </div>
  );
}

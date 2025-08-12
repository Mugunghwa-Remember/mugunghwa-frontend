import { useNavigate } from "react-router-dom";
import indexImage from "../../assets/index.png";
import * as styles from "./IntroPage.css";
import FlowerProgressCard from "../../components/FlowerProgressCard";

export default function IntroPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/plant2");
  };

  return (
    <section className={`${styles.introSection}`}>
      <div className={`${styles.introContainer}`}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>무궁화 꽃이 피었습니다</h1>
          <p className={styles.subtitle}>
            2025년 광복 80주년 디지털 헌화 캠페인
          </p>
        </div>

        <FlowerProgressCard
        // API 연동 전까지는 기본값 사용
        // apiEndpoint="/api/flower-progress"
        // refreshInterval={5 * 60 * 1000} // 5분마다 새로고침
        />

        <img src={indexImage} alt="무궁화 꽃" className={styles.flower} />

        <div className={styles.descriptionContainer}>
          <p className={styles.description}>
            감사의 마음을 당신의 이름으로 심어주세요!{" "}
            <br className={styles.mobileBreak} />
            대한민국 실시간 지도에 꽃이 피어납니다.
          </p>
          <div className={styles.buttonContainer}>
            <button className={styles.startButton} onClick={handleStart}>
              시작하기
            </button>
            <p className={styles.footerText}>
              메시지와 헌화 기록은 매년 8월 15일 리마인드됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

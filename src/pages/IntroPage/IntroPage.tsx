import indexImage from "../../assets/index.png";
import * as styles from "./IntroPage.css";
import FlowerProgressCard from "../../components/FlowerProgressCard";
import KakaoSVG from "../../assets/kakao.svg?react";

export default function IntroPage() {
  const handleKakaoLogin = () => {
    const redirect_uri = `${window.location.origin}/oauth`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
      import.meta.env.VITE_KAKAO_REST_API_KEY
    }&redirect_uri=${redirect_uri}`;
    window.location.href = kakaoAuthUrl;
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

        <FlowerProgressCard />

        <img src={indexImage} alt="무궁화 꽃" className={styles.flower} />

        <div className={styles.descriptionContainer}>
          <p className={styles.description}>
            감사의 마음을 당신의 이름으로 심어주세요!{" "}
            <br className={styles.mobileBreak} />
            대한민국 실시간 지도에 꽃이 피어납니다.
          </p>
          <div className={styles.buttonContainer}>
            <button
              className={styles.kakaoLoginButton}
              onClick={handleKakaoLogin}
            >
              <KakaoSVG className={styles.kakaoLoginButtonIcon} />
              <p className={styles.kakaoLoginButtonText}>카카오로 시작하기</p>
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

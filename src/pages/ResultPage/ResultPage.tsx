/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import * as styles from "./ResultPage.css";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { useLocation } from "react-router-dom";
import { createMarker, getFlowerHTML } from "../../utils/FlowerMap";
import useFlowerMap from "../../hooks/useFlowerMap";
import logoPng from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { safeTrack } from "../../utils/mixpanel";
import fetchFlowerProgress from "../../controllers/flowerProgress/api";

const ResultPage = () => {
  useEffect(() => {
    safeTrack("page_view", {
      page: "result",
    });
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);

  const { name, message, flowerLocation } = location.state;

  console.log(name, message, flowerLocation);

  // 이미지 저장 기능
  const handleSaveImage = async () => {
    if (!cardRef.current) return;

    safeTrack("image_save_attempt", {
      name,
      message_length: message?.length || 0,
      has_message: !!message,
      flower_location: flowerLocation,
    });

    try {
      const blob = await domtoimage.toBlob(cardRef.current);
      saveAs(blob, "영원히 기억될 무궁화.png");

      safeTrack("image_save_success", {
        name,
        message_length: message?.length || 0,
        has_message: !!message,
        flower_location: flowerLocation,
      });
    } catch (error) {
      console.error("이미지 저장 실패:", error);

      safeTrack("image_save_error", {
        name,
        message_length: message?.length || 0,
        has_message: !!message,
        flower_location: flowerLocation,
        error: error instanceof Error ? error.message : String(error),
      });

      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      const existingScript = document.querySelector('script[src*="kakao.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // 카카오톡 공유 기능
  const handleKakaoShare = () => {
    safeTrack("kakao_share_attempt", {
      name,
      message_length: message?.length || 0,
      has_message: !!message,
      flower_location: flowerLocation,
    });

    // 카카오톡 공유 API가 설정되어 있지 않은 경우를 위한 임시 처리
    if ((window as any).Kakao) {
      const kakao = (window as any).Kakao;
      if (!kakao.isInitialized()) {
        kakao.init(import.meta.env.VITE_APP_KAKAO_JAVASCRIPT_KEY);
        console.log(kakao);
      }

      kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: "무궁화 꽃이 피었습니다",
          description:
            "당신의 무궁화가 피었습니다. 이 순간을 함께 나누어보세요.",
          // imageUrl: "",
          imageUrl: "/main-image.png",
          link: {
            mobileWebUrl: window.location.hostname,
            webUrl: window.location.hostname,
          },
        },
        buttons: [
          {
            title: "무궁화 심기",
            link: {
              mobileWebUrl: window.location.hostname,
              webUrl: window.location.hostname,
            },
          },
        ],
      });

      safeTrack("kakao_share_success", {
        name,
        message_length: message?.length || 0,
        has_message: !!message,
        flower_location: flowerLocation,
      });
    } else {
      // 카카오톡 공유 API가 없는 경우 클립보드에 링크 복사
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          safeTrack("link_copy_success", {
            name,
            message_length: message?.length || 0,
            has_message: !!message,
            flower_location: flowerLocation,
            method: "clipboard",
          });

          alert("링크가 클립보드에 복사되었습니다. 카카오톡에서 공유해주세요.");
        })
        .catch(() => {
          // 클립보드 API가 지원되지 않는 경우
          const textArea = document.createElement("textarea");
          textArea.value = window.location.href;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);

          safeTrack("link_copy_success", {
            name,
            message_length: message?.length || 0,
            has_message: !!message,
            flower_location: flowerLocation,
            method: "execCommand",
          });

          alert("링크가 클립보드에 복사되었습니다. 카카오톡에서 공유해주세요.");
        });
    }
  };

  const { mapRef } = useFlowerMap({
    mapOptions: {
      center: new naver.maps.LatLng(flowerLocation.lat, flowerLocation.lng),
      zoom: 16,
      draggable: false,
      scrollWheel: false,
      scaleControl: false,
      logoControl: false,
    },
    enableClickEvent: false,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [flowerCount, setFlowerCount] = useState(0);

  useEffect(() => {
    if (!isMounted) return;

    if (!mapRef.current) return;

    fetchFlowerProgress().then((res) => {
      setFlowerCount(res.data.currentCount);
    });

    createMarker(
      mapRef.current,
      new naver.maps.LatLng(flowerLocation.lat, flowerLocation.lng),
      getFlowerHTML(1, 72, false),
      72,
      1000
    );
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>당신의 무궁화가 피었습니다</h1>
        <p className={styles.subtitle}>이 순간을 저장하고 공유해보세요</p>
      </div>

      <div ref={cardRef} className={styles.cardContainer}>
        <div className={styles.cardTitle} />
        <div className={styles.cardContent}>
          <div className={styles.cardMapContainer}>
            <div className={styles.cardMapFrame} />
            <div id="map" className={styles.cardMap} />
          </div>
          <div className={styles.cardMessageContainer}>
            <p className={styles.cardMessage}>{message}</p>
            <p className={styles.cardUserName}>-{name}-</p>
          </div>
          <div className={styles.cardFlowers}>
            <div className={styles.cardFlowerLeft} />
            <div className={styles.cardFlowerRight} />
          </div>
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.cardFooterLine} />
          <p>{flowerCount.toLocaleString()}번째 무궁화를 심었습니다.</p>
          <div className={styles.cardFooterLine} />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.saveButton}`}
          onClick={handleSaveImage}
        >
          이미지 저장
        </button>
        <button
          className={`${styles.button} ${styles.shareButton}`}
          onClick={handleKakaoShare}
        >
          카카오톡 공유
        </button>
      </div>

      <button
        className={styles.exploreButton}
        onClick={() => {
          safeTrack("result_page_explore_button_click", {
            name,
            message_length: message?.length || 0,
            has_message: !!message,
            flower_location: flowerLocation,
          });

          navigate("/explore");
        }}
      >
        <img className={styles.exploreButtonLogo} src={logoPng} alt="logo" />
        <p className={styles.exploreButtonText}>무궁화 구경하러 가기</p>
      </button>
    </div>
  );
};

export default ResultPage;

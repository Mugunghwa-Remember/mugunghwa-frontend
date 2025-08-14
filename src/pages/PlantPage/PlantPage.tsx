import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as styles from "./PlantPage.css";
import FlowerProgressCard from "../../components/FlowerProgressCard";
import fetchPlantFlower from "../../controllers/plantFlower/api";
import { useIsMobile } from "../../hooks/useWindowSize";
import { safeTrack } from "../../utils/mixpanel";
import useFlowerMap from "../../hooks/useFlowerMap";
import { useToast } from "../../hooks/useToast";

export default function PlantPage2() {
  useEffect(() => {
    safeTrack("page_view", {
      page: "plant",
    });
  }, []);

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [message, setMessage] = useState(
    "나라를 위해 헌신해주신 모든 분들께 진심으로 감사드립니다."
  );
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [nameError, setNameError] = useState("");
  const onRandomLocationRef = useRef<(() => void) | null>(null);
  const isMobile = useIsMobile();
  const { toast, showToast } = useToast(1500);
  const { userMarkerLocation, error } = useFlowerMap({
    enableClickEvent: true,
    enableUserMarker: true,
    onRandomLocation: onRandomLocationRef,
  });

  useEffect(() => {
    if (!error) return;
    showToast(error.message);
  }, [error]);

  // 이름 유효성 검사
  const validateName = (name: string, message: string): string => {
    if (!name.trim()) {
      return "이름을 입력해주세요";
    }
    if (name.trim().length < 2) {
      return "이름은 2글자 이상 입력해주세요";
    }
    if (name.trim().length > 15) {
      return "이름은 15글자 이하로 입력해주세요";
    }
    if (!message.trim()) {
      return "감사 편지를 입력해주세요";
    }
    if (message.trim().length > 50) {
      return "감사 편지는 50자 이내로 입력해주세요";
    }
    // 특수문자나 숫자만 있는 경우 체크
    // if (!/^[가-힣a-zA-Z0-9\s]+$/.test(name.trim())) {
    //   return "이름은 한글, 영문, 숫자, 공백만 입력 가능합니다";
    // }
    return "";
  };

  const handlePlant = () => {
    // 이름 유효성 검사
    const nameValidationError = validateName(name, message);
    if (nameValidationError) {
      setNameError(nameValidationError);
      safeTrack("plant_validation_error", {
        error: nameValidationError,
        name: name.trim(),
      });
      return;
    }

    if (!(name.trim() && userMarkerLocation)) return;

    safeTrack("flower_plant_attempt", {
      name: name.trim(),
      message_length: message.trim().length,
      has_message: !!message.trim(),
      location: userMarkerLocation,
    });

    console.log("Planting flower:", {
      name,
      message,
      location: userMarkerLocation,
    });
    // 꽃 심기 완료 후 기부 모달 표시
    setShowDonationModal(true);
  };

  const handleRandomLocation = () => {
    safeTrack("random_location_button_click");
    if (!onRandomLocationRef.current) return;
    onRandomLocationRef.current();
  };

  const handleDonation = () => {
    safeTrack("donation_button_click", {
      name: name.trim(),
      message_length: message.trim().length,
      location: userMarkerLocation,
    });

    // 카카오같이가치 기부 페이지로 이동
    window.open(
      "https://together.kakao.com/fundraisings/128878/story",
      "_blank"
    );

    fetchPlantFlower({
      latitude: userMarkerLocation?.lat || 0,
      longitude: userMarkerLocation?.lng || 0,
      name,
      message,
    }).then(() => {
      safeTrack("flower_planted_success", {
        name: name.trim(),
        message_length: message.trim().length,
        has_message: !!message.trim(),
        location: userMarkerLocation,
        with_donation: true,
      });

      navigate("/result", {
        state: {
          name,
          message,
          flowerLocation: userMarkerLocation,
        },
      });
    });
  };

  const handleCloseModal = () => {
    safeTrack("donation_modal_closed", {
      name: name.trim(),
      message_length: message.trim().length,
      location: userMarkerLocation,
    });

    fetchPlantFlower({
      latitude: userMarkerLocation?.lat || 0,
      longitude: userMarkerLocation?.lng || 0,
      name,
      message,
    }).then(() => {
      safeTrack("flower_planted_success", {
        name: name.trim(),
        message_length: message.trim().length,
        has_message: !!message.trim(),
        location: userMarkerLocation,
        with_donation: false,
      });

      navigate("/result", {
        state: {
          name,
          message,
          flowerLocation: userMarkerLocation,
        },
        replace: true,
      });
    });
  };

  const handleModalOverlayClick = (e: React.MouseEvent) => {
    // 모달 오버레이 클릭 시에만 모달 닫기
    if (e.target === e.currentTarget) {
      setShowDonationModal(false);
    }
  };

  const ButtonGroup = () => {
    return (
      <div className={styles.buttonGroup}>
        <button
          onClick={handleRandomLocation}
          className={`${styles.button} ${styles.secondaryButton}`}
        >
          랜덤 위치
        </button>
        <button
          onClick={handlePlant}
          className={`${styles.button} ${styles.primaryButton}`}
          disabled={!name.trim() || !message.trim() || !userMarkerLocation}
        >
          이 위치에 심기
        </button>
      </div>
    );
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container}>
      {/* 기부 모달 */}
      {showDonationModal && (
        <div className={styles.modalOverlay} onClick={handleModalOverlayClick}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h1 className={styles.modalTitle}>마음을 나누어주세요</h1>
              <p className={styles.modalDescription}>
                이 캠페인은 자발적인 기부로 이어집니다.
                <br />
                독립유공자 후손 지원을 위해 함께 해주세요.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.donationButton}
                onClick={handleDonation}
              >
                카카오같이가치 기부하기
              </button>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                꽃만 심을게요
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>당신의 이름으로 무궁화를 심어주세요</h1>
        <p className={styles.instruction}>
          지도 위에 원하는 위치를 클릭하여 꽃을 심어보세요!
        </p>
      </div>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <div className={styles.formContainer}>
            <div className={styles.inputContainer}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                  이름/별명
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름 또는 별명 (2~15자)"
                  className={styles.nameInput}
                  maxLength={15}
                  minLength={2}
                />
                <div className={styles.nameInputError}>
                  {nameError || <br />}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message" className={styles.label}>
                  감사 편지
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="50자 이내로 감사의 마음을 남겨주세요"
                  className={styles.messageInput}
                  maxLength={50}
                  rows={3}
                />
              </div>
            </div>

            <FlowerProgressCard />

            {!isMobile && <ButtonGroup />}
          </div>

          <p className={styles.bottomInstruction}>
            지도를 탭하면 임시 위치가 표시돼요.
            <br />이 위치에 심기 버튼을 눌러 확정하세요!
          </p>
        </div>

        <div className={styles.rightSection}>
          <div
            className={styles.mapContainer}
            ref={mapContainerRef}
            tabIndex={-1}
            onClick={() => {
              mapContainerRef.current?.focus();
            }}
          >
            <div id="map" className={styles.mapPlaceholder} />
            {toast.enabled && (
              <div
                className={styles.toast}
                style={{
                  opacity: toast.closing ? 0 : 1,
                }}
              >
                ⚠️ {toast.message}
              </div>
            )}
          </div>

          {isMobile && <ButtonGroup />}
        </div>
      </div>
    </div>
  );
}

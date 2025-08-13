import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as styles from "./PlantPage.css";
import FlowerProgressCard from "../../components/FlowerProgressCard";
import PlantMap from "../../components/PlantMap";
import fetchPlantFlower from "../../controllers/plantFlower/api";

export default function PlantPage2() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [userMarkerData, setUserMarkerData] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [nameError, setNameError] = useState("");
  const randomLocationRef = useRef<(() => void) | null>(null);

  // 이름 유효성 검사
  const validateName = (name: string): string => {
    if (!name.trim()) {
      return "이름을 입력해주세요";
    }
    if (name.trim().length < 2) {
      return "이름은 2글자 이상 입력해주세요";
    }
    if (name.trim().length > 15) {
      return "이름은 15글자 이하로 입력해주세요";
    }
    // 특수문자나 숫자만 있는 경우 체크
    // if (!/^[가-힣a-zA-Z0-9\s]+$/.test(name.trim())) {
    //   return "이름은 한글, 영문, 숫자, 공백만 입력 가능합니다";
    // }
    return "";
  };

  const handlePlant = () => {
    // 이름 유효성 검사
    const nameValidationError = validateName(name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    if (!(name.trim() && userMarkerData)) return;

    console.log("Planting flower:", {
      name,
      message,
      location: userMarkerData,
    });
    // 꽃 심기 완료 후 기부 모달 표시
    setShowDonationModal(true);
  };

  const handleRandomLocation = () => {
    if (randomLocationRef.current) {
      randomLocationRef.current();
    }
  };

  const handleDonation = () => {
    // 카카오같이가치 기부 페이지로 이동
    window.open("https://together.kakao.com", "_blank");

    fetchPlantFlower({
      latitude: userMarkerData?.lat || 0,
      longitude: userMarkerData?.lng || 0,
      name,
      message,
    }).then(() => {
      navigate("/result", {
        state: {
          name,
          message,
          flowerLocation: userMarkerData,
        },
      });
    });
  };

  const handleCloseModal = () => {
    fetchPlantFlower({
      latitude: userMarkerData?.lat || 0,
      longitude: userMarkerData?.lng || 0,
      name,
      message,
    }).then(() => {
      navigate("/result", {
        state: {
          name,
          message,
          flowerLocation: userMarkerData,
        },
      });
    });
  };

  const handleModalOverlayClick = (e: React.MouseEvent) => {
    // 모달 오버레이 클릭 시에만 모달 닫기
    if (e.target === e.currentTarget) {
      setShowDonationModal(false);
    }
  };

  return (
    <div className={styles.section}>
      {/* 기부 모달 */}
      {showDonationModal && (
        <div className={styles.modalOverlay} onClick={handleModalOverlayClick}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h1 className={styles.modalTitle}>마음을 나누어주세요</h1>
              <p className={styles.modalDescription}>
                이 캠페인은 자발적인 기부로 이어집니다
                <br />
                독립유공자 후손 지원을 위해 함께 해주세요
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

      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>당신의 이름으로 무궁화를 심어주세요</h1>
          <p className={styles.instruction}>
            대한민국 지도 위 아무 곳이나 탭하여 위치를 선택해주세요.
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
                    감사 편지 (선택)
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

              <div className={styles.buttonGroup}>
                <button
                  onClick={handlePlant}
                  className={styles.plantButton}
                  disabled={!name.trim() || !userMarkerData}
                >
                  이 위치에 심기
                </button>
                <button
                  onClick={handleRandomLocation}
                  className={styles.randomButton}
                >
                  랜덤 위치
                </button>
              </div>
            </div>

            <p className={styles.bottomInstruction}>
              지도를 탭하면 임시 위치 표시가 생깁니다.
              <br />이 위치에 심기 버튼을 눌러 확정하세요!
            </p>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.mapPlaceholder}>
              <PlantMap
                setUserMarkerData={setUserMarkerData}
                onRandomLocation={randomLocationRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

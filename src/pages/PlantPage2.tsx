import { useState } from "react";
import * as styles from "./PlantPage2.css";
import FlowerProgressCard from "../components/FlowerProgressCard";

export default function PlantPage2() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handlePlant = () => {
    // TODO: 지도 API 연동 후 구현
    console.log("Planting flower:", { name, message });
  };

  const handleRandomLocation = () => {
    // TODO: 랜덤 위치 선택 로직 구현
    console.log("Random location selected");
  };

  return (
    <div className={styles.section}>
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
                    이름을 입력해주세요
                  </div>
                </div>

                {/* 감사 편지 입력 */}
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

              {/* 전체 헌화 현황 */}
              <FlowerProgressCard />

              {/* 버튼들 */}
              <div className={styles.buttonGroup}>
                <button
                  onClick={handlePlant}
                  className={styles.plantButton}
                  disabled={!name.trim()}
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
          {/* 오른쪽 섹션 - 지도 (임시로 회색 사각형) */}
          <div className={styles.rightSection}>
            <div className={styles.mapPlaceholder}>지도가 들어갈 영역</div>
          </div>
        </div>
      </div>
    </div>
  );
}

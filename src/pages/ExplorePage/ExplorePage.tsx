import useFlowerMap from "../../hooks/useFlowerMap";
import * as styles from "./ExplorePage.css";

const ExplorePage = () => {
  const [mapRef] = useFlowerMap({});
  console.log(mapRef);

  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.mainTitle}>
            대한민국에 피어난 무궁화 구경하기
          </h1>
          <p className={styles.subtitle}>
            지도를 움직이면 주변 헌화를 불러옵니다. 마커를 클릭해 이름과 편지를
            열어보세요!
          </p>
        </div>
        <div id="map" className={styles.map}></div>
      </div>
    </div>
  );
};

export default ExplorePage;

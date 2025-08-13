import useFlowerMap from "../../hooks/useFlowerMap";
import * as styles from "./ExplorePage.css";
import { safeTrack } from "../../utils/mixpanel";
import { useEffect } from "react";

const ExplorePage = () => {
  useEffect(() => {
    safeTrack("page_view", {
      page: "explore",
    });

    // 지도 로드 완료 tracking
    safeTrack("explore_map_loaded");
  }, []);

  const [mapRef] = useFlowerMap({});

  // 지도 이벤트 tracking을 위한 useEffect
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // 지도 이동 이벤트
    const moveListener = naver.maps.Event.addListener(map, "dragend", () => {
      const bounds = map.getBounds();
      if (bounds) {
        safeTrack("explore_map_move", {
          center: {
            lat: map.getCenter().lat(),
            lng: map.getCenter().lng(),
          },
          zoom: map.getZoom(),
          bounds: {
            minLat: bounds.getMin().y,
            minLng: bounds.getMin().x,
            maxLat: bounds.getMax().y,
            maxLng: bounds.getMax().x,
          },
        });
      }
    });

    // 줌 이벤트
    const zoomListener = naver.maps.Event.addListener(
      map,
      "zoom_changed",
      () => {
        safeTrack("explore_map_zoom", {
          zoom: map.getZoom(),
          center: {
            lat: map.getCenter().lat(),
            lng: map.getCenter().lng(),
          },
        });
      }
    );

    return () => {
      naver.maps.Event.removeListener(map, "dragend", moveListener);
      naver.maps.Event.removeListener(map, "zoom_changed", zoomListener);
    };
  }, [mapRef]);

  console.log(mapRef);

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>대한민국에 피어난 무궁화 구경하기</h1>
        <p className={styles.subtitle}>
          지도를 움직이면 주변 헌화를 불러옵니다.{" "}
          <br className={styles.mobileBreak} />
          마커를 클릭해 이름과 편지를 열어보세요!
        </p>
      </div>
      <div id="map" className={styles.map}></div>
    </div>
  );
};

export default ExplorePage;

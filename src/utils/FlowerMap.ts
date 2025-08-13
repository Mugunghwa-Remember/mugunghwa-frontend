import mugunghwaRaw from "../assets/mugunghwa2.svg?raw";

export const mugunghwaSVGHTML = mugunghwaRaw.replace(
  "<svg ",
  `<svg class="bloom" width="100%" height="100%" `
);

export const getFlowerHTML = (
  count: number,
  size: number,
  randomRotate?: boolean
) => {
  const rotate = randomRotate ? Math.random() * 360 : 0;

  const html = `
  <div style="position: relative; display: flex; align-items: center; justify-content: center;">
    <div class="cluster" style="position: absolute; width:${size}px;height:${size}px;">
      <div style="transform: rotate(${rotate}deg);">
        ${mugunghwaSVGHTML}
      </div>
      ${count == 1 ? "" : `<div class="cluster-num">${count}</div>`}
    </div>
  </div>`;

  return html;
};

export function clusterSize(count: number, maxCount: number) {
  console.log(maxCount);
  const MIN = 42;
  const MAX = 72;
  const REF = 800000;
  const t = Math.min(1, Math.log2(count) / Math.log2(REF));
  const size = MIN + (MAX - MIN) * t;
  return Math.round(size);
}

export const createMarker = (
  map: naver.maps.Map,
  position: naver.maps.LatLng,
  html: string,
  size: number,
  zIndex?: number
) => {
  return new naver.maps.Marker({
    position,
    map: map,
    icon: {
      content: html,
      size: new naver.maps.Size(size, size),
      anchor: new naver.maps.Point(0, 0),
    },
    zIndex: zIndex ?? 0,
  });
};

// 부드러운 이동 함수
export const smoothMoveTo = (
  map: naver.maps.Map | null,
  lat: number,
  lng: number
) => {
  if (!map) return;

  const targetPosition = new naver.maps.LatLng(lat, lng);
  map.panTo(targetPosition, {
    duration: 800,
    easing: "easeOutCubic",
  });
};

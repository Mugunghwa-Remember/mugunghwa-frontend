import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 초기 사이즈 설정
    handleResize();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 클린업
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

// 미디어 쿼리 브레이크포인트를 위한 유틸리티 훅들
export const useIsMobile = (): boolean => {
  const { width } = useWindowSize();
  return width < 768;
};

export const useIsTablet = (): boolean => {
  const { width } = useWindowSize();
  return width >= 768 && width < 1280;
};

export const useIsDesktop = (): boolean => {
  const { width } = useWindowSize();
  return width >= 1280;
};

export const useIsLargeDesktop = (): boolean => {
  const { width } = useWindowSize();
  return width >= 1280;
};

// 특정 브레이크포인트를 위한 훅
export const useBreakpoint = (breakpoint: number): boolean => {
  const { width } = useWindowSize();
  return width >= breakpoint;
};

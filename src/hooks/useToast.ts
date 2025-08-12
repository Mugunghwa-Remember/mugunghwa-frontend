import { useRef, useState, useEffect } from "react";

interface ToastState {
  message: string;
  enabled: boolean;
  closing: boolean;
  duration: number;
}

export const useToast = (defaultDuration: number = 1500) => {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    enabled: false,
    closing: false,
    duration: defaultDuration,
  });

  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, duration: number = defaultDuration) => {
    // 기존 타이머들 정리
    [toastTimeoutRef, fadeTimeoutRef].forEach((ref) => {
      if (ref.current) clearTimeout(ref.current);
    });

    setToast({ message, enabled: true, closing: false, duration });

    // 페이드아웃 시작 (duration - 0.3초 전)
    fadeTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, closing: true }));
    }, duration - 300);

    // 토스트 완전히 숨김
    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, enabled: false, closing: false }));
    }, duration);
  };

  const hideToast = () => {
    [toastTimeoutRef, fadeTimeoutRef].forEach((ref) => {
      if (ref.current) clearTimeout(ref.current);
    });
    setToast((prev) => ({ ...prev, enabled: false, closing: false }));
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      [toastTimeoutRef, fadeTimeoutRef].forEach((ref) => {
        if (ref.current) clearTimeout(ref.current);
      });
    };
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};

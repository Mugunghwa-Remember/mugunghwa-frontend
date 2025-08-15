import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import IntroPage from "./pages/IntroPage/IntroPage";
import PlantPage from "./pages/PlantPage/PlantPage";
import ExplorePage from "./pages/ExplorePage/ExplorePage";
import { AppStateProvider } from "./state/AppState";
import ResultPage from "./pages/ResultPage/ResultPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import backgroundImage from "./assets/index_background.png";
import mixpanel from "mixpanel-browser";
import { useEffect } from "react";
import { safeTrack, safeIdentify, safeSetPeople } from "./utils/mixpanel";

export default function App() {
  return (
    <AppStateProvider>
      <MainLayout />
    </AppStateProvider>
  );
}

function MainLayout() {
  const location = useLocation();

  const userAgent = navigator.userAgent.toLowerCase();
  const isKakaoInApp = userAgent.includes("kakaotalk");

  // 카카오톡 인앱 브라우저일 경우에만 실행
  if (isKakaoInApp) {
    const targetUrl = window.location.href;
    window.location.replace(
      `kakaotalk://web/openExternal?url=${encodeURIComponent(targetUrl)}`
    );
  }

  useEffect(() => {
    try {
      mixpanel.init("13db1bc4631864c42165ba586b1b9cf1", {
        debug: true,
        track_pageview: true,
        persistence: "localStorage",
        autocapture: true,
      });

      // mixpanel 초기화 완료 확인
      if (mixpanel.get_distinct_id()) {
        // 앱 초기화 tracking
        safeTrack("app_initialized", {
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language,
          platform: navigator.platform,
        });

        // 사용자 식별 정보 설정 (가능한 경우)
        const email = localStorage.getItem("email");
        if (email) {
          safeIdentify(email);
          safeSetPeople({
            $email: email,
            $last_seen: new Date().toISOString(),
            provider: localStorage.getItem("provider") || "unknown",
          });
        }
      }
    } catch (error) {
      console.error("Mixpanel 초기화 실패:", error);
    }
  }, []);

  // 라우트 변경 tracking
  useEffect(() => {
    safeTrack("route_change", {
      from: location.pathname,
      timestamp: new Date().toISOString(),
    });
  }, [location.pathname]);

  console.log(location.pathname);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100dvh",
        alignItems: "center",
        overflowY: "auto",
        backgroundImage: ["/", "/result"].includes(location.pathname)
          ? `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${backgroundImage})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "0 20px",
        boxSizing: "border-box",
      }}
    >
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/plant" element={<PlantPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/oauth" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

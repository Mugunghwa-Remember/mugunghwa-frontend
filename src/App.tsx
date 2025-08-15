import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import IntroPage from "./pages/IntroPage/IntroPage";
import PlantPage from "./pages/PlantPage/PlantPage";
import ExplorePage from "./pages/ExplorePage/ExplorePage";
import { AppStateProvider } from "./state/AppState";
import ResultPage from "./pages/ResultPage/ResultPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import mainImage from "./assets/taegeukgi.png";
import mixpanel from "mixpanel-browser";
import { useEffect } from "react";
import { safeTrack, safeIdentify, safeSetPeople } from "./utils/mixpanel";
import MainLayout from "./layouts/MainLayout";
import { vars } from "./styles/vars.css";

export default function App() {
  return (
    <AppStateProvider>
      <Main />
    </AppStateProvider>
  );
}

function Main() {
  const location = useLocation();

  const userAgent = navigator.userAgent.toLowerCase();
  const isKakaoInApp = userAgent.includes("kakaotalk");
  const isInstagramInApp = userAgent.includes("instagram");
  const isiOS = /iphone|ipad|ipod/i.test(userAgent);
  const isInApp = isKakaoInApp || isInstagramInApp;

  useEffect(() => {
    if (isInApp) {
      if (isKakaoInApp) {
        window.location.href = "kakaotalk://inappbrowser/close";
      }

      const target_url = window.location.href;
      if (isiOS && isKakaoInApp) {
        window.location.href =
          "kakaotalk://web/openExternal?url=" + encodeURIComponent(target_url);
      } else {
        window.location.href =
          "intent://" +
          target_url.replace(/https?:\/\//i, "") +
          "#Intent;scheme=http;package=com.android.chrome;end";
      }
    }

    // // 카카오톡 인앱 브라우저일 경우에만 실행
    // if (isInstagramInApp) {
    //   window.location.href = "instagram://inappbrowser/close";
    //   window.location.href =
    //     "intent://" +
    //     window.location.href.replace(/https?:\/\//i, "") +
    //     "#Intent;scheme=http;package=com.android.chrome;end";
    // } else if (isKakaoInApp) {
    //   window.location.href = "kakaotalk://inappbrowser/close";
    //   // 크롬으로 새창 열기
    //   const target_url = window.location.href;
    //   window.location.href =
    //     "kakaotalk://web/openExternal?url=" + encodeURIComponent(target_url);
    //   // window.location.href =
    //   //   "intent://" +
    //   //   window.location.href.replace(/https?:\/\//i, "") +
    //   //   "#Intent;scheme=http;package=com.android.chrome;end";
    // }

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

  if (isInstagramInApp || isKakaoInApp) {
    return (
      <MainLayout>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: "1",
            flexDirection: "column",
            gap: "24px",

            fontFamily: vars.fonts.pretendard,
            fontWeight: "600",
          }}
        >
          <img
            src={mainImage}
            style={{
              maxWidth: "280px",
            }}
          />
          ⚠️ 크롬브라우저를 이용해주세요
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/plant" element={<PlantPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/oauth" element={<AuthPage />} />
      </Routes>
    </MainLayout>
  );
}

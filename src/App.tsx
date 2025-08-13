import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import IntroPage from "./pages/IntroPage/IntroPage";
import PlantPage from "./pages/PlantPage/PlantPage";
import ExplorePage from "./pages/ExplorePage/ExplorePage";
import { AppStateProvider } from "./state/AppState";
import ResultPage from "./pages/ResultPage/ResultPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import backgroundImage from "./assets/index_background.png";

export default function App() {
  return (
    <AppStateProvider>
      <MainLayout />
    </AppStateProvider>
  );
}

function MainLayout() {
  const location = useLocation();

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

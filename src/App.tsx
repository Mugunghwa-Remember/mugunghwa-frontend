import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import IntroPage from "./pages/IntroPage";
import PlantPage from "./pages/PlantPage";
import ExplorePage from "./pages/ExplorePage";
import ResultPage from "./pages/ResultPage";
import { AppStateProvider } from "./state/AppState";
import TopNav from "./components/TopNav";

export default function App() {
  return (
    <AppStateProvider>
      <MainLayout />
    </AppStateProvider>
  );
}

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const onMapScreen = pathname === "/" || pathname === "/result";
  const showTopNav = pathname !== "/"; // mimic tmp.html (nav hidden initially)

  return (
    <main className="font-sans min-h-screen flex flex-col  items-center justify-center w-full max-w-3xl mx-auto md:h-auto h-screen">
      <div className="w-full md:grow-0 grow flex flex-col">
        {showTopNav && <TopNav />}
        <div className="p-4 grow md:grow-0 flex flex-col">
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/plant" element={<PlantPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </div>
      </div>

      <button
        className={`fixed right-4 bottom-4 z-[2002] px-4 py-3 rounded-full shadow-soft bg-black/80 text-white font-semibold ${
          onMapScreen ? "block" : "hidden"
        }`}
        onClick={() => navigate(pathname === "/" ? "/plant" : "/explore")}
      >
        {pathname === "/" ? "심으러 가기" : "구경하기"}
      </button>
    </main>
  );
}

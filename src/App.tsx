import { Routes, Route } from "react-router-dom";
import "./index.css";
import IntroPage from "./pages/IntroPage/IntroPage";
import PlantPage from "./pages/PlantPage";
import PlantPage2 from "./pages/PlantPage2";
import ExplorePage from "./pages/ExplorePage";
import ResultPage from "./pages/ResultPage";
import { AppStateProvider } from "./state/AppState";

export default function App() {
  return (
    <AppStateProvider>
      <MainLayout />
    </AppStateProvider>
  );
}

function MainLayout() {
  return (
    <main className="min-h-screen">
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/plant" element={<PlantPage />} />
        <Route path="/plant2" element={<PlantPage2 />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </main>
  );
}

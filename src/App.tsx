import { Routes, Route } from "react-router-dom";
import "./index.css";
import IntroPage from "./pages/IntroPage/IntroPage";
import PlantPage from "./pages/PlantPage/PlantPage";
import ExplorePage from "./pages/ExplorePage/ExplorePage";
import { AppStateProvider } from "./state/AppState";
import ResultPage from "./pages/ResultPage/ResultPage";
import AuthPage from "./pages/AuthPage/AuthPage";

export default function App() {
  return (
    <AppStateProvider>
      <MainLayout />
    </AppStateProvider>
  );
}

function MainLayout() {
  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/plant" element={<PlantPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/oauth" element={<AuthPage />} />
    </Routes>
  );
}

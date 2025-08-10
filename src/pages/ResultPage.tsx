import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppState";
import { useEffect, useState, useRef } from "react";
import MugunghwaSVG from "../assets/mugunghwa2.svg?react";

// Hero data from tmp.html
const HEROES = [
  {
    id: "ahn",
    name: "안중근",
    years: "1879–1910",
    line: "나라를 위한 용기와 희생",
  },
  {
    id: "kimgoo",
    name: "김구",
    years: "1876–1949",
    line: "나의 소원, 대한의 완전한 독립",
  },
  {
    id: "yugwansun",
    name: "유관순",
    years: "1902–1920",
    line: "대한독립 만세",
  },
  {
    id: "yoon",
    name: "윤봉길",
    years: "1908–1932",
    line: "젊은 피로 나라를 밝히다",
  },
  {
    id: "ahnchangho",
    name: "안창호",
    years: "1878–1938",
    line: "나라의 힘은 국민의 힘",
  },
];

const STYLES = ["paper", "flower", "minimal"];

// Hash function for consistent hero selection
function hashStr(s: string): number {
  let h = 0;
  for (const ch of s) {
    h = (h << 5) - h + ch.charCodeAt(0);
    h |= 0;
  }
  return Math.abs(h);
}

// Pick hero index based on name
function pickHeroIndex(seed: string): number {
  return hashStr(seed || String(Date.now())) % HEROES.length;
}

export default function ResultPage() {
  const navigate = useNavigate();
  const { name, msg } = useAppState();
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0);
  const [styleIndex, setStyleIndex] = useState<number>(0);
  const [currentStyle, setCurrentStyle] = useState<string>("paper");

  const shareCardRef = useRef<HTMLDivElement>(null);

  // Initialize hero and style on component mount
  useEffect(() => {
    if (name) {
      setCurrentHeroIndex(pickHeroIndex(name));
    }
    setCurrentStyle(STYLES[styleIndex]);
  }, [name]);

  // Set card style
  function setCardStyle(style: string) {
    setCurrentStyle(style);
  }

  // Next card style
  function nextCardStyle() {
    const newIndex = (styleIndex + 1) % STYLES.length;
    setStyleIndex(newIndex);
    setCardStyle(STYLES[newIndex]);
  }

  // Cycle through heroes
  function cycleHero() {
    const newIndex = (currentHeroIndex + 1) % HEROES.length;
    setCurrentHeroIndex(newIndex);
  }

  // Export share card as image
  async function exportShareCard() {
    if (!shareCardRef.current) return;

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: "#f8f4ed",
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        logging: false,
        removeContainer: true,
        scale: 2, // Higher quality
        width: shareCardRef.current.offsetWidth,
        height: shareCardRef.current.offsetHeight,
      });

      const link = document.createElement("a");
      link.download = "mugunghwa_certificate.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.");
    }
  }

  const currentHero = HEROES[currentHeroIndex];

  return (
    <section className="animate-fadeUp text-center w-full h-full flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold">당신의 무궁화가 피었습니다</h2>
      <p className="text-sm text-gray-600 mb-4">
        이 순간을 저장하고 공유해주세요.
      </p>

      <article
        ref={shareCardRef}
        className="relative w-full max-w-md mx-auto aspect-[2/3] rounded-2xl overflow-hidden shadow-soft"
      >
        <div className="absolute inset-0 paper-bg" />
        <div className="absolute inset-0 paper-grain pointer-events-none" />
        {/* <div className="absolute inset-0 ring-1 ring-black/5 rounded-2xl" /> */}

        <div className="relative z-10 h-full w-full flex flex-col items-center justify-between p-7">
          <div className="pt-3 text-center">
            <p className="text-xs tracking-wide">광복 80주년 기념</p>
            <h3
              style={{ color: "#dc2626" }}
              className="text-[26px] md:text-3xl font-extrabold"
            >
              무궁화 꽃이 피었습니다
            </h3>
          </div>

          <div className="relative w-full flex-1 flex items-center justify-center">
            <div
              className={`absolute z-10 text-center ${
                currentStyle === "paper" || currentStyle === "minimal"
                  ? ""
                  : "hidden"
              }`}
            >
              <div className="text-[13px] tracking-wider text-[#6a7282] mb-1">
                독립유공자
              </div>
              <div className="text-2xl font-extrabold">{currentHero?.name}</div>
              <div className="text-xs text-[#6a7282]">{currentHero?.years}</div>
              <div className="mt-2 text-sm italic">"{currentHero?.line}"</div>
            </div>
            <div
              className={`absolute ${
                currentStyle !== "minimal" ? "" : "hidden"
              }`}
            >
              <MugunghwaSVG
                className={`${
                  currentStyle === "paper" ? "w-40 opacity-50" : "w-16"
                }`}
              />
            </div>
          </div>

          <div className="w-full text-center">
            <p className="font-pen text-2xl min-h-12">
              {msg || "당신의 마음이 모여 대한민국을 빛냅니다."}
            </p>
            <p className="mt-2 text-xl font-bold">{name}</p>
            <p className="text-xs mt-1">님께서 대한민국에 희망을 피웠습니다.</p>
          </div>
          <div className="pb-2 text-xs">2025. 08. 15.</div>
        </div>
      </article>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          className="px-3 py-2 rounded-full text-sm font-semibold bg-black/80 text-white"
          onClick={nextCardStyle}
        >
          카드 바꾸기
        </button>
        <button
          className="px-3 py-2 rounded-full text-sm border"
          onClick={cycleHero}
        >
          주인공 바꾸기
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 max-w-md mx-auto w-full">
        <button
          className="py-3 rounded-xl bg-gray-900 text-white font-bold"
          onClick={exportShareCard}
        >
          이미지 저장
        </button>
        <button
          className="py-3 rounded-xl bg-[#FEE500] text-[#191919] font-bold"
          onClick={() => alert("카카오 공유는 곧 연결됩니다.")}
        >
          카카오톡 공유
        </button>
      </div>

      <button
        className="mt-4 text-sm text-gray-500 underline"
        onClick={() => navigate("/plant")}
      >
        다시하기
      </button>
    </section>
  );
}

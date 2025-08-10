import { useNavigate } from "react-router-dom";
import Mugunghwa from "../assets/mugunghwa.svg?react";

export default function IntroPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/plant");
  };

  return (
    <section className="screen active animate-fadeUp text-center w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl whitespace-nowrap">
          무궁화 꽃이 피었습니다
        </h1>
        <p className="text-sm mt-1">2025년 광복 80주년 디지털 헌화 캠페인</p>
      </div>

      <div className="my-8 flex justify-center">
        <Mugunghwa className="w-44 h-44" aria-hidden />
      </div>

      <p className="text-base leading-relaxed">
        감사의 마음을 당신의 이름으로 심어주세요. 대한민국 실시간 지도에 꽃이
        피어납니다.
      </p>
      <button
        className="btn-cta w-full mt-8 py-3 rounded-xl text-lg font-bold cursor-pointer"
        onClick={handleStart}
      >
        시작하기
      </button>
      <p className="mt-6 text-xs text-ink/70">
        메시지와 헌화 기록은 매년 8월 15일 리마인드됩니다.
      </p>
    </section>
  );
}

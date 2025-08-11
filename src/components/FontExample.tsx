export default function FontExample() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-ink">폰트 예시</h2>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">기본 폰트 (Noto Sans KR)</h3>
        <p className="font-sans text-base">
          이것은 기본 폰트인 Noto Sans KR입니다. 한글과 영문이 모두 잘
          표시됩니다.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          손글씨 폰트 (Nanum Pen Script)
        </h3>
        <p className="font-pen text-xl">
          이것은 손글씨 스타일의 Nanum Pen Script 폰트입니다.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">MYYeongnamnu 폰트</h3>
        <p className="font-yeongnamnu text-xl">
          이것은 새로 추가된 MYYeongnamnu 폰트입니다. 한글 디자인에 특화된
          폰트입니다.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">CSS 변수 사용</h3>
        <p style={{ fontFamily: "var(--font-yeongnamnu)" }} className="text-xl">
          CSS 변수를 사용한 MYYeongnamnu 폰트 예시입니다.
        </p>
      </div>
    </div>
  );
}

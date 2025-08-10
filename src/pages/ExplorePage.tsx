export default function ExplorePage() {
  return (
    <section className="screen active animate-fadeUp w-full">
      <header className="mb-4">
        <h2 className="text-2xl font-bold">
          대한민국에 피어난 무궁화 구경하기
        </h2>
        <p className="text-sm text-ink/70">
          지도를 움직이면 주변 헌화를 불러옵니다.
        </p>
      </header>
      <div
        id="mapExplore"
        className="w-full h-[78vh] md:h-[620px] rounded-xl overflow-hidden shadow-soft bg-gray-100"
      />
    </section>
  );
}

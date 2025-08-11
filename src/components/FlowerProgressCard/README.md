# FlowerProgressCard 컴포넌트

헌화 진행률을 표시하는 카드 컴포넌트입니다.

## 사용법

```tsx
import FlowerProgressCard from '../components/FlowerProgressCard';

// 기본 사용법
<FlowerProgressCard />

// 커스텀 값으로 사용
<FlowerProgressCard
  currentCount={500000}
  targetCount={1000000}
/>
```

## Props

| Prop              | Type                 | Default                                       | Description                 |
| ----------------- | -------------------- | --------------------------------------------- | --------------------------- |
| `initialData`     | `FlowerProgressData` | `{currentCount: 785432, targetCount: 800000}` | 초기 데이터 (API 연동 전용) |
| `apiEndpoint`     | `string`             | `undefined`                                   | API 엔드포인트 URL          |
| `refreshInterval` | `number`             | `300000` (5분)                                | 자동 새로고침 간격 (밀리초) |

## API 연동

### 1. 기본 사용법 (API 연동 전)

```tsx
<FlowerProgressCard />
```

### 2. API 연동 후

```tsx
<FlowerProgressCard
  apiEndpoint="/api/flower-progress"
  refreshInterval={60000} // 1분마다 새로고침
/>
```

### 3. API 응답 형식

```json
{
  "currentCount": 785432,
  "targetCount": 800000
}
```

## 특징

- 진행률을 시각적으로 표시
- MYYeongnamnu 폰트 사용
- 반응형 디자인
- 핑크 그라데이션 진행률 바
- 천 단위 콤마 구분

## 스타일

- 둥근 모서리 (16px)
- 반투명 흰색 배경
- 연한 핑크 테두리
- 그림자 효과
- 부드러운 애니메이션
